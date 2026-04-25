import { useEffect, useState } from "react";
import { nowUnix, unixToIso, isoToUnix, unixToDate } from "@convertprivately/core/text/timestamp";
import { AttributionBadge } from "./AttributionBadge.js";

export interface TimestampProps {
  hideAttribution?: boolean;
  className?: string;
}

export function Timestamp({ hideAttribution, className }: TimestampProps) {
  const [now, setNow] = useState(nowUnix());
  const [unixIn, setUnixIn] = useState("");
  const [isoIn, setIsoIn] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(nowUnix()), 1000);
    return () => clearInterval(id);
  }, []);

  let unixToOut = "";
  let unixToOutErr: string | null = null;
  if (unixIn.trim()) {
    const n = Number(unixIn.trim());
    if (Number.isFinite(n)) {
      try {
        unixToOut = `${unixToIso(n)} · ${unixToDate(n).toString()}`;
      } catch (e) {
        unixToOutErr = (e as Error).message;
      }
    } else {
      unixToOutErr = "Not a valid number.";
    }
  }

  let isoToOut = "";
  let isoToOutErr: string | null = null;
  if (isoIn.trim()) {
    try {
      isoToOut = String(isoToUnix(isoIn.trim()));
    } catch (e) {
      isoToOutErr = (e as Error).message;
    }
  }

  return (
    <div className={`cp-tool cp-timestamp ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 600 }}>Current Unix time</p>
        <p style={{ fontFamily: "monospace", fontSize: 18 }}>{now}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 600 }}>Unix → date</p>
        <input
          type="text"
          value={unixIn}
          onChange={(e) => setUnixIn(e.target.value)}
          placeholder="1700000000"
          style={{ width: "100%", fontFamily: "monospace", padding: 6 }}
        />
        {unixToOutErr && <p style={{ color: "#dc2626", fontSize: 13 }}>{unixToOutErr}</p>}
        {unixToOut && <p style={{ fontFamily: "monospace", fontSize: 13, marginTop: 4 }}>{unixToOut}</p>}
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600 }}>Date → Unix</p>
        <input
          type="text"
          value={isoIn}
          onChange={(e) => setIsoIn(e.target.value)}
          placeholder="2026-04-25T12:00:00Z"
          style={{ width: "100%", fontFamily: "monospace", padding: 6 }}
        />
        {isoToOutErr && <p style={{ color: "#dc2626", fontSize: 13 }}>{isoToOutErr}</p>}
        {isoToOut && <p style={{ fontFamily: "monospace", fontSize: 13, marginTop: 4 }}>{isoToOut}</p>}
      </div>
    </div>
  );
}
