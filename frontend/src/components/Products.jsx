import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, X, Gamepad2 } from "lucide-react";
import { PRODUCTS, FINPILOT_DEMO_URL } from "../data/portfolio";
import { scrollToId } from "../utils";
import { VoiceDemo } from "./VoiceDemo";

const SpotlightCard = ({ children, className = "", testid, onClick }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onClick={onClick}
      data-testid={testid}
      className={`group relative overflow-hidden rounded-2xl border border-[#1E222D] bg-[#0D0F14] cursor-pointer transition-colors duration-500 hover:border-cyan-400/40 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(480px circle at var(--mx) var(--my), rgba(0,240,255,0.08), transparent 65%)" }}
      />
      {children}
    </div>
  );
};

const StatusPill = ({ status }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 font-mono2 text-[9px] uppercase tracking-widest text-emerald-300">
    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
    {status}
  </span>
);

export const Products = () => {
  const [active, setActive] = useState(null);
  const finpilot = PRODUCTS.find((p) => p.featured);
  const rest = PRODUCTS.filter((p) => !p.featured);

  return (
    <section id="products" data-testid="ai-products-showcase" className="relative py-24 lg:py-36 bg-[#090A0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-cyan-400">// AI PRODUCT ARSENAL</div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-100">
              Things I've built.<br />
              <span className="text-stroke-cyan">Things that think.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
            Five products across fintech, voice, vision and revenue intelligence. One of them is playable — right on this page.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <SpotlightCard testid="product-card-finpilot" onClick={() => setActive(finpilot)} className="lg:grid lg:grid-cols-2">
            <div className="relative overflow-hidden min-h-[280px]">
              <img
                src={finpilot.image}
                alt="FinPilot fintech AI dashboard"
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                data-testid="finpilot-image"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0F14]/90 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14] to-transparent lg:hidden" />
              <div className="absolute top-5 left-5"><StatusPill status={finpilot.status} /></div>
            </div>
            <div className="relative p-8 lg:p-12">
              <div className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-cyan-400">{finpilot.tag}</div>
              <h3 className="mt-3 font-display text-3xl lg:text-4xl font-semibold text-slate-100 flex items-center gap-3">
                {finpilot.name}
                <ArrowUpRight className="size-6 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p className="mt-2 font-grotesk text-base sm:text-lg text-cyan-300/80">{finpilot.tagline}</p>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">{finpilot.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {finpilot.metrics.map((m) => (
                  <span key={m} className="rounded-md border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5 font-mono2 text-[10px] uppercase tracking-widest text-cyan-300">
                    {m}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {finpilot.stack.map((s) => (
                  <span key={s} className="rounded-full border border-white/10 px-3 py-1 font-mono2 text-[10px] text-slate-400">{s}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  data-testid="finpilot-launch-demo-button"
                  href={FINPILOT_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-mono2 text-[11px] font-bold uppercase tracking-widest text-[#07080A] hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(0,240,255,0.45)] transition-[background-color,box-shadow] duration-300"
                >
                  Launch Live App <ArrowUpRight className="size-4" />
                </a>
                <button
                  data-testid="finpilot-open-casefile-button"
                  className="rounded-full border border-white/15 px-6 py-3 font-mono2 text-[11px] uppercase tracking-widest text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
                >
                  Open Case File
                </button>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {rest.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard testid={`product-card-${p.id}`} onClick={() => setActive(p)} className="h-full">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.name} preview`}
                    className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4"><StatusPill status={p.status} /></div>
                </div>
                <div className="p-6">
                  <div className="font-mono2 text-[9px] uppercase tracking-[0.3em] text-cyan-400">{p.tag}</div>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
                    {p.name}
                    <ArrowUpRight className="size-4 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{p.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono2 text-[9px] text-slate-500">{s}</span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.button
          data-testid="products-play-game-banner"
          onClick={() => scrollToId("game")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-6 w-full flex items-center justify-between gap-4 rounded-2xl border border-violet-500/30 bg-violet-500/5 px-6 sm:px-8 py-5 hover:border-violet-400/60 transition-colors duration-300 group"
        >
          <div className="flex items-center gap-4">
            <Gamepad2 className="size-6 text-violet-400" />
            <div className="text-left">
              <div className="font-display text-lg font-semibold text-slate-100">Neural Snake — the fifth product is playable</div>
              <div className="font-mono2 text-[10px] uppercase tracking-widest text-slate-500">Manual mode // or watch the pathfinding AI autopilot think</div>
            </div>
          </div>
          <ArrowUpRight className="size-5 text-violet-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.button>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            data-testid="product-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-2xl max-h-[85vh] overflow-y-auto chat-scroll rounded-2xl"
            >
              <div className="relative h-56">
                <img src={active.image} alt={active.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14] to-transparent" />
                <button
                  data-testid="product-modal-close"
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/60 border border-white/15 p-2 text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors duration-300"
                >
                  <X className="size-4" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <div className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-cyan-400">{active.tag}</div>
                  <h3 className="font-display text-3xl font-semibold text-slate-100">{active.name}</h3>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{active.description}</p>
                <div className="mt-6 space-y-3">
                  {active.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="size-4 mt-0.5 text-cyan-400 shrink-0" />
                      <span className="text-sm text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {active.metrics.map((m) => (
                    <span key={m} className="rounded-md border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5 font-mono2 text-[10px] uppercase tracking-widest text-cyan-300">{m}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {active.stack.map((s) => (
                    <span key={s} className="rounded-full border border-white/10 px-3 py-1 font-mono2 text-[10px] text-slate-400">{s}</span>
                  ))}
                </div>
                {active.id === "finpilot" && (
                  <a
                    data-testid="finpilot-modal-launch-button"
                    href={FINPILOT_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-mono2 text-[11px] font-bold uppercase tracking-widest text-[#07080A] hover:bg-cyan-300 transition-colors duration-300"
                  >
                    Launch Live App <ArrowUpRight className="size-4" />
                  </a>
                )}
                {active.id === "echoverse" && <VoiceDemo />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
