import { useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { GALLERY_IMAGES } from "../../lib/data";

// Cycle through a few card sizes so the horizontal strip has rhythm instead
// of a rigid, uniform grid.
const SIZES = [
  "md:h-[62vh] md:w-[26vw]",
  "md:h-[46vh] md:w-[20vw] md:self-end",
  "md:h-[72vh] md:w-[23vw] md:self-start",
  "md:h-[54vh] md:w-[30vw] md:self-center",
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-head", {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      // The pinned horizontal scroll only makes sense once there's room for
      // it — on small screens the strip just scrolls with the page.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        if (!track) return;

        const getDistance = () => track.scrollWidth - window.innerWidth;

        const scrollTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        // Cards drift up/down at slightly different rates as the strip
        // slides by, so the pass feels dimensional rather than flat.
        gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card, i) => {
          const depth = (i % 3) - 1; // -1, 0, 1
          gsap.fromTo(
            card,
            { yPercent: depth * -14 },
            {
              yPercent: depth * 14,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: () => `+=${getDistance()}`,
                scrub: 1,
              },
            },
          );
        });

        return () => {
          scrollTween.scrollTrigger?.kill();
          scrollTween.kill();
        };
      });

      return () => mm.revert();
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={root}
      className="relative overflow-hidden px-6 py-28 md:h-screen md:px-0 md:py-0"
    >
      <p className="gallery-head absolute left-6 top-10 z-10 font-sans text-sm uppercase tracking-[0.3em] text-ink/50 md:left-12 md:top-12">
        Gallery
      </p>

      <div
        ref={trackRef}
        className="flex flex-col gap-3 md:h-screen md:w-max md:flex-row md:items-center md:gap-6 md:pl-12 md:pr-[16vw]"
      >
        {GALLERY_IMAGES.map((src, i) => (
          <div
            key={src}
            data-cursor="view"
            className={[
              "gallery-card shrink-0 overflow-hidden rounded-xl",
              SIZES[i % SIZES.length],
            ].join(" ")}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-64 w-full object-cover md:h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
