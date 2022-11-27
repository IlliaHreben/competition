import { DateTime } from 'luxon';

export function formatISODate(date) {
  return DateTime.fromISO(date).toFormat('dd.MM.yyyy');
}

export function getFormattedDate() {
  return DateTime.now().toFormat('dd.MM.yyyy');
}

export function getAgeFromBirthDate(date) {
  if (!date) return;
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const formatTime = (time) => {
  if (!time) {
    return null;
  }
  const [minutes, seconds] = time.split(':');
  return +minutes * 60 + +seconds;
};

export const formatTimeToText = (time) => {
  if (!time) {
    return '';
  }
  const minutes = Math.floor(time / 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const seconds = time % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${formattedMinutes}:${formattedSeconds}`;
};

function isNumber(value) {
  return !isNaN(value);
}

function isInteger(value) {
  return isNumber(value) && value % 1 === 0;
}

export const calculateSecFromFight = ({ roundCount, roundTime, breakTime }) => {
  if (!isInteger(roundCount) || !isInteger(roundTime) || !isInteger(breakTime))
    throw new Error('Invalid fight data');

  return roundCount * roundTime + (roundCount - 1) * breakTime;
};

export const parseTimeFromSec = (time) => {
  if (typeof +time !== 'number') throw new Error('Time must be a number');

  const totalMinutes = Math.floor(time / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = time % 60;
  return { hours, minutes, seconds };
};
