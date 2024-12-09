import { hasLeftOverlap } from "./schedule.js";

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
    blocks: blocks.map(([startHour, startMinute, duration], i) => ({
      active: false,
      startHour,
      startMinute,
      duration,
      leftOverlap: hasLeftOverlap(prevBlockOf(blocks, i), {
        startHour,
        startMinute,
      }),
    })),
  }));
}

function prevBlockOf(blocks, currentIndex) {
  const prev = blocks[currentIndex - 1];
  if (prev === undefined) return undefined;

  const [startHour, startMinute, duration] = prev;
  return { startHour, startMinute, duration };
}
