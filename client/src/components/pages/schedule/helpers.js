import { parseTimeFromSec, calculateSecFromFight } from 'utils/datetime';

export function getTotalTime(fightsList, formatted = true) {
  const totalTime = fightsList.reduce(
    (sum, f) => sum + calculateSecFromFight(f.linked.fightFormula),
    0
  );
  const { hours, minutes, seconds } = parseTimeFromSec(totalTime);
  const formattedTime = `${hours}h ${minutes} min ${seconds} sec`;
  return formatted ? formattedTime : { hour: hours, minute: minutes, second: seconds };
}
