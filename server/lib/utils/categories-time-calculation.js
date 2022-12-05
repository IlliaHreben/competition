import { splitBy } from './index';
import { getMaxDegree } from './common';

const MAX_DAY_TIME = 10 * 60 * 60;
const TIMEOUT = 90;
const FINAL_DAY_DEGREE = 2;
const FINAL_DAY_DEGREE_FROM = 4;

const getDays = (fightSpaces) => Math.max(...fightSpaces.map((fs) => fs.competitionDay));

export function calculate(categories, fightSpaces) {
  const [fullFS, lightFS] = splitBy(fightSpaces, (c) => c.type !== 'ring');
  const [fullCategories, lightCategories] = splitBy(categories, (c) => c.Section.type !== 'full');

  calculateForType(fullFS, fullCategories);
  calculateForType(lightFS, lightCategories);

  return [...assignFightSpacesToFights(fullFS), ...assignFightSpacesToFights(lightFS)];
}

function assignFightSpacesToFights(fightSpaces) {
  const days = getDays(fightSpaces);
  return fightSpaces.flatMap((fs) => {
    const needFilter = days > 1;
    const isLastDay = fs.competitionDay === days;

    const fightList = fs.Categories.flatMap((category) => {
      const fights = needFilter
        ? extractProperDayFights(category.Fights, isLastDay)
        : category.Fights;

      fights.forEach((f) => {
        f.fightSpaceId = fs.id;
        f.FightSpace = fs;
      });

      return fights.sort((a, b) => a.orderNumber - b.orderNumber);
    });

    fightList.forEach((fight, i) => (fight.serialNumber = i + 1));

    return fightList;
  });
}

function calculateForType(fightSpaces, categories) {
  const days = getDays(fightSpaces);
  const fightSpacesGrouped = groupByCriteria(fightSpaces, ['competitionDay', 'type']).sort(
    (a, b) => a.competitionDay - b.competitionDay
  );

  const usedCategoryIds = [];
  const filterCb = (c) =>
    !usedCategoryIds.includes(c.id) || getMaxDegree(c) >= FINAL_DAY_DEGREE_FROM;

  fightSpacesGrouped.forEach((fsg) => {
    const properCategories =
      fsg.competitionDay === days
        ? categories.filter(filterCb)
        : categories.filter((c) => !usedCategoryIds.includes(c.id));

    const { leftCategories } = calculateForTypeAndDay(
      properCategories,
      fsg.items,
      days,
      fsg.competitionDay
    );
    const leftCategoriesIds = leftCategories.map((c) => c.id);
    usedCategoryIds.push(
      ...categories.filter((c) => !leftCategoriesIds.includes(c.id)).map((c) => c.id)
    );
  });
}

function extractProperDayFights(fights, isLastDay) {
  const isHugeCategory = fights.some((f) => f.degree >= FINAL_DAY_DEGREE_FROM);

  if (!isHugeCategory) return fights;
  const finalDayFights = fights.filter((f) =>
    isLastDay ? f.degree <= FINAL_DAY_DEGREE : f.degree > FINAL_DAY_DEGREE
  );
  return finalDayFights;
}

/**
 * @param {Record<string, any>[]} items - The items to be sorted by
 * @param {string[] | string} by - array or string
 * @param {string} itemName the key which will be used to push sorted items
 * @example
 *
 * const items = [
 *  { name: 'A', age: 1, lastName: 'X' },
 *  { name: 'A', age: 2, lastName: 'Y' },
 *  { name: 'B', age: 1, lastName: 'X' }
 * ]
 * const result = groupByCriteria(items, 'name')
 * // [
 * //   { name: 'A', items: [ {name: 'A', age: 1, lastName: 'X'}, { name: 'A', age: 2, lastName: 'Y' } ] },
 * //   { name: 'B', items: [ { name: 'B', age: 1, lastName: 'Y' } ] },
 * // ]
 *
 * const result = groupByCriteria(items, ['age', 'lastName'], 'fighters');
 * // [
 * //   { age: 1, lastName: 'X', fighters: [ {name: 'A', age: 1, lastName: 'X'}, { name: 'B', age: 1, lastName: 'X' } ] },
 * //   { age: 2, lastName: 'Y', fighters: [ { name: 'A', age: 2, lastName: 'Y' } ] },
 * // ]
 */
function groupByCriteria(items, by, itemName = 'items') {
  if (!Array.isArray(items) || !by) throw new Error('Items should be an array');
  if (!Array.isArray(by)) by = [by];

  const sorted = items.reduce((acc, item) => {
    const common = by.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {});
    const key = Object.values(common).join('-');

    if (acc[key]) {
      acc[key][itemName].push(item);
    } else {
      acc[key] = {
        ...common,
        [itemName]: [item],
      };
    }
    return acc;
  }, {});

  return Object.values(sorted);
}

const calculateFightsTime = (categories, daysTotal, day) =>
  categories.reduce((acc, c) => {
    const fights = daysTotal === 1 ? c.Fights : extractProperDayFights(c.Fights, daysTotal === day);
    fights.forEach((f) => (acc += calculateFormulaTime(f.FightFormula)));
    acc += (fights.length - 1) * TIMEOUT;
    return acc;
  }, 0);

function calculateFormulaTime(formula) {
  const { roundCount, roundTime, breakTime } = formula;
  return roundCount * roundTime + (roundCount - 1) * breakTime;
}

function findMaxNotCrossingCategoryGroup(grouped, currentIndex, fightSpaceCategories) {
  const currentFightSpaceCategory = fightSpaceCategories[currentIndex];
  const ffcToCheck = fightSpaceCategories.filter(
    (ffc, i) => currentIndex !== i && ffc.fillLevel > currentFightSpaceCategory.fillLevel
  );
  const ffcToCheckSections = ffcToCheck.map((ffc) => ffc.sectionId);
  const fitGroupIndex = grouped.findIndex((g) => !ffcToCheckSections.includes(g.sectionId));
  const usedIndex = fitGroupIndex !== -1 ? fitGroupIndex : 0;
  return grouped.splice(usedIndex, 1)[0];
}

function calculateForTypeAndDay(categories, fightSpaces, daysTotal, day) {
  fightSpaces = [...fightSpaces];
  const grouped = groupByCriteria(categories, ['sectionId', 'ageFrom', 'ageTo'], 'categories');

  grouped.forEach(
    (group) => (group.fightsTime = calculateFightsTime(group.categories, daysTotal, day))
  );
  grouped.sort((a, b) => b.fightsTime - a.fightsTime);
  const fightSpacesCategories = fightSpaces.map((fightSpace) => ({
    fightSpace,
    categories: [],
    fillLevel: 0,
    lastCategory: {},
  }));

  while (grouped.length /* && hasSpace */) {
    // const lowestFillLevel = Math.min(...fightSpacesCategories.map((ffc) => ffc.fillLevel));
    const lowestFillIndex = fightSpacesCategories
      .sort((a, b) => a.fillLevel - b.fillLevel)
      .findIndex((ffc) => ffc.fillLevel < MAX_DAY_TIME);

    if (lowestFillIndex === -1) break;

    const fitGroup = findMaxNotCrossingCategoryGroup(
      grouped,
      lowestFillIndex,
      fightSpacesCategories
    );

    fightSpacesCategories[lowestFillIndex].categories.push(...fitGroup.categories);
    fightSpacesCategories[lowestFillIndex].lastCategory = fitGroup;
    fightSpacesCategories[lowestFillIndex].fillLevel += fitGroup.fightsTime;
  }

  return {
    fightSpaces: fightSpacesCategories.map(({ fightSpace, categories }) => {
      fightSpace.Categories = categories;
      return fightSpace;
    }),

    leftCategories: grouped.flatMap((g) => g.categories),
  };
}
