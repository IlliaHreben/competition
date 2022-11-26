export * from './dump.js';

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
