import { v4 as uuid } from 'uuid';
const data = [
  {
    id            : '0017630c-4858-4f72-887c-b45c527834f1',
    fighterId     : '055ce55a-1743-4ed7-9ff6-bf53ad666865',
    clubId        : '17460e95-8713-4138-befa-8442f9dedc0d',
    coachId       : '25639d54-5bf5-4380-85b4-1d8b2fbf7608',
    categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
    competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    section       : 'low-kick',
    weight        : 34.2,
    realWeight    : 34.2,
    group         : 'B',
    city          : 'Хорол',
    birthDate     : '2008-02-03T00:00:00.000Z'
  },
  {
    id            : '4c79aeff-3726-4249-82aa-fdb319385407',
    fighterId     : '87664a5d-6589-4b92-998c-50ff0cd9cc3d',
    clubId        : 'ff078d71-54dc-4432-a63a-c1350b0791f5',
    coachId       : '85d0310b-7b88-4cb2-b7a7-0beed805cf84',
    categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
    competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    section       : 'low-kick',
    weight        : 34.2,
    realWeight    : 34.2,
    group         : 'B',
    city          : 'Київ',
    birthDate     : '2009-02-03T00:00:00.000Z'
  },
  {
    id            : '852664df-6c88-49b8-951b-3db58d9c2d05',
    fighterId     : 'dfe141d5-bbad-4ea0-a578-dcbedbb8a277',
    clubId        : 'bb896edd-a39e-4565-801f-35b2509e8361',
    coachId       : '4a3a725b-ef39-4828-bb26-472cf0baae5a',
    categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
    competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    section       : 'low-kick',
    weight        : 35,
    realWeight    : 35,
    group         : 'B',
    city          : 'Київ',
    birthDate     : '2009-02-02T00:00:00.000Z'
  },
  {
    id            : 'bbcac1ac-8c44-41b0-bbfa-d8b12b9ffa49',
    fighterId     : '14efe4d5-dbda-4f92-b3de-a9129ff53e77',
    clubId        : 'ff078d71-54dc-4432-a63a-c1350b0791f4',
    coachId       : '85d0310b-7b88-4cb2-b7a7-0beed805cf83',
    categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
    competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    section       : 'low-kick',
    weight        : 34.2,
    realWeight    : 34.2,
    group         : 'B',
    city          : 'Київ',
    birthDate     : '2009-02-03T00:00:00.000Z'
  },
  {
    id            : '0ec2ab74-3250-4145-bd11-38a546c26671',
    fighterId     : 'ee818bdd-fdda-4854-b6a9-9de5bd82ba03',
    clubId        : 'ff078d71-54dc-4432-a63a-c1350b0791f4',
    coachId       : '85d0310b-7b88-4cb2-b7a7-0beed805cf83',
    categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
    competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    section       : 'low-kick',
    weight        : 36,
    realWeight    : 36,
    group         : 'B',
    city          : 'Київ',
    birthDate     : '2009-05-12T00:00:00.000Z'
  },
  {
    id            : '10a889cc-640d-4cbe-9848-446c53f4f00a',
    fighterId     : '0e0af9f3-9cbd-4be9-bcef-fafc48f2c6d5',
    clubId        : 'ff078d71-54dc-4432-a63a-c1350b0791f4',
    coachId       : '85d0310b-7b88-4cb2-b7a7-0beed805cf83',
    categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
    competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
    section       : 'low-kick',
    weight        : 34.2,
    realWeight    : 34.2,
    group         : 'B',
    city          : 'Київ',
    birthDate     : '2009-02-03T00:00:00.000Z'
  }
];

const proximityCoefficients = { // TODO rank
  coach : 1000000,
  club  : 10000,
  city  : 10
  // rank  : 100
};

function calculateFightersProximityCoefficient (units, coefficientMap) {
  const cardsCoefficients = units.map((from, i) => {
    const deepFrom = deepFlat(from);
    const greaterCoefficient = units.reduce((acc, to, k) => {
      if (i === k) return acc;
      const deepTo = deepFlat(to);
      let coefficient = 0;

      deepFrom.forEach(fightFrom => {
        deepTo.forEach(fightTo => {
          if (fightFrom.coachId === fightTo.coachId) coefficient += coefficientMap.coach;
          if (fightFrom.clubId === fightTo.clubId) coefficient += coefficientMap.club;
          if (fightFrom.city === fightTo.city) coefficient += coefficientMap.city;
        });
      });

      // if (card.coachId === c.coachId) coefficient += coefficientMap.coach;
      // if (card.clubId === c.clubId) coefficient += coefficientMap.club;
      // if (card.city === c.city) coefficient += coefficientMap.city;
      return acc += coefficient;
    }, 0);

    return [ from.id, greaterCoefficient ];
  })
    .sort((a, b) => b[1] - a[1]);

  return cardsCoefficients;
}

function deepFlat (array) {
  const target = array.pair || array;
  const flatten = Array.isArray(target) ? target.flat() : [ target ];
  return Array.isArray(flatten[0]) ? deepFlat(flatten) : flatten;
}

function calculatePairsToPairsCombinations (units, coefficientMap) {
  const cardsToCardsCombinations = units.flatMap((from, i) => {
    const catted = units.slice(i + 1);

    const flattenFrom = deepFlat(from);
    return catted.map((to, k) => {
      // if (i === k) return acc;
      const flattenTo = deepFlat(to);
      const coefficient = {
        id          : uuid(),
        pair        : [ from, to ],
        coefficient : 0
      };
      flattenFrom.forEach(fightFrom => {
        flattenTo.forEach(fightTo => {
          if (fightFrom.coachId === fightTo.coachId) coefficient.coefficient += coefficientMap.coach;
          if (fightFrom.clubId === fightTo.clubId) coefficient.coefficient += coefficientMap.club;
          if (fightFrom.city === fightTo.city) coefficient.coefficient += coefficientMap.city;
        });
      });

      return coefficient;
    }, []);
  })
    .sort((a, b) => a.coefficient - b.coefficient);

  return cardsToCardsCombinations;
}

function aggregateByMinimalCoefficient (combinations, coefficients) {
  let pairs = [ ...combinations ];
  const fightersCoefficients = [ ...coefficients ];
  const fights = [];

  fightersCoefficients.forEach(([ id ], i) => {
    // console.log(`${i}`.repeat(50)); // !nocommit
    // console.log(fightersCoefficients);
    // console.log(`${i}`.repeat(50));
    if (!id) return;

    const potentialFights = pairs
      .filter(({ pair }) => [ pair[0].id, pair[1].id ].includes(id))
      // .sort((a, b) => a.coefficient - b.coefficient)
      .filter(({ coefficient }, _, arr) => coefficient === arr[0].coefficient);

    const potentialRivalIds = potentialFights
      .flatMap(({ pair }) => pair)
      .filter(pair => pair.id !== id)
      .map(pair => pair.id);

    const idToCoefficient =  Object.fromEntries(fightersCoefficients.filter(c => c.length)); // to avoid cycle in cycle
    const moreNeededIdToMerge = potentialRivalIds.reduce(
      (grCoefId, id) => idToCoefficient[id] > idToCoefficient[grCoefId] ? id : grCoefId,
      potentialRivalIds[0]
    );

    const fight = potentialFights.find(({ pair }) => {
      return [ pair[0].id, pair[1].id ].includes(moreNeededIdToMerge);
    });

    if (!fight) {
      const lastFighterWithoutPair = combinations.flatMap(c => c.pair).find(fighter => fighter.id === id);

      return fights.push({ pair: [ lastFighterWithoutPair ], id: uuid() });
    }

    fightersCoefficients[i] = [];
    const rivalIndex = fightersCoefficients.findIndex(c => c[0] === moreNeededIdToMerge);
    fightersCoefficients[rivalIndex] = [];

    pairs = pairs.filter(({ pair }) => {
      return !pair.some(f => fight.pair.some(fighter => fighter.id === f.id));
    });
    fights.push(fight);
  });

  return fights;

  // if (pairs.length === 2) return pairs;
  // const pairsToPair = pairs.slice(1);
  // const pairsPairs = permutations([
  //   pairs,
  //   pairsToPair
  // ]);

  //   return pairs.flatMap((from, i) => {
  //     const cattedCards = cards.slice(i + 1);

//     return cattedCards.map(to => {
//       const coefficient = {
//         // pairs:
//         coefficient: 0
//       };
//       if (cardFrom.coachId === cardTo.coachId) coefficient.coefficient += proximityCoefficients.coach;
//       if (cardFrom.clubId === cardTo.clubId) coefficient.coefficient += proximityCoefficients.club;
//       if (cardFrom.city === cardTo.city) coefficient.coefficient += proximityCoefficients.city;
//       // if (cardFrom.city === cardTo.city) coefficient.coefficient += proximityCoefficients.city;
//       return coefficient;
//     });
//   });
}

// function permutations (input) {
//   return input.reduce((acc, line) => {
//     return line.flatMap(number => {
//       return acc.map(permutation => [ ...permutation, number ]);
//     });
//   }, [ [] ]);
// }

function calculate (cards, proximityCoefficients) {
  const fightersProximityCoefficient = calculateFightersProximityCoefficient(data, proximityCoefficients);

  const cardsToCardsCombinations = calculatePairsToPairsCombinations(data, proximityCoefficients);
  const pairs = aggregateByMinimalCoefficient(cardsToCardsCombinations, fightersProximityCoefficient);
  return pairs.length === 2
    ? pairs
    : calculate(pairs, proximityCoefficients);
}

const fightersProximityCoefficient = calculateFightersProximityCoefficient(data, proximityCoefficients);
const cardsToCardsCombinations = calculatePairsToPairsCombinations(data, proximityCoefficients);
const pairs = aggregateByMinimalCoefficient(cardsToCardsCombinations, fightersProximityCoefficient);

const pairsProximityCoefficient = calculateFightersProximityCoefficient(pairs, proximityCoefficients);
const pp = calculatePairsToPairsCombinations(pairs, proximityCoefficients);
const pairsPairsPairs = aggregateByMinimalCoefficient(pp, pairsProximityCoefficient);
console.log('='.repeat(50)); // !nocommit
console.log(pairsPairsPairs);
console.log('='.repeat(50));

// const res = calculate(data);

// fightersProximityCoefficient.
