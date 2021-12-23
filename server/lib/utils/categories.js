export function createBlocks (_categories, days = 1) {
  const categories = [ ..._categories ];

  const blocks = [];

  const blockSeparators = blockSeparatorsList.find(s => s.days === days);

  categories.forEach(category => {
    const blockAlreadyExist = blocks.some(b =>
      b.sectionId === category.sectionId &&
      b.ageFrom === category.ageFrom &&
      b.ageTo === category.ageTo
    );
    if (blockAlreadyExist) return;

    const localBlocks = blockSeparators.separators.map(b => ({
      ...b,
      sectionId  : category.sectionId,
      ageFrom    : category.ageFrom,
      ageTo      : category.ageTo,
      // fights: [],
      categories : []
    }));

    const fitCategories = categories.filter(c =>
      c.sectionId === category.sectionId &&
      c.ageFrom === category.ageFrom &&
      c.ageTo === category.ageTo
    );

    fitCategories.forEach(c => {
      const maxCategoryDegree = Math.max(...c.Fights.map(f => f.degree));
      const fitSeparators = blockSeparators.separators
        .filter(({ existedDegree }) => existedDegree <= maxCategoryDegree);
      const maxSeparator = Math.max(...fitSeparators.map(s => s.existedDegree));
      const maxSeparators = fitSeparators
        .filter(s => maxSeparator === s.existedDegree)
        .sort((a, b) => b.separatedDegree - a.separatedDegree);

      if (maxSeparators.length) {
        maxSeparators.forEach(({ existedDegree, separatedDegree }) => {
          const fights = c.Fights.reduce((acc, fight, i) => {
            if (fight.degree <= separatedDegree) return acc;
            // const [removed] = c.Fights.splice(i, 1);
            const newAcc = [ c.Fights[i], ...acc ];
            delete c.Fights[i];
            return newAcc;
          }, []);
          c.Fights = c.Fights.filter(Boolean);

          const matchedBlock = localBlocks.find(b =>
            b.existedDegree === existedDegree &&
            b.separatedDegree === separatedDegree
          );

          const matchedCategory = matchedBlock.categories.find(category => category.id === c.id);
          if (matchedCategory) matchedCategory.Fights.push(...fights);
          else matchedBlock.categories.push({ ...c, Fights: fights });

          // matchedBlock.fights.push(...fights);

          // const fights = c.Fights.filter(f => f.degree > separatedDegree);
        });
      }
    });

    blocks.push(...localBlocks.filter(b => b.categories.length));

    // categories.forEach((c, i) => {
    //   if (
    //     c.sectionId !== category.sectionId ||
    //     c.ageFrom !== category.ageFrom ||
    //     c.ageTo !== category.ageTo
    //   ) return;
    // });
  });

  const sortedBlocks = blocks.map(block => {
    block.categories = block.categories.sort((a, b) => b.Fights.length - a.Fights.length);
    const fights = [];
    blockSeparators.orders.forEach(({ existedDegree, activeDegree }) => {
      const matchedCategories = block.categories.filter(c => {
        const maxExistedDegree = Math.max(...c.Fights.map(f => f.degree));
        return existedDegree === maxExistedDegree;
      });
      const matchedFights = matchedCategories.flatMap(c => {
        c.Fights
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .sort((a, b) => b.degree - a.degree);
        return c.Fights.filter(f => f.degree === activeDegree);
      });

      fights.push(...matchedFights);
    });
    return fights;
  });

  console.log('='.repeat(50)); // !nocommit
  console.log(sortedBlocks.map(f => f
    .map(f =>
        `${f?.orderNumber}. 1/${f?.degree}: ${f?.FirstCard?.Fighter.lastName} ${f?.FirstCard?.Fighter.name} & ${f?.SecondCard?.Fighter.lastName} ${f?.SecondCard?.Fighter.name}`
    )));
  console.log('='.repeat(50));

  return blocks;
}

const blockSeparatorsList = [
  {
    days       : 1,
    separators : [ { existedDegree: 1, separatedDegree: 0 } ],
    orders     : [
      { existedDegree: 16, activeDegree: 16 },
      { existedDegree: 8, activeDegree: 8 },
      { existedDegree: 16, activeDegree: 8 },
      { existedDegree: 4, activeDegree: 4 },
      { existedDegree: 8, activeDegree: 4 },
      { existedDegree: 16, activeDegree: 4 },
      { existedDegree: 2, activeDegree: 2 },
      { existedDegree: 1, activeDegree: 1 },
      { existedDegree: 4, activeDegree: 2 },
      { existedDegree: 8, activeDegree: 2 },
      { existedDegree: 16, activeDegree: 2 },
      { existedDegree: 4, activeDegree: 1 },
      { existedDegree: 8, activeDegree: 1 },
      { existedDegree: 16, activeDegree: 1 },
      { existedDegree: 2, activeDegree: 1 }
    ]
  },
  {
    days       : 2,
    separators : [
      { existedDegree: 4, separatedDegree: 2 },
      { existedDegree: 4, separatedDegree: 1 },
      { existedDegree: 4, separatedDegree: 0 },
      { existedDegree: 2, separatedDegree: 1 },
      { existedDegree: 2, separatedDegree: 0 }
    ],
    orders: [
      { existedDegree: 16, activeDegree: 16 },
      { existedDegree: 8, activeDegree: 8 },
      { existedDegree: 16, activeDegree: 8 },
      { existedDegree: 4, activeDegree: 4 },
      { existedDegree: 1, activeDegree: 1 },
      { existedDegree: 2, activeDegree: 2 },
      { existedDegree: 8, activeDegree: 4 },
      { existedDegree: 16, activeDegree: 4, lastInDay: true },
      { existedDegree: 4, activeDegree: 2 },
      { existedDegree: 8, activeDegree: 2 },
      { existedDegree: 16, activeDegree: 2 },
      { existedDegree: 2, activeDegree: 1 },
      { existedDegree: 4, activeDegree: 1 },
      { existedDegree: 8, activeDegree: 1 },
      { existedDegree: 16, activeDegree: 1 }
    ]
  }
];

// const orders
