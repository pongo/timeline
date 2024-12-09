import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasLeftOverlap,
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
            {
              active: true,
              duration: 0,
              startHour: 10,
              startMinute: 30,
              leftOverlap: false,
            },
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
            {
              active: false,
              duration: 25,
              startHour: 10,
              startMinute: 0,
              leftOverlap: false,
            },
          ],
        },
      ];
      const actual = startNewBlock(schedule, new Date("2024-12-04 10:30:00"));
      assert.deepEqual(actual, [
        {
          date: "2024-12-04",
          blocks: [
            {
              active: false,
              duration: 25,
              startHour: 10,
              startMinute: 0,
              leftOverlap: false,
            },
            {
              active: true,
              duration: 0,
              startHour: 10,
              startMinute: 30,
              leftOverlap: false,
            },
          ],
        },
      ]);
      assert.notEqual(actual, schedule, "should not mutate original");
      assert.notDeepEqual(actual, schedule, "should not mutate original");
    });

    it("should check left overlaps for blocks", () => {
      const schedule = [
        {
          date: "2024-12-04",
          blocks: [
            {
              active: false,
              duration: 25,
              startHour: 10,
              startMinute: 0,
              leftOverlap: false,
            },
          ],
        },
      ];
      const actual = startNewBlock(schedule, new Date("2024-12-04 10:25:00"));
      assert.deepEqual(actual, [
        {
          date: "2024-12-04",
          blocks: [
            {
              active: false,
              duration: 25,
              startHour: 10,
              startMinute: 0,
              leftOverlap: false,
            },
            {
              active: true,
              duration: 0,
              startHour: 10,
              startMinute: 25,
              leftOverlap: true,
            },
          ],
        },
      ]);
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
            {
              active: true,
              duration: 0,
              startHour: 10,
              startMinute: 30,
              leftOverlap: false,
            },
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
          {
            active: false,
            duration: 25,
            startHour: 10,
            startMinute: 0,
            leftOverlap: false,
          },
          {
            active: true,
            duration: 0,
            startHour: 10,
            startMinute: 30,
            leftOverlap: false,
          },
        ],
      },
    ];
    const actual = updateActiveBlock(schedule, new Date("2024-12-04 11:00:00"));
    assert.deepEqual(actual, [
      {
        date: "2024-12-04",
        blocks: [
          {
            active: false,
            duration: 25,
            startHour: 10,
            startMinute: 0,
            leftOverlap: false,
          },
          {
            active: true,
            duration: 30,
            startHour: 10,
            startMinute: 30,
            leftOverlap: false,
          },
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
          {
            active: false,
            duration: 25,
            startHour: 10,
            startMinute: 0,
            leftOverlap: false,
          },
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
            {
              active: true,
              duration: 0,
              startHour: 10,
              startMinute: 30,
              leftOverlap: false,
            },
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
              leftOverlap: false,
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
            {
              active: true,
              duration: 0,
              startHour: 22,
              startMinute: 30,
              leftOverlap: false,
            },
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
              leftOverlap: false,
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
              leftOverlap: false,
            },
          ],
        },
      ]);
    });
  });
});

describe("hasLeftOverlap", () => {
  it("should check left overlaps for blocks", () => {
    const blockA = { startHour: 10, startMinute: 0, duration: 25 };

    assert.equal(hasLeftOverlap(undefined, blockA), false, "no left");

    assert.equal(
      hasLeftOverlap(blockA, { startHour: 10, startMinute: 25, duration: 25 }),
      true,
      "duration 0"
    );

    assert.equal(
      hasLeftOverlap(blockA, { startHour: 10, startMinute: 24, duration: 25 }),
      true,
      "duration -1"
    );

    assert.equal(
      hasLeftOverlap(blockA, { startHour: 10, startMinute: 26, duration: 25 }),
      false,
      "duration 1"
    );
  });
});
