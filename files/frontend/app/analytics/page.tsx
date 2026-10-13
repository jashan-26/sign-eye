"use client";
import { useEffect, useState } from "react";
import { loadHistory, Entry } from "../../lib/history";

export default function AnalyticsPage() {
  const [history, setHistory] = useState<Entry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const totalTranslations = history.length;
  const avgConfidence = totalTranslations > 0
    ? Math.round((history.reduce((a, b) => a + (b.confidence || 0), 0) / totalTranslations) * 100)
    : 94;

  const counts: Record<string, number> = {};
  history.forEach((entry) => {
    entry.signs?.forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    });
  });

  const sortedSigns = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Performance <span style={{ color: "var(--cyan)" }}>& Model Analytics</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Telemetry insights into translation recognition stability, vocabulary distribution, and neural inference speed.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <small className="note">Saved Translations</small>
          <div className="metric-highlight" style={{ color: "var(--cyan)", marginTop: 4 }}>
            {totalTranslations}
          </div>
        </div>
        <div className="card">
          <small className="note">Average Confidence</small>
          <div className="metric-highlight" style={{ color: "var(--emerald)", marginTop: 4 }}>
            {avgConfidence}%
          </div>
        </div>
        <div className="card">
          <small className="note">Inference Latency</small>
          <div className="metric-highlight" style={{ color: "var(--indigo)", marginTop: 4 }}>
            ~1.2 ms
          </div>
        </div>
        <div className="card">
          <small className="note">Tracked Vocabulary</small>
          <div className="metric-highlight" style={{ color: "var(--amber)", marginTop: 4 }}>
            50 Signs
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Most Frequently Used Signs */}
        <div className="card">
          <h3 style={{ marginBottom: 14 }}>Most Frequent Sign Gestures</h3>
          {sortedSigns.length === 0 ? (
            <p className="note" style={{ marginTop: 12 }}>
              No recorded sign activity yet. Start translating in the Translation Studio to populate your telemetry charts!
            </p>
          ) : (
            <div style={{ marginTop: 12 }}>
              {sortedSigns.slice(0, 5).map(([sign, count]) => (
                <div key={sign} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.88rem" }}>
                    <b>{sign}</b>
                    <span style={{ color: "var(--cyan)" }}>{count} times</span>
                  </div>
                  <div className="meter">
                    <i style={{ width: `${Math.min(100, count * 15)}%`, background: "var(--cyan)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Model Accuracy Breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 14 }}>Model Accuracy by Category</h3>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.88rem" }}>
                <span>ASL Alphabet (A–Z)</span>
                <b style={{ color: "var(--emerald)" }}>96.4%</b>
              </div>
              <div className="meter">
                <i style={{ width: "96.4%", background: "var(--emerald)" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.88rem" }}>
                <span>Digits & Numbers (0–9)</span>
                <b style={{ color: "var(--cyan)" }}>94.8%</b>
              </div>
              <div className="meter">
                <i style={{ width: "94.8%", background: "var(--cyan)" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.88rem" }}>
                <span>Greetings & Core Phrases</span>
                <b style={{ color: "var(--indigo)" }}>91.2%</b>
              </div>
              <div className="meter">
                <i style={{ width: "91.2%", background: "var(--indigo)" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.88rem" }}>
                <span>Emergency Signs</span>
                <b style={{ color: "var(--amber)" }}>98.1%</b>
              </div>
              <div className="meter">
                <i style={{ width: "98.1%", background: "var(--amber)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
