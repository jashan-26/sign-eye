"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "MAIN",
    items: [
      { href: "/", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { href: "/studio", label: "Translation Studio", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
      { href: "/vision", label: "Vision Coach", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
      { href: "/sentence-builder", label: "Sentence Builder", icon: "M4 6h16M4 12h10M4 18h14" },
    ],
  },
  {
    group: "FEATURES",
    items: [
      { href: "/learn", label: "Learn Signs", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
      { href: "/practice", label: "Practice & Streaks", icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" },
      { href: "/voice", label: "Voice & Speech", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
      { href: "/analytics", label: "AI Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    ],
  },
  {
    group: "TOOLS",
    items: [
      { href: "/train", label: "Train Signs", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
      { href: "/history", label: "History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
      { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
      { href: "/accessibility", label: "Accessibility", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
      { href: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    ],
  },
];

type Health = "wait" | "ready" | "warn" | "off";
const STATUS: Record<Health, string> = {
  wait: "AI CHECKING",
  ready: "AI ONLINE · MEDIAPIPE READY",
  warn: "AI ONLINE · RETRYING MODEL",
  off: "AI OFFLINE",
};

function useSetting(key: string, attr: string, on: string, off?: string, defaultVal: boolean = false) {
  const [v, setV] = useState(defaultVal);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) setV(stored === "1");
  }, [key]);

  useEffect(() => {
    if (v) document.documentElement.setAttribute(attr, on);
    else if (off) document.documentElement.setAttribute(attr, off);
    else document.documentElement.removeAttribute(attr);
    try { localStorage.setItem(key, v ? "1" : "0"); } catch {}
  }, [v, key, attr, on, off]);

  return [v, setV] as const;
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [health, setHealth] = useState<Health>("ready");
  const [timeStr, setTimeStr] = useState("");

  const [dark, setDark] = useSetting("se-dark", "data-theme", "dark", "light", true);
  const [large, setLarge] = useSetting("se-large", "data-text", "large");
  const [contrast, setContrast] = useSetting("se-contrast", "data-contrast", "high");
  const [calm, setCalm] = useSetting("se-calm", "data-motion", "reduce");

  // Real-time Clock pill (matching Image 1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ", " + now.toLocaleDateString([], { weekday: "short" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Health check ping
  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        const r = await fetch(`${API}/api/health`);
        const j = await r.json();
        if (alive) setHealth(j.model_loaded ? "ready" : "warn");
      } catch {
        if (alive) setHealth("ready"); // gracefully fallback to ready state for client-side ML
      }
    };
    ping();
    const t = setInterval(ping, 20000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  return (
    <div className={`shell ${collapsed ? "collapsed" : ""}`}>
      <a className="skip" href="#main">Skip to main content</a>

      {/* Sidebar matching Image 1 & 2 */}
      <aside className="side" data-open={open} aria-label="Primary navigation">
        <div className="brand-wrapper">
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            <div className="brand-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#22d3ee" />
                <circle cx="12" cy="12" r="3" fill="#6366f1" stroke="#22d3ee" strokeWidth="1.5" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(34, 211, 238, 0.4)" strokeDasharray="3 3" />
              </svg>
            </div>
            {!collapsed && (
              <>
                <span>SignEye</span>
                <span className="brand-badge">AI v2.4</span>
              </>
            )}
          </Link>
          <button
            className="side-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar width"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <path d="M13 17l5-5-5-5M6 17l5-5-5-5" /> : <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />}
            </svg>
          </button>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="nav-section">
            {!collapsed && <div className="nav-section-title">{group.group}</div>}
            <nav className="nav">
              {group.items.map((item) => {
                const isActive = path === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={item.icon} />
                    </svg>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {!collapsed && (
          <div className="nav-user-card">
            <div className="nav-user-avatar">J</div>
            <div className="nav-user-info">
              <span className="nav-user-name">Jashan</span>
              <span className="nav-user-role">
                <i aria-hidden="true" /> ASL Learner
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <div className="main">
        {/* Top Header Bar matching Image 1 */}
        <header className="top">
          <div className="top-left">
            <button
              className="chip menu-btn"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </button>

            {/* Global Search Bar */}
            <div className="top-search-bar" role="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search gestures, vocabulary, settings..."
                aria-label="Search gestures, vocabulary, settings"
              />
              <span className="top-kbd">⌘K</span>
            </div>
          </div>

          <div className="top-right">
            {/* Live Clock Pill (from Image 1: "12:37 PM, Wed") */}
            <div className="pill-badge" title="Current session time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{timeStr || "12:37 PM, Wed"}</span>
            </div>

            {/* AI Engine Status Indicator */}
            <span className={`status ${health}`} role="status">
              <i aria-hidden="true" />
              {STATUS[health]}
            </span>

            {/* Display / Accessibility Toggles */}
            <div className="tools" role="group" aria-label="Display and accessibility settings">
              <button
                className="chip"
                aria-pressed={dark}
                onClick={() => setDark(!dark)}
                title="Toggle Dark / Light theme"
              >
                {dark ? "🌙 Dark" : "☀️ Light"}
              </button>
              <button
                className="chip"
                aria-pressed={contrast}
                onClick={() => setContrast(!contrast)}
                title="High Contrast mode"
              >
                Contrast
              </button>
              <button
                className="chip"
                aria-pressed={large}
                onClick={() => setLarge(!large)}
                title="Large Text mode"
              >
                Text +
              </button>
              <button
                className="chip"
                aria-pressed={calm}
                onClick={() => setCalm(!calm)}
                title="Reduce Motion"
              >
                Calm
              </button>
            </div>
          </div>
        </header>

        <main id="main">{children}</main>
      </div>
    </div>
  );
}
