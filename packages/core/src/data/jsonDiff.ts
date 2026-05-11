import { computeLineDiff } from "../text/diff.js";
import type { DiffLine } from "../text/diff.js";

function normalizeJson(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input;
  }
}

export function computeJsonDiff(left: string, right: string): DiffLine[] {
  return computeLineDiff(normalizeJson(left), normalizeJson(right));
}
