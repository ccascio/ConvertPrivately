export function nowUnix(): number {
  return Math.floor(Date.now() / 1000);
}

export function unixToDate(seconds: number): Date {
  return new Date(seconds * 1000);
}

export function dateToUnix(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) throw new Error("Invalid date.");
  return Math.floor(d.getTime() / 1000);
}

export function unixToIso(seconds: number): string {
  return unixToDate(seconds).toISOString();
}

export function isoToUnix(iso: string): number {
  return dateToUnix(iso);
}
