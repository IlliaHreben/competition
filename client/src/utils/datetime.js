import { DateTime } from 'luxon';

export function formatISODate (date) {
    return DateTime.fromISO(date).toFormat('dd.MM.yyyy');
}

export function getFormattedDate () {
    return DateTime.now().toFormat('dd.MM.yyyy');
}

export function getAgeFromBirthDate (date) {
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
