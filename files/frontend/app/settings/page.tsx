"use client";
import { useState, useEffect } from "react";
import { loadSamples, saveSamples } from "../../lib/knn";

export default function SettingsPage() {
  const [minConf, setMinConf] = useState(75);
  const [smoothWindow, setSmoothWindow] = useState(8);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [sampleCount, setSampleCount] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const samples = loadSamples();
    setSampleCount(samples.length);

    const savedConf = localStorage.getItem("se-min-conf");
    if (savedConf) setMinConf(+savedConf);

    const savedWindow = localStorage.getItem("se-smooth-window");
    if (savedWindow) setSmoothWindow(+savedWindow);

    const savedUrl = localStorage.getItem("se-api-url");
    if (savedUrl) setApiUrl(savedUrl);
  }, []);

  const saveAllSettings = () => {
    localStorage.setItem("se-min-conf", minConf.toString());
    localStorage.setItem("se-smooth-window", smoothWindow.toString());
    localStorage.setItem("se-api-url", apiUrl);
    setMsg("✓ Settings saved successfully!");
    setTimeout(() => setMsg(""), 3500);
  };

  const clearRecordedSamples = () => {
    if (confirm("Are you sure you want to reset all locally recorded sign samples?")) {
      saveSamples([]);
      setSampleCount(0);
      setMsg("Reset recorded sign samples.");
      setTimeout(() => setMsg(""), 3500);
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          System Settings <span style={{ color: "var(--cyan)" }}>& Model Configuration</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Configure AI recognition confidence thresholds, temporal smoothing windows, API endpoints, and storage.
        </p>
      </div>

      <div className="grid-2">
        {/* Detection & Recognition Settings */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Recognition & Model Thresholds</h3>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="note">Minimum Confidence Threshold</span>
              <b style={{ color: "var(--cyan)" }}>{minConf}%</b>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minConf}
              onChange={(e) => setMinConf(+e.target.value)}
            />
            <p className="note" style={{ marginTop: 6 }}>
              Gestures with confidence below this threshold are filtered to prevent false positives.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="note">Temporal Smoothing Window</span>
              <b style={{ color: "var(--emerald)" }}>{smoothWindow} frames</b>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={smoothWindow}
              onChange={(e) => setSmoothWindow(+e.target.value)}
            />
            <p className="note" style={{ marginTop: 6 }}>
              Higher values eliminate posture jitter; lower values offer instant responsiveness.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="note" htmlFor="api-url">Backend FastAPI Server Endpoint</label>
            <input
              id="api-url"
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div className="btns" style={{ marginTop: 24 }}>
            <button className="btn primary" onClick={saveAllSettings}>
              💾 Save Preferences
            </button>
          </div>

          {msg && <p className="note" style={{ marginTop: 12, color: "var(--emerald)", fontWeight: 700 }}>{msg}</p>}
        </div>

        {/* Local Storage & Dataset Management */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Dataset & Model Weights</h3>

          <div style={{ padding: 18, background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid var(--line)", marginBottom: 20 }}>
            <span className="note">Locally Stored Sign Samples</span>
            <div className="metric-highlight" style={{ color: "var(--cyan)", marginTop: 6 }}>
              {sampleCount} Samples
            </div>
            <p className="note" style={{ marginTop: 4 }}>
              Custom 21-joint landmark arrays saved in browser local storage.
            </p>
          </div>

          <div className="btns">
            <button className="btn" onClick={clearRecordedSamples} disabled={sampleCount === 0} style={{ color: "var(--bad)" }}>
              🗑️ Reset Recorded Samples
            </button>
          </div>

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ margin: "0 0 8px", fontSize: "0.95rem" }}>Active Neural Model Weights</h4>
            <p className="note" style={{ margin: "4px 0" }}>Engine: <b>MediaPipe Tasks Vision v0.10.14 + kNN</b></p>
            <p className="note" style={{ margin: "4px 0" }}>Trained Static Model: <code>ai/models/signeye_static.pt (87.7% Benchmark)</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
