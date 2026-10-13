"use client";
import { useEffect, useRef, useState } from "react";
import CameraPanel, { Frame } from "../../components/CameraPanel";
import { toFeatures } from "../../lib/features";
import { counts, loadSamples, saveSamples, Sample } from "../../lib/knn";
import { ALPHABET, WORDS } from "../../lib/vocab";

const PER_TAKE = 40;

export default function Train() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("HELLO");
  const [custom, setCustom] = useState("");
  const [cnt, setCnt] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [left, setLeft] = useState(0);
  const samples = useRef<Sample[]>([]);
  const rec = useRef({ left: 0, label: "" });

  useEffect(() => {
    samples.current = loadSamples();
    setCnt(counts(samples.current));
  }, []);

  const onFrame = (f: Frame) => {
    if (!f.hands.length) {
      if (rec.current.left) setMsg("No hand detected. Keep your hand inside the frame.");
      return;
    }
    if (rec.current.left > 0) {
      samples.current.push({ label: rec.current.label, vec: toFeatures(f.hands[0]).map((v) => +v.toFixed(4)) });
      rec.current.left--;
      setLeft(rec.current.left);
      if (rec.current.left === 0) {
        if (!saveSamples(samples.current)) setErr("Could not save samples. Browser storage is full or unavailable.");
        setCnt(counts(samples.current));
        setMsg(`Recorded ${PER_TAKE} samples for "${rec.current.label}".`);
      }
    }
  };

  const start = () => {
    const l = (custom.trim() || label).toUpperCase();
    rec.current = { left: PER_TAKE, label: l };
    setLeft(PER_TAKE);
    setMsg(`Recording ${l}. Hold the sign and move hand slightly for variance.`);
  };

  const reset = (l?: string) => {
    samples.current = l ? samples.current.filter((s) => s.label !== l) : [];
    saveSamples(samples.current);
    setCnt(counts(samples.current));
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Train <span style={{ color: "var(--cyan)" }}>Sign Classifier</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Train the client-side kNN classifier on your own live camera gestures. Recorded landmark features stay 100% private in your browser.
        </p>
      </div>

      {err && <div className="msg" role="alert">{err}</div>}

      <div className="studio">
        {/* Camera Stage */}
        <div>
          <div className="vision-stage">
            <CameraPanel active={on} paused={false} skip={2} onFrame={onFrame} onError={(e) => { setErr(e); setOn(false); }} />
            <div className="vision-hud-overlay">
              <span className="hud-corner tl" />
              <span className="hud-corner tr" />
              <span className="hud-corner bl" />
              <span className="hud-corner br" />
            </div>
          </div>

          <div className="btns" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={() => { setErr(""); setOn(!on); }}>
              {on ? "⏹️ Stop camera" : "▶️ Start camera"}
            </button>
            <button className="btn cyan" disabled={!on || left > 0} onClick={start}>
              {left > 0 ? `Recording… ${left} left` : `⏺️ Record ${PER_TAKE} samples`}
            </button>
          </div>

          {left > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 4 }}>
                <span style={{ color: "var(--cyan)" }}>Recording progress</span>
                <b>{PER_TAKE - left} / {PER_TAKE}</b>
              </div>
              <div className="meter">
                <i style={{ width: `${((PER_TAKE - left) / PER_TAKE) * 100}%` }} />
              </div>
            </div>
          )}

          {msg && <p className="note" role="status" style={{ color: "var(--cyan)", marginTop: 10 }}>{msg}</p>}
        </div>

        {/* Sign Selection & Recorded Samples */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Sign Vocabulary Target</h3>

          <label className="note" htmlFor="w">Predefined Words and Letters</label>
          <select id="w" value={label} onChange={(e) => { setLabel(e.target.value); setCustom(""); }} style={{ width: "100%", marginTop: 4, marginBottom: 16 }}>
            <optgroup label="Core Words">{WORDS.map((w) => <option key={w}>{w}</option>)}</optgroup>
            <optgroup label="Alphabet">{ALPHABET.map((w) => <option key={w}>{w}</option>)}</optgroup>
          </select>

          <label className="note" htmlFor="c">Or Record Custom Sign / Name</label>
          <input
            id="c"
            type="text"
            placeholder="e.g. JASHAN or WELCOME"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            style={{ marginTop: 4, marginBottom: 20 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Recorded Dataset</h4>
            <span className="badge">
              {Object.keys(cnt).length} Signs Trained
            </span>
          </div>

          <div className="tiles">
            {Object.keys(cnt).length === 0 && (
              <span className="note">No samples recorded yet. Aim for two takes (80 samples) per sign.</span>
            )}
            {Object.entries(cnt).map(([k, v]) => (
              <button
                key={k}
                className="tile"
                aria-label={`Delete samples for ${k}`}
                title="Click to delete this gesture dataset"
                onClick={() => reset(k)}
              >
                <b>{k}</b>
                <small>{v} samples ✕</small>
              </button>
            ))}
          </div>

          {Object.keys(cnt).length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <button className="btn" onClick={() => reset()} style={{ color: "var(--bad)" }}>
                🗑️ Clear All Samples
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
