const NAMED: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
};

const REVERSE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"']/g, (c) => REVERSE[c]!);
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (m) => NAMED[m] ?? m)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}
