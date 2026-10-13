"use client";
import { useEffect, useState } from "react";
import { Entry, loadHistory, saveHistory } from "../../lib/history";

export default function History() {
  const [rows, setRows] = useState<Entry[]>([]);
  const [q, setQ] = useState("");
  const [min, setMin] = useState(0);

  useEffect(() => setRows(loadHistory()), []);

  const del = (id: string) => {
    const n = rows.filter((r) => r.id !== id);
    setRows(n);
    saveHistory(n);
  };

  const shown = rows.filter((r) => r.sentence.toLowerCase().includes(q.toLowerCase()) && r.confidence * 100 >= min);

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Translation <span style={{ color: "var(--cyan)" }}>History</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Review and export past sign translations recorded during your live sessions.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="note">Search translations</label>
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ marginTop: 4 }}
            />
          </div>
          <div style={{ minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: 4 }}>
              <span className="note">Min Confidence</span>
              <b style={{ color: "var(--cyan)" }}>{min}%</b>
            </div>
            <input type="range" min={0} max={100} value={min} onChange={(e) => setMin(+e.target.value)} />
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p className="note">No saved translations found matching criteria. Save translations from Translation Studio to view them here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {shown.map((r) => (
            <div className="card" key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="note">{new Date(r.at).toLocaleString()}</span>
                <span className="badge cyan">
                  {r.confidence ? `${(r.confidence * 100).toFixed(0)}% Confidence` : "Demo Input"}
                </span>
              </div>
              <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", margin: "8px 0" }}>
                {r.sentence}
              </p>
              <div className="chips" style={{ marginBottom: 14 }}>
                {r.signs.map((s, i) => (
                  <span className="tok" key={i}>{s}</span>
                ))}
              </div>
              <div className="btns" style={{ margin: 0 }}>
                <button className="btn" onClick={() => navigator.clipboard?.writeText(r.sentence)}>
                  📋 Copy
                </button>
                <button className="btn" onClick={() => del(r.id)} style={{ color: "var(--bad)" }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
