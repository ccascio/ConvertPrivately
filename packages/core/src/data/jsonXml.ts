export interface JsonXmlOptions {
  indent?: number;
  attributeNamePrefix?: string;
}

export async function jsonToXml(input: unknown, options: JsonXmlOptions = {}): Promise<string> {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  const { XMLBuilder } = await import("fast-xml-parser");
  const builder = new XMLBuilder({
    format: true,
    indentBy: " ".repeat(options.indent ?? 2),
    attributeNamePrefix: options.attributeNamePrefix ?? "@_",
    ignoreAttributes: false,
  });
  return builder.build(data);
}

export async function xmlToJson(input: string, options: JsonXmlOptions = {}): Promise<string> {
  const { XMLParser } = await import("fast-xml-parser");
  const parser = new XMLParser({
    attributeNamePrefix: options.attributeNamePrefix ?? "@_",
    ignoreAttributes: false,
  });
  const data = parser.parse(input);
  return JSON.stringify(data, null, options.indent ?? 2);
}
