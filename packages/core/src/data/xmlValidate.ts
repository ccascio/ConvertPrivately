import type { ValidationResult, ValidationIssue } from "./jsonValidate.js";

function countElements(node: Node): { elements: number; attributes: number; tags: Map<string, number> } {
  let elements = 0;
  let attributes = 0;
  const tags = new Map<string, number>();

  function walk(n: Node) {
    if (n.nodeType === 1) {
      elements++;
      const el = n as Element;
      attributes += el.attributes.length;
      const tag = el.tagName.toLowerCase();
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
    for (let i = 0; i < n.childNodes.length; i++) {
      walk(n.childNodes[i]!);
    }
  }

  walk(node);
  return { elements, attributes, tags };
}

export function validateXml(input: string): ValidationResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "application/xml");
  const errorNode = doc.querySelector("parsererror");

  if (errorNode) {
    const msg = errorNode.textContent?.split("\n")[0] ?? "XML is not well-formed.";
    return {
      isValid: false,
      issues: [{ code: "parse_error", message: msg, row: null, severity: "error" }],
      stats: {},
    };
  }

  const issues: ValidationIssue[] = [];
  const { elements, attributes, tags } = countElements(doc);

  const root = doc.documentElement;
  const namespaces = new Set<string>();
  if (root.namespaceURI) namespaces.add(root.namespaceURI);
  for (let i = 0; i < root.attributes.length; i++) {
    const attr = root.attributes[i]!;
    if (attr.name.startsWith("xmlns")) {
      namespaces.add(attr.value);
    }
  }

  if (!input.trimStart().startsWith("<?xml")) {
    issues.push({
      code: "no_declaration",
      message: 'Missing XML declaration (<?xml version="1.0"?>).',
      row: 1,
      severity: "warning",
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
    stats: {
      "Root element": root.tagName,
      Elements: elements,
      Attributes: attributes,
      "Unique tags": tags.size,
      Namespaces: namespaces.size,
    },
  };
}
