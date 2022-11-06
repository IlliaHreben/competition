export * from './dump.js';

export function splitBy(array, byFn, count = 2) {
  if (!Array.isArray(array)) throw new Error('First argument must be an array');
  if (typeof byFn !== 'function') throw new Error('Second argument must be a function');

  return array.reduce(
    (acc, item) => {
      const index = +byFn(item);
      if (isNaN(index)) throw new Error('Index must be an integer');
      if (index + 1 > count) throw new Error('Index must be lower than count');

      acc[index].push(item);

      return acc;
    },
    Array.from({ length: count }).map(() => [])
  );
}
