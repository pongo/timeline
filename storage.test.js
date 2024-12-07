import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compress, decompress } from "./storage.js";

// describe("groupByDays", () => {
//   it("should convert array-blocks to grouped array", () => {
//     const actual = groupByDays("2024-12-04", [
//       ["2024-12-04", 10, 0, 25],
//       ["2024-12-04", 10, 30, 25],
//     ]);
//
//     const expected = [
//       {
//         date: "2024-12-04",
//         blocks: [
//           { active: false, duration: 25, startHour: 10, startMinute: 0 },
//           { active: false, duration: 25, startHour: 10, startMinute: 30 },
//         ],
//       },
//     ];
//
//     assert.deepEqual(actual, expected);
//   });
//
//   it("should adds missed days", () => {
//     const actual = groupByDays("2024-12-04", [
//       ["2024-12-01", 18, 14, 60],
//       ["2024-12-04", 10, 0, 25],
//     ]);
//
//     const expected = [
//       {
//         date: "2024-12-04",
//         blocks: [
//           { active: false, duration: 25, startHour: 10, startMinute: 0 },
//         ],
//       },
//       { date: "2024-12-03", blocks: [] },
//       { date: "2024-12-02", blocks: [] },
//       {
//         date: "2024-12-01",
//         blocks: [
//           { active: false, duration: 60, startHour: 18, startMinute: 14 },
//         ],
//       },
//     ];
//
//     assert.deepEqual(actual, expected);
//   });
//
//   it("should adds today", () => {
//     const actual = groupByDays("2024-12-04", [["2024-12-01", 18, 14, 60]]);
//
//     const expected = [
//       { date: "2024-12-04", blocks: [] },
//       { date: "2024-12-03", blocks: [] },
//       { date: "2024-12-02", blocks: [] },
//       {
//         date: "2024-12-01",
//         blocks: [
//           { active: false, duration: 60, startHour: 18, startMinute: 14 },
//         ],
//       },
//     ];
//
//     assert.deepEqual(actual, expected);
//   });
// });

describe("compressor", () => {
  const decompressed = [
    {
      date: "2024-12-02",
      blocks: [
        { active: false, duration: 25, startHour: 10, startMinute: 0 },
        { active: false, duration: 25, startHour: 10, startMinute: 30 },
      ],
    },
    {
      date: "2024-12-01",
      blocks: [{ active: false, duration: 60, startHour: 18, startMinute: 14 }],
    },
  ];
  const compressed = [
    [
      "2024-12-02",
      [
        [10, 0, 25],
        [10, 30, 25],
      ],
    ],
    ["2024-12-01", [[18, 14, 60]]],
  ];

  it("should compress", () => {
    assert.deepEqual(compress(decompressed), compressed);
  });

  it("should decompress", () => {
    assert.deepEqual(decompress(compressed), decompressed);
  });
});
