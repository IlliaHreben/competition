import  { v4 as uuid } from 'uuid';
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
    city          : 'Київ',
    birthDate     : '2008-02-03T00:00:00.000Z'
  },
  // {
  //   id            : '4c79aeff-3726-4249-82aa-fdb319385407',
  //   fighterId     : '87664a5d-6589-4b92-998c-50ff0cd9cc3d',
  //   clubId        : 'ff078d71-54dc-4432-a63a-c1350b0791f4',
  //   coachId       : '85d0310b-7b88-4cb2-b7a7-0beed805cf83',
  //   categoryId    : 'f45ca04f-d647-4c80-a12c-fb222495efaa',
  //   competitionId : 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb',
  //   section       : 'low-kick',
  //   weight        : 34.2,
  //   realWeight    : 34.2,
  //   group         : 'B',
  //   city          : 'Київ',
  //   birthDate     : '2009-02-03T00:00:00.000Z'
  // },
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

function calculateFightersProximityCoefficient (cards, coefficientMap) {
  const cardsCoefficients = cards.map((card, i) => {
    const greaterCoefficient = cards.reduce((acc, c, k) => {
      if (i === k) return acc;
      let coefficient = 0;

      if (card.coachId === c.coachId) coefficient += coefficientMap.coach;
      if (card.clubId === c.clubId) coefficient += coefficientMap.club;
      if (card.city === c.city) coefficient += coefficientMap.city;
      return acc += coefficient;
    }, 0);

    return [ card, greaterCoefficient ];
  })
    .sort((a, b) => b[1] - a[1]);

  return cardsCoefficients;
}

function deepFlat (array) {
  const flatten = Array.isArray(array) ? array.flat() : [ array ];
  return Array.isArray(flatten[0]) ? deepFlat(flatten) : flatten;
}

function calculateCardsToCardsCombinations (units, coefficientMap) {
  const cardsToCardsCombinations = units.flatMap((from, i) => {
    const cattedUnits = units.slice(i + 1);

    return (function getCoefficient (from, units) {
      const flattenFrom = deepFlat(from);
      return units.map(to => {
        const flattenTo = deepFlat(to);
        const coefficient = {
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
      });
    })(from, cattedUnits);

    return cattedUnits.map(to => {
      const coefficient = {
        pair        : [ from, to ],
        coefficient : 0
      };
      if (from.coachId === to.coachId) coefficient.coefficient += coefficientMap.coach;
      if (from.clubId === to.clubId) coefficient.coefficient += coefficientMap.club;
      if (from.city === to.city) coefficient.coefficient += coefficientMap.city;
      // if (from.city === to.city) coefficient.coefficient += coefficientMap.city;
      return coefficient;
    });
  })
    .sort((a, b) => a.coefficient - b.coefficient);

  return cardsToCardsCombinations;
}

function aggregateByMinimalCoefficient (combinations, coefficients) {
  let pairs = [ ...combinations ];
  const fightersCoefficients = new Map(coefficients.entries());
  const fights = [];

  fightersCoefficients.forEach(([ fighter ], key, map) => {
    console.log('='.repeat(50)); // !nocommit
    console.log(fightersCoefficients);
    console.log('='.repeat(50));
    if (!fighter) return;
    const potentialFights = pairs
      .filter(({ pair }) => [ pair[0], pair[1] ].includes(fighter))
      // .sort((a, b) => a.coefficient - b.coefficient)
      .filter(({ coefficient }, _, arr) => coefficient === arr[0].coefficient);
    // console.log('='.repeat(50)); // !nocommit
    // console.log(potentialFights);
    // console.log('='.repeat(50));
    if (!potentialFights.length) {
      const lastFighterWithoutPair = combinations.flatMap(c => c.pair).find(f => f === fighter);

      return fights.push([ lastFighterWithoutPair ]);
    }

    const potentialRivals = potentialFights
      .flatMap(({ pair }) => pair)
      .filter(f => f !== fighter);
    // const fighterToCoefficient =  new Map(fightersCoefficients.filter(c => c.length)); // to avoid cycle in cycle
    const moreNeededFighterToMerge = potentialRivals.reduce(
      (grCoefFighter, fighter) => fightersCoefficients.get(fighter) > fightersCoefficients.get(grCoefFighter)
        ? fighter
        : grCoefFighter
    );

    const fight = potentialFights.find(({ pair }) => {
      return [ pair[0], pair[1] ].includes(moreNeededFighterToMerge);
    });

    map.delete(key);
    const rivalIndex = fightersCoefficients.findIndex(c => c[0] === moreNeededFighterToMerge);
    map.delete(moreNeededFighterToMerge);

    pairs = pairs.filter(({ pair }) => {
      return !pair.some(f => fight.pair.some(fighter => fighter === f));
    });
    fights.push(fight.pair);
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

const fightersProximityCoefficient = calculateFightersProximityCoefficient(data, proximityCoefficients);

const cardsToCardsCombinations = calculateCardsToCardsCombinations(data, proximityCoefficients);
const a = aggregateByMinimalCoefficient(cardsToCardsCombinations, fightersProximityCoefficient);
console.log('='.repeat(50)); // !nocommit
console.log(cardsToCardsCombinations);
console.log('='.repeat(50));

// fightersProximityCoefficient.
