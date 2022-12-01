import { JSONPointer } from './common';

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
export function groupByCriteria(items, groupBy = [], { splitByOrder } = {}) {
  const groups = items.reduce((acc, item) => {
    let group = groupBy.map((key) => JSONPointer(item, key)).join('-');
    if (splitByOrder) {
      const [exitedGroup] =
        Object.entries(acc).find(([key, value]) => {
          if (!key.startsWith(group)) return false;
          const lastValueNumber = value.at(-1)[splitByOrder];
          if (item[splitByOrder] - lastValueNumber !== 1) return false;
          return true;
        }) || [];

      if (!exitedGroup) {
        group += item[splitByOrder];
      } else {
        group = exitedGroup;
      }
    }

    if (!acc[group]) acc[group] = [];

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

/**
 * @param {*} array array to be splitted
 * @param {(any) => number} byFn function to be used to split the array. Should return an index of elements in a returned array
 * @returns {any[][]} array of arrays where each sub-array will be placed on the index which was given by byFn callback
 * @example
 * const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const result = splitBy(array, (item) => item % 2 === 0);
 * // [
 * //   [1, 3, 5, 7, 9],
 * //   [2, 4, 6, 8, 10],
 * // ]
 */
export function splitBy(array, byFn) {
  if (!Array.isArray(array)) throw new Error('First argument must be an array');
  if (typeof byFn !== 'function') throw new Error('Second argument must be a function');

  return array.reduce((acc, item) => {
    const index = +byFn(item);
    if (isNaN(index)) throw new Error('Index must be an integer');

    if (!acc[index]) acc[index] = [];
    acc[index].push(item);

    return acc;
  }, []);
}
