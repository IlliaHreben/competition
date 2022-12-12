export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function shuffle(array) {
  if (!Array.isArray(array)) throw new Error('Must be an array');
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 *
 * @param {*} list - array of arrays of key and array of values [[key, [value1, value2, ...]], ...]
 * @returns {Record<string, any>[]}
 * @example
 * objectCombos([['a', [1, 2]], ['b', [3, 4]]]) // [{a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 3}, {a: 2, b: 4}]
 *
 */
export function objectCombos(list, n = 0, result = [], current = {}) {
  if (n === list.length) result.push(current);
  else {
    const [key, items] = list[n];
    items.forEach((item) => objectCombos(list, n + 1, result, { ...current, [key]: item }));
  }

  return result;
}

export function JSONPointer(object, pointer) {
  const parts = pointer.split('/');
  let value = object;

  for (const part of parts) {
    if (!value) break;
    value = value[part];
  }

  return value;
}

export function objectFilter(object) {
  const result = {};
  for (const key in object) {
    if (object[key]) result[key] = object[key];
  }

  return result;
}
