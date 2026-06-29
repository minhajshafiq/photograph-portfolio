import { useId, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { ApertureIris } from "./ApertureIris";

type PreloaderProps = {
  onReveal: () => void;
};

const CENTER = 50;
const SIDES = 6;

function aperturePoints(radius: number, rotation = -90) {
  return Array.from({ length: SIDES })
    .map((_, index) => {
      const angle = ((rotation + index * (360 / SIDES)) * Math.PI) / 180;

      const x = CENTER + Math.cos(angle) * radius;
      const y = CENTER + Math.sin(angle) * radius;

      return `${x},${y}`;
    })
    .join(" ");
}

function closedAperturePoints() {
  return Array.from({ length: SIDES })
    .map(() => `${CENTER},${CENTER}`)
    .join(" ");
}

export function Preloader({ onReveal }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const apertureRef = useRef<SVGPolygonElement>(null);
  const apertureEdgeRef = useRef<SVGPolygonElement>(null);

  const revealStartedRef = useRef(false);
  const [hidden, setHidden] = useState(false);

  const reactId = useId().replace(/:/g, "");
  const maskId = `aperture-mask-${reactId}`;
  const gradientId = `aperture-gradient-${reactId}`;

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    document.body.classList.add("is-preloading");

    const ctx = gsap.context(() => {
      const counter = { value: 0 };

      const aperture = {
        radius: 0,
        rotation: -90,
      };

      const updateAperture = () => {
        const points = aperturePoints(aperture.radius, aperture.rotation);

        apertureRef.current?.setAttribute("points", points);
        apertureEdgeRef.current?.setAttribute("points", points);
      };

      apertureRef.current?.setAttribute("points", closedAperturePoints());
      apertureEdgeRef.current?.setAttribute("points", closedAperturePoints());

      gsap.set(rootRef.current, {
        autoAlpha: 1,
      });

      gsap.set(hudRef.current, {
        autoAlpha: 1,
      });

      gsap.set(irisRef.current, {
        rotate: 0,
        scale: 1,
        autoAlpha: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set(apertureEdgeRef.current, {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.inOut",
        },
        onComplete: () => {
          document.body.classList.remove("is-preloading");
          setHidden(true);
        },
      });

      tl.from(hudRef.current, {
        autoAlpha: 0,
        y: 8,
        duration: 0.55,
        ease: "power2.out",
      })

        .to(
          counter,
          {
            value: 100,
            duration: 1.65,
            ease: "power1.inOut",
            onUpdate: () => {
              if (!counterRef.current) return;

              counterRef.current.textContent = String(
                Math.round(counter.value)
              ).padStart(2, "0");
            },
          },
          0.2
        )

        .to(
          irisRef.current,
          {
            rotate: 185,
            duration: 1.65,
            ease: "power1.inOut",
          },
          0.2
        )

        // Micro fermeture avant ouverture : plus caméra, moins "flash"
        .to(irisRef.current, {
          scale: 0.96,
          duration: 0.1,
          ease: "power3.in",
        })

        .to(irisRef.current, {
          scale: 1.035,
          duration: 0.16,
          ease: "power3.out",
        })

        // On retire les éléments HUD, mais on garde l’iris vivant
        .to(
          [chromeRef.current, readoutRef.current],
          {
            autoAlpha: 0,
            y: -6,
            duration: 0.28,
            ease: "power2.inOut",
          },
          ">-0.02"
        )

        // Début du reveal
        .add(() => {
          if (revealStartedRef.current) return;

          revealStartedRef.current = true;
          onReveal();
        })

        // Ouverture nette initiale
        .to(
          aperture,
          {
            radius: 10,
            rotation: -84,
            duration: 0.16,
            ease: "power4.out",
            onUpdate: updateAperture,
          },
          "<"
        )

        .set(
          apertureEdgeRef.current,
          {
            autoAlpha: 0.16,
          },
          "<"
        )

        // Ouverture mécanique intermédiaire
        .to(aperture, {
          radius: 34,
          rotation: -68,
          duration: 0.28,
          ease: "power3.inOut",
          onUpdate: updateAperture,
        })

        // Ouverture large, fluide et premium
        .to(aperture, {
          radius: 185,
          rotation: -34,
          duration: 0.95,
          ease: "expo.inOut",
          onUpdate: updateAperture,
        })

        .to(
          apertureEdgeRef.current,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "<+0.15"
        )

        // L’iris s’éloigne avec l’ouverture
        .to(
          irisRef.current,
          {
            scale: 6.8,
            rotate: "+=130",
            autoAlpha: 0,
            duration: 0.78,
            ease: "power3.in",
          },
          "<-0.72"
        )

        // Fade final très court pour éviter une coupe sèche
        .to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.18,
          ease: "power2.out",
        });
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.classList.remove("is-preloading");
    };
  }, [onReveal]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#090909" />
            <stop offset="65%" stopColor="#050505" />
            <stop offset="100%" stopColor="#020202" />
          </radialGradient>

          <mask
            id={maskId}
            x="0"
            y="0"
            width="100"
            height="100"
            maskUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="100" height="100" fill="white" />

            <polygon
              ref={apertureRef}
              points={closedAperturePoints()}
              fill="black"
            />
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
        />

        <polygon
          ref={apertureEdgeRef}
          points={closedAperturePoints()}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.08"
        />
      </svg>

      <div
        ref={hudRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-paper"
      >
        <div ref={chromeRef} className="absolute inset-0">
          <Brackets />

          <div className="absolute left-1/2 top-8 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.4em] text-paper/50">
            ● REC&nbsp;&nbsp;f/1.8&nbsp;&nbsp;50mm
          </div>
        </div>

        <ApertureIris ref={irisRef} className="h-40 w-40 md:h-56 md:w-56" />

        <div
          ref={readoutRef}
          className="mt-10 flex items-baseline gap-3 font-sans text-paper/70"
        >
          <span className="text-xs uppercase tracking-[0.3em]">
            Focusing
          </span>

          <span ref={counterRef} className="font-display text-2xl tabular-nums">
            00
          </span>

          <span className="text-xs">%</span>
        </div>
      </div>
    </div>
  );
}

function Brackets() {
  const corner = "absolute h-8 w-8 border-paper/35 md:h-12 md:w-12";

  return (
    <>
      <span className={`${corner} left-6 top-6 border-l border-t`} />
      <span className={`${corner} right-6 top-6 border-r border-t`} />
      <span className={`${corner} bottom-6 left-6 border-b border-l`} />
      <span className={`${corner} bottom-6 right-6 border-b border-r`} />
    </>
  );
}