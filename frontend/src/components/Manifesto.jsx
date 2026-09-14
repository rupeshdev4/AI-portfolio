import { motion } from "framer-motion";
import { CHAPTERS } from "../data/portfolio";

export const Manifesto = () => {
  return (
    <section id="manifesto" data-testid="manifesto-chapters" className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-cyan-400">// THE MANIFESTO</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-100">
            Three chapters.<br />
            <span className="text-stroke-cyan">One operator.</span>
          </h2>
        </motion.div>

        <div className="mt-16 lg:mt-24">
          {CHAPTERS.map((ch, i) => (
            <motion.article
              key={ch.num}
              data-testid={`manifesto-chapter-${ch.num}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="grid md:grid-cols-12 gap-6 md:gap-10 border-t border-white/10 py-12 lg:py-16 group"
            >
              <div className="md:col-span-3">
                <div className="font-display text-6xl lg:text-8xl font-semibold text-stroke-cyan group-hover:text-cyan-400 transition-colors duration-700 group-hover:[-webkit-text-stroke:0px]">
                  {ch.num}
                </div>
                <div className="mt-2 font-mono2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  CHAPTER {ch.num} / 03
                </div>
              </div>
              <div className="md:col-span-9 lg:col-span-8">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors duration-500">
                  {ch.title}
                </h3>
                <div className="mt-1 font-grotesk text-base sm:text-lg text-cyan-400/80">{ch.subtitle}</div>
                <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">{ch.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {ch.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono2 text-[10px] uppercase tracking-widest text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
