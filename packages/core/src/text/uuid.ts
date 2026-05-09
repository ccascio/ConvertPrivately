export interface UuidOptions {
  uppercase?: boolean;
  hyphens?: boolean;
}

export function generateUuid(opts: UuidOptions = {}): string {
  const raw: string = crypto.randomUUID();
  let id = raw;
  if (opts.hyphens === false) id = id.replace(/-/g, "");
  if (opts.uppercase) id = id.toUpperCase();
  return id;
}

export async function generateUlid(opts: UuidOptions = {}): Promise<string> {
  const { ulid } = await import("ulid");
  let id: string = ulid();
  if (!opts.uppercase) id = id.toLowerCase();
  return id;
}

export function generateUuids(count: number, opts: UuidOptions = {}): string[] {
  return Array.from({ length: count }, () => generateUuid(opts));
}

export async function generateUlids(count: number, opts: UuidOptions = {}): Promise<string[]> {
  const { ulid } = await import("ulid");
  return Array.from({ length: count }, () => {
    let id: string = ulid();
    if (!opts.uppercase) id = id.toLowerCase();
    return id;
  });
}
