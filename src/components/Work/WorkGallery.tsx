import { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CategoryRow } from "./CategoryRow";
import { PhotoPreview } from "./PhotoPreview";
import { useMousePosition } from "../../hooks/useMousePosition";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { CATEGORIES } from "../../lib/data";
import type { CategoryId } from "../../lib/types";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

const noop = () => {};

export function WorkGallery() {
  const [active, setActive] = useState<CategoryId | null>(null);
  const mouse = useMousePosition(5);
  const root = useRef<HTMLElement>(null);

  // The cursor-driven photo scatter is a pointer-only interaction. On touch
  // devices it would fire on tap, get stuck (no reliable mouseleave) and the
  // wide previews would overflow the screen — so we disable it there.
  const interactive = useMediaQuery("(hover: hover) and (pointer: fine)");

  const clear = useCallback(() => setActive(null), []);

  const current = interactive && active ? CATEGORIES.find((c) => c.id === active) : null;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-head", {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".work-row", {
        autoAlpha: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work-list", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={root}
      className="relative min-h-screen px-6 py-24 md:px-12"
    >
      <div className="work-head mb-10 flex items-end justify-between">
        <h2 className="font-sans text-sm uppercase tracking-[0.3em] text-ink/60">
          Selected work
        </h2>
        <span className="hidden font-sans text-xs text-ink/40 md:block">
          (hover a category)
        </span>
      </div>

      <div className="work-list">
        {CATEGORIES.map((category) => (
          <div className="work-row" key={category.id}>
            <CategoryRow
              category={category}
              active={active === category.id}
              onHover={interactive ? setActive : noop}
              onLeave={interactive ? clear : noop}
            />
          </div>
        ))}
      </div>

      {/* Scattered photo previews follow the cursor */}
      <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
        <AnimatePresence>
          {current?.photos.map((photo, index) => (
            <PhotoPreview
              key={`${current.id}-${photo.src}-${index}`}
              photo={photo}
              index={index}
              mouse={mouse}
              label={current.label}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
