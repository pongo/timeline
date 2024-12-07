import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compress, decompress } from "./storage.js";

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
