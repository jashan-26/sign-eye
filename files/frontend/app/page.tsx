"use client";
import Link from "next/link";
import { useState } from "react";
import NeuralVisualizer from "../components/NeuralVisualizer";

const RECENT_RECORDS = [
  { sign: "HELLO", category: "Greetings", confidence: "99.4%", status: "Verified", statusColor: "success" },
  { sign: "LETTER A", category: "Alphabet", confidence: "98.1%", status: "Mastered", statusColor: "cyan" },
  { sign: "THANK YOU", category: "Greetings", confidence: "96.8%", status: "Verified", statusColor: "success" },
  { sign: "HELP", category: "Emergency", confidence: "99.7%", status: "High Conf", statusColor: "purple" },
  { sign: "LOVE (ILY)", category: "Common", confidence: "97.2%", status: "Mastered", statusColor: "cyan" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"all" | "high" | "verified">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHowModal, setShowHowModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState(
    "Recommended: Prioritize finger-spelling fluency for letters B, C and two-handed coordination for 'HELP'. Your current recognition stability across A–Z is 96.4%."
  );

  const filteredRecords = RECENT_RECORDS.filter((r) => {
    const matchesSearch = r.sign.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "high") return parseFloat(r.confidence) >= 98;
    if (activeTab === "verified") return r.status === "Verified";
    return true;
  });

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiAnswer(
      `Analyzing "${aiQuestion}": SignEye detects optimal hand orientation at 45° angle. Keep your wrist centered in frame for maximum 3D joint landmark precision.`
    );
    setAiQuestion("");
  };

  return (
    <div className="page">
      {/* Executive Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
            Neural Intelligence <span style={{ color: "var(--cyan)" }}>Dashboard</span>
          </h1>
          <p className="subtitle" style={{ margin: 0 }}>
            Real-time sign language recognition, 21 3D joint landmark telemetry, and learning streaks.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/studio" className="btn primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Launch Studio
          </Link>
          <Link href="/vision" className="btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Vision Coach
          </Link>
        </div>
      </div>

      {/* Main Dashboard Grid matching Image 1 */}
      <div className="dash-grid">
        {/* Card 1: Master Metric & 3D Neural Engine (Image 1 top left) */}
        <div className="dash-card col-span-4 glow-cyan">
          <div className="dash-card-header">
            <div>
              <span className="dash-card-sub">Total Analyzed Gestures</span>
              <div className="metric-highlight" style={{ marginTop: 6 }}>
                18,540
                <span className="metric-delta positive">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                  +12.4%
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--ink-secondary)", marginTop: 4 }}>
                Daily Avg: 1,240 signs · 98.4% Accuracy
              </div>
            </div>

            <button
              onClick={() => setShowHowModal(true)}
              className="chip"
              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
              title="Learn how SignEye Neural Engine operates"
            >
              ⓘ How it works?
            </button>
          </div>

          {/* Interactive 3D Crystal / Polyhedral Neural Visualizer */}
          <NeuralVisualizer />
        </div>

        {/* Card 2: Gesture & Model Metrics (Image 1 top middle) */}
        <div className="dash-card col-span-4">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Gesture & Model Telemetry
              </div>
              <span className="dash-card-sub">AI-powered 21 3D joint landmark confidence</span>
            </div>
          </div>

          <div className="metric-highlight" style={{ fontSize: "2.4rem", color: "var(--emerald)", margin: "8px 0" }}>
            99.2%
            <span style={{ fontSize: "0.95rem", color: "var(--ink-secondary)", fontWeight: 500 }}>Coverage Balance</span>
          </div>
          <p style={{ fontSize: "0.84rem", color: "var(--ink-secondary)", margin: "0 0 16px" }}>
            Real-time temporal voting filter with sub-2ms inference latency.
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 14 }}>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)" }}>265</div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>Signs Mastered</div>
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--cyan)" }}>8.4k</div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>Samples Trained</div>
            </div>

            {/* Community Avatar Stack */}
            <div className="avatar-stack">
              <div className="avatar-stack-item" style={{ background: "#4f46e5" }}>A</div>
              <div className="avatar-stack-item" style={{ background: "#059669" }}>M</div>
              <div className="avatar-stack-item" style={{ background: "#0891b2" }}>S</div>
              <div className="avatar-stack-item" style={{ background: "#d97706" }}>+4</div>
            </div>
          </div>

          {/* Dual Circular Gauge Meters */}
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                <span style={{ color: "var(--ink-secondary)" }}>Stability</span>
                <span style={{ color: "var(--emerald)", fontWeight: 700 }}>98%</span>
              </div>
              <div className="meter"><i style={{ width: "98%", background: "var(--emerald)" }} /></div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                <span style={{ color: "var(--ink-secondary)" }}>Vocabulary</span>
                <span style={{ color: "var(--cyan)", fontWeight: 700 }}>84%</span>
              </div>
              <div className="meter"><i style={{ width: "84%", background: "var(--cyan)" }} /></div>
            </div>
          </div>
        </div>

        {/* Card 3: Smart Gesture Analytics & Ring Chart (Image 1 top right) */}
        <div className="dash-card col-span-4 glow-violet">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                Smart Gesture Analytics
              </div>
              <span className="dash-card-sub">Category distribution & practice growth</span>
            </div>
            <span className="badge">Weekly ▾</span>
          </div>

          {/* Concentric Ring Chart */}
          <div className="ring-chart-wrap">
            <div className="ring-svg-container">
              <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                {/* Track 1: Alphabet 40% */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 * (1 - 0.40)} strokeLinecap="round" />

                {/* Track 2: Phrases 35% */}
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="188" strokeDashoffset={188 * (1 - 0.35)} strokeLinecap="round" />

                {/* Track 3: Emergency & Digits 25% */}
                <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="18" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="113" strokeDashoffset={113 * (1 - 0.25)} strokeLinecap="round" />
              </svg>
            </div>

            <div className="ring-legend">
              <div className="ring-legend-item">
                <span className="ring-legend-label">
                  <span className="ring-dot" style={{ background: "#22d3ee" }} />
                  ASL Alphabet
                </span>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>40%</span>
              </div>
              <div className="ring-legend-item">
                <span className="ring-legend-label">
                  <span className="ring-dot" style={{ background: "#6366f1" }} />
                  Daily Phrases
                </span>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>35%</span>
              </div>
              <div className="ring-legend-item">
                <span className="ring-legend-label">
                  <span className="ring-dot" style={{ background: "#10b981" }} />
                  Emergency & Digits
                </span>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>25%</span>
              </div>
            </div>
          </div>

          {/* Glowing Wave Chart at Bottom */}
          <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 6 }}>
              <span style={{ color: "var(--ink-secondary)" }}>Learning Trajectory</span>
              <span style={{ color: "var(--emerald)", fontWeight: 700 }}>+6.2% growth</span>
            </div>
            <svg viewBox="0 0 300 40" style={{ width: "100%", height: "36px", overflow: "visible" }}>
              <path
                d="M 0 30 Q 50 10 100 24 T 200 8 T 300 18"
                fill="none"
                stroke="url(#waveGrad1)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 35 Q 60 22 120 30 T 220 18 T 300 24"
                fill="none"
                stroke="url(#waveGrad2)"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <defs>
                <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 4: Learning Progress & Daily Goals (Image 1 bottom left) */}
        <div className="dash-card col-span-4">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Learning Goals & Limits
              </div>
              <span className="dash-card-sub">Daily target tracker · 2 days into cycle</span>
            </div>
            <span className="badge success">+8%</span>
          </div>

          <div className="metric-highlight" style={{ fontSize: "2rem" }}>
            42 <span style={{ fontSize: "1.1rem", color: "var(--ink-secondary)", fontWeight: 500 }}>/ 50 Signs</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="segmented-bar">
            <div className="seg-item" style={{ width: "40%", background: "#10b981" }} title="Alphabet (40%)" />
            <div className="seg-item" style={{ width: "35%", background: "#22d3ee" }} title="Phrases (35%)" />
            <div className="seg-item" style={{ width: "15%", background: "#fbbf24" }} title="Numbers (15%)" />
            <div className="seg-item" style={{ width: "10%", background: "rgba(255,255,255,0.15)" }} title="Remaining" />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", color: "var(--ink-secondary)", marginTop: 6 }}>
            <span>🟩 Alphabet (40%)</span>
            <span>🟦 Phrases (35%)</span>
            <span>🟨 Numbers (15%)</span>
          </div>

          <div style={{ marginTop: 20, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b style={{ color: "var(--ink)", fontSize: "0.9rem" }}>Current Streak: 5 Days 🔥</b>
                <div style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>8 signs needed to reach today's gold milestone</div>
              </div>
              <Link href="/practice" className="btn" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                Practice
              </Link>
            </div>
          </div>
        </div>

        {/* Card 5: Recent Gesture Records & Telemetry Table (Image 1 bottom middle) */}
        <div className="dash-card col-span-4">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Recent Gesture Records
              </div>
              <span className="dash-card-sub">Real-time telemetry and validation log</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="filter-tabs">
            <button className={`filter-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
              All Records
            </button>
            <button className={`filter-tab ${activeTab === "high" ? "active" : ""}`} onClick={() => setActiveTab("high")}>
              High Confidence
            </button>
            <button className={`filter-tab ${activeTab === "verified" ? "active" : ""}`} onClick={() => setActiveTab("verified")}>
              Verified
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="dark-table">
              <thead>
                <tr>
                  <th>Sign</th>
                  <th>Category</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "var(--ink)" }}>{r.sign}</td>
                    <td style={{ color: "var(--ink-secondary)" }}>{r.category}</td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)", fontWeight: 600 }}>{r.confidence}</td>
                    <td>
                      <span className={`badge ${r.statusColor}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 6: AI Assistant Quick Insights (Image 1 bottom right) */}
        <div className="dash-card col-span-4">
          <div className="ai-assistant-card">
            <div>
              <div className="dash-card-header" style={{ marginBottom: 12 }}>
                <div className="dash-card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  AI Assistant
                </div>
                <span className="status ready" style={{ padding: "2px 8px", fontSize: "0.7rem" }}>
                  <i /> Online
                </span>
              </div>

              {/* Chat Bubble matching Image 1 */}
              <div className="ai-bubble">
                <span style={{ fontSize: "0.75rem", color: "var(--cyan)", fontWeight: 700, display: "block", marginBottom: 4 }}>
                  RECOMMENDED FOCUS
                </span>
                {aiAnswer}
              </div>
            </div>

            {/* Prompt input field */}
            <form onSubmit={handleAskAi} className="ai-prompt-input-row" style={{ marginTop: 12 }}>
              <input
                type="text"
                placeholder="Ask AI Coach a question..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
              />
              <button type="submit" className="ai-send-btn" title="Send question">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Image 2 Four Core Platform Hubs Section */}
      <section className="hubs-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: "1.7rem", marginBottom: 4 }}>Core Platform Modules</h2>
            <p className="note">Explore live translation, vision landmark inspection, interactive lessons, and speech output.</p>
          </div>
        </div>

        <div className="hubs-grid">
          {/* Hub 1: Vision Coach */}
          <Link href="/vision" className="hub-card glow-cyan">
            <div className="hub-card-preview" style={{ background: "#05070d" }}>
              <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Visual landmark skeleton wireframe preview */}
                <svg width="220" height="180" viewBox="0 0 220 180" fill="none">
                  <path d="M110 160 L110 120 L75 95 L60 65 L50 45" stroke="#22d3ee" strokeWidth="2" />
                  <path d="M110 120 L95 80 L88 50 L82 25" stroke="#6366f1" strokeWidth="2" />
                  <path d="M110 120 L115 75 L118 45 L120 20" stroke="#6366f1" strokeWidth="2" />
                  <path d="M110 120 L135 80 L142 52 L148 28" stroke="#6366f1" strokeWidth="2" />
                  <path d="M110 120 L155 95 L165 72 L172 52" stroke="#22d3ee" strokeWidth="2" />
                  <circle cx="110" cy="160" r="6" fill="#ef4444" />
                  <circle cx="50" cy="45" r="4.5" fill="#10b981" />
                  <circle cx="82" cy="25" r="4.5" fill="#10b981" />
                  <circle cx="120" cy="20" r="4.5" fill="#10b981" />
                  <circle cx="148" cy="28" r="4.5" fill="#10b981" />
                  <circle cx="172" cy="52" r="4.5" fill="#10b981" />
                  <circle cx="110" cy="120" r="5" fill="#22d3ee" />
                </svg>
                <div style={{ position: "absolute", top: 12, right: 14 }}>
                  <span className="badge cyan">Live 21 3D Joints</span>
                </div>
              </div>
            </div>
            <div className="hub-card-body">
              <span className="hub-card-title">Vision Coach</span>
              <p className="hub-card-desc">
                Live camera, gesture feedback, landmark joint angle analysis, and recognition confidence.
              </p>
            </div>
          </Link>

          {/* Hub 2: Translation Studio */}
          <Link href="/studio" className="hub-card glow-violet">
            <div className="hub-card-preview" style={{ background: "linear-gradient(135deg, #090e1a, #11182c)" }}>
              <div style={{ textAlign: "center", padding: 20 }}>
                <span className="badge purple" style={{ marginBottom: 12 }}>Neural Studio</span>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "var(--cyan)", textShadow: "0 0 20px rgba(34, 211, 238, 0.4)" }}>
                  "HELLO WORLD"
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
                  <span className="tok">HELLO</span>
                  <span className="tok">WORLD</span>
                  <span className="badge success">99.4% Match</span>
                </div>
              </div>
            </div>
            <div className="hub-card-body">
              <span className="hub-card-title">Translation Studio</span>
              <p className="hub-card-desc">
                Real-time gesture recognition with automatic sentence construction, speech synthesis, and copy tools.
              </p>
            </div>
          </Link>

          {/* Hub 3: Learn & Practice */}
          <Link href="/learn" className="hub-card">
            <div className="hub-card-preview" style={{ background: "linear-gradient(135deg, #1e1035, #3b0764)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, padding: 24, width: "100%", justifyContent: "center" }}>
                <div style={{ width: 70, height: 70, borderRadius: "50%", border: "4px solid #8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, color: "#fff", boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}>
                  27%
                </div>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Alphabet & Sounds</div>
                  <div style={{ fontSize: "0.8rem", color: "#c4b5fd" }}>33 Cards · 12 Lessons · 5-Day Streak 🔥</div>
                </div>
              </div>
            </div>
            <div className="hub-card-body">
              <span className="hub-card-title">Learn & Practice</span>
              <p className="hub-card-desc">
                Interactive sign language lessons, timed challenges, animated hand guide, and XP streaks.
              </p>
            </div>
          </Link>

          {/* Hub 4: Communication & Voice */}
          <Link href="/voice" className="hub-card">
            <div className="hub-card-preview" style={{ background: "#060913" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <span className="badge">BEFORE & AFTER AUDIO</span>
                {/* Audio wave animation */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, height: 40 }}>
                  {[12, 24, 38, 18, 32, 40, 26, 16, 34, 28, 14].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        width: 4,
                        height: h,
                        borderRadius: 4,
                        background: i % 2 === 0 ? "var(--cyan)" : "var(--indigo)",
                        boxShadow: `0 0 8px ${i % 2 === 0 ? "var(--cyan)" : "var(--indigo)"}`,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--cyan)" }}>Text-to-Speech Engine Active</span>
              </div>
            </div>
            <div className="hub-card-body">
              <span className="hub-card-title">Communication & Speech</span>
              <p className="hub-card-desc">
                Sign-to-text, customizable speech pitch, playback rate, and reverse text-to-speech learning.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* "How it Works" Modal */}
      {showHowModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(10px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowHowModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 540, width: "100%", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3>How SignEye Works</h3>
              <button className="chip" onClick={() => setShowHowModal(false)}>✕ Close</button>
            </div>
            <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              SignEye translates sign language through a 5-stage real-time AI pipeline:
            </p>
            <ul style={{ paddingLeft: 20, color: "var(--ink)", fontSize: "0.9rem", lineHeight: 1.7, margin: "16px 0" }}>
              <li><b>1. Frame Capture:</b> High-speed client-side webcam frame capture via WebRTC.</li>
              <li><b>2. 3D Landmark Extraction:</b> Google MediaPipe extracts 21 3D coordinate keypoints per hand.</li>
              <li><b>3. Normalization:</b> Coordinates are scaled and normalized relative to wrist origin and palm span.</li>
              <li><b>4. kNN & Neural Classification:</b> Evaluates pose similarity against your trained vocabulary samples.</li>
              <li><b>5. Temporal Smoothing:</b> Multi-frame debounce prevents jitter before emitting recognized text & audio.</li>
            </ul>
            <div className="btns" style={{ justifyContent: "flex-end" }}>
              <button className="btn primary" onClick={() => setShowHowModal(false)}>Got It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
