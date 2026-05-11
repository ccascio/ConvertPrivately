export interface ValidationIssue {
  code: string;
  message: string;
  row: number | null;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  stats: Record<string, string | number>;
}

interface JsonStats {
  type: string;
  depth: number;
  keys: number;
  arrays: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
}

function analyzeValue(value: unknown, depth: number, stats: JsonStats) {
  if (depth > stats.depth) stats.depth = depth;
  if (value === null) {
    stats.nulls++;
  } else if (Array.isArray(value)) {
    stats.arrays++;
    for (const item of value) analyzeValue(item, depth + 1, stats);
  } else if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    stats.keys += entries.length;
    for (const [, v] of entries) analyzeValue(v, depth + 1, stats);
  } else if (typeof value === "string") {
    stats.strings++;
  } else if (typeof value === "number") {
    stats.numbers++;
  } else if (typeof value === "boolean") {
    stats.booleans++;
  }
}

export function validateJson(input: string): ValidationResult {
  try {
    const parsed = JSON.parse(input);
    const rootType = Array.isArray(parsed) ? "array" : typeof parsed;
    const stats: JsonStats = { type: rootType, depth: 0, keys: 0, arrays: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };
    analyzeValue(parsed, 0, stats);

    const issues: ValidationIssue[] = [];
    const keyRegex = /"([^"\\]|\\.)*"\s*:/g;
    const lines = input.split("\n");
    const seenKeys = new Map<string, number>();
    for (let i = 0; i < lines.length; i++) {
      let match: RegExpExecArray | null;
      keyRegex.lastIndex = 0;
      while ((match = keyRegex.exec(lines[i]!)) !== null) {
        const key = match[0].slice(0, -1).trim();
        const prev = seenKeys.get(key);
        if (prev !== undefined) {
          issues.push({ code: "duplicate_key", message: `Duplicate key ${key} (also on line ${prev}).`, row: i + 1, severity: "warning" });
        } else {
          seenKeys.set(key, i + 1);
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      stats: {
        "Root type": stats.type,
        "Depth": stats.depth,
        "Keys": stats.keys,
        "Arrays": stats.arrays,
        "Strings": stats.strings,
        "Numbers": stats.numbers,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    const lineMatch = message.match(/line (\d+)/i) ?? message.match(/position (\d+)/i);
    const row = lineMatch ? Number(lineMatch[1]) : null;
    return {
      isValid: false,
      issues: [{ code: "parse_error", message, row, severity: "error" }],
      stats: {},
    };
  }
}
