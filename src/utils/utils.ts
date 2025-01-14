// Import moment.js
import moment from 'moment';

/**
 * Converts a date to UTC format.
 * @param {string | Date} date - The input date (can be a Date object or a valid date string).
 * @returns {string} - The date in UTC format (ISO 8601).
 */
export function toUTC(date: string | Date): string {
  return moment(date).utc().format();
}

/**
 * Converts a date to local time format.
 * @param {string | Date} date - The input date (can be a Date object or a valid date string).
 * @returns {string} - The date in local time format.
 */
export function toLocalTime(date: string | Date): string {
  return moment(date).local().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Converts a date to a custom format.
 * @param {string | Date} date - The input date (can be a Date object or a valid date string).
 * @param {string} format - The desired output format (e.g., 'YYYY-MM-DD HH:mm:ss').
 * @returns {string} - The formatted date string.
 */
export function toCustomFormat(date: string | Date, format: string): string {
  return moment(date).format(format);
}

/**
 * Parses a UTC date string into a local date.
 * @param {string} utcDate - The UTC date string (ISO 8601 or similar).
 * @returns {string} - The parsed local date string.
 */
export function parseUTCToLocal(utcDate: string): string {
  return moment.utc(utcDate).local().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Converts a local date string to a UTC date string.
 * @param {string} localDate - The local date string.
 * @returns {string} - The date in UTC format.
 */
export function parseLocalToUTC(localDate: string): string {
  return moment(localDate).utc().format();
}

/**
 * Gets the current date and time in UTC.
 * @returns {string} - The current UTC date and time (ISO 8601 format).
 */
export function getCurrentUTC(): string {
  return moment().utc().format();
}

/**
 * Gets the current date and time in local time.
 * @returns {string} - The current local date and time.
 */
export function getCurrentLocalTime(): string {
  return moment().local().format('YYYY-MM-DD HH:mm:ss');
}
