import sequelize, { DT }     from '../sequelize-singleton.js';
import Base                  from './Base.js';
import { v4 as uuid }        from 'uuid';

import calculateFights       from './calculateFightersProximity';

export default class Category extends Base {
  static initRelation () {
    const Card = sequelize.model('Card');
    const Fight = sequelize.model('Fight');

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
}

Category.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  section    : { type: DT.STRING, allowNull: false },
  sex        : { type: DT.ENUM([ 'man', 'woman' ]), allowNull: false },
  type       : { type: DT.ENUM([ 'full', 'light' ]), allowNull: false },
  ageFrom    : { type: DT.INTEGER, allowNull: false },
  ageTo      : { type: DT.INTEGER, allowNull: false },
  weightFrom : { type: DT.FLOAT, allowNull: false },
  weightTo   : { type: DT.FLOAT, allowNull: false },
  weightName : { type: DT.STRING, allowNull: false },
  group      : { type: DT.ENUM([ 'A', 'B' ]), allowNull: true },

  competitionId: { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
