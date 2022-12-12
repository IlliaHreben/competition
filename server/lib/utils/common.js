export function getMaxDegree(category) {
  return Math.max(...category.Fights.map((f) => f.degree));
}

export const findAndReplace = (findFn, arr, replacement) => {
  const index = arr.findIndex(findFn);
  if (index === -1) return arr;
  arr[index] = replacement;
};
