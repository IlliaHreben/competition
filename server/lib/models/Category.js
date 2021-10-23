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

    // const fights = await Fight.bulkCreate(fightsObjects);

    // const fightsCoefficients = this.calculateFightsProximityCoefficient(fights);
    // const fightersCoefficients = this.calculateFightersProximityCoefficient(cards);
    // const fightersToFights = this.calculateFightersToFights({
    //   fightsCoefficients,
    //   fightersCoefficients,
    //   cards
    // });
    const fightsWithCards = calculateFights(cards, fightsObjects);
    // console.log('='.repeat(50)); // !nocommit
    // console.log(fightsWithCards);
    // console.log('='.repeat(50));
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

  calculateFightersToFights ({ fightsCoefficients, fightersCoefficients, cards }) {
    const fightersToFights = {};

    const getMaxProximityFight = (key) => {
      for (const fightCoefficient of fightsCoefficients) {
        const fight = fightCoefficient[key];
        const arrayOfCards = fightersToFights[fight.id];
        const availablePlaces = 2 - fight.filledPlacesCount;
        if (!arrayOfCards || arrayOfCards.length < availablePlaces) return fight.id;
      }
    };

    fightersCoefficients.forEach(({ firstFighter, secondFighter }, i) => {
      const firstFightId = getMaxProximityFight('firstFight');
      const secondFightId = getMaxProximityFight('secondFight');
      fightersToFights[firstFightId]
        ? fightersToFights[firstFightId].push(firstFighter)
        : fightersToFights[firstFightId] = [ firstFighter ];

      fightersToFights[secondFightId]
        ? fightersToFights[secondFightId].push(secondFighter)
        : fightersToFights[secondFightId] = [ secondFighter ];

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
    });
    const calculatedCards = Object.values(fightersToFights).flat();
    const cardWithoutPair = cards.find(card => !calculatedCards.includes(card));
    if (cardWithoutPair) {
      const firstFightId = getMaxProximityFight('firstFight');
      fightersToFights[firstFightId]
        ? fightersToFights[firstFightId].push(cardWithoutPair)
        : fightersToFights[firstFightId] = [ cardWithoutPair ];
    }

    return fightersToFights;
  }

  calculateFightsProximityCoefficient (fights) {
    const lastFights = fights.reduce((acc, fight) => {
      const filledPlacesCount = fights.filter(f => f.nextFightId === fight.id).length;
      return [
        ...acc,
        ...(filledPlacesCount < 2) ? [ { ...fight.dataValues, filledPlacesCount } ] : []
      ];
    }, []);

    const coefficients = [];
    lastFights.forEach((fightFrom, i) => {
      // const cattedFights = lastFights.slice(i + 1);
      lastFights.forEach(fightTo => {
        // if (fightFrom.id === fightTo.id) return;
        const coefficient = {
          firstFight  : fightFrom,
          secondFight : fightTo,
          coefficient : 0
        };
        const countStepsToCommonParent = (first, second) => { // TODO: mb need to increment by 0.5 when parent not found
          if (
            first.id === second.nextFightId ||
            second.id === first.nextFightId
          ) return coefficient.coefficient++;

          const firstParent = fights.find(f => f.id === first.nextFightId);
          const secondParent = fights.find(f => f.id === second.nextFightId);
          if (firstParent) coefficient.coefficient++;
          if (secondParent) {
            coefficient.coefficient++;
            if (firstParent.id !== secondParent.id) {
              countStepsToCommonParent(firstParent || first, secondParent || second);
            };
          }
        };
        countStepsToCommonParent(fightFrom, fightTo);
        coefficients.push(coefficient);
      });
    });

    return coefficients.sort((a, b) => b.coefficient - a.coefficient);
  }

  calculateFightersProximityCoefficient (cards) {
    console.log('='.repeat(50)); // !nocommit
    console.log(cards.map(c => c.dataValues));
    console.log('='.repeat(50));
    const proximityCoefficients = { // TODO rank
      coach : 1000,
      club  : 500,
      city  : 200
      // rank  : 100
    };

    return cards.flatMap((cardFrom, i) => {
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
