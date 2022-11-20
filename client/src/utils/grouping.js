/**
 *
 * @param {*[]} items array of items
 * @param {string[]} groupBy array of keys to be used in grouping
 * @returns {Object[][]} array of arrays grouped by the given criteria
 * @example
 * const items = [
 * { name: 'A', age: 1, lastName: 'X' },
 * { name: 'A', age: 1, lastName: 'Y' },
 * { name: 'B', age: 2, lastName: 'Y' },
 * { name: 'B', age: 2, lastName: 'Z' },
 * ];
 * const groupBy = ['name', 'age'];
 * const result = groupByCriteria(items, groupBy);
 * // result = [
 * //  [ { name: 'A', age: 1, lastName: 'X' }, { name: 'A', age: 1, lastName: 'Y'  } ],
 * //  [ { name: 'B', age: 2, lastName: 'Y' }, { name: 'B', age: 2, lastName: 'Z'  } ],
 * // ]
 */
export function groupByCriteria(items, groupBy = []) {
  const groups = items.reduce((acc, item) => {
    const group = groupBy.map((key) => item[key]).join('-');
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});

  return Object.values(groups);
}

/**
 * Returns a Map of the fight formulas with accumulated formula as a key. The distinct values will be joined by ', '.
 * @param {Array[]} groupedFightFormulas - array of arrays already grouped by some criteria
 * @param {string[]} groupBy - array of keys to be used in accumulation
 * @returns {Map<Record<groupBy, any>, Record<groupBy | string, any>[]>} - new Map() of fight formulas with accumulated formula as a key
 * @example
 * const groupedFightFormulas = [
 *  [ { name: 'A', age: 1, lastName: 'X' }, { name: 'A', age: 1, lastName: 'Y'  } ],
 *  [ { name: 'B', age: 2, lastName: 'Y' }, { name: 'B', age: 2, lastName: 'Z'  } ],
 *  ];
 * const groupBy = ['name', 'age', 'lastName'];
 * const result = groupFightFormulas(groupedFightFormulas, groupBy);
 * // result = {
 * //  { name: 'A', age: 1, lastName: 'X, Y' },: [ { name: 'A', age: 1, lastName: 'X' }, { name: 'A', age: 1, lastName: 'Y'  } ],
 * //  { name: 'B', age: 2, lastName: 'Y, Z' },: [ { name: 'B', age: 2, lastName: 'X' }, { name: 'B', age: 2, lastName: 'Y'  } ],
 * // }
 */
export function extractCommonFightFormula(groupedFightFormulas, groupBy) {
  const commonSection = new Map();
  groupedFightFormulas.forEach((group) => {
    const initial = groupBy.reduce((acc, key) => ({ ...acc, [key]: new Set() }), {});
    group.forEach((ff) => {
      groupBy.forEach((key) => {
        initial[key].add(ff[key]);
      });
    });
    Object.entries(initial).forEach(
      ([key, value]) => (initial[key] = [...value].sort().join(', '))
    );

    commonSection.set(initial, group);
  });

  return commonSection;
}
