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

export function groupByDays(today, blocks) {
  const oldest = oldestDate(blocks, today);
  const dates = dateRange(oldest, today).map(YYYYMMDD).toReversed();
  return dates.map((date) => {
    return {
      date,
      blocks: blocks
        .filter(([blockDate]) => blockDate === date)
        .map(blockObject),
    };
  });
}

function blockObject(blockArray) {
  return {
    // date: blockArray[0],
    startHour: blockArray[1],
    startMinute: blockArray[2],
    duration: blockArray[3],
    active: blockArray[4] === true,
  };
}

function oldestDate(blocks, defaultDate) {
  if (blocks.length === 0) return defaultDate;
  return blocks[0][0];

  // const dates = blocks.map(([date]) => date);
  // return dates.toSorted()[0];
}

// const dates = dateRange("2024-12-01", "2024-12-04");
// console.log(dates.map(YYYYMMDD));

// console.dir(
//   groupByDays("2024-12-04", [
//     ["2024-12-01", 18, 14, 60],
//     ["2024-12-04", 10, 0, 25],
//     ["2024-12-04", 10, 30, 25],
//   ]),
//   { depth: null }
// );

// https://stackoverflow.com/a/24316516/136559
export function getMinutesBetweenDates(startDate, endDate) {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.round(diff / 60_000);
}

export function toggleStopwatch(now, startDate) {
  if (startDate == null) {
    return {
      started: true,
      startDate: now,
      blocks: [[YYYYMMDD(now), now.getHours(), now.getMinutes(), 0, true]],
    };
  }

  const duration = getMinutesBetweenDates(startDate, now);

  if (duration < 1) {
    return {
      started: false,
      blocks: [],
    };
  }

  return {
    started: false,
    blocks: [
      [
        YYYYMMDD(startDate),
        startDate.getHours(),
        startDate.getMinutes(),
        duration,
      ],
    ],
  };
}

export function updateActiveBlock(blocks, duration) {
  const found = blocks.findLast((x) => x[4] === true);
  if (found == null) return blocks;

  found[3] = duration;
  return blocks;
}

export function deleteActiveBlocks(blocks) {
  return blocks.filter((x) => x[4] !== true);
}

export const Stopwatch = {
  toggle() {},
};
