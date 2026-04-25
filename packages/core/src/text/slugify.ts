export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  maxLength?: number;
}

export function slugify(input: string, options: SlugifyOptions = {}): string {
  const { separator = "-", lowercase = true, maxLength } = options;
  let s = input.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  if (lowercase) s = s.toLowerCase();
  s = s
    .replace(/[^a-zA-Z0-9]+/g, separator)
    .replace(new RegExp(`^${escapeRegex(separator)}+|${escapeRegex(separator)}+$`, "g"), "")
    .replace(new RegExp(`${escapeRegex(separator)}{2,}`, "g"), separator);
  if (maxLength && s.length > maxLength) {
    s = s.slice(0, maxLength).replace(new RegExp(`${escapeRegex(separator)}+$`), "");
  }
  return s;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
