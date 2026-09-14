import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Award, GraduationCap } from "lucide-react";
import { TIMELINE, SKILLS, TOOLSTACK, CERTS_AWARDS, EDUCATION } from "../data/portfolio";

export const CVTimeline = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="cv" data-testid="cv-matrix-timeline" className="relative py-24 lg:py-36 bg-[#090A0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-cyan-400">// CV MATRIX</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-100">
            The record,<br />
            <span className="text-stroke-cyan">declassified.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <div className="relative border-l border-cyan-400/20 ml-2 space-y-2">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.company}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-8 pb-4"
                  data-testid={`timeline-item-${i}`}
                >
                  <span className={`absolute -left-[5px] top-2 size-2.5 rounded-full ${open === i ? "bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.8)]" : "bg-slate-600"}`} />
                  <button
                    data-testid={`timeline-toggle-${i}`}
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full text-left group"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors duration-300">
                        {t.company}
                      </h3>
                      <span className="font-mono2 text-[10px] uppercase tracking-widest text-slate-500">{t.period}</span>
                    </div>
                    <div className="mt-1 font-grotesk text-sm text-cyan-400/80">{t.role} · {t.location}</div>
                    <div className="mt-1 flex items-center justify-between gap-4">
                      <span className="font-mono2 text-[11px] text-slate-500">{t.highlight}</span>
                      <ChevronDown className={`size-4 shrink-0 text-slate-500 transition-transform duration-300 ${open === i ? "rotate-180 text-cyan-400" : ""}`} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                        data-testid={`timeline-achievements-${i}`}
                      >
                        <div className="pt-4 space-y-2.5">
                          {t.achievements.map((a) => (
                            <li key={a} className="flex items-start gap-3 text-sm text-slate-400 list-none">
                              <span className="mt-2 size-1 rounded-full bg-cyan-400 shrink-0" />
                              {a}
                            </li>
                          ))}
                        </div>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              data-testid="skills-matrix"
            >
              <div className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-5">CAPABILITY_LEVELS</div>
              <div className="space-y-4">
                {SKILLS.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm text-slate-300">{s.name}</span>
                      <span className="font-mono2 text-[10px] text-cyan-400">{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {TOOLSTACK.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono2 text-[10px] text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              data-testid="education-block"
            >
              <div className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4">
                <GraduationCap className="size-4 text-cyan-400" /> EDUCATION
              </div>
              <div className="space-y-3">
                {EDUCATION.map((e) => (
                  <div key={e.school} className="rounded-xl border border-[#1E222D] bg-[#0D0F14] p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-display text-lg font-semibold text-slate-100">{e.school}</div>
                      <span className="font-mono2 text-[10px] text-slate-500">{e.period}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-400">{e.degree}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              data-testid="awards-block"
            >
              <div className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4">
                <Award className="size-4 text-cyan-400" /> PROOF_OF_WORK
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CERTS_AWARDS.map((c) => (
                  <div key={c} className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-slate-300">
                    {c}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
