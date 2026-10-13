"use client";
import { useEffect, useRef } from "react";

const CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm
  [5, 9], [9, 13], [13, 17],
];

export default function AnimatedHand({ sign }: { sign: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, cv.width, cv.height);

      // Subtle background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < cv.width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cv.height); ctx.stroke();
      }
      for (let y = 0; y < cv.height; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cv.width, y); ctx.stroke();
      }

      // Generate 21 animated hand joints based on sign and time
      const lm = generateAnimatedLandmarks(sign, time, cv.width, cv.height);

      // Draw bone connections with glow
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 10;

      CONNECTIONS.forEach(([start, end]) => {
        const p1 = lm[start];
        const p2 = lm[end];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        }
      });

      ctx.shadowBlur = 0;

      // Draw joint nodes
      lm.forEach((pt, i) => {
        const isTip = [4, 8, 12, 16, 20].includes(i);
        const isWrist = i === 0;

        ctx.beginPath();
        ctx.arc(pt[0], pt[1], isTip ? 6.5 : isWrist ? 8 : 4.5, 0, 2 * Math.PI);

        if (isTip) {
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 8;
        } else if (isWrist) {
          ctx.fillStyle = "#ef4444";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = "#22d3ee";
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 6;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.lineWidth = 1.8;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [sign]);

  return (
    <div style={{ textAlign: "center", width: "100%", maxWidth: 360 }}>
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(34, 211, 238, 0.3)", boxShadow: "0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(34, 211, 238, 0.15)", background: "#050811" }}>
        <canvas
          ref={canvasRef}
          width={340}
          height={320}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />
        <div style={{ position: "absolute", top: 10, right: 12 }}>
          <span className="badge cyan" style={{ fontSize: "0.72rem" }}>
            21 Joints Active
          </span>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: "0.88rem", color: "var(--cyan)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span className="neural-pulsing-dot" />
        Animated Hand Guide: "{sign}"
      </div>
    </div>
  );
}

function generateAnimatedLandmarks(sign: string, t: number, w: number, h: number): [number, number][] {
  const cx = w / 2;
  const cy = h / 2 + 25;

  const wave = Math.sin(t * 2) * (sign === "HELLO" ? 22 : sign === "YES" ? 14 : 6);
  const flex = Math.cos(t * 2) * (sign === "THANK YOU" ? 18 : 4);

  const lm: [number, number][] = new Array(21).fill([0, 0]);
  lm[0] = [cx + wave * 0.3, cy]; // Wrist

  // Base MCPs
  lm[1] = [cx - 28 + wave * 0.3, cy - 28];
  lm[2] = [cx - 46 + wave * 0.3, cy - 56];
  lm[5] = [cx - 24 + wave * 0.3, cy - 84];
  lm[9] = [cx + wave * 0.3, cy - 94 + flex];
  lm[13] = [cx + 24 + wave * 0.3, cy - 84];
  lm[17] = [cx + 42 + wave * 0.3, cy - 70];

  const isFist = ["A", "S", "E", "0", "YES"].includes(sign);
  const isOpen = ["HELLO", "5", "B", "OPEN", "PLEASE", "THANK YOU"].includes(sign);
  const isLove = sign === "LOVE";

  const ext = isLove ? [1.0, 1.0, 0.1, 0.1, 1.0] : isOpen ? [1.0, 1.0, 1.0, 1.0, 1.0] : isFist ? [0.2, 0.1, 0.1, 0.1, 0.1] : [0.7, 0.8, 0.8, 0.8, 0.8];

  // Thumb tip
  lm[3] = [lm[2][0] - 18 * ext[0], lm[2][1] - 18 * ext[0]];
  lm[4] = [lm[3][0] - 14 * ext[0], lm[3][1] - 14 * ext[0]];

  // Fingers
  [5, 9, 13, 17].forEach((mcp, fi) => {
    const fExt = ext[fi + 1];
    const spread = (fi - 1.5) * 11;
    for (let j = 1; j <= 3; j++) {
      const curr = mcp + j;
      const prev = curr - 1;
      const len = j < 3 ? 26 : 20;
      lm[curr] = [
        lm[prev][0] + spread,
        lm[prev][1] - len * fExt + flex * 0.3,
      ];
    }
  });

  return lm;
}
