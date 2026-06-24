import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * Sets up Lenis smooth scrolling and drives it from GSAP's ticker so that
 * ScrollTrigger and Lenis stay perfectly in sync (the lessestudio approach).
 *
 * @param enabled  Pass false while the preloader is running to keep the page
 *                 locked, then flip to true to release the scroll.
 */
export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger updated on every Lenis frame.
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      // GSAP ticker time is in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Lock the page while the preloader runs, release it when ready.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (enabled) {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [enabled]);
}
