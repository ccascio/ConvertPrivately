import { useState } from "react";
import { UNITS, convertUnit, type UnitCategory } from "@convertprivately/core/units";
import { AttributionBadge } from "./AttributionBadge.js";

export interface UnitConverterProps {
  hideAttribution?: boolean;
  category: UnitCategory;
  defaultFrom?: string;
  defaultTo?: string;
  className?: string;
}

export function UnitConverter({
  hideAttribution,
  category,
  defaultFrom,
  defaultTo,
  className,
}: UnitConverterProps) {
  const units = UNITS[category];
  const [from, setFrom] = useState(defaultFrom ?? units[0]?.value ?? "");
  const [to, setTo] = useState(defaultTo ?? units[1]?.value ?? units[0]?.value ?? "");
  const [input, setInput] = useState("1");

  const parsed = parseFloat(input);
  const result = Number.isFinite(parsed) ? convertUnit(parsed, from, to, category) : null;

  return (
    <div className={`cp-tool cp-unit-converter ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div className="cp-controls">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "8rem" }}
        />
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {units.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label} ({u.symbol})
            </option>
          ))}
        </select>
        <span> → </span>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {units.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label} ({u.symbol})
            </option>
          ))}
        </select>
      </div>

      <p className="cp-result" style={{ fontSize: "1.5rem", fontFamily: "monospace" }}>
        {result === null ? "—" : result.toLocaleString("en-US", { maximumFractionDigits: 6 })}
      </p>
    </div>
  );
}
