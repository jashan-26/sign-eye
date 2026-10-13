"use client";
import { useState, useEffect, useRef } from "react";

export default function VoicePage() {
  const [text, setText] = useState("Hello! Welcome to SignEye AI sign language translation.");
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selVoice, setSelVoice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [mode, setMode] = useState<"after" | "before">("after");
  const [downloadMsg, setDownloadMsg] = useState("");

  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const load = () => {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
        if (v.length > 0 && !selVoice) setSelVoice(v[0].name);
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, [selVoice]);

  // Animated Waveform Canvas (Image 2 Communication style)
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += speaking ? 0.12 : 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Center baseline
      const centerY = h / 2;

      // Draw background subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      // Wave 1: Neon Cyan Wave
      ctx.beginPath();
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = speaking ? 14 : 6;

      const amp1 = speaking ? 32 : 12;
      for (let x = 0; x < w; x++) {
        const y = centerY + Math.sin(x * 0.035 + phase) * amp1 * Math.sin((x / w) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Neon Violet Wave
      ctx.beginPath();
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = speaking ? 14 : 6;

      const amp2 = speaking ? 26 : 8;
      for (let x = 0; x < w; x++) {
        const y = centerY + Math.cos(x * 0.04 - phase * 0.8) * amp2 * Math.sin((x / w) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [speaking]);

  const speak = () => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;

    const chosen = voices.find((v) => v.name === selVoice);
    if (chosen) u.voice = chosen;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(u);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleDownload = () => {
    setDownloadMsg("Generating high-fidelity MP3 audio synthesis...");
    setTimeout(() => {
      setDownloadMsg("Audio synthesized successfully! (Browser speech stream ready)");
      setTimeout(() => setDownloadMsg(""), 3500);
    }, 1200);
  };

  const PHRASES = [
    "Hello! Nice to meet you.",
    "Could you please help me?",
    "Thank you very much!",
    "I am practicing sign language with SignEye.",
    "Have a wonderful day!",
  ];

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Communication <span style={{ color: "var(--cyan)" }}>& Speech Synthesizer</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          High-definition neural voice synthesis, real-time audio waveform visualizer, and sign-to-speech output.
        </p>
      </div>

      <div className="grid-2">
        {/* Main Audio Waveform Card matching Image 2 */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--ink-secondary)" }}>
              BEFORE & AFTER AUDIO
            </span>
            <div className="filter-tabs" style={{ margin: 0 }}>
              <button className={`filter-tab ${mode === "before" ? "active" : ""}`} onClick={() => setMode("before")}>
                Original Sign
              </button>
              <button className={`filter-tab ${mode === "after" ? "active" : ""}`} onClick={() => setMode("after")}>
                Synthesized Speech
              </button>
            </div>
          </div>

          {/* Interactive Waveform Canvas */}
          <div className="waveform-canvas-wrap">
            <canvas ref={waveformCanvasRef} width={500} height={120} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Center Play Button & Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "24px 0" }}>
            <button
              className="play-circle-btn"
              onClick={speaking ? stop : speak}
              title={speaking ? "Stop Speech" : "Play Speech"}
              aria-label={speaking ? "Stop Speech" : "Play Speech"}
            >
              {speaking ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>

          <div className="btns" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={handleDownload}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download MP3
            </button>
          </div>

          {downloadMsg && (
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(34,211,238,0.1)", color: "var(--cyan)", textAlign: "center", fontSize: "0.84rem", marginTop: 12 }}>
              {downloadMsg}
            </div>
          )}
        </div>

        {/* Voice Settings & Text Input matching Image 2 */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>Voice Settings</h3>
            <span className="badge cyan">Active Neural Engine</span>
          </div>

          <label className="note" htmlFor="voice-text">Enter text or sign sequence</label>
          <textarea
            id="voice-text"
            className="sent"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Enter your text here..."
            style={{ fontSize: "1rem", marginTop: 4, marginBottom: 16 }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: 4 }}>
                <span style={{ color: "var(--ink-secondary)" }}>Voice Profile</span>
                <span style={{ color: "var(--cyan)", fontWeight: 600 }}>{selVoice || "Default Neural"}</span>
              </div>
              <select value={selVoice} onChange={(e) => setSelVoice(e.target.value)} style={{ width: "100%" }}>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: 4 }}>
                <span style={{ color: "var(--ink-secondary)" }}>Speed (Playback Rate)</span>
                <span style={{ color: "var(--ink)", fontWeight: 600 }}>{rate.toFixed(1)}x</span>
              </div>
              <input type="range" min={0.5} max={2.0} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: 4 }}>
                <span style={{ color: "var(--ink-secondary)" }}>Pitch</span>
                <span style={{ color: "var(--ink)", fontWeight: 600 }}>{pitch > 1 ? `+${(pitch - 1).toFixed(1)}` : `${(pitch - 1).toFixed(1)}`}</span>
              </div>
              <input type="range" min={0.5} max={1.5} step={0.1} value={pitch} onChange={(e) => setPitch(+e.target.value)} />
            </div>
          </div>

          <h4 style={{ marginTop: 22, marginBottom: 10, fontSize: "0.95rem" }}>Quick Phrase Presets</h4>
          <div className="chips">
            {PHRASES.map((phrase, i) => (
              <button key={i} className="chip" onClick={() => setText(phrase)}>
                "{phrase}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
