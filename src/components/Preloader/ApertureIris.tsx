import { forwardRef } from "react";

type ApertureIrisProps = {
  className?: string;
};

const C = 50; // center
const RING = 46; // outer ring radius
const INNER = 17; // inner (hexagon hole) radius
const BLADES = 6;
const SWEEP = 58; // degrees each blade is swept toward the rim

const deg2rad = (d: number) => (d * Math.PI) / 180;
const pt = (angle: number, radius: number) => ({
  x: C + radius * Math.cos(deg2rad(angle)),
  y: C + radius * Math.sin(deg2rad(angle)),
});

// Pre-compute the iris geometry once.
const hexagon = Array.from({ length: BLADES }, (_, i) => pt(i * 60 - 90, INNER));
const blades = Array.from({ length: BLADES }, (_, i) => {
  const a = i * 60 - 90;
  const inner = pt(a, INNER);
  const outer = pt(a + SWEEP, RING);
  return `M ${inner.x.toFixed(2)} ${inner.y.toFixed(2)} L ${outer.x.toFixed(2)} ${outer.y.toFixed(2)}`;
});
const hexPath =
  hexagon.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") +
  " Z";

/** Stylised thin-line camera aperture. */
export const ApertureIris = forwardRef<SVGSVGElement, ApertureIrisProps>(
  ({ className }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      style={{ transformOrigin: "50% 50%", willChange: "transform" }}
    >
      <circle cx={C} cy={C} r={RING} strokeWidth={0.8} opacity={0.5} />
      <circle cx={C} cy={C} r={RING - 4} strokeWidth={0.4} opacity={0.25} />
      <path d={hexPath} strokeWidth={1} strokeLinejoin="round" />
      {blades.map((d, i) => (
        <path key={i} d={d} strokeWidth={0.9} strokeLinecap="round" />
      ))}
      {/* tick marks around the barrel */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 15;
        const o = pt(a, RING);
        const inn = pt(a, RING - (i % 6 === 0 ? 4 : 2));
        return (
          <line
            key={`t${i}`}
            x1={inn.x}
            y1={inn.y}
            x2={o.x}
            y2={o.y}
            strokeWidth={0.4}
            opacity={0.4}
          />
        );
      })}
    </svg>
  ),
);

ApertureIris.displayName = "ApertureIris";
