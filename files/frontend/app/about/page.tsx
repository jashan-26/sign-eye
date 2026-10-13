export default function Page() {
  const PIPELINE = [
    { title: "Camera", desc: "OpenCV / WebRTC" },
    { title: "Landmarks", desc: "MediaPipe 21 3D Joints" },
    { title: "Features", desc: "Origin Normalization" },
    { title: "Classifier", desc: "kNN & Neural Net" },
    { title: "Smoothing", desc: "Temporal Debounce" },
    { title: "Sentence", desc: "Grammar Aggregator" },
    { title: "Speech", desc: "Web Speech TTS" },
  ];

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          About <span style={{ color: "var(--cyan)" }}>SignEye</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Breaking communication barriers with high-speed AI gesture translation running directly in your browser.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <h3 style={{ marginBottom: 8 }}>Mission & Purpose</h3>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            SignEye enables seamless two-way communication between Deaf, hard-of-hearing, and hearing individuals using standard commodity webcams and accessible browser technology, without requiring specialized hardware gloves or proprietary sensors.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 8 }}>Privacy by Design</h3>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            Camera frames are analyzed on-device in real-time. Video footage is never transmitted to external cloud servers or stored without explicit user recording actions.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Architecture Pipeline</h3>
        <p className="note" style={{ marginBottom: 20 }}>
          Modular decoupled pipeline spanning client-side vision, machine learning inference, and rule-based grammar smoothing:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          {PIPELINE.map((stage, i) => (
            <div
              key={stage.title}
              style={{
                padding: "16px 12px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--line)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--cyan)", fontWeight: 700, marginBottom: 4 }}>
                0{i + 1}
              </div>
              <b style={{ color: "var(--ink)", display: "block", fontSize: "0.95rem" }}>{stage.title}</b>
              <small style={{ color: "var(--ink-soft)", fontSize: "0.78rem" }}>{stage.desc}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
