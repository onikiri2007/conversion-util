// @flow

const fromStringToDecimal = (val: string): number => {
  const hoursAndMinutes = val.replace(':', '.');
  return parseFloat(hoursAndMinutes);
};
const timeFormatRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const isEmptyOrNullArray = (source: Array<string>): boolean => {
  return source === null || source.length === 0;
};

const isDivisibleBy = (val: number, divideBy: number): boolean => {
  return val && divideBy !== 0 && (val % divideBy) === 0;
};

const getEmptyArray = () => Array(48).fill(0);

const MIDNIGHT_STRING = '24:00';

export default {
  /**
  * @desc Used to display the time on the UI.
  * @param {number} value - A number passed from TimeRanges & OperatingHours
  * @return {string} - Time string
  * @example '00:00', '00:30', ..., '24:00'
  */
  decimalToTimeString(value: number): string {
    if (value < 0) return null;
    const hourAndMinutes = value * 100;
    const hours = Math.floor(hourAndMinutes / 100);
    const minutes = hourAndMinutes % 100;
    const minutesConverted = Math.round((minutes / 100) * 60);
    const minutesRounded = minutesConverted;
    return `${hours}:${minutesRounded}`;
  },
  /**
  * @desc Used to convert Time string into an array of float values used to determine
  * time period points.
  * @param {string} timeString - A time string passed from Operating Hours
  * @return {float} - Float value representation of the number of hours from midnight
  * @example 0, 0.5, ..., 24
  */
  timeStringToDecimal(timeString: ?string): ?number {
    if (timeString === null) return null;
    if (!this.isValidTimeString(timeString)) return null;
    const timeInDecimal = fromStringToDecimal(timeString);
    const hourAndMinutes = timeInDecimal * 100;
    const hours = Math.floor(hourAndMinutes / 100);
    const minutes = hourAndMinutes % 100;
    const minutesConverted = minutes / 60;
    return hours + minutesConverted;
  },
  /**
   * @desc Converts array of time strings
   * @example e.g. [11:30, 12:30, 15:00, 17:25]) to 48hr on/off array
   * [0, 0, 0, 1, 1, 2....] stored in EnergyLink DB
   * @param  {timeStringArray}
   * @example [11:30, 12:30, 15:00, 17:25]
   * @return - [0, 0, 1, 1, 2]
   */
  timeStringsToIntervalArray(timeStringArray: Array<string>): Array<number> {
    let intervalArray = getEmptyArray();
    if (isEmptyOrNullArray(timeStringArray)) return intervalArray;
    if (!isDivisibleBy(timeStringArray.length, 4)) return intervalArray;
    return intervalArray;
  },
  /**
  * @desc Used in index.js (or EnergyLink proper) as values for initial UI look.
  * @param {Array<number>} rawValues
  * @example [0, 0, 1, 1, 2]
  * @return {Array<string>} - An array of time strings
  * @example ['00:00', '00:30', ..., '24:00']
  */
  intervalArrayToTimeStrings(rawValues: Array<number>): Array<string> {
    return [];
  },
  /**
   * Checks if provided user input is a valid time string between
   * 00:00 and 23:59
   * @param  timeString  User provided time string
   * @return Whether it's a valid time string or not
   */
  isValidTimeString(timeString: string): boolean {
    const isValid = timeFormatRegex.test(timeString);
    if (!isValid && timeString === MIDNIGHT_STRING) return true;
    return isValid;
  },
  /**
   * Checks if provided user input is a valid time range
   * e.g. 01:01-03:59
   * @param  timeRangeString  User provided time range string
   * @return Whether it's a valid time string or not
   */
  isValidTimeRangeString(timeRangeString: string): boolean {
    const timeRanges = timeRangeString.split('-');
    if (timeRanges.length <= 1) return false;
    return this.isValidTimeString(timeRanges[0]) && this.isValidTimeString(timeRanges[1]);
  },
};
