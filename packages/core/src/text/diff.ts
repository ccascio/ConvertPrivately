export type DiffLineType = "equal" | "added" | "removed";

export interface DiffLine {
  type: DiffLineType;
  lineLeft: number | null;
  lineRight: number | null;
  content: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

export function computeLineDiff(left: string, right: string): DiffLine[] {
  const linesA = left.split("\n");
  const linesB = right.split("\n");
  const m = linesA.length;
  const n = linesB.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.push({ type: "equal", lineLeft: i, lineRight: j, content: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "added", lineLeft: null, lineRight: j, content: linesB[j - 1] });
      j--;
    } else {
      result.push({ type: "removed", lineLeft: i, lineRight: null, content: linesA[i - 1] });
      i--;
    }
  }

  result.reverse();
  return result;
}

export function computeDiffStats(lines: DiffLine[]): DiffStats {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const line of lines) {
    if (line.type === "added") added++;
    else if (line.type === "removed") removed++;
    else unchanged++;
  }
  return { added, removed, unchanged };
}
