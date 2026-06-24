import { useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

type HeroProps = {
  /** Flip to true once the preloader has revealed the page. */
  started: boolean;
};

export function Hero({ started }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  // Hide the hero immediately on mount so it's never seen in its final state
  // through the opening aperture, and wire up the scroll parallax.
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { yPercent: 120 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 20 });
      gsap.set(".hero-scroll", { autoAlpha: 0 });

      // subtle parallax drift on the big title as you scroll
      gsap.to(".hero-title", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Animate in once the aperture starts opening.
  useIsomorphicLayoutEffect(() => {
    if (!started) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(".hero-line", { yPercent: 0, duration: 1.1, stagger: 0.12 })
        .to(
          ".hero-fade",
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 },
          "-=0.6",
        )
        .to(".hero-scroll", { autoAlpha: 1, duration: 0.8 }, "-=0.3");
    }, root);
    return () => ctx.revert();
  }, [started]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pb-10 pt-28 md:px-12"
    >
      <div className="hero-fade flex items-center justify-between font-sans text-xs uppercase tracking-[0.25em] text-ink/60">
        <span>Photographer · Videographer</span>
        <span className="hidden md:block">Available 2026</span>
      </div>

      <div className="hero-title">
        <h1 className="font-display uppercase leading-[0.82] tracking-tight">
          <span className="reveal-mask">
            <span className="hero-line text-[18vw] md:text-[15vw]">Capture</span>
          </span>
          <span className="reveal-mask">
            <span className="hero-line block text-[18vw] md:text-[15vw]">
              the moment<span className="text-accent">.</span>
            </span>
          </span>
        </h1>
        <p className="hero-fade mt-6 max-w-md font-sans text-base leading-relaxed text-ink/70 md:text-lg">
          Photo &amp; video for sport, brands and independents. The right frame,
          clean light, a story that sticks.
        </p>
      </div>

      <div className="hero-scroll flex items-center gap-3 font-sans text-xs uppercase tracking-[0.25em] text-ink/50">
        <span className="inline-block h-8 w-px animate-pulse bg-ink/40" />
        Scroll to explore
      </div>
    </section>
  );
}
