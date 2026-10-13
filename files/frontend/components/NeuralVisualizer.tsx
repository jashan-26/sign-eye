"use client";
import { useEffect, useRef } from "react";

export default function NeuralVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0.4;
    let angleY = 0.6;
    let angleZ = 0.2;

    // 3D Polyhedron Vertices (Faceted geometric crystal structure)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
      // Inner core keypoints (simulating 21 hand landmark nodes)
      [0, 0, 0], [0, 0.8, 0.4], [0.6, 0.5, 0.2], [-0.6, 0.5, 0.2],
      [0.8, -0.2, 0.4], [-0.8, -0.2, 0.4], [0, -0.8, 0.3], [0.4, 1.2, -0.2],
      [-0.4, 1.2, -0.2]
    ];

    // Triangular facets for 3D origami / crystal faces
    const faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    // Ambient floating particles
    const particles = Array.from({ length: 32 }, () => ({
      x: (Math.random() - 0.5) * 260,
      y: (Math.random() - 0.5) * 160,
      z: (Math.random() - 0.5) * 200,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.015 + 0.005,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = mouseX * 1.2;
      targetRotX = -mouseY * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Subtle background ambient gradient
      const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 1.5);
      bgGlow.addColorStop(0, "rgba(6, 182, 212, 0.14)");
      bgGlow.addColorStop(0.5, "rgba(16, 185, 129, 0.06)");
      bgGlow.addColorStop(1, "rgba(9, 13, 22, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Increment rotation with smooth mouse damping
      angleY += 0.008 + (targetRotY - angleY) * 0.02;
      angleX += 0.005 + (targetRotX - angleX) * 0.02;
      angleZ += 0.002;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Rotate and project vertices
      const scale = 58;
      const cx = width / 2;
      const cy = height / 2;
      const cameraDistance = 3.8;

      const projected = rawVertices.map(([x, y, z]) => {
        // Rotate around Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;
        // Rotate around X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        // Rotate around Z
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        const pz = z2 + cameraDistance;
        const fov = scale / pz;
        return {
          x: cx + x3 * fov,
          y: cy + y3 * fov,
          z: z2,
        };
      });

      // Sort faces by average Z depth for 3D realism
      const sortedFaces = faces
        .map((faceIndices) => {
          const zAvg =
            (projected[faceIndices[0]].z +
              projected[faceIndices[1]].z +
              projected[faceIndices[2]].z) /
            3;
          return { indices: faceIndices, z: zAvg };
        })
        .sort((a, b) => b.z - a.z);

      // Render Facets with Emerald / Cyan lighting
      sortedFaces.forEach(({ indices, z }) => {
        const p0 = projected[indices[0]];
        const p1 = projected[indices[1]];
        const p2 = projected[indices[2]];

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        // Shading based on normal and depth
        const depthNorm = Math.min(1, Math.max(0.1, (z + 2) / 4));
        const gradient = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(34, 211, 238, ${0.18 * depthNorm})`);
        gradient.addColorStop(0.5, `rgba(16, 185, 129, ${0.25 * depthNorm})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, ${0.08 * depthNorm})`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Crisp neon facet edges
        ctx.strokeStyle = `rgba(52, 211, 153, ${0.45 * depthNorm + 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Render glowing inner landmark nodes
      projected.slice(12).forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, i === 0 ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#34d399" : "#22d3ee";
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render ambient floating particles
      particles.forEach((p) => {
        p.y -= p.speed * 15;
        if (p.y < -100) p.y = 100;

        const fov = 120 / (p.z + 240);
        const px = cx + p.x * fov;
        const py = cy + p.y * fov;

        ctx.beginPath();
        ctx.arc(px, py, p.size * fov * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha * 0.7})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="neural-vis-card">
      <div className="neural-vis-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={420}
          height={240}
          className="neural-vis-canvas"
          aria-hidden="true"
        />
        <div className="neural-vis-overlay">
          <div className="neural-vis-badge">
            <span className="neural-pulsing-dot" />
            AI Assistant is analyzing gesture stream...
          </div>
          <div className="neural-vis-sub">
            21 3D Spatial Landmarks · Neural Smoothing Active
          </div>
        </div>
      </div>
    </div>
  );
}
