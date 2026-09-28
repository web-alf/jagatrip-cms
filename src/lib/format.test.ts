import { expect, test } from "bun:test";
import { bodyBlocks, fmtDate, handleOf, isWaNumber, waLink, ytId } from "./format";

test("format helpers", () => {
  expect(waLink("+62 813-9190-363")).toBe("https://wa.me/628139190363");
  expect(waLink("0811 2850", "a b")).toBe("https://wa.me/628112850?text=a%20b");
  expect(handleOf("https://www.tiktok.com/@jagatrip.id")).toBe("jagatrip.id");
  expect(fmtDate("2026-09-10")).toBe("10 September 2026");
  expect(ytId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  expect(isWaNumber("0812-3456-7890")).toBe(true);
  expect(isWaNumber("0712345")).toBe(false);
  expect(bodyBlocks("## A\n\n### B\n\nc").map((b) => b.tag)).toEqual(["h2", "h3", "p"]);
});
