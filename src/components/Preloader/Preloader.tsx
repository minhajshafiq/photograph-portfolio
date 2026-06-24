import { useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { ApertureIris } from "./ApertureIris";

type PreloaderProps = {
  /**
   * Fired the instant the "O" starts opening, so the page content can animate
   * in *through* the growing hole instead of appearing already-rendered.
   */
  onReveal: () => void;
};

/**
 * Camera-style intro:
 *  1. A viewfinder HUD with a spinning aperture iris and a 0 → 100 counter.
 *  2. A "shutter" beat: the iris spins up, scales and fades.
 *  3. The site is revealed through a growing circular hole (the "O") punched
 *     into a full-screen black rect via an SVG mask.
 */
export function Preloader({ onReveal }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const iris = useRef<SVGSVGElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const reveal = useRef<SVGCircleElement>(null);
  const [hidden, setHidden] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const maxR = Math.hypot(w, h) / 2 + 4;

    const ctx = gsap.context(() => {
      const count = { value: 0 };
      gsap.set(reveal.current, { attr: { r: 0 } });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => setHidden(true),
      });

      tl
        // HUD fades in
        .from(hud.current, { autoAlpha: 0, duration: 0.5, ease: "power2.out" })
        // counter 0 → 100, synced with a slow iris rotation
        .to(
          count,
          {
            value: 100,
            duration: 1.9,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counter.current) {
                counter.current.textContent = String(Math.round(count.value)).padStart(2, "0");
              }
            },
          },
          0.3,
        )
        .to(iris.current, { rotate: 200, duration: 1.9, ease: "power1.inOut" }, 0.3)
        // shutter "click": iris snaps, spins up, scales out
        .to(iris.current, { scale: 1.08, duration: 0.12, ease: "power3.out" }, ">-0.1")
        .to(hud.current, { autoAlpha: 0, duration: 0.4 }, ">")
        .to(
          iris.current,
          { scale: 9, rotate: "+=140", autoAlpha: 0, duration: 1.2, ease: "power3.in" },
          "<",
        )
        // the "O" opens — site shows through the growing hole
        .to(
          reveal.current,
          { attr: { r: maxR }, duration: 1.25, ease: "expo.out" },
          "<+0.12",
        )
        // kick off the page-content intro just after the hole begins opening,
        // so the hero rises *through* the aperture rather than appearing static
        .add(onReveal, "<+0.18");
    }, root);

    return () => ctx.revert();
  }, [onReveal]);

  if (hidden) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {/* Black mask layer — the hole grows to reveal the site behind it */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox={`0 0 ${typeof window !== "undefined" ? window.innerWidth : 1920} ${
          typeof window !== "undefined" ? window.innerHeight : 1080
        }`}
      >
        <defs>
          <mask id="aperture-hole">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle
              ref={reveal}
              cx="50%"
              cy="50%"
              r="0"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#0a0a0a"
          mask="url(#aperture-hole)"
        />
      </svg>

      {/* Viewfinder HUD */}
      <div
        ref={hud}
        className="absolute inset-0 flex flex-col items-center justify-center text-paper"
      >
        {/* corner brackets */}
        <Brackets />

        <ApertureIris ref={iris} className="h-40 w-40 md:h-56 md:w-56" />

        <div className="mt-10 flex items-baseline gap-3 font-sans text-paper/80">
          <span className="text-xs uppercase tracking-[0.3em]">Focusing</span>
          <span ref={counter} className="font-display text-2xl tabular-nums">
            00
          </span>
          <span className="text-xs">%</span>
        </div>

        <div className="absolute left-1/2 top-8 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.4em] text-paper/60">
          ● REC&nbsp;&nbsp;f/1.8&nbsp;&nbsp;50mm
        </div>
      </div>
    </div>
  );
}

function Brackets() {
  const corner =
    "absolute h-8 w-8 border-paper/50 md:h-12 md:w-12";
  return (
    <>
      <span className={`${corner} left-6 top-6 border-l border-t`} />
      <span className={`${corner} right-6 top-6 border-r border-t`} />
      <span className={`${corner} bottom-6 left-6 border-b border-l`} />
      <span className={`${corner} bottom-6 right-6 border-b border-r`} />
    </>
  );
}
