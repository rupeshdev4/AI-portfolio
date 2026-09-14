import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { API } from "../utils";
import { QUICK_CHIPS } from "../data/portfolio";

const GREETING =
  "Neural link established. I'm RUPESH.AI — trained on every line of Rupesh's CV. Ask me about his metrics, his SAP years, FinPilot, or why he's worth hiring.";

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const sessionRef = useRef(
    localStorage.getItem("rd-chat-session") ||
      (() => {
        const id = (crypto.randomUUID && crypto.randomUUID()) || `s-${Date.now()}`;
        localStorage.setItem("rd-chat-session", id);
        return id;
      })()
  );

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionRef.current, message: msg }),
      });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const p of parts) {
          const line = p.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            done = true;
            break;
          }
          try {
            const j = JSON.parse(data);
            if (j.delta) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + j.delta };
                return copy;
              });
            } else if (j.error) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: j.error };
                return copy;
              });
            }
          } catch (e) {
            /* partial chunk */
          }
        }
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Neural link disrupted. Please retry." };
        return copy;
      });
    }
    setBusy(false);
  };

  return (
    <>
      <motion.button
        data-testid="chat-widget-fab"
        onClick={() => setOpen(!open)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200, damping: 16 }}
        className="fixed bottom-5 right-5 z-[90] size-14 rounded-full bg-cyan-400 text-[#07080A] flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.45)] hover:bg-cyan-300 transition-colors duration-300"
        aria-label="Open AI chat"
      >
        <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20" />
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="ask-cv-chatbot"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-[90] w-[calc(100vw-2rem)] max-w-[400px] h-[540px] max-h-[70vh] glass rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative size-9 rounded-full bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center">
                  <Bot className="size-4 text-cyan-300" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-[#0D0F14]" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold text-slate-100">RUPESH.AI</div>
                  <div className="font-mono2 text-[9px] uppercase tracking-widest text-emerald-400">CV neural link — live</div>
                </div>
              </div>
              <button
                data-testid="chat-close-button"
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-200 transition-colors duration-300"
              >
                <X className="size-5" />
              </button>
            </div>

            <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto px-4 py-4 space-y-3" data-testid="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-cyan-400 text-[#07080A] rounded-br-sm"
                        : "bg-white/[0.06] border border-white/10 text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.content || <span className="blink text-cyan-300">▊</span>}
                  </div>
                </div>
              ))}
              {busy && messages[messages.length - 1]?.content === "" && (
                <div className="font-mono2 text-[10px] text-slate-500 pl-1">RUPESH.AI is thinking…</div>
              )}
            </div>

            <div className="px-4 pb-2 flex gap-2 overflow-x-auto chat-scroll" data-testid="chat-quick-chips">
              {QUICK_CHIPS.map((q) => (
                <button
                  key={q}
                  data-testid={`chat-chip-${q.slice(0, 12).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => send(q)}
                  disabled={busy}
                  className="shrink-0 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5 font-mono2 text-[10px] text-cyan-300 hover:bg-cyan-400/15 disabled:opacity-40 transition-colors duration-300"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 p-3 flex items-center gap-2">
              <input
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about Rupesh…"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/60 transition-colors duration-300"
              />
              <button
                data-testid="chat-send-button"
                onClick={() => send()}
                disabled={busy || !input.trim()}
                className="size-10 rounded-full bg-cyan-400 text-[#07080A] flex items-center justify-center hover:bg-cyan-300 disabled:opacity-40 transition-colors duration-300"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
