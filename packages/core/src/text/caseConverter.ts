export type CaseStyle =
  | "lower"
  | "upper"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot";

export function convertCase(input: string, style: CaseStyle): string {
  switch (style) {
    case "lower":
      return input.toLowerCase();
    case "upper":
      return input.toUpperCase();
    case "title":
      return input.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    case "sentence":
      return input.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase());
    case "camel": {
      const w = words(input);
      return w
        .map((s, i) => (i === 0 ? s.toLowerCase() : capitalize(s)))
        .join("");
    }
    case "pascal":
      return words(input).map(capitalize).join("");
    case "snake":
      return words(input).map((s) => s.toLowerCase()).join("_");
    case "kebab":
      return words(input).map((s) => s.toLowerCase()).join("-");
    case "constant":
      return words(input).map((s) => s.toUpperCase()).join("_");
    case "dot":
      return words(input).map((s) => s.toLowerCase()).join(".");
  }
}

function words(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
