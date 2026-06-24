import { useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

export function About() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-line", {
        yPercent: 110,
        duration: 1,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.from(".about-img", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="grid gap-12 px-6 py-28 md:grid-cols-[1fr_1.2fr] md:gap-20 md:px-12"
    >
      <div className="about-img overflow-hidden rounded-xl">
        <img
          src="/img/work-02.jpg"
          alt="Portrait of Lyba"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="mb-8 font-sans text-sm uppercase tracking-[0.3em] text-ink/50">
          About
        </p>
        <h2 className="font-display text-[8vw] uppercase leading-[0.95] md:text-[3.4vw]">
          {["I shoot the", "people, sport", "and brands", "that move."].map((line) => (
            <span className="reveal-mask" key={line}>
              <span className="about-line">{line}</span>
            </span>
          ))}
        </h2>
        <p className="mt-8 max-w-md font-sans leading-relaxed text-ink/70">
          I'm Lyba, a freelance photographer &amp; videographer. From the gym to
          the studio, I work with athletes and with friends running their own
          businesses — giving their world images that hit, from brief to final
          cut.
        </p>
      </div>
    </section>
  );
}
