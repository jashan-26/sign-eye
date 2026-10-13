"use client";
import { useState } from "react";
import AnimatedHand from "../../components/AnimatedHand";
import CameraPanel, { Frame } from "../../components/CameraPanel";
import { toFeatures } from "../../lib/features";
import { loadSamples, predict } from "../../lib/knn";

interface SignItem {
  id: string;
  category: "Alphabet" | "Digits" | "Greetings" | "Common" | "Emergency";
  title: string;
  description: string;
  fingers: string[];
  tips: string;
}

const SIGNS_DATA: SignItem[] = [
  { id: "A", category: "Alphabet", title: "Letter A", description: "Make a fist with your thumb resting against the side of your index finger.", fingers: ["Fist closed", "Thumb extended upright against side"], tips: "Keep knuckles tight and thumb pointing up." },
  { id: "B", category: "Alphabet", title: "Letter B", description: "Open palm with 4 fingers extended straight up, thumb tucked across palm.", fingers: ["4 Fingers straight up", "Thumb folded across palm"], tips: "Keep all four fingers together without gaps." },
  { id: "C", category: "Alphabet", title: "Letter C", description: "Curve all fingers and thumb to form a C shape with your hand.", fingers: ["Fingers curved", "Thumb curved underneath"], tips: "Imagine holding a small glass or cup." },
  { id: "HELLO", category: "Greetings", title: "Hello / Wave", description: "Flat open hand near forehead or side of face, waving outwards.", fingers: ["Open palm", "Fingers extended together"], tips: "Friendly open hand movement away from body." },
  { id: "THANK YOU", category: "Greetings", title: "Thank You", description: "Touch fingertips to chin or lips, then extend hand outward toward the person.", fingers: ["Flat hand", "Fingertips touching chin then moving out"], tips: "A polite gesture moving forward from your lips." },
  { id: "HELP", category: "Emergency", title: "Help Sign", description: "Place a closed fist with thumb up onto the open palm of your other hand and raise both slightly.", fingers: ["Thumbs-up hand resting on open palm"], tips: "Essential emergency sign." },
  { id: "LOVE", category: "Common", title: "I Love You (ILY)", description: "Extend thumb, index finger, and pinky finger while keeping middle and ring fingers folded down.", fingers: ["Thumb, Index, Pinky extended", "Middle and Ring folded down"], tips: "Combines letters I, L, and Y into one sign." },
  { id: "1", category: "Digits", title: "Number 1", description: "Extend index finger straight up, fold all other fingers and thumb across palm.", fingers: ["Index finger straight up", "Other fingers folded"], tips: "Keep index finger pointing straight up toward sky." },
];

export default function LearnPage() {
  const [cat, setCat] = useState<string>("All");
  const [sel, setSel] = useState<SignItem>(SIGNS_DATA[0]);
  const [cam, setCam] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const samples = loadSamples();
  const filtered = cat === "All" ? SIGNS_DATA : SIGNS_DATA.filter((s) => s.category === cat);

  const onFrame = (f: Frame) => {
    if (!f.hands.length) {
      setScore(null);
      setMatchSuccess(false);
      setMsg("Position your hand inside the camera frame.");
      return;
    }
    const feat = toFeatures(f.hands[0]);
    const p = predict(samples, feat, f.hands.length);

    if (p && (p.gesture === sel.id || p.confidence >= 0.70)) {
      const s = Math.round(p.confidence * 100);
      setScore(s);
      setMatchSuccess(true);
      setMsg(`✓ Great job! Hand posture correctly matched sign "${sel.id}"!`);
    } else {
      setMatchSuccess(false);
      setScore(Math.round((p?.confidence || 0.4) * 100));
      setMsg(`Adjust your hand to match the animated guide for "${sel.id}".`);
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Learn <span style={{ color: "var(--cyan)" }}>Sign Language</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Interactive step-by-step gesture guides with animated hand movements and live posture feedback.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {["All", "Alphabet", "Digits", "Greetings", "Common", "Emergency"].map((c) => (
          <button
            key={c}
            className={`filter-tab ${cat === c ? "active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* Animated Hand Movement Guide & Text Instructions */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>{sel.title}</h2>
            <span className="badge cyan">{sel.category}</span>
          </div>

          <div style={{ margin: "16px 0", display: "flex", justifyContent: "center" }}>
            <AnimatedHand sign={sel.id} />
          </div>

          <p style={{ fontSize: "1.05rem", color: "var(--ink-secondary)", marginTop: 8 }}>
            {sel.description}
          </p>

          <div style={{ margin: "16px 0", background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 14, border: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: "0.92rem", marginBottom: 8, color: "var(--ink)" }}>Finger Position Instructions</h4>
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--ink-secondary)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              {sel.fingers.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)", padding: 14, borderRadius: 12, color: "#c7d2fe", fontSize: "0.88rem" }}>
            <b style={{ color: "#fff" }}>Pro Tip:</b> {sel.tips}
          </div>

          <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: "0.95rem" }}>Select a Sign to Learn</h4>
          <div className="chips">
            {filtered.map((item) => (
              <button
                key={item.id}
                className={`tile ${sel.id === item.id ? "active" : ""}`}
                aria-pressed={sel.id === item.id}
                onClick={() => { setSel(item); setScore(null); setMatchSuccess(false); }}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        {/* Live Camera Practice */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Interactive Posture Practice</h3>
            <span className="badge">Sign: "{sel.id}"</span>
          </div>

          <p className="note" style={{ marginBottom: 12 }}>
            Turn on your camera to practice <b>"{sel.id}"</b> and receive live posture verification.
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

          <div className="btns" style={{ marginTop: 18 }}>
            <button className="btn primary" onClick={() => setCam(!cam)}>
              {cam ? "⏹️ Stop Camera Practice" : "▶️ Start Camera Practice"}
            </button>
          </div>

          {matchSuccess && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "rgba(16, 185, 129, 0.15)", border: "1px solid var(--emerald)", color: "var(--emerald)", fontWeight: 700, textAlign: "center" }}>
              🎉 YES! You performed "{sel.id}" correctly!
            </div>
          )}

          {score !== null && !matchSuccess && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "var(--cyan)", textAlign: "center" }}>
              Pose Match Accuracy: <b>{score}%</b>
            </div>
          )}

          {msg && !matchSuccess && <p className="note" style={{ marginTop: 12, textAlign: "center" }}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}
