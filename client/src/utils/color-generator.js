import { getRandomInt, shuffle } from './common';

export default function pleasantHexColorGenerator() {
  const threshold = 40;
  const min = 80 + threshold;
  const max = 250 - threshold;
  const firstNumber = getRandomInt(min, max);
  const secondNumber = firstNumber - threshold + getRandomInt(-40, 40);
  const thirdNumber = firstNumber + threshold + getRandomInt(-40, 40);
  return `#${shuffle([firstNumber, secondNumber, thirdNumber])
    .map((n) => n.toString(16))
    .join('')}`;
}
