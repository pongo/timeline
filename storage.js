const KEY = "pongo-timeline-schedule";

export const MyStorage = {
  load() {
    const data = localStorage.getItem(KEY);
    return data ? decompress(JSON.parse(data)) : [];
  },
  save(data) {
    localStorage.setItem(KEY, JSON.stringify(compress(data)));
  },
};

// function groupByDays(today, blocks) {
//   const oldest = oldestDate(blocks, today);
//   const dates = dateRange(oldest, today).map(YYYYMMDD).toReversed();
//   return dates.map((date) => {
//     return {
//       date,
//       blocks: blocks
//         .filter(([blockDate]) => blockDate === date)
//         .map(blockObject),
//     };
//   });
// }

export function compress(schedule) {
  return schedule.map(({ date, blocks }) => [
    date,
    blocks.map(({ duration, startHour, startMinute }) => [
      startHour,
      startMinute,
      duration,
    ]),
  ]);
}

export function decompress(data) {
  return data.map(([date, blocks]) => ({
    date,
    blocks: blocks.map(([startHour, startMinute, duration]) => ({
      active: false,
      startHour,
      startMinute,
      duration,
    })),
  }));
}
