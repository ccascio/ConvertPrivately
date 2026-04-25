export async function jsonToYaml(input: unknown): Promise<string> {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  const yaml = await import("js-yaml");
  return yaml.dump(data, { lineWidth: -1 });
}

export async function yamlToJson(input: string, indent: number = 2): Promise<string> {
  const yaml = await import("js-yaml");
  const data = yaml.load(input);
  return JSON.stringify(data, null, indent);
}
