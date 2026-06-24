import { useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-line", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={root}
      className="flex min-h-screen flex-col justify-between bg-ink px-6 py-16 text-paper md:px-12"
    >
      <div className="flex flex-1 flex-col justify-center">
        <p className="mb-8 font-sans text-sm uppercase tracking-[0.3em] text-paper/50">
          Let's work together
        </p>
        <h2 className="font-display uppercase leading-[0.85]">
          <span className="reveal-mask">
            <span className="contact-line block text-[16vw] md:text-[12vw]">
              Let's make
            </span>
          </span>
          <span className="reveal-mask">
            <span className="contact-line block text-[16vw] md:text-[12vw]">
              something<span className="text-accent">?</span>
            </span>
          </span>
        </h2>

        <a
          href="mailto:hello@lyba.co.uk"
          data-cursor="hover"
          className="mt-10 inline-block w-fit border-b border-paper/40 pb-1 font-sans text-xl transition-colors hover:border-accent hover:text-accent md:text-3xl"
        >
          hello@lyba.co.uk
        </a>
      </div>

      <div className="flex flex-col gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-6 font-sans text-sm uppercase tracking-[0.2em]">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-cursor="hover"
              className="text-paper/60 transition-colors hover:text-paper"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="font-sans text-xs text-paper/40">
          © {new Date().getFullYear()} Lyba — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
