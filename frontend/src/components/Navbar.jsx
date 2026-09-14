import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, FileDown, Menu, X } from "lucide-react";
import { NAV_LINKS, CV_PDF_URL } from "../data/portfolio";
import { scrollToId, openChat } from "../utils";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (target) => {
    setMenuOpen(false);
    scrollToId(target);
  };

  return (
    <motion.header
      data-testid="navigation-header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled ? "glass" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => go("hero")}
          className="font-mono2 text-sm tracking-widest text-slate-100 hover:text-cyan-300 transition-colors duration-300"
        >
          RUPESH<span className="text-cyan-400">.DEV</span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <button
              key={l.target}
              data-testid={`nav-link-${l.target}`}
              onClick={() => go(l.target)}
              className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-300 transition-colors duration-300"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            data-testid="nav-status-badge"
            className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1"
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-400" />
            </span>
            <span className="font-mono2 text-[10px] uppercase tracking-widest text-emerald-300">Open to work</span>
          </div>
          <a
            data-testid="nav-download-cv"
            href={CV_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono2 text-[11px] uppercase tracking-widest text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
          >
            <FileDown className="size-3.5" /> CV
          </a>
          <button
            data-testid="nav-ask-ai-button"
            onClick={openChat}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 font-mono2 text-[11px] font-bold uppercase tracking-widest text-[#07080A] hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(0,240,255,0.45)] transition-[background-color,box-shadow] duration-300"
          >
            <Bot className="size-4" /> Ask AI
          </button>
          <button
            data-testid="nav-mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-200 p-1"
            aria-label="Menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-white/10" data-testid="nav-mobile-menu">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <button
                key={l.target}
                data-testid={`nav-mobile-link-${l.target}`}
                onClick={() => go(l.target)}
                className="text-left font-mono2 text-xs uppercase tracking-[0.2em] text-slate-300 hover:text-cyan-300"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
};
