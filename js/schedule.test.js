import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  startNewBlock,
  stopActiveBlock,
  updateActiveBlock,
} from "./schedule.js";

describe("startNewBlock", () => {
  describe("when schedule is empty", () => {
    it("should add day with active block", () => {
      const actual = startNewBlock([], new Date("2024-12-04 10:30:00"));
      assert.deepEqual(actual, [
        {
          date: "2024-12-04",
          blocks: [
            { active: true, duration: 0, startHour: 10, startMinute: 30 },
          ],
        },
      ]);
    });
  });

  describe("when schedule contains startDate", () => {
    it("should add active block to startDate", () => {
      const schedule = [
        {
          date: "2024-12-04",
          blocks: [
            { active: false, duration: 25, startHour: 10, startMinute: 0 },
          ],
        },
      ];
      const actual = startNewBlock(schedule, new Date("2024-12-04 10:30:00"));
      assert.deepEqual(actual, [
        {
          date: "2024-12-04",
          blocks: [
            { active: false, duration: 25, startHour: 10, startMinute: 0 },
            { active: true, duration: 0, startHour: 10, startMinute: 30 },
          ],
        },
      ]);
      assert.notEqual(actual, schedule, "should not mutate original");
      assert.notDeepEqual(actual, schedule, "should not mutate original");
    });
  });

  describe("when schedule does not contain startDate", () => {
    it("should add missing days", () => {
      const actual = startNewBlock(
        [{ blocks: [], date: "2024-12-01" }],
        new Date("2024-12-04 10:30:00")
      );
      assert.deepEqual(actual, [
        {
          date: "2024-12-04",
          blocks: [
            { active: true, duration: 0, startHour: 10, startMinute: 30 },
          ],
        },
        { date: "2024-12-03", blocks: [] },
        { date: "2024-12-02", blocks: [] },
        { date: "2024-12-01", blocks: [] },
      ]);
    });
  });
});

describe("updateActiveBlock", () => {
  it("should update duration", () => {
    const schedule = [
      {
        date: "2024-12-04",
        blocks: [
          { active: false, duration: 25, startHour: 10, startMinute: 0 },
          { active: true, duration: 0, startHour: 10, startMinute: 30 },
        ],
      },
    ];
    const actual = updateActiveBlock(schedule, new Date("2024-12-04 11:00:00"));
    assert.deepEqual(actual, [
      {
        date: "2024-12-04",
        blocks: [
          { active: false, duration: 25, startHour: 10, startMinute: 0 },
          { active: true, duration: 30, startHour: 10, startMinute: 30 },
        ],
      },
    ]);
    assert.notEqual(actual, schedule, "should not mutate original");
    assert.notDeepEqual(actual, schedule, "should not mutate original");
  });

  it("should do nothing if schedule is empty", () => {
    assert.deepEqual(
      updateActiveBlock([], new Date("2024-12-04 10:25:00")),
      []
    );
  });

  it("should do nothing if no active block", () => {
    const schedule = [
      {
        date: "2024-12-04",
        blocks: [
          { active: false, duration: 25, startHour: 10, startMinute: 0 },
        ],
      },
    ];
    const actual = updateActiveBlock(schedule, new Date("2024-12-04 11:00:00"));
    assert.deepEqual(actual, schedule);
  });
});

describe("stopActiveBlock", () => {
  describe("within one day", () => {
    it("should stop active block", () => {
      const schedule = [
        {
          date: "2024-12-04",
          blocks: [
            { active: true, duration: 0, startHour: 10, startMinute: 30 },
          ],
        },
      ];
      const actual = stopActiveBlock(schedule, new Date("2024-12-04 10:45:00"));
      assert.deepEqual(actual, [
        {
          date: "2024-12-04",
          blocks: [
            {
              active: false,
              duration: 15,
              startHour: 10,
              startMinute: 30,
            },
          ],
        },
      ]);
    });
  });

  describe("when block ends on the next day", () => {
    it("should stop active block and add block on the next day", () => {
      const schedule = [
        {
          blocks: [
            { active: true, duration: 0, startHour: 22, startMinute: 30 },
          ],
          date: "2024-12-04",
        },
      ];
      const actual = stopActiveBlock(schedule, new Date("2024-12-05 1:23:00"));
      assert.deepEqual(actual, [
        {
          date: "2024-12-05",
          blocks: [
            {
              active: false,
              duration: 60 + 23,
              startHour: 0,
              startMinute: 0,
            },
          ],
        },
        {
          date: "2024-12-04",
          blocks: [
            {
              active: false,
              duration: 60 + 30,
              startHour: 22,
              startMinute: 30,
            },
          ],
        },
      ]);
    });
  });
});
