import { ref, onUnmounted, readonly } from "vue";
import { dateRange, getMinutesBetweenDates, YYYYMMDD } from "./core.js";

const MINUTES_LIMIT = 24 * 60;

export function useSchedule(today, inputSchedule) {
  let clearId = null;
  let scheduleRaw = addMissingDays(inputSchedule, today);

  const schedule = ref(scheduleRaw);
  const isActive = ref(false);
  const activeDuration = ref(null);

  onUnmounted(() => {
    clearInterval(clearId);
  });

  return {
    schedule: readonly(schedule),
    isActive: readonly(isActive),
    activeDuration: readonly(activeDuration),
    start() {
      scheduleRaw = startNewBlock(scheduleRaw, new Date());
      schedule.value = scheduleRaw;
      isActive.value = true;
      activeDuration.value = 0;

      clearId = setInterval(() => {
        scheduleRaw = updateActiveBlock(scheduleRaw, new Date());
        schedule.value = scheduleRaw;
        activeDuration.value = getActiveBlockDuration(schedule.value);
      }, 60_000);
    },
    stop() {
      clearInterval(clearId);
      scheduleRaw = stopActiveBlock(scheduleRaw, new Date());
      schedule.value = scheduleRaw;
      isActive.value = false;
      activeDuration.value = null;
    },
  };
}

export function startNewBlock(schedule, startDate) {
  const date = YYYYMMDD(startDate);
  const newSchedule = addMissingDays(schedule, date);

  const day = newSchedule.find((day) => day.date === date);
  day.blocks.push({
    active: true,
    startHour: startDate.getHours(),
    startMinute: startDate.getMinutes(),
    duration: 0,
  });

  return newSchedule;
}

function addMissingDays(schedule, date) {
  const oldest = oldestDate(schedule, date);
  const datesNewestToOldest = dateRange(oldest, date)
    .map(YYYYMMDD)
    .toReversed();

  const daysCache = new Map();
  for (const day of schedule) {
    daysCache.set(day.date, day);
  }

  const newSchedule = datesNewestToOldest.map((date) => {
    const day = daysCache.get(date);
    return day === undefined ? { date, blocks: [] } : structuredClone(day);
  });
  return newSchedule;
}

function oldestDate(schedule, defaultDate) {
  if (schedule.length === 0) return defaultDate;
  return schedule.at(-1).date;

  // const dates = blocks.map(([date]) => date);
  // return dates.toSorted()[0];
}

export function updateActiveBlock(schedule, endDate) {
  const newSchedule = structuredClone(schedule);
  const { activeBlock, startDate } = findActiveBlock(newSchedule);
  if (activeBlock === undefined) return newSchedule;

  activeBlock.duration = getMinutesBetweenDates(startDate, endDate);
  return newSchedule;
}

function getActiveBlockDuration(schedule) {
  const { activeBlock } = findActiveBlock(schedule, false);
  return activeBlock?.duration ?? null;
}

function findActiveBlock(schedule, withStartDate = true) {
  const day = schedule.at(0);
  const activeBlock = day?.blocks.find((block) => block.active);
  return {
    activeBlock,
    startDate: withStartDate ? startDateOf(day, activeBlock) : undefined,
  };
}

function startDateOf(day, activeBlock) {
  if (day === undefined || activeBlock === undefined) return undefined;
  const date = day.date;
  const hh = activeBlock.startHour;
  const mm = activeBlock.startMinute;
  return new Date(`${date} ${hh}:${mm}:00`);
}

export function stopActiveBlock(schedule, endDate) {
  let newSchedule = structuredClone(schedule);
  const { activeBlock, startDate } = findActiveBlock(newSchedule);
  if (activeBlock === undefined) return newSchedule;

  if (YYYYMMDD(startDate) !== YYYYMMDD(endDate)) {
    newSchedule = stopMultiDaysBlock(
      newSchedule,
      activeBlock,
      startDate,
      endDate
    );
  } else {
    newSchedule = stopOrDeleteActiveBlock(
      newSchedule,
      activeBlock,
      startDate,
      endDate
    );
  }

  return newSchedule;
}

function stopMultiDaysBlock(schedule, activeBlock, startDate, endDate) {
  const midnight = midnightOf(endDate);

  // stop active block before midnight
  schedule = stopOrDeleteActiveBlock(
    schedule,
    activeBlock,
    startDate,
    midnight
  );

  // add block on next day
  schedule.unshift({
    date: YYYYMMDD(midnight),
    blocks: [{ active: true, startHour: 0, startMinute: 0, duration: 0 }],
  });
  const nextDayActiveBlock = findActiveBlock(schedule).activeBlock;
  schedule = stopOrDeleteActiveBlock(
    schedule,
    nextDayActiveBlock, //findActiveBlock(schedule),
    midnight,
    endDate
  );

  return schedule;
}

function midnightOf(endDate) {
  const midnight = new Date(endDate);
  midnight.setHours(0, 0, 0, 0);
  return midnight;
}

function minutesBetween(startDate, endDate, max) {
  return Math.min(getMinutesBetweenDates(startDate, endDate), max);
}

function stopOrDeleteActiveBlock(schedule, activeBlock, startDate, endDate) {
  const duration = minutesBetween(startDate, endDate, MINUTES_LIMIT);
  if (duration <= 1) {
    schedule = deleteActiveBlock(schedule, activeBlock);
  } else {
    activeBlock.active = false;
    activeBlock.duration = duration;
  }

  return schedule;
}

function deleteActiveBlock(schedule, activeBlock) {
  const day = schedule.at(0);
  day.blocks = day.blocks.filter((block) => block !== activeBlock);
  return schedule;
}
