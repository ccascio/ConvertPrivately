import type { ValidationResult, ValidationIssue } from "./jsonValidate.js";

function analyzeDepth(value: unknown, depth: number): number {
  if (value === null || typeof value !== "object") return depth;
  let max = depth;
  if (Array.isArray(value)) {
    for (const item of value) {
      max = Math.max(max, analyzeDepth(item, depth + 1));
    }
  } else {
    for (const v of Object.values(value as Record<string, unknown>)) {
      max = Math.max(max, analyzeDepth(v, depth + 1));
    }
  }
  return max;
}

function countKeys(value: unknown): number {
  if (value === null || typeof value !== "object") return 0;
  if (Array.isArray(value)) return (value as unknown[]).reduce<number>((s, v) => s + countKeys(v), 0);
  const obj = value as Record<string, unknown>;
  return Object.keys(obj).length + Object.values(obj).reduce<number>((s, v) => s + countKeys(v), 0);
}

export async function validateYaml(input: string): Promise<ValidationResult> {
  const jsYaml = (await import("js-yaml")).default;
  try {
    const docs: unknown[] = [];
    jsYaml.loadAll(input, (doc) => docs.push(doc));

    if (docs.length === 0) {
      return { isValid: true, issues: [], stats: { Documents: 0, Type: "empty" } };
    }

    const first = docs[0];
    const rootType =
      first === null
        ? "null"
        : Array.isArray(first)
        ? "sequence"
        : typeof first === "object"
        ? "mapping"
        : typeof first;
    const depth = docs.reduce<number>((max, d) => Math.max(max, analyzeDepth(d, 0)), 0);
    const keys = docs.reduce<number>((sum, d) => sum + countKeys(d), 0);

    const issues: ValidationIssue[] = [];
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (/^\t/.test(lines[i]!)) {
        issues.push({
          code: "tab_indent",
          message: "Line uses tab indentation (YAML requires spaces).",
          row: i + 1,
          severity: "error",
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      stats: { Documents: docs.length, "Root type": rootType, Depth: depth, Keys: keys },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid YAML";
    const lineMatch = message.match(/line (\d+)/i);
    const row = lineMatch ? Number(lineMatch[1]) : null;
    return {
      isValid: false,
      issues: [{ code: "parse_error", message, row, severity: "error" }],
      stats: {},
    };
  }
}
