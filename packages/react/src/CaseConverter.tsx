import { useState } from "react";
import { convertCase, type CaseStyle } from "@convertprivately/core/text/case-converter";
import { AttributionBadge } from "./AttributionBadge.js";

export interface CaseConverterProps {
  hideAttribution?: boolean;
  className?: string;
}

const STYLES: { value: CaseStyle; label: string }[] = [
  { value: "lower", label: "lower case" },
  { value: "upper", label: "UPPER CASE" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "camel", label: "camelCase" },
  { value: "pascal", label: "PascalCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
  { value: "constant", label: "CONSTANT_CASE" },
  { value: "dot", label: "dot.case" },
];

export function CaseConverter({ hideAttribution, className }: CaseConverterProps) {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<CaseStyle>("camel");

  const output = input ? convertCase(input, style) : "";

  return (
    <div className={`cp-tool cp-case ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div className="cp-controls" style={{ marginBottom: 8 }}>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as CaseStyle)}
          style={{ fontFamily: "monospace" }}
        >
          {STYLES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text"
        rows={4}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
      {output && (
        <textarea
          readOnly
          className="cp-textarea"
          value={output}
          rows={4}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      )}
    </div>
  );
}
