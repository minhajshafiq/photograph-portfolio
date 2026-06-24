import { useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

const SERVICES = [
  {
    no: "01",
    title: "Photography",
    desc: "Portraits, products, lifestyle. Sharp images with a clear art direction.",
  },
  {
    no: "02",
    title: "Video",
    desc: "Reels, short films, social content. From the shoot to a punchy edit.",
  },
  {
    no: "03",
    title: "Gym content",
    desc: "Training sessions, coaches and athletes shown at their best.",
  },
  {
    no: "04",
    title: "Brands & business",
    desc: "Supporting independents: visual identity, launches and campaigns.",
  },
];

export function Services() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-row", {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={root} className="px-6 py-28 md:px-12">
      <p className="mb-12 font-sans text-sm uppercase tracking-[0.3em] text-ink/50">
        Services
      </p>

      <div>
        {SERVICES.map((s) => (
          <div
            key={s.no}
            data-cursor="hover"
            className="service-row group grid grid-cols-[auto_1fr] items-start gap-6 border-t border-ink/15 py-8 transition-colors hover:bg-ink hover:text-paper md:grid-cols-[80px_1fr_1.4fr] md:items-center md:gap-10 md:px-4"
          >
            <span className="font-sans text-sm text-ink/40 group-hover:text-paper/50">
              {s.no}
            </span>
            <h3 className="font-display text-[7vw] uppercase leading-none md:text-[3vw]">
              {s.title}
            </h3>
            <p className="col-span-2 font-sans text-ink/60 group-hover:text-paper/70 md:col-span-1">
              {s.desc}
            </p>
          </div>
        ))}
        <div className="border-t border-ink/15" />
      </div>
    </section>
  );
}
