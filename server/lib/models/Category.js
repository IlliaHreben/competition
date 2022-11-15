import sequelize, { Op, DT } from '../sequelize-singleton.js';
import Base from './Base.js';
import { v4 as uuid } from 'uuid';

import calculateFights from './calculateFightersProximity';
import { splitBy } from '../utils/index.js';

export default class Category extends Base {
  static initRelation() {
    const Card = sequelize.model('Card');
    const Fight = sequelize.model('Fight');
    const Section = sequelize.model('Section');

    this.belongsTo(Section, {
      as: 'Section',
      foreignKey: {
        name: 'sectionId',
        allowNull: false,
      },
    });

    this.hasMany(Card, {
      as: 'Cards',
      foreignKey: {
        name: 'categoryId',
        allowNull: true,
      },
    });

    this.hasMany(Fight, {
      as: 'Fights',
      foreignKey: {
        name: 'categoryId',
        allowNull: false,
      },
    });
  }

  static validateCategories(categories, target = categories) {
    const [women, men] = splitBy(categories, (c) => c.sex === 'man');

    const errors = target.flatMap((category, index) => {
      // for every index find error
      if (category.ageFrom >= category.ageTo) {
        return [
          { index, key: 'ageTo', code: 'TOO_LOW' },
          { index, key: 'ageFrom', code: 'TOO_HIGHT' },
        ];
      }
      if (category.weightFrom >= category.weightTo) {
        return [
          { index, key: 'weightTo', code: 'TOO_LOW' },
          { index, key: 'weightFrom', code: 'TOO_HIGHT' },
        ];
      }

      const bySex = [...(category.sex === 'man' ? men : women)];
      const _categories = category.group ? bySex.filter((c) => c.group === category.group) : bySex;

      const currentIndex = _categories.indexOf(category);
      if (currentIndex >= 0) _categories.splice(currentIndex, 1);

      const maxWeight = Math.max(..._categories.map((c) => c.weightTo));
      const maxAge = Math.max(..._categories.map((c) => c.ageTo));

      const _errors = findErrors(_categories, category, index, maxAge, 'age', 1);
      if (_errors.length) return _errors;

      const filteredByAge = _categories.filter(
        (c) => c.ageFrom === category.ageFrom && c.ageTo === category.ageTo
      );
      return findErrors(filteredByAge, category, index, maxWeight, 'weight', 0.1);
    });

    return errors;
  }

  async calculateFights() {
    const cards = await this.getCards({
      include: ['Fighter'],
    });

    if (cards.length < 2) return [];

    const Fight = sequelize.model('Fight');

    const previousFights = await this.getFights();
    if (previousFights.some((f) => f.winnerId)) {
      throw new Error('Cannot change already fought net');
    }
    await Fight.destroy({
      where: { id: previousFights.map((f) => f.id) },
    });

    const fightsObjects = this.generateFights(cards.length);

    const fightsWithCards = calculateFights(cards, fightsObjects);

    this.sortByCoach(fightsWithCards);
    const fights = await Fight.bulkCreate(fightsWithCards, { returning: true });

    fights.forEach((fight) => {
      fight.FirstCard = cards.find((c) => c.id === fight.firstCardId);
      fight.SecondCard = cards.find((c) => c.id === fight.secondCardId);
    });
    return fights;
  }

  generateFights(cardsCount) {
    const fights = [];

    const totalFightsCount = cardsCount - 1 || 1;
    let stageFightsCount = 1;
    let fightsCountOnPreviousStages = stageFightsCount;
    let fightsLeft = totalFightsCount;

    while (fightsLeft) {
      fights.push({
        id: uuid(),
        orderNumber: fightsLeft--,
        degree: stageFightsCount,
        competitionId: this.competitionId,
        categoryId: this.id,
      });
      if (fightsCountOnPreviousStages === fights.length) {
        fightsCountOnPreviousStages += stageFightsCount *= 2;
      }
    }

    const degrees = [...new Set(fights.map((f) => f.degree))];
    const degreesWithoutFinal = degrees.filter((t) => t !== 1);

    degreesWithoutFinal.forEach((degree) => {
      const fightsInThisSector = fights
        .filter((f) => degree === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      const fightsInNextSector = fights
        .filter((f) => degree / 2 === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      for (const fight of fightsInThisSector) {
        const greaterNextFightWithoutChildren = fightsInNextSector.find(
          ({ id }) => fights.filter((f) => f.nextFightId === id).length < 2
        );
        fight.nextFightId = greaterNextFightWithoutChildren.id;
      }
    });
    return fights;
  }

  sortByCoach(fightersToFights) {
    const coaches = {};
    Object.values(fightersToFights)
      .flat()
      .forEach((c) => (coaches[c.coachId] ? coaches[c.coachId]++ : (coaches[c.coachId] = 1)));

    Object.entries(coaches)
      .sort((a, b) => a[1] - b[1])
      .forEach(([coachId], i) => {
        const key = i % 2;
        Object.entries(fightersToFights)
          .filter(([, cards]) => cards.length === 2)
          .forEach(([fightId, cards]) => {
            if (cards.some((c) => c.coachId === coachId) && cards[key].coachId !== coachId) {
              fightersToFights[fightId] = [
                fightersToFights[fightId][1],
                fightersToFights[fightId][0],
              ];
            }
          });
      });
  }

  async assignFightsToFormula() {
    const FightFormula = sequelize.model('FightFormula');

    const fightFormulas = await FightFormula.findAll({
      where: {
        competitionId: this.competitionId,
        sectionId: this.sectionId,
        weightFrom: { [Op.lte]: this.weightFrom },
        weightTo: { [Op.gte]: this.weightTo },
        ageFrom: { [Op.lte]: this.ageFrom },
        ageTo: { [Op.gte]: this.ageTo },
        group: this.group,
        sex: this.sex,
      },
    });

    const fights = await this.getFights();

    fights.forEach(async (fight) => {
      const fightFormula =
        fightFormulas.find((f) => f.degree === fight.degree) ||
        fightFormulas.find((f) => f.degree === null);

      fight.formulaId = fightFormula.id;
    });

    await Promise.all(fights.map((fight) => fight.save()));
  }

  static initScopes() {
    const Card = sequelize.model('Card');
    const Fight = sequelize.model('Fight');
    const Fighter = sequelize.model('Fighter');
    const Club = sequelize.model('Club');

    const scopes = {
      cards: {
        attributes: [
          ...Object.keys(this.getAttributes()),
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM "Cards" WHERE "Cards"."categoryId" = "Category"."id")'
            ),
            'cardsCount',
          ],
        ],
        include: [
          {
            model: Card,
            as: 'Cards',
            required: true,
            include: [{ model: Fighter, as: 'Fighter', include: ['Club', 'Coach'] }],
          },
          {
            model: Fight,
            as: 'Fights',
            order: [[sequelize.literal('"orderNumber"'), 'DESC']],
            include: [
              {
                model: Card,
                as: 'FirstCard',
                include: [
                  {
                    model: Fighter,
                    as: 'Fighter',
                    include: [{ model: Club, as: 'Club', include: 'Settlement' }, 'Coach'],
                  },
                ],
              },
              {
                model: Card,
                as: 'SecondCard',
                include: [
                  {
                    model: Fighter,
                    as: 'Fighter',
                    include: [{ model: Club, as: 'Club', include: 'Settlement' }, 'Coach'],
                  },
                ],
              },
            ],
          },
        ],
        // order   : [ [ { model: Fight, as: 'Fights' }, 'secondCardId', 'ASC' ] ],
        order: [
          [sequelize.literal('"cardsCount"'), 'DESC'],
          ['id', 'ASC'],
        ],
        // logging  : true,
        // distinct: true,
      },
      sections: {
        include: ['Section'],
      },
      cardsWithFighters: {
        include: {
          model: Card,
          as: 'Cards',
          required: true,
          include: ['Fighter'],
          order: [['id', 'ASC']],
        },
      },
      // search: (search) => ({
      //   where: {
      //     [Op.or]: [
      //       { '$Cards.Fighter.name$': { [Op.iLike]: `%${search}%` } },
      //       { '$Cards.Fighter.lastName$': { [Op.iLike]: `%${search}%` } },
      //     ],
      //   },
      //   include: [{ model: Card, as: 'Cards', include: ['Fighter'] }],
      // }),
      // clubId: (clubId) => ({
      //   where: sequelize.where(sequelize.col('Cards.Fighter.clubId'), clubId),
      //   include: [{ model: Card, as: 'Cards', include: ['Fighter'] }],
      // }),
      // coachId: (coachId) => ({
      //   where: sequelize.where(sequelize.col('Cards.Fighter.coachId'), coachId),
      //   include: [{ model: Card, as: 'Cards', include: ['Fighter'] }],
      // }),
      // settlementId: (settlementId) => ({
      //   where: sequelize.where(sequelize.col('Cards.Fighter.Club.settlementId'), settlementId),
      //   include: {
      //     model: Card,
      //     as: 'Cards',
      //     include: {
      //       model: Fighter,
      //       as: 'Fighter',
      //       include: {
      //         model: Club,
      //         as: 'Club',
      //         // where: { settlementId },
      //       },
      //     },
      //   },
      // }),
      sectionId: (sectionId) => ({ where: { sectionId } }),
      group: (group) => ({ where: { group } }),
      sex: (sex) => ({ where: { sex } }),
      weightFrom: (weightFrom) => ({ where: { [Op.gte]: { weightFrom } } }),
      weightTo: (weightTo) => ({ where: { [Op.lte]: { weightTo } } }),
      ageFrom: (ageFrom) => ({ where: { [Op.gte]: { ageFrom } } }),
      ageTo: (ageTo) => ({ where: { [Op.lte]: { ageTo } } }),
      type: (type) => ({ where: { '$Section.type$': type }, include: ['Section'] }),
    };

    Object.entries(scopes).forEach((scope) => Category.addScope(...scope));
  }
}

const findErrors = (categories, categoryToCheck, index, maxCharacteristic, by, gap) => {
  const from = `${by}From`;
  const to = `${by}To`;
  const errors = [];
  if (categoryToCheck[to] !== maxCharacteristic) {
    // check on gap with greater nearest element
    const nearestGreaterElement = findNearestGreaterElement(categoryToCheck, categories, to, from);
    if (nearestGreaterElement) {
      const wrongGap =
        +(nearestGreaterElement[from] - categoryToCheck[to]).toFixed(1) !== +gap.toFixed(1);
      if (wrongGap) {
        errors.push({ index, key: to, code: 'WRONG_GAP' });
      }
    }
    const nearestLowerElement = findNearestLowerElement(categoryToCheck, categories, to, from);
    if (nearestLowerElement) {
      const wrongGap =
        +(nearestLowerElement[from] - categoryToCheck[to]).toFixed(1) !== +gap.toFixed(1);
      if (wrongGap) {
        errors.push({ index, key: to, code: 'WRONG_GAP' });
      }
    }
  }
  categories.forEach((c, i) => {
    // Age should not overlap
    const fromHigher = categoryToCheck[from] > c[from];
    // const fromHigherOrEqual = categoryToCheck[from] >= c[from];
    const toLower = categoryToCheck[to] < c[to];
    // const fromLowerOrEqualTo = categoryToCheck[from] <= c[to];
    const toHigherFrom = categoryToCheck[to] > c[from];
    const fromLowerTo = categoryToCheck[from] < c[to];
    const toEqual = categoryToCheck[to] === c[to];
    const fromEqual = categoryToCheck[from] === c[from];

    const avarageTagret = categoryToCheck[from] + (categoryToCheck[to] - categoryToCheck[from]) / 2;
    const avarageCurrent = c[from] + (c[to] - c[from]) / 2;

    const targetIsHigher = avarageTagret > avarageCurrent;
    const targetIsEqual = avarageTagret === avarageCurrent;

    //    [---]     [---]          [---]
    //    [---]     [------]    [------]
    if (fromEqual || toEqual) {
      //      [---]          [---]
      //      [------]    [------]
      if (by === 'weight' || !targetIsEqual)
        errors.push(
          { index, key: from, code: 'WRONG_OVERLAP' },
          { index, key: to, code: 'WRONG_OVERLAP' }
        );
      //         [----]
      //      [----]
    } else if (targetIsHigher && fromLowerTo) {
      errors.push({ index, key: from, code: 'WRONG_OVERLAP' });

      //    [----]
      //      [----]
    } else if (!targetIsHigher && toHigherFrom) {
      errors.push({ index, key: to, code: 'WRONG_OVERLAP' });

      //        [----]
      //      [--------]
    } else if (fromHigher && toLower) {
      errors.push(
        { index, key: from, code: 'WRONG_OVERLAP' },
        { index, key: to, code: 'WRONG_OVERLAP' }
      );
    }
  });

  return errors;
};

const findNearestGreaterElement = (categoryToCheck, categories, keyTo, keyFrom) => {
  return findNearestElement(
    categories,
    (acc, current) => categoryToCheck[keyTo] < current[keyFrom] && current[keyFrom] < acc[keyFrom]
  );
};

const findNearestLowerElement = (categoryToCheck, categories, keyTo, keyFrom) => {
  return findNearestElement(
    categories,
    (acc, current) => categoryToCheck[keyFrom] > current[keyTo] && current[keyTo] > acc[keyTo]
  );
};

const findNearestElement = (categories, getCondition) => {
  const fakeInitialValue = { ageFrom: Infinity, weightFrom: Infinity };
  const nearestElement = categories.reduce((acc, current) => {
    return getCondition(acc, current) ? current : acc;
  }, fakeInitialValue);

  if (fakeInitialValue !== nearestElement) return nearestElement;
};

Category.init(
  {
    id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

    sex: { type: DT.ENUM(['man', 'woman']), allowNull: false },
    ageFrom: { type: DT.INTEGER, allowNull: false },
    ageTo: { type: DT.INTEGER, allowNull: false },
    weightFrom: { type: DT.FLOAT, allowNull: false },
    weightTo: { type: DT.FLOAT, allowNull: false },
    weightName: { type: DT.STRING, allowNull: false },
    group: {
      type: DT.ENUM(['A', 'B']),
      allowNull: true,
      validate: {
        groupByType(group, next) {
          this.getSection()
            .then((section) => {
              if (section.type === 'full' && !group) {
                next('Full category must have group.');
              }
              next();
            })
            .catch((err) => next(err));
        },
      },
    },

    sectionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Sections', key: 'id' },
      allowNull: false,
    },
    competitionId: {
      type: DT.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'Competitions', key: 'id' },
      allowNull: false,
    },

    createdAt: { type: DT.DATE, allowNull: false, defaultValue: new Date() },
    deletedAt: { type: DT.DATE, allowNull: true },
    updatedAt: { type: DT.DATE, allowNull: false, defaultValue: new Date() },
  },
  {
    sequelize,
    paranoid: true,
  }
);
