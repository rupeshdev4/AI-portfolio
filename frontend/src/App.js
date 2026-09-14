import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Manifesto } from "./components/Manifesto";
import { Products } from "./components/Products";
import { NeuralSnake } from "./components/NeuralSnake";
import { CVTimeline } from "./components/CVTimeline";
import { ChatWidget } from "./components/ChatWidget";
import { Footer } from "./components/Footer";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="bg-[#07080A] text-slate-100 min-h-screen font-jakarta overflow-x-clip">
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Products />
        <NeuralSnake />
        <CVTimeline />
      </main>
      <Footer />
      <ChatWidget />
      <Toaster theme="dark" position="bottom-left" />
    </div>
  );
}

export default App;
