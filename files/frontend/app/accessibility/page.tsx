"use client";
import { useState, useEffect } from "react";

export default function AccessibilityPage() {
  const [announce, setAnnounce] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    setHighContrast(localStorage.getItem("se-contrast") === "1");
    setLargeText(localStorage.getItem("se-large") === "1");
  }, []);

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("se-contrast", next ? "1" : "0");
    if (next) document.documentElement.setAttribute("data-contrast", "high");
    else document.documentElement.removeAttribute("data-contrast");
  };

  const toggleLarge = () => {
    const next = !largeText;
    setLargeText(next);
    localStorage.setItem("se-large", next ? "1" : "0");
    if (next) document.documentElement.setAttribute("data-text", "large");
    else document.documentElement.removeAttribute("data-text");
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", marginBottom: 4 }}>
          Accessibility Center <span style={{ color: "var(--cyan)" }}>& Assistive Controls</span>
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          Customize display contrast, screen-reader spoken announcements, typography scaling, and keyboard shortcuts.
        </p>
      </div>

      <div className="grid-2">
        {/* Live Display & Speech Settings */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Display & Spoken Feedback</h3>

          <div style={{ marginBottom: 20, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid var(--line)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={announce}
                onChange={(e) => setAnnounce(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--cyan)" }}
              />
              Automatic Screen-Reader Spoken Announcements
            </label>
            <p className="note" style={{ marginTop: 6, marginLeft: 28 }}>
              Automatically speaks newly recognized sign gestures aloud as they are detected.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="note">Spoken Announcement Speed</span>
              <b style={{ color: "var(--cyan)" }}>{speechRate.toFixed(1)}x</b>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.8}
              step={0.1}
              value={speechRate}
              onChange={(e) => setSpeechRate(+e.target.value)}
            />
          </div>

          <div className="btns" style={{ marginTop: 24 }}>
            <button className={`btn ${highContrast ? "primary" : ""}`} onClick={toggleContrast}>
              {highContrast ? "✓ High Contrast Active" : "Toggle High Contrast"}
            </button>
            <button className={`btn ${largeText ? "primary" : ""}`} onClick={toggleLarge}>
              {largeText ? "✓ Large Text Active" : "Toggle Large Text (+20%)"}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="card">
          <h3 style={{ marginBottom: 14 }}>Keyboard Navigation Shortcuts</h3>
          <p className="note" style={{ marginBottom: 16 }}>
            SignEye is 100% operable via keyboard controls without requiring mouse input.
          </p>

          <table className="dark-table">
            <thead>
              <tr>
                <th>Shortcut Key</th>
                <th>Action Triggered</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd className="top-kbd">Tab</kbd> / <kbd className="top-kbd">Shift+Tab</kbd></td>
                <td>Traverse interactive controls</td>
              </tr>
              <tr>
                <td><kbd className="top-kbd">Space</kbd> / <kbd className="top-kbd">Enter</kbd></td>
                <td>Activate selected button or sign</td>
              </tr>
              <tr>
                <td><kbd className="top-kbd">Alt + S</kbd></td>
                <td>Toggle webcam recognition on/off in Studio</td>
              </tr>
              <tr>
                <td><kbd className="top-kbd">Alt + V</kbd></td>
                <td>Speak generated sentence aloud</td>
              </tr>
              <tr>
                <td><kbd className="top-kbd">Esc</kbd></td>
                <td>Clear sequence selection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
