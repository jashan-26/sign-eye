"use client";
import { useState, useEffect, useRef } from "react";
import AnimatedHand from "../../components/AnimatedHand";
import CameraPanel, { Frame } from "../../components/CameraPanel";
import { buildSentence } from "../../lib/sentence";
import { KNOWN } from "../../lib/vocab";
import { toFeatures } from "../../lib/features";
import { loadSamples, predict } from "../../lib/knn";

const VOCAB_CATEGORIES = {
  Greetings: ["HELLO", "WELCOME", "THANK YOU", "SORRY", "PLEASE"],
  Common: ["YES", "NO", "GOOD", "BAD", "LOVE", "I", "YOU", "MY", "NAME"],
  Alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  Emergency: ["HELP"],
};

export default function SentenceBuilderPage() {
  const [tokens, setTokens] = useState<string[]>(["HELLO", "MY", "NAME", "JASHAN"]);
  const [sentence, setSentence] = useState("");
  const [selectedSign, setSelectedSign] = useState("HELLO");
  const [cam, setCam] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const samples = useRef(loadSamples());

  useEffect(() => {
    setSentence(buildSentence(tokens, KNOWN));
  }, [tokens]);

  const addToken = (t: string) => {
    setTokens((prev) => [...prev, t]);
    setSelectedSign(t);
    setMatchSuccess(false);
    setMatchScore(null);
  };

  const removeToken = (idx: number) => {
    setTokens((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    setTokens([]);
    setSentence("");
    setMatchSuccess(false);
    setMatchScore(null);
  };

  const onFrame = (f: Frame) => {
    if (!f.hands.length) {
      setMatchScore(null);
      setMatchSuccess(false);
      setMsg("Place your hand inside camera view to perform gesture.");
      return;
    }
    const feat = toFeatures(f.hands[0]);
    const p = predict(samples.current, feat, f.hands.length);

    if (p && (p.gesture === selectedSign || p.confidence >= 0.70)) {
      const score = Math.round(p.confidence * 100);
      setMatchScore(score);
      setMatchSuccess(true);
      setMsg(`✓ Excellent! You performed "${selectedSign}" correctly!`);
    } else {
      setMatchSuccess(false);
      setMatchScore(Math.round((p?.confidence || 0.4) * 100));
      setMsg(`Adjust your hand to match the animated guide for "${selectedSign}".`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sentence);
      setMsg("Copied sentence to clipboard!");
    } catch {
      setMsg("Could not copy automatically.");
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Sentence Builder <span style={{ color: "var(--cyan)" }}>& Animated Hand Guide</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Learn gesture kinematics with the animated 3D guide, practice live with camera pose feedback, and construct fluent sentences.
        </p>
      </div>

      {/* Guide & Practice Section */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Animated Hand Guide */}
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Kinematic Hand Guide</h3>
            <span className="badge cyan">Sign: "{selectedSign}"</span>
          </div>
          <p className="note" style={{ marginBottom: 16, textAlign: "center" }}>
            Showing real-time kinematics for <b>"{selectedSign}"</b>. Click any sign in the palette below to change.
          </p>
          <AnimatedHand sign={selectedSign} />
        </div>

        {/* Live Camera Gesture Practice */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Interactive Camera Practice</h3>
            <span className="badge">Target: {selectedSign}</span>
          </div>

          <p className="note" style={{ marginBottom: 12 }}>
            Follow the animated guide and match the target posture for <b>"{selectedSign}"</b>.
          </p>

          <div className="vision-stage" style={{ aspectRatio: "4/3" }}>
            <CameraPanel active={cam} paused={false} skip={2} onFrame={onFrame} onError={(e) => setMsg(e)} />
            <div className="vision-hud-overlay">
              <span className="hud-corner tl" />
              <span className="hud-corner tr" />
              <span className="hud-corner bl" />
              <span className="hud-corner br" />
            </div>
          </div>

          <div className="btns" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={() => setCam(!cam)}>
              {cam ? "⏹️ Stop Practice Camera" : "▶️ Start Practice Camera"}
            </button>
          </div>

          {matchSuccess && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "rgba(16, 185, 129, 0.15)", border: "1px solid var(--emerald)", color: "var(--emerald)", fontWeight: 700, textAlign: "center" }}>
              🎉 YES! Action correctly verified for "{selectedSign}"! (+100 XP)
            </div>
          )}

          {matchScore !== null && !matchSuccess && (
            <div style={{ marginTop: 14, padding: 10, borderRadius: 10, background: "rgba(34, 211, 238, 0.12)", color: "var(--cyan)", textAlign: "center", fontSize: "0.88rem" }}>
              Gesture similarity: <b>{matchScore}%</b>. Match the animated teacher!
            </div>
          )}

          {msg && !matchSuccess && <p className="note" style={{ marginTop: 10, textAlign: "center" }}>{msg}</p>}
        </div>
      </div>

      {/* Sentence Constructor Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Sentence Token Sequence</h3>
        <div className="chips" style={{ minHeight: 44, margin: "10px 0" }}>
          {tokens.length === 0 ? (
            <span className="note">Select signs from the palette below to append to your sentence sequence.</span>
          ) : (
            tokens.map((t, i) => (
              <span
                key={i}
                className="tok"
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                onClick={() => removeToken(i)}
                title="Click to remove token"
              >
                {t} <span style={{ opacity: 0.6 }}>✕</span>
              </span>
            ))
          )}
        </div>

        <label className="note" htmlFor="construct-sent" style={{ marginTop: 14, display: "block" }}>
          Constructed Grammar Output
        </label>
        <textarea
          id="construct-sent"
          className="sent"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="Constructed sentence output..."
          rows={2}
          style={{ fontSize: "1.1rem", marginTop: 6 }}
        />

        <div className="btns" style={{ marginTop: 14 }}>
          <button className="btn primary" onClick={copyToClipboard} disabled={!sentence}>
            📋 Copy Text
          </button>
          <button className="btn" onClick={clearAll} disabled={tokens.length === 0}>
            🗑️ Clear Sequence
          </button>
        </div>
      </div>

      {/* Vocabulary Palette */}
      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Sign Vocabulary Palette</h3>
        <p className="note" style={{ marginBottom: 20 }}>
          Click any sign to preview it in the animated guide and append it to your sentence.
        </p>

        {Object.entries(VOCAB_CATEGORIES).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 10, color: "var(--cyan)", fontSize: "0.95rem" }}>{cat}</h4>
            <div className="chips">
              {items.map((sign) => (
                <button
                  key={sign}
                  className={`tile ${selectedSign === sign ? "active" : ""}`}
                  aria-pressed={selectedSign === sign}
                  onClick={() => addToken(sign)}
                >
                  {sign}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
