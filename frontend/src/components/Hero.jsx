import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Bot, FileDown } from "lucide-react";
import { ParticleCanvas } from "./ParticleCanvas";
import { HERO_METRICS, CV_PDF_URL } from "../data/portfolio";
import { scrollToId, openChat } from "../utils";

const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1 -mb-1">
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const PORTRAIT_URL =
  "https://images.unsplash.com/photo-1607693965623-01021a7aee54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxmdXR1cmlzdGljJTIwQUklMjB0ZWNoJTIwZGFyayUyMHBvcnRyYWl0JTIwc29mdHdhcmUlMjBlbmdpbmVlciUyMGNvbnN1bHRpbmclMjBoZXJvfGVufDB8fHx8MTc4OTM2MTg4Mnww&ixlib=rb-4.1.0&q=85";

export const Hero = () => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 10, ry: px * 10 });
  };

  return (
    <section id="hero" data-testid="hero-section" className="relative min-h-screen flex items-center overflow-hidden">
      <ParticleCanvas className="absolute inset-0 w-full h-full" />
      <div className="absolute -top-40 -left-40 size-[560px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 size-[480px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-cyan-400 mb-8"
            data-testid="hero-eyebrow"
          >
            // PORTFOLIO.SYS — INITIALIZED
          </motion.div>

          <h1 className="font-display font-semibold tracking-tight leading-[0.95] text-4xl sm:text-6xl lg:text-7xl" data-testid="hero-headline">
            <MaskedLine delay={0.3}>Enterprise rigor.</MaskedLine>
            <MaskedLine delay={0.45}>
              <span className="text-cyan-400" style={{ textShadow: "0 0 40px rgba(0,240,255,0.35)" }}>
                AI velocity.
              </span>
            </MaskedLine>
            <MaskedLine delay={0.6}>
              <span className="text-stroke-cyan">One operator.</span>
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed"
            data-testid="hero-subtext"
          >
            I'm <span className="text-slate-100 font-semibold">Rupesh Dev</span> — ex-SAP consultant who ran
            $1.8M+ enterprise portfolios at 92.5% CSAT, now building autonomous AI products.
            FinPilot is my flagship. The rest of this site is the proof.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="hero-explore-products-button"
              onClick={() => scrollToId("products")}
              className="group flex items-center gap-3 rounded-full bg-cyan-400 px-7 py-3.5 font-mono2 text-xs font-bold uppercase tracking-widest text-[#07080A] hover:bg-cyan-300 hover:shadow-[0_0_32px_rgba(0,240,255,0.5)] transition-[background-color,box-shadow] duration-300"
            >
              Explore the Arsenal
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <button
              data-testid="hero-ask-cv-button"
              onClick={openChat}
              className="flex items-center gap-3 rounded-full border border-white/15 px-7 py-3.5 font-mono2 text-xs uppercase tracking-widest text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
            >
              <Bot className="size-4" /> Ask my CV
            </button>
            <a
              data-testid="hero-download-cv-button"
              href={CV_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono2 text-xs uppercase tracking-widest text-slate-400 hover:text-cyan-300 transition-colors duration-300"
            >
              <FileDown className="size-4" /> PDF
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden"
            data-testid="hero-metrics"
          >
            {HERO_METRICS.map((m) => (
              <div key={m.label} className="bg-[#0A0C10] px-5 py-5">
                <div className="font-display text-2xl sm:text-3xl font-semibold text-cyan-300">{m.value}</div>
                <div className="mt-1 font-mono2 text-[10px] uppercase tracking-widest text-slate-500">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block lg:col-span-5"
        >
          <div
            data-testid="hero-portrait-card"
            onMouseMove={onTilt}
            onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.25s ease-out",
            }}
            className="relative animate-float-slow"
          >
            <div className="absolute -inset-6 bg-cyan-400/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative border border-white/10 bg-[#0D0F14] p-3 rounded-lg">
              <span className="absolute -top-px -left-px size-6 border-t-2 border-l-2 border-cyan-400" />
              <span className="absolute -top-px -right-px size-6 border-t-2 border-r-2 border-cyan-400" />
              <span className="absolute -bottom-px -left-px size-6 border-b-2 border-l-2 border-cyan-400" />
              <span className="absolute -bottom-px -right-px size-6 border-b-2 border-r-2 border-cyan-400" />
              <div className="overflow-hidden rounded-sm">
                <img
                  src={PORTRAIT_URL}
                  alt="Rupesh Dev — AI product builder"
                  className="w-full h-[420px] object-cover grayscale-[0.4] contrast-125"
                  data-testid="hero-portrait-image"
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-mono2 text-[10px] uppercase tracking-widest text-slate-500">
                <span>RUPESH.EXE</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => scrollToId("manifesto")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono2 text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-cyan-300 transition-colors duration-300 flex flex-col items-center gap-2"
      >
        Scroll
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="size-3.5" />
        </motion.span>
      </motion.button>
    </section>
  );
};
