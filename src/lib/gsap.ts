import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once for the whole app.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
