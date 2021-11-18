import sequelize, { DT }     from '../sequelize-singleton.js';
import Base                  from './Base.js';
import { v4 as uuid }        from 'uuid';

import calculateFights       from './calculateFightersProximity';
import { splitBy }           from '../utils/index.js';
import upperFirst            from 'lodash/upperFirst';

export default class Category extends Base {
  static initRelation () {
    const Card = sequelize.model('Card');
    const Fight = sequelize.model('Fight');
    const Section = sequelize.model('Section');

    this.belongsTo(Section, {
      as         : 'Section',
      foreignKey : {
        name      : 'sectionId',
        allowNull : false
      }
    });

    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'categoryId',
        allowNull : true
      }
    });

    this.hasMany(Fight, {
      as         : 'Fights',
      foreignKey : {
        name      : 'categoryId',
        allowNull : false
      }
    });
  }

  static validateCategories (data, target = data) {
    const [ women, men ] = splitBy(data, c => c.sex === 'man');

    const maxWeightWomen = Math.max(...women.map(c => c.weightTo));
    const maxWeightMen = Math.max(...men.map(c => c.weightTo));
    const maxAgeWomen = Math.max(...women.map(c => c.ageTo));
    const maxAgeMen = Math.max(...men.map(c => c.ageTo));

    const errors = target.flatMap((category, index) => { // for every index find error
      const maxWeight  = category.sex === 'man' ? maxWeightMen : maxWeightWomen;
      const maxAge = category.sex === 'man' ? maxAgeMen : maxAgeWomen;
      const bySex = category.sex === 'man' ? men : women;

      if (category.ageFrom > category.ageTo) {
        return [
          { index, key: 'ageTo', message: 'Age to must be greater.', code: 'TOO_LOW' },
          { index, key: 'ageFrom', message: 'Age from must be lower.', code: 'TOO_HIGHT' }
        ];
      }
      if (category.weightFrom > category.weightTo) {
        return [
          { index, key: 'weightTo', message: 'Age to must be greater.', code: 'TOO_LOW' },
          { index, key: 'weightFrom', message: 'Age from must be lower.', code: 'TOO_HIGHT' }
        ];
      }

      return [
        ...findErrors(data, category, index, bySex, maxAge, 'age', 1),
        ...findErrors(data, category, index, bySex, maxWeight, 'weight', 0.1)
      ];
    });

    return errors;
  }

  async calculateFights () {
    const cards = await this.getCards({
      include: [ 'Fighter' ]
    });

    if (cards.length < 2) return [];

    const Fight = sequelize.model('Fight');

    const previousFights = await this.getFights();
    if (previousFights.some(f => f.winnerId)) {
      throw new Error('Cannot change already fought net');
    }
    await Fight.destroy({
      where: { id: previousFights.map(f => f.id) }
    });

    const fightsObjects = this.generateFights(cards.length);

    const fightsWithCards = calculateFights(cards, fightsObjects);

    this.sortByCoach(fightsWithCards);
    const fights = await Fight.bulkCreate(fightsWithCards, { returning: true });

    fights.forEach(fight => {
      fight.FirstCard = cards.find(c => c.id === fight.firstCardId);
      fight.SecondCard = cards.find(c => c.id === fight.secondCardId);
    });
    return fights;
  }

  generateFights (cardsCount) {
    const fights = [];

    const totalFightsCount = cardsCount - 1;
    let stageFightsCount = 1;
    let fightsCountOnPreviousStages = stageFightsCount;
    let fightsLeft = totalFightsCount;

    while (fightsLeft) {
      fights.push({
        id            : uuid(),
        orderNumber   : fightsLeft--,
        degree        : stageFightsCount,
        competitionId : this.competitionId,
        categoryId    : this.id
      });
      if (fightsCountOnPreviousStages === fights.length) {
        fightsCountOnPreviousStages += stageFightsCount *= 2;
      }
    }

    const degrees = [ ...new Set(fights.map(f => f.degree)) ];
    const degreesWithoutFinal = degrees.filter(t => t !== 1);

    degreesWithoutFinal.forEach(degree => {
      const fightsInThisSector = fights
        .filter(f => degree === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      const fightsInNextSector = fights
        .filter(f => degree / 2 === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      for (const fight of fightsInThisSector) {
        const greaterNextFightWithoutChildren = fightsInNextSector
          .find(({ id }) => fights.filter(f => f.nextFightId === id).length < 2);
        fight.nextFightId = greaterNextFightWithoutChildren.id;
      };
    });

    return fights;
  }

  sortByCoach (fightersToFights) {
    const coaches = {};
    Object.values(fightersToFights)
      .flat()
      .forEach(c => coaches[c.coachId] ? coaches[c.coachId]++ : coaches[c.coachId] = 1);

    Object.entries(coaches)
      .sort((a, b) => a[1] - b[1])
      .forEach(([ coachId ], i) => {
        const key = i % 2;
        Object.entries(fightersToFights)
          .filter(([ , cards ]) => cards.length === 2)
          .forEach(([ fightId, cards ]) => {
            if (cards.some(c => c.coachId === coachId) && cards[key].coachId !== coachId) {
              fightersToFights[fightId] = [ fightersToFights[fightId][1], fightersToFights[fightId][0] ];
            }
          });
      });
  }

  static initScopes () {
    const Card = sequelize.model('Card');
    const Fight = sequelize.model('Fight');

    const scopes = {
      cards: {
        include: [ 'Cards', {
          model    : Fight,
          as       : 'Fights',
          required : true,
          include  : [
            { model: Card, as: 'FirstCard', include: [ 'Fighter', 'Club', 'Coach' ] },
            { model: Card, as: 'SecondCard', include: [ 'Fighter', 'Club', 'Coach' ] }
          ]
        } ]
      }
    };

    Object.entries(scopes).forEach(scope => Category.addScope(...scope));
  }
}

const findErrors = (data, category, index, bySex, maxCharacteristic, by, gap) => {
  const keyFrom = `${by}From`;
  const keyTo = `${by}To`;
  const errors = [];
  if (category[keyTo] !== maxCharacteristic) { // check on gap with greater nearest element
    const nearestElement = data.reduce((acc, current) => {
      if (
        category[keyTo] < current[keyFrom] &&
        current[keyFrom] < acc[keyFrom]
      ) return current;
      return acc;
    }, { ageFrom: Infinity, weightFrom: Infinity });
    if (+(nearestElement[keyFrom] - category[keyTo]).toFixed(1) !== +gap.toFixed(1)) {
      errors.push(
        { index, key: keyTo, code: 'WRONG_GAP', message: `Gap should be ${gap}.` }
      );
    }
  }
  bySex.forEach((c, i) => { // Age should not overlap
    if (i === index) return;
    const message = `${upperFirst(by)} should not overlap.`;

    if (category[keyFrom] > c[keyFrom] && category[keyFrom] < c[keyTo]) {
      errors.push({ index, key: keyFrom, message, code: 'WRONG_OVERLAP' });
    } else if (category[keyTo] > c[keyFrom] && category[keyTo] < c[keyTo]) {
      errors.push({ index, key: keyTo, message, code: 'WRONG_OVERLAP' });
    } else if (c[keyFrom] <= category[keyFrom] && c[keyTo] >= category[keyFrom]) {
      errors.push(
        { index, key: keyFrom, message, code: 'WRONG_OVERLAP' },
        { index, key: keyTo, message, code: 'WRONG_OVERLAP' }
      );
    };
  });

  return errors;
};

Category.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  sex        : { type: DT.ENUM([ 'man', 'woman' ]), allowNull: false },
  ageFrom    : { type: DT.INTEGER, allowNull: false },
  ageTo      : { type: DT.INTEGER, allowNull: false },
  weightFrom : { type: DT.FLOAT, allowNull: false },
  weightTo   : { type: DT.FLOAT, allowNull: false },
  weightName : { type: DT.STRING, allowNull: false },
  group      : {
    type      : DT.ENUM([ 'A', 'B' ]),
    allowNull : true,
    validate  : {
      groupByType (next) {
        this.getSection().done((err, section) => {
          if (err) next(err);
          if ((section.type === 'full') && !this.group) {
            next('Full category must have group.');
          }
          next();
        });
      }
    }
  },

  sectionId     : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Sections', key: 'id' }, allowNull: false },
  competitionId : { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

  createdAt : { type: DT.DATE, allowNull: false, defaultValue: new Date() },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false, defaultValue: new Date() }
}, {
  sequelize,
  paranoid: true
});
