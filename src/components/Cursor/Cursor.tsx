"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";

type CursorVariant = "idle" | "hover" | "view" | "drag";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<CursorVariant>("idle");

  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState<CursorVariant>("idle");

  useEffect(() => {
    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!isFinePointer || !dotRef.current) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const el = dotRef.current;

    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.45,
      ease: "expo.out",
    });

    const yTo = gsap.quickTo(el, "y", {
      duration: 0.45,
      ease: "expo.out",
    });

    const setCursor = (next: CursorVariant, nextLabel = "") => {
      if (variantRef.current === next) return;

      variantRef.current = next;
      setVariant(next);
      setLabel(nextLabel);
    };

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as Element | null;
      const cursorTarget = target?.closest?.("[data-cursor]");
      const kind = cursorTarget?.getAttribute("data-cursor");

      if (kind === "view") {
        setCursor("view", "View");
      } else if (kind === "drag") {
        setCursor("drag", "Drag");
      } else if (kind === "hover") {
        setCursor("hover");
      } else {
        setCursor("idle");
      }
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  const size =
    variant === "view" || variant === "drag"
      ? 80
      : variant === "hover"
        ? 18
        : 12;

  const isFilled = variant === "hover";

  return (
    <div
      ref={dotRef}
      className={[
        "pointer-events-none fixed left-0 top-0 z-[9999]",
        "items-center justify-center rounded-full",
        "border border-white text-[10px] font-medium uppercase tracking-[0.16em] text-white",
        "mix-blend-difference",
        enabled ? "flex" : "hidden",
      ].join(" ")}
      style={{
        width: size,
        height: size,
        backgroundColor: isFilled ? "#ffffff" : "transparent",
        transition:
          "width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease",
      }}
    >
      {label}
    </div>
  );
}