export function getMaxDegree(category) {
  return Math.max(...category.Fights.map((f) => f.degree));
}
