import { useRef } from "react";
import { CardStack } from "./CardStack";
import { STACK_IMAGES } from "../../lib/data";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

type StackCard = { id: number; img: string };

const CARDS: StackCard[] = STACK_IMAGES.map((img, i) => ({ id: i + 1, img }));

export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".showcase-anim", {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="grid items-center gap-16 bg-ink px-6 py-28 text-paper md:grid-cols-2 md:px-12"
    >
      <div className="showcase-anim">
        <h2 className="font-display text-[10vw] uppercase leading-[0.9] md:text-[5vw]">
          Living
          <br />
          prints<span className="text-accent">.</span>
        </h2>
        <p className="mt-6 max-w-sm font-sans text-paper/70">
          Grab a card, throw it, browse the set. Every frame tells a moment —
          training, a brand launch, a portrait.
        </p>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.25em] text-paper/40">
          Drag the cards →
        </p>
      </div>

      <div
        className="showcase-anim flex items-center justify-center"
        data-cursor="drag"
      >
        <CardStack items={CARDS}>
          {(card) => (
            <img
              src={card.img}
              alt="Print"
              width={1000}
              height={1250}
              draggable={false}
              className="pointer-events-none h-full w-full rounded-xl object-cover shadow-2xl"
            />
          )}
        </CardStack>
      </div>
    </section>
  );
}
