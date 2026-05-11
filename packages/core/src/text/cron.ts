export const CRON_FIELD_NAMES = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"] as const;
export const CRON_FIELD_RANGES = ["0-59", "0-23", "1-31", "1-12", "0-7 (0=Sun)"] as const;

export interface CronExplanation {
  description: string;
  error: string | null;
  fields: string[] | null;
}

export async function explainCron(expression: string): Promise<CronExplanation> {
  const trimmed = expression.trim();
  if (!trimmed) return { description: "", error: null, fields: null };
  const parts = trimmed.split(/\s+/);
  const fields = parts.length === 5 ? parts : null;
  try {
    const cronstrue = (await import("cronstrue")).default;
    const description = cronstrue.toString(trimmed);
    return { description, error: null, fields };
  } catch {
    return {
      description: "",
      error: "Invalid cron expression — a standard cron has 5 fields: minute hour day month weekday",
      fields,
    };
  }
}

export const CRON_EXAMPLES: { expr: string; desc: string }[] = [
  { expr: "* * * * *", desc: "Every minute" },
  { expr: "0 * * * *", desc: "Every hour" },
  { expr: "0 0 * * *", desc: "Every day at midnight" },
  { expr: "0 9 * * 1-5", desc: "Weekdays at 9 AM" },
  { expr: "0 0 1 * *", desc: "First of every month" },
  { expr: "*/15 * * * *", desc: "Every 15 minutes" },
  { expr: "0 0 * * 0", desc: "Every Sunday at midnight" },
];
