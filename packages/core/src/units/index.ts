export interface UnitDefinition {
  value: string;
  label: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "area"
  | "speed"
  | "time"
  | "dataSize";

function factor(value: string, label: string, symbol: string, factorToBase: number): UnitDefinition {
  return {
    value,
    label,
    symbol,
    toBase: (v) => v * factorToBase,
    fromBase: (v) => v / factorToBase,
  };
}

export const UNITS: Record<UnitCategory, UnitDefinition[]> = {
  length: [
    factor("mm", "Millimeter", "mm", 0.001),
    factor("cm", "Centimeter", "cm", 0.01),
    factor("m", "Meter", "m", 1),
    factor("km", "Kilometer", "km", 1000),
    factor("in", "Inch", "in", 0.0254),
    factor("ft", "Foot", "ft", 0.3048),
    factor("yd", "Yard", "yd", 0.9144),
    factor("mi", "Mile", "mi", 1609.344),
    factor("nmi", "Nautical Mile", "nmi", 1852),
  ],
  weight: [
    factor("mg", "Milligram", "mg", 0.000001),
    factor("g", "Gram", "g", 0.001),
    factor("kg", "Kilogram", "kg", 1),
    factor("t", "Metric Ton", "t", 1000),
    factor("oz", "Ounce", "oz", 0.028349523125),
    factor("lb", "Pound", "lb", 0.45359237),
    factor("st", "Stone", "st", 6.35029318),
  ],
  temperature: [
    { value: "c", label: "Celsius", symbol: "C", toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15 },
    { value: "f", label: "Fahrenheit", symbol: "F", toBase: (v) => ((v - 32) * 5) / 9 + 273.15, fromBase: (v) => ((v - 273.15) * 9) / 5 + 32 },
    { value: "k", label: "Kelvin", symbol: "K", toBase: (v) => v, fromBase: (v) => v },
    { value: "r", label: "Rankine", symbol: "R", toBase: (v) => (v * 5) / 9, fromBase: (v) => (v * 9) / 5 },
  ],
  volume: [
    factor("ml", "Milliliter", "mL", 0.001),
    factor("l", "Liter", "L", 1),
    factor("m3", "Cubic Meter", "m3", 1000),
    factor("tsp-us", "Teaspoon (US)", "tsp", 0.00492892159375),
    factor("tbsp-us", "Tablespoon (US)", "tbsp", 0.01478676478125),
    factor("floz-us", "Fluid Ounce (US)", "fl oz", 0.0295735295625),
    factor("cup-us", "Cup (US)", "cup", 0.2365882365),
    factor("pint-us", "Pint (US)", "pt", 0.473176473),
    factor("quart-us", "Quart (US)", "qt", 0.946352946),
    factor("gallon-us", "Gallon (US)", "gal", 3.785411784),
    factor("gallon-uk", "Gallon (UK)", "gal", 4.54609),
  ],
  area: [
    factor("mm2", "Square Millimeter", "mm2", 0.000001),
    factor("cm2", "Square Centimeter", "cm2", 0.0001),
    factor("m2", "Square Meter", "m2", 1),
    factor("ha", "Hectare", "ha", 10000),
    factor("km2", "Square Kilometer", "km2", 1000000),
    factor("in2", "Square Inch", "in2", 0.00064516),
    factor("ft2", "Square Foot", "ft2", 0.09290304),
    factor("acre", "Acre", "acre", 4046.8564224),
    factor("mi2", "Square Mile", "mi2", 2589988.110336),
  ],
  speed: [
    factor("mps", "Meters per Second", "m/s", 1),
    factor("kmh", "Kilometers per Hour", "km/h", 0.2777777777778),
    factor("mph", "Miles per Hour", "mph", 0.44704),
    factor("knot", "Knot", "kn", 0.514444444444),
    factor("fps", "Feet per Second", "ft/s", 0.3048),
  ],
  time: [
    factor("ms", "Millisecond", "ms", 0.001),
    factor("s", "Second", "s", 1),
    factor("min", "Minute", "min", 60),
    factor("h", "Hour", "h", 3600),
    factor("day", "Day", "day", 86400),
    factor("week", "Week", "week", 604800),
  ],
  dataSize: [
    factor("bit", "Bit", "bit", 0.125),
    factor("byte", "Byte", "B", 1),
    factor("kb", "Kilobyte (decimal)", "kB", 1000),
    factor("kib", "Kibibyte (binary)", "KiB", 1024),
    factor("mb", "Megabyte (decimal)", "MB", 1000000),
    factor("mib", "Mebibyte (binary)", "MiB", 1048576),
    factor("gb", "Gigabyte (decimal)", "GB", 1000000000),
    factor("gib", "Gibibyte (binary)", "GiB", 1073741824),
  ],
};

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: UnitCategory,
): number | null {
  const units = UNITS[category];
  const from = units.find((u) => u.value === fromUnit);
  const to = units.find((u) => u.value === toUnit);
  if (!from || !to) return null;
  return to.fromBase(from.toBase(value));
}
