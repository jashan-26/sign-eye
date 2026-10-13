"use client";
import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { LM } from "../lib/features";

export type Frame = { hands: LM[][]; handedness: string[]; fps: number; detectMs: number };
type Props = { active: boolean; paused: boolean; skip?: number; onFrame: (f: Frame) => void; onError: (m: string) => void; onReady?: () => void };

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export default function CameraPanel({ active, paused, skip = 1, onFrame, onError, onReady }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const cb = useRef({ onFrame, onError, onReady });
  const [loading, setLoading] = useState(false);
  pausedRef.current = paused;
  cb.current = { onFrame, onError, onReady };

  useEffect(() => {
    if (!active) return;
    let stop = false, raf = 0, stream: MediaStream | null = null, lm: HandLandmarker | null = null;
    (async () => {
      setLoading(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" }, audio: false });
      } catch {
        cb.current.onError("Camera unavailable. Allow camera access in your browser, or use Demo Mode.");
        setLoading(false); return;
      }
      try {
        const fs = await FilesetResolver.forVisionTasks(WASM);
        lm = await HandLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: MODEL, delegate: "GPU" }, runningMode: "VIDEO", numHands: 2 });
      } catch {
        cb.current.onError("The hand-tracking model could not load. Check your internet connection and try again.");
        stream.getTracks().forEach((t) => t.stop()); setLoading(false); return;
      }
      const v = video.current!; v.srcObject = stream; await v.play();
      setLoading(false); cb.current.onReady?.();

      let n = 0, lastT = -1, times: number[] = [];
      const loop = () => {
        if (stop) return;
        raf = requestAnimationFrame(loop);
        if (pausedRef.current || v.readyState < 2 || ++n % skip) return;
        const t0 = performance.now();
        if (v.currentTime === lastT) return; lastT = v.currentTime;
        const res = lm!.detectForVideo(v, t0);
        const detectMs = performance.now() - t0;
        times.push(t0); while (times.length && t0 - times[0] > 1000) times.shift();
        draw(res.landmarks as LM[][]);
        cb.current.onFrame({ hands: res.landmarks as LM[][], handedness: res.handedness.map((h) => h[0]?.categoryName ?? "?"), fps: times.length, detectMs });
      };
      loop();
    })();

    const draw = (hands: LM[][]) => {
      const c = canvas.current, v = video.current; if (!c || !v) return;
      c.width = v.videoWidth; c.height = v.videoHeight;
      const g = c.getContext("2d")!; g.clearRect(0, 0, c.width, c.height);
      for (const h of hands) {
        g.strokeStyle = "#7C5CFF"; g.lineWidth = 3;
        for (const { start, end } of HandLandmarker.HAND_CONNECTIONS) {
          g.beginPath(); g.moveTo(h[start].x * c.width, h[start].y * c.height); g.lineTo(h[end].x * c.width, h[end].y * c.height); g.stroke();
        }
        g.fillStyle = "#22D3EE";
        for (const p of h) { g.beginPath(); g.arc(p.x * c.width, p.y * c.height, 4, 0, 7); g.fill(); }
        const xs = h.map((p) => p.x * c.width), ys = h.map((p) => p.y * c.height);
        g.strokeStyle = "#22D3EE"; g.lineWidth = 2; g.setLineDash([6, 6]);
        g.strokeRect(Math.min(...xs) - 12, Math.min(...ys) - 12, Math.max(...xs) - Math.min(...xs) + 24, Math.max(...ys) - Math.min(...ys) + 24);
        g.setLineDash([]);
      }
    };
    return () => {
      stop = true; cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop()); lm?.close();
      const c = canvas.current; c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
      if (video.current) video.current.srcObject = null;
    };
  }, [active, skip]);

  return (
    <div className="cam">
      <div className="camwrap">
        <video ref={video} playsInline muted aria-label="Camera feed" />
        <canvas ref={canvas} aria-hidden />
        {!active && <div className="cammsg">Camera is off. Choose Start camera or use Demo Mode.</div>}
        {loading && <div className="cammsg">Loading hand tracking…</div>}
      </div>
    </div>
  );
}
