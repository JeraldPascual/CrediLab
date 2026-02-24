import React, { useEffect, useRef, useState, useCallback } from "react";

function resolveColor(color) {
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim();
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return resolved || color;
  }
  return color;
}

/**
 * CanvasText — Aceternity-style animated text with solid color bands.
 * Draws thick horizontal stripes that wave gently behind the text,
 * producing a bold, readable effect (like the "Lightning Speed" example).
 */
export function CanvasText({
  text,
  className = "",
  backgroundClassName = "bg-white dark:bg-dark-bg",
  colors = ["#00e89f", "#4ecdc4", "#45b7d1", "#00c987", "#10b981", "#06b6d4"],
  animationDuration = 6,
  overlay = false,
}) {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);
  const animationRef = useRef(0);
  const startTimeRef = useRef(0);
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [resolvedColors, setResolvedColors] = useState([]);

  const updateColors = useCallback(() => {
    if (bgRef.current) {
      const computed = window.getComputedStyle(bgRef.current);
      setBgColor(computed.backgroundColor);
    }
    const resolved = colors.map(resolveColor);
    setResolvedColors(resolved);
  }, [colors]);

  useEffect(() => {
    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [updateColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textEl = textRef.current;
    if (!canvas || !textEl || resolvedColors.length === 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const rect = textEl.getBoundingClientRect();
    const width = Math.ceil(rect.width) || 400;
    const height = Math.ceil(rect.height) || 200;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Thick bands — each color gets a solid horizontal band
    const bandHeight = height / resolvedColors.length;
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTimeRef.current) / 1000;
      const phase = (elapsed / animationDuration) * Math.PI * 2;

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw thick colored bands with gentle wave
      for (let i = 0; i < resolvedColors.length; i++) {
        const baseY = i * bandHeight;
        const waveOffset = Math.sin(phase + i * 0.8) * (bandHeight * 0.15);

        ctx.fillStyle = resolvedColors[i];
        ctx.beginPath();

        // Top edge with curve
        ctx.moveTo(0, baseY + waveOffset);
        ctx.bezierCurveTo(
          width * 0.25,
          baseY + waveOffset + Math.sin(phase + 1) * 4,
          width * 0.75,
          baseY + waveOffset + Math.sin(phase + 2) * 4,
          width,
          baseY + waveOffset
        );

        // Bottom edge with curve
        const bottomY = baseY + bandHeight;
        const waveOffset2 = Math.sin(phase + (i + 1) * 0.8) * (bandHeight * 0.15);
        ctx.lineTo(width, bottomY + waveOffset2);
        ctx.bezierCurveTo(
          width * 0.75,
          bottomY + waveOffset2 + Math.sin(phase + 3) * 4,
          width * 0.25,
          bottomY + waveOffset2 + Math.sin(phase + 4) * 4,
          0,
          bottomY + waveOffset2
        );
        ctx.closePath();
        ctx.fill();
      }

      textEl.style.backgroundImage = `url(${canvas.toDataURL()})`;
      textEl.style.backgroundSize = `${width}px ${height}px`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [bgColor, resolvedColors, animationDuration]);

  return (
    <span className={`relative inline ${overlay ? "absolute inset-0" : ""}`}>
      <span
        ref={bgRef}
        className={`pointer-events-none absolute h-0 w-0 opacity-0 ${backgroundClassName}`}
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <span
        ref={textRef}
        className={`bg-clip-text text-transparent ${overlay ? "absolute inset-0" : "inline"} ${className}`}
        style={{
          WebkitBackgroundClip: "text",
        }}
      >
        {text}
      </span>
    </span>
  );
}
