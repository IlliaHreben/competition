import sequelize, { DT }     from '../sequelize-singleton.js';
import Base                  from './Base.js';

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
      include: 'Fighter'
      // order   : [ [ 'weight', 'DESC' ], [ 'age', 'DESC' ] ]
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

    const fightsObject = [];

    const totalFightsCount = cards.length - 1;
    let stageFightsCount = 1;
    let fightsLeft = totalFightsCount;

    while (stageFightsCount * 2 <= totalFightsCount) { // TODO merge with
      for (let i = 1; i <= stageFightsCount; i++) {
        fightsObject.push({
          orderNumber   : fightsLeft--,
          degree        : stageFightsCount,
          competitionId : this.competitionId,
          categoryId    : this.id
        });
      }
      stageFightsCount *= 2;
    }

    for (let i = 1; i <= fightsLeft; fightsLeft--) { // this
      fightsObject.push({
        orderNumber   : fightsLeft,
        degree        : stageFightsCount,
        competitionId : this.competitionId,
        categoryId    : this.id
      });
    }

    const fights = await Fight.bulkCreate(fightsObject);

    const degrees = [ ...new Set(fights.map(f => f.degree)) ];
    const degreesWithoutFinal = degrees.filter(t => t !== 1);

    await Promise.all(degreesWithoutFinal.map(async degree => {
      const fightsInThisSector = fights
        .filter(f => degree === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      const fightsInNextSector = fights
        .filter(f => degree / 2 === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      for (const fight of fightsInThisSector) {
        const greaterNextFightWithoutChildren = fightsInNextSector
          .find(({ id }) => fights.filter(f => f.nextFightId === id).length < 2);
        await fight.update({ nextFightId: greaterNextFightWithoutChildren.id });
      };
    }));

    const fightsCoefficients = this.calculateFightsProximityCoefficient(fights);
    const fightersCoefficients = this.calculateFightersProximityCoefficient(cards);
    const fightersToFights = this.calculateFightersToFights({ fightsCoefficients, fightersCoefficients });
    this.sortByCoach(fightersToFights);

    await Promise.all(
      Object.entries(fightersToFights).map(([ fightId, cards ]) => {
        const fight = fights.find(f => f.id === fightId);
        fight.FirstCard = cards[0];
        fight.SecondCard = cards[1];

        return fight.update({
          firstCardId  : cards[0].id,
          secondCardId : cards[1].id
        });
      })
    );
    return fights;
  }

  sortByCoach (fightersToFights) {
    const coaches = {};
    Object
      .values(fightersToFights)
      .map(cards => cards.forEach(c => {
        coaches[c.coachId] ? coaches[c.coachId]++ : coaches[c.coachId] = 1;
      }));
    Object.entries(coaches).sort((a, b) => a[1] - b[1]).forEach(([ coachId ], i) => {
      const key = i % 2;
      Object.entries(fightersToFights).forEach(([ fightId, cards ]) => {
        if (cards.some(c => c.coachId === coachId) && cards[key].coachId !== coachId) {
          fightersToFights[fightId] = [ fightersToFights[fightId][1], fightersToFights[fightId][0] ];
        }
      });
    });
  }

  calculateFightersToFights ({ fightsCoefficients, fightersCoefficients }) {
    const fightersToFights = {};

    const getMaxProximityFirstFight = () => {
      for (const fightCoefficient of fightsCoefficients) {
        if (
          !fightersToFights[fightCoefficient.firstFight] ||
          fightersToFights[fightCoefficient.firstFight].length < 2
        ) return fightCoefficient.firstFight;
      }
    };
    const getMaxProximitySecondFight = () => {
      for (const fightCoefficient of fightsCoefficients) {
        if (
          !fightersToFights[fightCoefficient.secondFight] ||
          fightersToFights[fightCoefficient.secondFight].length < 2
        ) return fightCoefficient.secondFight;
      }
    };
    fightersCoefficients.forEach(({ firstFighter, secondFighter }, i) => {
      // IMPORTANT!!! Array mutating
      //
      // delete all entries with this ids in array
      const indexesToDelete = [];
      fightersCoefficients.forEach((c, k) => {
        if (
          i !== k &&
          (c.firstFighter.id === firstFighter.id ||
          c.firstFighter.id === secondFighter.id ||
          c.secondFighter.id === firstFighter.id ||
          c.secondFighter.id === secondFighter.id)
        ) {
          indexesToDelete.push(k);
        }
      });
      indexesToDelete.reverse().forEach(i => fightersCoefficients.splice(i, 1));

      const firstFightId = getMaxProximityFirstFight();
      const secondFightId = getMaxProximitySecondFight();
      fightersToFights[firstFightId]
        ? fightersToFights[firstFightId].push(firstFighter)
        : fightersToFights[firstFightId] = [ firstFighter ];

      fightersToFights[secondFightId]
        ? fightersToFights[secondFightId].push(secondFighter)
        : fightersToFights[secondFightId] = [ secondFighter ];
    });
    return fightersToFights;
  }

  calculateFightsProximityCoefficient (fights) {
    const lastFights = fights.filter(fight => fights.filter(f => f.nextFightId === fight.id) < 2);

    const coefficients = [];
    lastFights.forEach((fightFrom, i) => {
      // const cattedFights = lastFights.slice(i + 1);
      lastFights.forEach(fightTo => {
        // if (fightFrom.id === fightTo.id) return;
        const coefficient = {
          firstFight  : fightFrom.id,
          secondFight : fightTo.id,
          coefficient : 0
        };
        const countStepsToCommonParent = (first, second) => { // TODO: mb need to increment by 0.5 when parent not found
          const firstParent = fights.find(f => f.id === first.nextFightId) || first;
          const secondParent = fights.find(f => f.id === second.nextFightId) || second;
          coefficient.coefficient++;
          if (firstParent.id !== secondParent.id) countStepsToCommonParent(firstParent, secondParent);
        };
        countStepsToCommonParent(fightFrom, fightTo);
        coefficients.push(coefficient);
      });
    });

    return coefficients.sort((a, b) => b.coefficient - a.coefficient);
  }

  calculateFightersProximityCoefficient (cards) {
    const proximityCoefficients = { // TODO rank
      coach : 1000,
      club  : 500,
      city  : 200
      // rank  : 100
    };

    return cards.map((cardFrom, i) => {
      const cattedCards = cards.slice(i + 1);

      return cattedCards.map(cardTo => {
        const coefficient = {
          firstFighter  : cardFrom,
          secondFighter : cardTo,
          coefficient   : 0
        };
        if (cardFrom.coachId === cardTo.coachId) coefficient.coefficient += proximityCoefficients.coach;
        if (cardFrom.clubId === cardTo.clubId) coefficient.coefficient += proximityCoefficients.club;
        if (cardFrom.city === cardTo.city) coefficient.coefficient += proximityCoefficients.city;
        // if (cardFrom.city === cardTo.city) coefficient.coefficient += proximityCoefficients.city;
        return coefficient;
      });
    })
      .flat()
      .sort((a, b) => b.coefficient - a.coefficient);
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
