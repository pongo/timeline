/**
 * Converts a Date object to a string in the format YYYY-MM-DD.
 *
 * @param {Date} date - The date to be converted.
 * @returns {string} The formatted date string.
 */
export function YYYYMMDD(date) {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// https://stackoverflow.com/a/64592438/136559
export function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

// https://stackoverflow.com/a/24316516/136559
export function getMinutesBetweenDates(startDate, endDate) {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.round(diff / 60_000);
}

export function midnightOf(endDate) {
  const midnight = new Date(endDate);
  midnight.setHours(0, 0, 0, 0);
  return midnight;
}
