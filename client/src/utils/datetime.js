import { DateTime } from 'luxon';

export function formatISODate (date) {
    return DateTime.fromISO(date).toFormat('dd.MM.yyyy');
}

export function getFormattedDate () {
    return DateTime.now().toFormat('dd.MM.yyyy');
}
