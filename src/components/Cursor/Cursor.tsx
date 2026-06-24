import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";

/**
 * Minimal magnetic cursor. Follows the pointer with an eased quickTo and
 * morphs when hovering elements that carry a `data-cursor` attribute:
 *   - "hover" → small filled dot
 *   - "view"  → larger ring with a "View" label
 *   - "drag"  → ring with a "Drag" label
 * Disabled on touch / coarse-pointer devices.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState<"idle" | "hover" | "view" | "drag">("idle");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.body.classList.add("has-custom-cursor");
    const el = dot.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "expo.out" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      const kind = target?.getAttribute("data-cursor");
      if (kind === "view") {
        setVariant("view");
        setLabel("View");
      } else if (kind === "drag") {
        setVariant("drag");
        setLabel("Drag");
      } else if (kind === "hover") {
        setVariant("hover");
        setLabel("");
      } else {
        setVariant("idle");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  const size = variant === "view" || variant === "drag" ? 80 : variant === "hover" ? 16 : 10;
  const filled = variant === "hover";

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden items-center justify-center rounded-full border border-ink text-[10px] uppercase tracking-[0.15em] text-ink mix-blend-difference [body.has-custom-cursor_&]:flex"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: filled ? "#0a0a0a" : "transparent",
        transition: "width .3s var(--ease-expo), height .3s var(--ease-expo), background-color .3s",
      }}
    >
      {label}
    </div>
  );
}
