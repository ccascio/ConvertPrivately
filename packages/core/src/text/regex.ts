export interface RegexFlags {
  g?: boolean;
  i?: boolean;
  m?: boolean;
  s?: boolean;
}

export interface RegexMatchInfo {
  index: number;
  value: string;
  groups: (string | undefined)[];
}

export interface RegexTestResult {
  error: string | null;
  matches: RegexMatchInfo[];
}

export function buildFlagString(flags: RegexFlags): string {
  return Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");
}

export function testRegex(pattern: string, testString: string, flags: RegexFlags = {}): RegexTestResult {
  if (!pattern) return { error: null, matches: [] };
  const flagStr = buildFlagString(flags);
  try {
    const globalFlags = flagStr.includes("g") ? flagStr : flagStr + "g";
    const regex = new RegExp(pattern, globalFlags);
    const raw = [...testString.matchAll(regex)];
    const matches: RegexMatchInfo[] = raw.map((m) => ({
      index: m.index ?? 0,
      value: m[0],
      groups: m.slice(1),
    }));
    return { error: null, matches };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid regex", matches: [] };
  }
}
