import { useEffect, useState } from "react";
import { formatSqlQuery, SQL_DIALECTS } from "@convertprivately/core/data/sql-format";
import type { SqlDialect, SqlKeywordCase } from "@convertprivately/core/data/sql-format";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload } from "./utils.js";

export interface SqlFormatterProps {
  hideAttribution?: boolean;
  className?: string;
  defaultText?: string;
}

const PLACEHOLDER =
  "SELECT u.id,u.name,u.email,o.total,o.created_at FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 AND o.total>100 ORDER BY o.created_at DESC LIMIT 50;";

type IndentOption = "2" | "4" | "tab" | "minify";

export function SqlFormatter({ hideAttribution, className, defaultText = PLACEHOLDER }: SqlFormatterProps) {
  const [input, setInput] = useState(defaultText);
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [keywordCase, setKeywordCase] = useState<SqlKeywordCase>("upper");
  const [output, setOutput] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const minify = indent === "minify";
      const useTabs = indent === "tab";
      const tabWidth = useTabs ? 1 : indent === "minify" ? 2 : parseInt(indent);
      const result = await formatSqlQuery(input, { dialect, tabWidth, useTabs, keywordCase, minify });
      if (!cancelled) setOutput(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [input, dialect, indent, keywordCase]);

  return (
    <div className={`cp-tool cp-sql-formatter ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 12, fontSize: 13 }}>
        <label>
          Dialect:&nbsp;
          <select value={dialect} onChange={(e) => setDialect(e.target.value as SqlDialect)}>
            {SQL_DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Indent:&nbsp;
          <select value={indent} onChange={(e) => setIndent(e.target.value as IndentOption)}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
            <option value="minify">Minify</option>
          </select>
        </label>
        <label>
          Keywords:&nbsp;
          <select value={keywordCase} onChange={(e) => setKeywordCase(e.target.value as SqlKeywordCase)}>
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
            <option value="preserve">Preserve</option>
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            SQL Input
          </label>
          <textarea
            className="cp-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="Paste SQL query here…"
            rows={12}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Formatted SQL
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted SQL will appear here…"
            rows={12}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: 13,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              padding: "8px 10px",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className="cp-button"
          onClick={() => output && navigator.clipboard.writeText(output).catch(() => {})}
          disabled={!output}
        >
          Copy Output
        </button>
        <button
          type="button"
          className="cp-button cp-button-active"
          onClick={() =>
            output && triggerDownload(new Blob([output], { type: "text/plain" }), "formatted.sql")
          }
          disabled={!output}
        >
          Download .sql
        </button>
      </div>
    </div>
  );
}
