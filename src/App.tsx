import { useCallback, useState } from "react";
import { Preloader } from "./components/Preloader/Preloader";
import { Cursor } from "./components/Cursor/Cursor";
import { Navbar } from "./components/Navbar/Navbar";
import { Hero } from "./components/Hero/Hero";
import { WorkGallery } from "./components/Work/WorkGallery";
import { Showcase } from "./components/Showcase/Showcase";
import { About } from "./components/About/About";
import { Services } from "./components/Services/Services";
import { Footer } from "./components/Footer/Footer";
import { useLenis } from "./hooks/useLenis";

export default function App() {
  const [ready, setReady] = useState(false);

  // Smooth scroll is locked until the preloader finishes revealing the page.
  useLenis(ready);

  const handleReveal = useCallback(() => setReady(true), []);

  return (
    <>
      <Preloader onReveal={handleReveal} />
      <Cursor />
      <Navbar started={ready} />

      <main id="top">
        <Hero started={ready} />
        <WorkGallery />
        <Showcase />
        <About />
        <Services />
        <Footer />
      </main>
    </>
  );
}
