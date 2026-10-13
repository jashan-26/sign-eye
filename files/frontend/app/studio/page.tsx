"use client";
import { useEffect, useRef, useState } from "react";
import CameraPanel, { Frame } from "../../components/CameraPanel";
import { toFeatures } from "../../lib/features";
import { loadSamples, predict, Prediction, Sample } from "../../lib/knn";
import { Smoother } from "../../lib/smoother";
import { buildSentence } from "../../lib/sentence";
import { KNOWN } from "../../lib/vocab";
import { Entry, loadHistory, saveHistory } from "../../lib/history";

const DEMO_SEQ = ["HELLO", "MY", "NAME", "JASHAN"];

export default function Studio() {
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [demo, setDemo] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [signs, setSigns] = useState<string[]>([]);
  const [sentence, setSentence] = useState("");
  const [pred, setPred] = useState<Prediction | null>(null);
  const [m, setM] = useState({ fps: 0, ms: 0, hands: 0 });
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [confs, setConfs] = useState<number[]>([]);
  const samples = useRef<Sample[]>([]);
  const smoother = useRef(new Smoother());
  const edited = useRef(false);

  useEffect(() => { samples.current = loadSamples(); }, []);
  useEffect(() => { if (!edited.current) setSentence(buildSentence(signs, KNOWN)); }, [signs]);
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const addSign = (s: string, c: number) => {
    setSigns((p) => [...p, s]);
    setConfs((p) => [...p, c]);
    edited.current = false;
  };

  const onFrame = (f: Frame) => {
    const t0 = performance.now();
    if (!f.hands.length) {
      setInfo("No hand detected. Position your hand inside the camera frame.");
      setPred(null);
      smoother.current.feed(null, 0);
      setM({ fps: f.fps, ms: f.detectMs, hands: 0 });
      return;
    }
    if (!samples.current.length) {
      setInfo("No trained signs yet. Record some on the Train Signs page first.");
      setM({ fps: f.fps, ms: f.detectMs, hands: f.hands.length });
      return;
    }
    setInfo(f.hands.length > 1 ? "Two hands detected. Tracking primary dominant hand." : "");
    const p = predict(samples.current, toFeatures(f.hands[0]), f.hands.length);
    setPred(p);
    const stable = smoother.current.feed(p?.gesture ?? null, p?.confidence ?? 0);
    if (stable && p) addSign(stable, p.confidence);
    setM({ fps: f.fps, ms: f.detectMs + (performance.now() - t0), hands: f.hands.length });
  };

  // Demo mode
  useEffect(() => {
    if (!demo) return;
    let i = 0;
    const t = setInterval(() => { addSign(DEMO_SEQ[i % DEMO_SEQ.length], 0.95); i++; }, 1400);
    return () => clearInterval(t);
  }, [demo]);

  const clear = () => {
    setSigns([]);
    setConfs([]);
    setSentence("");
    setPred(null);
    smoother.current.reset();
    edited.current = false;
  };

  const speak = () => {
    if (!sentence || !window.speechSynthesis) {
      setErr("Speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(sentence);
    u.rate = rate;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sentence);
      setInfo("Copied to clipboard.");
    } catch {
      setErr("Could not copy automatically. Select text to copy manually.");
    }
  };

  const save = () => {
    if (!sentence) return;
    const real = confs.filter((c) => c > 0);
    const e: Entry = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      sentence,
      signs,
      confidence: real.length ? real.reduce((a, b) => a + b, 0) / real.length : 0.95,
    };
    if (saveHistory([e, ...loadHistory()])) setInfo("Saved to History.");
    else setErr("Could not save to browser storage.");
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Live Translation <span style={{ color: "var(--cyan)" }}>Studio</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          High-speed gesture recognition, live MediaPipe 3D joint tracking, real-time sentence aggregation, and neural speech.
        </p>
      </div>

      {err && <div className="msg" role="alert">{err}</div>}

      <div className="studio">
        {/* Camera Stage */}
        <div>
          <div className="vision-stage">
            <CameraPanel active={on} paused={paused} skip={2} onFrame={onFrame} onError={(e) => { setErr(e); setOn(false); }} />
            <div className="vision-hud-overlay">
              <span className="hud-corner tl" />
              <span className="hud-corner tr" />
              <span className="hud-corner bl" />
              <span className="hud-corner br" />
            </div>
          </div>

          <div className="btns" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={() => { setErr(""); setOn(!on); setPaused(false); }}>
              {on ? "⏹️ Stop camera" : "▶️ Start camera"}
            </button>
            <button className="btn" disabled={!on} onClick={() => setPaused(!paused)}>
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button className="btn" aria-pressed={demo} onClick={() => setDemo(!demo)}>
              {demo ? "⏹ Stop demo" : "⚡ Demo mode"}
            </button>
          </div>
          {demo && <p className="note">Demo mode feeds a sequence of signs into the sentence builder pipeline for testing.</p>}
        </div>

        {/* Real-time Recognition Telemetry */}
        <div className="card">
          <small className="note">Detected sign</small>
          <div className="sign" aria-live="polite">
            {pred ? pred.gesture : "–"}
          </div>

          <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((pred?.confidence ?? 0) * 100)} aria-label="Confidence">
            <i style={{ width: `${(pred?.confidence ?? 0) * 100}%` }} />
          </div>

          <div className="stats">
            <div className="stat">
              <small>Confidence</small>
              <b>{pred ? (pred.confidence * 100).toFixed(1) + "%" : "–"}</b>
            </div>
            <div className="stat">
              <small>Tracked Hands</small>
              <b>{on ? m.hands : "–"}</b>
            </div>
            <div className="stat">
              <small>3D Landmarks</small>
              <b>{on ? m.hands * 21 : "–"}</b>
            </div>
            <div className="stat">
              <small>Inference</small>
              <b>{on ? m.ms.toFixed(0) + " ms" : "–"}</b>
            </div>
            <div className="stat">
              <small>Pipeline FPS</small>
              <b>{on ? m.fps : "–"}</b>
            </div>
            <div className="stat">
              <small>Model Engine</small>
              <b style={{ color: "var(--cyan)" }}>SignEye kNN</b>
            </div>
          </div>
          {info && <p className="note" role="status" style={{ color: "var(--cyan)" }}>{info}</p>}
        </div>
      </div>

      {/* Sentence Builder & Speech Card */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Sentence Aggregation</h3>
        <div className="chips" aria-label="Detected signs" style={{ minHeight: 40, marginBottom: 12 }}>
          {signs.length ? (
            signs.map((s, i) => <span className="tok" key={i}>{s}</span>)
          ) : (
            <span className="note">Detected signs will appear here sequentially...</span>
          )}
        </div>

        <label className="note" htmlFor="sent" style={{ marginTop: 8, display: "block" }}>
          Generated sentence (fully editable)
        </label>
        <textarea
          id="sent"
          className="sent"
          value={sentence}
          onChange={(e) => { edited.current = true; setSentence(e.target.value); }}
          placeholder="Constructed sentence text..."
          rows={3}
          style={{ fontSize: "1.1rem", marginTop: 6 }}
        />

        <div className="btns" style={{ marginTop: 16 }}>
          <button className="btn primary" onClick={speak}>
            🔊 Speak Aloud
          </button>
          <button className="btn" disabled={!speaking} onClick={() => window.speechSynthesis.cancel()}>
            ⏹️ Stop
          </button>
          <button className="btn" onClick={copy}>
            📋 Copy Text
          </button>
          <button className="btn" onClick={save}>
            💾 Save to History
          </button>
          <button className="btn" onClick={clear}>
            🗑️ Clear
          </button>
          <label className="note" style={{ alignSelf: "center", marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span>Speech Speed: <b>{rate.toFixed(1)}x</b></span>
            <input type="range" min={0.5} max={1.8} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} style={{ width: 110 }} />
          </label>
        </div>
      </div>
    </div>
  );
}
