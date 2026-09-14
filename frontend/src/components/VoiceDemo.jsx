import { useState } from "react";
import { Loader2, Waves, Play } from "lucide-react";
import { API } from "../utils";

const VOICE_PROFILES = [
  { id: "onyx", label: "Founder", tone: "Deep · Authoritative" },
  { id: "nova", label: "Presenter", tone: "Energetic · Upbeat" },
  { id: "fable", label: "Storyteller", tone: "Expressive · Warm" },
  { id: "shimmer", label: "Host", tone: "Bright · Cheerful" },
];

export const VoiceDemo = () => {
  const [text, setText] = useState(
    "Welcome to EchoVerse. This voice was synthesized live on Rupesh's portfolio — pick a profile and make it say anything."
  );
  const [voice, setVoice] = useState("onyx");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), voice }),
      });
      const j = await res.json();
      if (j.url) {
        setUrl(`${process.env.REACT_APP_BACKEND_URL}${j.url}`);
      } else {
        setError("Synthesis failed — try a shorter line.");
      }
    } catch (e) {
      setError("Synthesis engine unreachable — retry.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/5 p-5" data-testid="voice-clone-demo">
      <div className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.3em] text-violet-300">
        <Waves className="size-4" /> Live demo — synthesis engine
      </div>
      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
        Type a line, pick a voice profile, and the engine renders speech in real time.
      </p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {VOICE_PROFILES.map((v) => (
          <button
            key={v.id}
            data-testid={`voice-profile-${v.id}`}
            onClick={() => setVoice(v.id)}
            className={`rounded-lg border px-3 py-2 text-left transition-colors duration-300 ${
              voice === v.id
                ? "border-violet-400/70 bg-violet-500/15"
                : "border-white/10 bg-white/[0.02] hover:border-violet-400/40"
            }`}
          >
            <div className={`font-mono2 text-[10px] font-bold uppercase tracking-widest ${voice === v.id ? "text-violet-300" : "text-slate-300"}`}>
              {v.label}
            </div>
            <div className="font-mono2 text-[9px] text-slate-500">{v.tone}</div>
          </button>
        ))}
      </div>

      <textarea
        data-testid="voice-demo-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={400}
        rows={3}
        className="mt-3 w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-400/60 transition-colors duration-300 resize-none"
        placeholder="Type something for the voice to say…"
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          data-testid="voice-demo-generate-button"
          onClick={generate}
          disabled={loading || !text.trim()}
          className="flex items-center gap-2 rounded-full bg-violet-500 px-6 py-2.5 font-mono2 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-violet-400 disabled:opacity-40 transition-colors duration-300"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
          {loading ? "Synthesizing…" : "Generate Voice"}
        </button>
        {error && <span data-testid="voice-demo-error" className="font-mono2 text-[10px] text-red-400">{error}</span>}
      </div>

      {url && (
        <audio
          key={url}
          data-testid="voice-demo-player"
          controls
          autoPlay
          src={url}
          className="mt-4 w-full h-10 rounded-lg"
        />
      )}
    </div>
  );
};
