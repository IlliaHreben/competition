import { getMaxDegree } from './common';

function isBlockExists(blocks, category) {
  return blocks.some(
    (b) =>
      b.sectionId === category.sectionId &&
      b.ageFrom === category.ageFrom &&
      b.ageTo === category.ageTo
  );
}

function compareCategories(categoryA, categoryB) {
  return (
    categoryA.sectionId === categoryB.sectionId &&
    categoryA.ageFrom === categoryB.ageFrom &&
    categoryA.ageTo === categoryB.ageTo
  );
}

export function createBlocks(_categories, days = 1) {
  const categories = [..._categories];

  const blocks = [];

  const { separators, orders } = blockSeparatorsList.find((s) => s.days === days);

  categories.forEach((category) => {
    const blockAlreadyExist = isBlockExists(blocks, category);
    if (blockAlreadyExist) return;

    const localBlocks = separators.map((b) => ({
      ...b,
      sectionId: category.sectionId,
      ageFrom: category.ageFrom,
      ageTo: category.ageTo,
      // fights: [],
      categories: [],
    }));

    const fitCategories = categories.filter((c) => compareCategories(c, category));

    fitCategories.forEach((c) => {
      const maxCategoryDegree = getMaxDegree(c);

      // separators should be lower than max degree in category
      const fitBlocks = localBlocks.filter(
        ({ existedDegree }) => existedDegree <= maxCategoryDegree
      );
      const maxSeparator = Math.max(...fitBlocks.map((s) => s.existedDegree));

      fitBlocks
        .filter((s) => maxSeparator === s.existedDegree)
        .sort((a, b) => b.separatedDegree - a.separatedDegree)
        .forEach(({ existedDegree, separatedDegree, categories: blockCategories }) => {
          const fights = c.Fights.filter((f) => f.degree > separatedDegree);

          c.Fights = c.Fights.filter((f) => f.degree <= separatedDegree);

          const matchedCategory = blockCategories.find((category) => category.id === c.id);
          if (matchedCategory) matchedCategory.Fights.push(...fights);
          else blockCategories.push({ ...c, Fights: fights });

          // fights.push(...fights);

          // const fights = c.Fights.filter(f => f.degree > separatedDegree);
        });
    });

    blocks.push(...localBlocks.filter((b) => b.categories.length));

    // categories.forEach((c, i) => {
    //   if (
    //     c.sectionId !== category.sectionId ||
    //     c.ageFrom !== category.ageFrom ||
    //     c.ageTo !== category.ageTo
    //   ) return;
    // });
  });

  const sortedBlocks = blocks.map((block) => {
    block.categories = block.categories.sort((a, b) => b.Fights.length - a.Fights.length);
    const fights = [];
    orders.forEach(({ existedDegree, activeDegree }) => {
      const matchedCategories = block.categories.filter((c) => existedDegree === getMaxDegree(c));

      const matchedFights = matchedCategories.flatMap((c) => {
        c.Fights.sort((a, b) => a.orderNumber - b.orderNumber).sort((a, b) => b.degree - a.degree);
        return c.Fights.filter((f) => f.degree === activeDegree);
      });

      fights.push(...matchedFights);
    });
    return fights;
  });

  console.log('='.repeat(50)); // !nocommit
  console.log(
    sortedBlocks.map((f) =>
      f.map(
        (f) =>
          `${f?.orderNumber}. 1/${f?.degree}: ${f?.FirstCard?.Fighter.lastName} ${f?.FirstCard?.Fighter.name} & ${f?.SecondCard?.Fighter.lastName} ${f?.SecondCard?.Fighter.name}`
      )
    )
  );
  console.log('='.repeat(50));

  return blocks;
}

const blockSeparatorsList = [
  {
    days: 1,
    separators: [{ existedDegree: 1, separatedDegree: 0 }],
    orders: [
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
      { existedDegree: 2, activeDegree: 1 },
    ],
  },
  {
    days: 2,
    separators: [
      { existedDegree: 4, separatedDegree: 2 },
      { existedDegree: 4, separatedDegree: 1 },
      { existedDegree: 4, separatedDegree: 0 },
      { existedDegree: 2, separatedDegree: 1 },
      { existedDegree: 2, separatedDegree: 0 },
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
      { existedDegree: 16, activeDegree: 1 },
    ],
  },
];

// const orders
