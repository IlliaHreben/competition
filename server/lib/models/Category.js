import sequelize, { Op, DT } from '../sequelize-singleton.js';
import Base from './Base.js';
import { v4 as uuid } from 'uuid';

import getCategoryScopes from './scopes/category-scopes.js';
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

  async calculateFights({ recalculate = false } = {}) {
    const cards = await this.getCards({
      include: ['Fighter'],
    });

    if (cards.length < 2) return [];

    const Fight = sequelize.model('Fight');

    const previousFights = await this.getFights();
    if (previousFights.some((f) => f.winnerId)) {
      throw new Error('Cannot change already fought net');
    }
    const fightSpacesToDegrees = previousFights.reduce((acc, fight) => {
      acc[fight.degree] = fight.fightSpaceId;
      return acc;
    }, {});

    const maxDegree = Math.max(...previousFights.map((f) => f.degree));

    if (recalculate) {
      previousFights.forEach((fight) => {
        fight.firstCardId = null;
        fight.secondCardId = null;
      });
    } else {
      await Fight.destroy({
        where: { id: previousFights.map((f) => f.id) },
      });
    }

    const fightsObjects = recalculate ? previousFights : this.generateFights(cards.length);
    const fightsWithCards = calculateFights(cards, fightsObjects);

    this.sortByCoach(fightsWithCards);
    const fights = recalculate
      ? await Promise.all(previousFights.map((f) => f.save()))
      : await Fight.bulkCreate(fightsWithCards, { returning: true });

    // fights.forEach((fight) => (fight.Category = this));

    fights.forEach((fight) => {
      fight.FirstCard = cards.find((c) => c.id === fight.firstCardId);
      fight.SecondCard = cards.find((c) => c.id === fight.secondCardId);
      if (!recalculate)
        fight.fightSpaceId = fightSpacesToDegrees[fight.degree] || fightSpacesToDegrees[maxDegree];
    });

    if (!recalculate || previousFights.some((f) => !f.formulaId))
      await this.assignFightFormulaToFights();

    this.Fights = fights;

    if (!previousFights.length && fights.length) this.assignFightSpaceAndPosition();

    return fights;
  }

  // should find the nearest fight by section, age, sex, weight and group and assign the same fightSpaceId and set serialNumber incremented by 1 and shift further fights vy 1
  async assignFightSpaceAndPosition(fights = this.Fights) {
    const Category = sequelize.model('Category');
    const Fight = sequelize.model('Fight');

    const orderQuery = [
      [sequelize.literal(`ABS(${this.ageFrom} - "ageFrom")`), 'ASC'],
      [sequelize.literal(`("sex" = '${this.sex}')`), 'DESC'],
      [sequelize.literal(`ABS(${this.weightFrom} - "weightFrom")`), 'ASC'],
    ];

    if (this.group) orderQuery.push([sequelize.literal(`("group" = '${this.group}')`), 'DESC']);

    const nearestCategory = await Category.findOne({
      where: {
        competitionId: this.competitionId,
        sectionId: this.sectionId,
        id: { [Op.ne]: this.id },
      },
      include: [{ model: Fight, as: 'Fights', required: true, order: [['serialNumber', 'ASC']] }],
      order: orderQuery,
    });

    const ageHigher = this.ageFrom > nearestCategory.ageFrom;
    const ageEqual = this.ageFrom === nearestCategory.ageFrom;
    const sexMan = this.sex < nearestCategory.sex;
    const weightHigher = this.weightFrom > nearestCategory.weightFrom;
    const weightEqual = this.weightFrom === nearestCategory.weightFrom;
    const groupA = this.group < nearestCategory.group;
    const shouldBeAfter =
      ageHigher || (ageEqual && (sexMan || weightHigher || (weightEqual && groupA)));

    const nearestIndex = shouldBeAfter ? nearestCategory.Fights.length - 1 : 0;
    const nearestFight = nearestCategory.Fights[nearestIndex];
    const movePoint = nearestFight.serialNumber + +shouldBeAfter;

    const currentFightsLength = fights.length;

    await Fight.shiftSerialNumber({
      fightSpaceId: nearestFight.fightSpaceId,
      from: movePoint,
      offset: currentFightsLength,
      side: '+',
    });
    console.log('='.repeat(50)); // !nocommit
    console.log(fights);
    console.log('='.repeat(50));
    await Promise.all(
      fights.map((fight, index) => {
        fight.fightSpaceId = nearestFight.fightSpaceId;
        fight.serialNumber = movePoint + index;
        return fight.save();
      })
    );
  }

  async assignFightFormulaToFights() {
    const FightFormula = sequelize.model('FightFormula');

    const fights = this.Fights || (await this.getFights());
    const where = {
      competitionId: this.competitionId,
      sectionId: this.sectionId,
      group: this.group,
      sex: this.sex,
      weightFrom: { [Op.lte]: this.weightTo },
      weightTo: { [Op.gte]: this.weightFrom },
      ageFrom: { [Op.lte]: this.ageTo },
      ageTo: { [Op.gte]: this.ageFrom },
    };
    const fightFormulas = await FightFormula.findAll({ where });
    const defaultFightFormula = fightFormulas.find((ff) => !ff.degree);

    fights.forEach((fight) => {
      const fitFightFormula =
        fightFormulas.find((ff) => ff.degree === fight.degree) || defaultFightFormula;
      fight.formulaId = fitFightFormula?.id;
      fight.FightFormula = fitFightFormula;
    });

    await Promise.all(fights.map((fight) => fight.save()));
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
    const scopes = getCategoryScopes(this);

    Object.entries(scopes).forEach((scope) => Category.addScope(...scope));
  }

  async addFight() {
    const Fight = sequelize.model('Fight');

    const fights = this.Fights || (await this.getFights());
    const firstFight = fights.find((f) => f.orderNumber === 1) || {};
    const maxDegree = fights.reduce((max, fight) => Math.max(max, fight.degree), 0) || 1;
    const lastDegreeFights = fights.filter((f) => f.degree === maxDegree);
    const isLastDegreeFull = maxDegree === lastDegreeFights.length;
    const serialNumber = firstFight?.serialNumber || 1;

    const fightsWithoutChildren = fights.filter(
      (f) => fights.filter((fight) => fight.nextFightId === f.id).length < 2
    );
    const maxOrderFight = fightsWithoutChildren.reduce(
      (maxFight, fight) => (fight.orderNumber > maxFight.orderNumber ? fight : maxFight),
      { orderNumber: 0 }
    );

    await Fight.update(
      { orderNumber: sequelize.literal('"orderNumber" + 1') },
      { where: { categoryId: this.id } }
    );

    await Fight.shiftSerialNumber({
      fightSpaceId: firstFight?.fightSpaceId || null,
      from: serialNumber,
      offset: 1,
      side: '+',
    });

    const fight = await Fight.create({
      nextFightId: maxOrderFight.id,
      formulaId: firstFight.formulaId,
      fightSpaceId: firstFight.fightSpaceId,
      categoryId: this.id,
      orderNumber: 1,
      serialNumber,
      degree: isLastDegreeFull ? maxDegree * 2 : maxDegree,
    });

    return fight;
  }

  async removeFight() {
    const Fight = sequelize.model('Fight');

    const fights = this.Fights || (await this.getFights());

    if (fights.length === 0) return;

    const firstFight = fights.find((f) => f.orderNumber === 1);

    await Fight.update(
      { orderNumber: sequelize.literal('"orderNumber" - 1') },
      { where: { categoryId: this.id } }
    );

    await Fight.shiftSerialNumber({
      fightSpaceId: firstFight.fightSpaceId,
      from: firstFight.serialNumber + 1,
      offset: 1,
      side: '-',
    });

    return firstFight.destroy();
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
