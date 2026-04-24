export interface CsvToJsonOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
}

export interface JsonToCsvOptions {
  delimiter?: string;
  newline?: string;
}

export async function csvToJson(
  input: string,
  options: CsvToJsonOptions = {},
): Promise<unknown[]> {
  const { header = true, skipEmptyLines = true } = options;
  const Papa = (await import("papaparse")).default;
  const result = Papa.parse(input.trim(), { header, skipEmptyLines });
  if (result.errors.length > 0) {
    throw new Error(result.errors[0]!.message);
  }
  return result.data as unknown[];
}

export async function jsonToCsv(
  input: unknown,
  options: JsonToCsvOptions = {},
): Promise<string> {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  if (!Array.isArray(data)) {
    throw new Error("JSON input must be an array of objects.");
  }
  const Papa = (await import("papaparse")).default;
  return Papa.unparse(data, options);
}
