import { useState } from "react";
import { slugify } from "@convertprivately/core/text/slugify";
import { AttributionBadge } from "./AttributionBadge.js";

export interface SlugifyProps {
  hideAttribution?: boolean;
  className?: string;
}

export function Slugify({ hideAttribution, className }: SlugifyProps) {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");

  const output = input ? slugify(input, { separator }) : "";

  return (
    <div className={`cp-tool cp-slugify ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div className="cp-controls" style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 14 }}>
          Separator:{" "}
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value || "-")}
            maxLength={3}
            style={{ width: 40, fontFamily: "monospace" }}
          />
        </label>
      </div>
      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to slugify"
        rows={3}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
      {output && (
        <textarea
          readOnly
          className="cp-textarea"
          value={output}
          rows={2}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      )}
    </div>
  );
}
