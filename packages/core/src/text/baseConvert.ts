export type NumberBase = 2 | 8 | 10 | 16;

export interface BaseInfo {
  base: NumberBase;
  label: string;
  prefix: string;
}

export const BASES: BaseInfo[] = [
  { base: 2, label: "Binary", prefix: "0b" },
  { base: 8, label: "Octal", prefix: "0o" },
  { base: 10, label: "Decimal", prefix: "" },
  { base: 16, label: "Hexadecimal", prefix: "0x" },
];

export interface BaseConversion extends BaseInfo {
  value: string;
}

export function convertNumberBase(input: string, fromBase: NumberBase): BaseConversion[] | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const decimal = parseInt(trimmed, fromBase);
  if (isNaN(decimal) || !isFinite(decimal)) return null;
  return [
    { base: 2, label: "Binary", prefix: "0b", value: decimal.toString(2) },
    { base: 8, label: "Octal", prefix: "0o", value: decimal.toString(8) },
    { base: 10, label: "Decimal", prefix: "", value: decimal.toString(10) },
    { base: 16, label: "Hexadecimal", prefix: "0x", value: decimal.toString(16).toUpperCase() },
  ];
}
