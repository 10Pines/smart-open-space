import { isEqual } from 'date-fns';

/**
 * Add 0 padding if is "n < 10" to apply format 'HH'
 **/
export const numberToTwoDigitNumber = (number) => (number < 10 ? '0' : '') + number;

/**
 * get time format 'HH:mm' if is an array, otherwise if is already string skip.
 **/
export const numbersToTime = (number) =>
  isStringInput(number) ? number : number.map(numberToTwoDigitNumber).join(':');

/**
 * compare two times only Array support: (expected format [HH, mm])
 **/
export const compareTimeByArray = ([anHour, aMinute], [otherHour, otherMinute]) => {
  const anHourInt = getIntNumber(anHour);
  const otherHourInt = getIntNumber(otherHour);
  return anHourInt < otherHourInt ||
    (anHourInt === otherHourInt && getIntNumber(aMinute) < getIntNumber(otherMinute))
    ? -1
    : 1;
};

/**
 * compare two times as Array or String with either of two formats: ([HH, mm] | 'HH:mm')
 **/
export const compareTime = (t1, t2) =>
  compareTimeByArray(getTimeArray(t1), getTimeArray(t2));

/**
 * Sort list of objects with startTimes with array of hours and minutes and return list
 * (eg: [{startTime: [HH, mm]}, ...] or [{startTime: "HH:mm"}, ...])
 **/
export const sortTimesByStartTime = (times) => {
  times.sort((t1, t2) =>
    compareTime(getTimeArray(t1.startTime), getTimeArray(t2.startTime))
  );
  return times;
};

/**
 * Get new Date from date string valid format 'yyyy-MM-dd'
 *  or array with the following structure ([year, month, day]).
 * If date is already a Date or null/undefined, return same value.
 **/
export const toDate = (date) => {
  if (date == null || isDateInput(date)) {
    return date;
  }
  return isStringInput(date) ? getDateFromString(date) : getDateFromArray(date);
};

/**
 * Given date argument (which could be an string with format 'yyyy-MM-dd' | [y, m, d] | Date)
 * return an function which expect an slot (or obj with date key) and return the result of
 * apply equals with that date argument
 */
export const byDate = (date) => (slot) => isEqualsDateTime(slot.date, date);

/**
 * Given two date params try to apply toDate both params and perform isEqual
 * If any of two is null or undefined, then return falsy
 */
export const isEqualsDateTime = (date1, date2) => isEqual(toDate(date1), toDate(date2));

/**
 * Get endTime key of the last element of slots array.
 * If is empty, return undefined
 */
export const getLastEndFromCollectionOfSlots = (slots) =>
  slots.length > 0 ? slots.slice(-1)[0].endTime : undefined;

export const isSameDate = (date1, date2) =>
  isDateInput(date1) &&
  isDateInput(date2) &&
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const isStringInput = (input) => typeof input === 'string' || input instanceof String;

const isDateInput = (input) => input instanceof Date;

const getDateFromArray = ([year, month, day]) => new Date(year, month - 1, day);

const getDateFromString = (dateStr) =>
  dateStr.includes('T') ? new Date(dateStr) : getDateFromArray(dateStr.split('-'));

const getTimeArray = (t) => (isStringInput(t) ? t.split(':') : t);

const getIntNumber = (d) => (isStringInput(d) ? parseInt(d, 10) : d);
