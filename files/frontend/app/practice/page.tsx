"use client";
import { useState, useEffect, useRef } from "react";
import CameraPanel, { Frame } from "../../components/CameraPanel";
import { toFeatures } from "../../lib/features";
import { loadSamples, predict } from "../../lib/knn";

interface Challenge {
  id: string;
  sign: string;
  prompt: string;
  xp: number;
  timeLimitSec: number;
}

const CHALLENGES: Challenge[] = [
  { id: "c1", sign: "A", prompt: "Form a tight fist with thumb upright resting against the side.", xp: 50, timeLimitSec: 15 },
  { id: "c2", sign: "B", prompt: "Show open palm with 4 fingers straight up, thumb tucked across palm.", xp: 60, timeLimitSec: 15 },
  { id: "c3", sign: "C", prompt: "Curve all fingers and thumb into a smooth C shape.", xp: 70, timeLimitSec: 15 },
  { id: "c4", sign: "HELLO", prompt: "Open palm facing forward at eyebrow level with friendly wave.", xp: 100, timeLimitSec: 12 },
  { id: "c5", sign: "THANK YOU", prompt: "Touch fingers near chin or lips then extend outward forward.", xp: 120, timeLimitSec: 12 },
  { id: "c6", sign: "HELP", prompt: "Make thumbs up resting on flat palm of your other hand.", xp: 150, timeLimitSec: 10 },
  { id: "c7", sign: "LOVE", prompt: "Extend Thumb, Index, and Pinky while keeping Middle & Ring folded.", xp: 180, timeLimitSec: 10 },
];

export default function PracticePage() {
  const [idx, setIdx] = useState(0);
  const [xp, setXp] = useState(350);
  const [streak, setStreak] = useState(5);
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(15);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "fail">("idle");
  const [feedback, setFeedback] = useState("");
  const samples = useRef(loadSamples());

  const current = CHALLENGES[idx];

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (active && status === "running" && timer > 0) {
      t = setInterval(() => setTimer((p) => p - 1), 1000);
    } else if (timer === 0 && status === "running") {
      setStatus("fail");
      setFeedback(`Time expired! Re-adjust hand angle for sign "${current.sign}" and retry.`);
    }
    return () => clearInterval(t);
  }, [active, status, timer, current.sign]);

  const startChallenge = () => {
    setTimer(current.timeLimitSec);
    setStatus("running");
    setActive(true);
    setFeedback(`Show sign for "${current.sign}" in front of the camera!`);
  };

  const onFrame = (f: Frame) => {
    if (status !== "running" || !f.hands.length) return;
    const feat = toFeatures(f.hands[0]);
    const p = predict(samples.current, feat, f.hands.length);

    if (p && (p.gesture === current.sign || p.confidence >= 0.75)) {
      setStatus("success");
      setXp((prev) => prev + current.xp);
      setStreak((prev) => prev + 1);
      setFeedback(`🎉 Perfect posture! Matched "${current.sign}" with ${Math.round(p.confidence * 100)}% accuracy! (+${current.xp} XP)`);
    }
  };

  const nextChallenge = () => {
    const nextIdx = (idx + 1) % CHALLENGES.length;
    setIdx(nextIdx);
    setStatus("idle");
    setTimer(CHALLENGES[nextIdx].timeLimitSec);
    setFeedback("");
  };

  const progressPct = Math.round(((idx + 1) / CHALLENGES.length) * 100);

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Practice <span style={{ color: "var(--cyan)" }}>& Challenge Streaks</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Interactive timed posture challenges, recognition streaks, and XP progression.
        </p>
      </div>

      {/* Streak Hero Banner matching Image 2 */}
      <div className="streak-hero-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.15)", fontSize: "0.78rem", fontWeight: 700, marginBottom: 8 }}>
              🔥 5-DAY STREAK ACTIVE
            </div>
            <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: 4 }}>You started a new streak!</h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", margin: 0, maxWidth: 520 }}>
              Complete any sign challenge today to maintain your recognition momentum and unlock the Master Signer badge.
            </p>

            {/* Streak 7-day indicators */}
            <div className="streak-dots-row">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className={`streak-dot ${i < 5 ? "active" : ""}`} />
                  <span style={{ fontSize: "0.68rem", opacity: 0.8 }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px 18px", borderRadius: 14, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Cards Collected</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>33</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px 18px", borderRadius: 14, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Lessons Done</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>12</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px 18px", borderRadius: 14, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Challenges</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>41</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Challenge Interface */}
      <div className="grid-2">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="badge cyan">Challenge {idx + 1} of {CHALLENGES.length}</span>
            <span className="badge success">+{current.xp} XP</span>
          </div>

          <h2 style={{ fontSize: "2rem", marginTop: 12, marginBottom: 6 }}>
            Perform Sign: <span style={{ color: "var(--cyan)" }}>"{current.sign}"</span>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--ink-secondary)", margin: 0 }}>
            {current.prompt}
          </p>

          <div style={{ margin: "20px 0", padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>Timer Remaining</span>
              <b style={{ color: timer <= 5 ? "var(--bad)" : "var(--cyan)" }}>{timer}s</b>
            </div>
            <div className="meter">
              <i style={{ width: `${(timer / current.timeLimitSec) * 100}%`, background: timer <= 5 ? "var(--bad)" : "var(--cyan)" }} />
            </div>
          </div>

          <div className="btns">
            {status !== "running" && (
              <button className="btn primary" onClick={startChallenge}>
                {status === "success" ? "🔄 Practice Again" : "▶️ Start Challenge"}
              </button>
            )}
            {status === "success" && (
              <button className="btn cyan" onClick={nextChallenge}>
                Next Challenge ➔
              </button>
            )}
          </div>

          {feedback && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 12,
                background: status === "success" ? "rgba(16,185,129,0.15)" : status === "fail" ? "rgba(239,68,68,0.15)" : "rgba(34,211,238,0.15)",
                border: `1px solid ${status === "success" ? "var(--emerald)" : status === "fail" ? "var(--bad)" : "var(--cyan)"}`,
                color: status === "success" ? "var(--emerald)" : status === "fail" ? "var(--bad)" : "var(--cyan)",
                fontWeight: 600,
                fontSize: "0.92rem",
              }}
            >
              {feedback}
            </div>
          )}
        </div>

        {/* Live Camera Feed */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Live Recognition Stream</h3>
            <span className="badge">Total Score: {xp} XP</span>
          </div>

          <div className="vision-stage" style={{ aspectRatio: "4/3" }}>
            <CameraPanel active={active} paused={false} skip={2} onFrame={onFrame} onError={(e) => setFeedback(e)} />
            <div className="vision-hud-overlay">
              <span className="hud-corner tl" />
              <span className="hud-corner tr" />
              <span className="hud-corner bl" />
              <span className="hud-corner br" />
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.84rem", color: "var(--ink-secondary)" }}>
            <span>Level {Math.floor(xp / 200) + 1} Practitioner</span>
            <span>Course Progress: {progressPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
