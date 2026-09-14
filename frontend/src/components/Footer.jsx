import { motion } from "framer-motion";
import { Copy, Linkedin, Github, FileDown, Mail } from "lucide-react";
import { toast } from "sonner";
import { CONTACT, CV_PDF_URL } from "../data/portfolio";

export const Footer = () => {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      toast.success("Email copied to clipboard", { description: CONTACT.email });
    } catch (e) {
      toast.error("Copy failed", { description: CONTACT.email });
    }
  };

  return (
    <footer id="contact" data-testid="contact-footer" className="relative py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-2 gap-14 items-center"
        >
          <div>
            <div className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-cyan-400">// INITIATE DIALOGUE</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-100 leading-[1.02]">
              Let's build the<br />
              <span className="text-cyan-400" style={{ textShadow: "0 0 40px rgba(0,240,255,0.3)" }}>next one.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm sm:text-base text-slate-400 leading-relaxed">
              Hiring for Customer Success leadership or AI product roles? The terminal is open —
              the fastest route to me is one email away.
            </p>
            <a
              data-testid="footer-email-cta"
              href={`mailto:${CONTACT.email}`}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-cyan-400 px-8 py-4 font-mono2 text-xs font-bold uppercase tracking-widest text-[#07080A] hover:bg-cyan-300 hover:shadow-[0_0_32px_rgba(0,240,255,0.5)] transition-[background-color,box-shadow] duration-300"
            >
              <Mail className="size-4" /> {CONTACT.email}
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-[#1E222D] bg-[#0A0C10] overflow-hidden"
            data-testid="contact-terminal"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 font-mono2 text-[10px] uppercase tracking-widest text-slate-500">rupesh@portfolio: ~</span>
            </div>
            <div className="p-5 sm:p-6 font-mono2 text-xs sm:text-sm leading-7 text-slate-300">
              <div><span className="text-cyan-400">$</span> whoami</div>
              <div className="text-slate-500">rupesh_dev — customer_success × ai_products</div>
              <div className="mt-3"><span className="text-cyan-400">$</span> status --availability</div>
              <div className="text-emerald-400">OPEN TO WORK <span className="blink">▊</span></div>
              <div className="mt-3"><span className="text-cyan-400">$</span> contact --channels</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  data-testid="footer-copy-email-button"
                  onClick={copyEmail}
                  className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
                >
                  <Copy className="size-3.5" /> email
                </button>
                <a
                  data-testid="footer-linkedin-link"
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
                >
                  <Linkedin className="size-3.5" /> linkedin
                </a>
                <a
                  data-testid="footer-github-link"
                  href={CONTACT.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
                >
                  <Github className="size-3.5" /> github
                </a>
                <a
                  data-testid="footer-resume-download"
                  href={CV_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
                >
                  <FileDown className="size-3.5" /> resume.pdf
                </a>
              </div>
              <div className="mt-4 text-slate-600">// all neural systems operational</div>
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono2 text-[10px] uppercase tracking-widest text-slate-600">
            © 2026 RUPESH DEV — BUILT AT THE INTERSECTION OF ENTERPRISE RIGOR AND AI VELOCITY
          </div>
          <div className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-widest text-emerald-400" data-testid="footer-system-status">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Status: all neural systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};
