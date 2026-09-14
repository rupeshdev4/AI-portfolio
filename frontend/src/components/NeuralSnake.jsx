import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Bot, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const GRID = 20;
const CELL = 22;
const SIZE = GRID * CELL;
const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const key = (x, y) => `${x},${y}`;

const initialSnake = () => [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

const randomFood = (snake) => {
  while (true) {
    const f = { x: (Math.random() * GRID) | 0, y: (Math.random() * GRID) | 0 };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
};

const bfs = (start, target, blocked) => {
  const q = [[start.x, start.y]];
  const seen = new Set([key(start.x, start.y)]);
  const prev = new Map();
  while (q.length) {
    const [x, y] = q.shift();
    if (x === target.x && y === target.y) {
      const path = [];
      let cur = [x, y];
      while (prev.has(key(cur[0], cur[1]))) {
        path.unshift({ x: cur[0], y: cur[1] });
        cur = prev.get(key(cur[0], cur[1]));
      }
      return path;
    }
    for (const d of Object.values(DIRS)) {
      const nx = x + d.x;
      const ny = y + d.y;
      if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
      const nk = key(nx, ny);
      if (seen.has(nk) || blocked.has(nk)) continue;
      seen.add(nk);
      prev.set(nk, [x, y]);
      q.push([nx, ny]);
    }
  }
  return null;
};

const dirTo = (from, to) => ({ x: to.x - from.x, y: to.y - from.y });

export const NeuralSnake = () => {
  const canvasRef = useRef(null);
  const snakeRef = useRef(initialSnake());
  const dirRef = useRef(DIRS.right);
  const queueRef = useRef([]);
  const foodRef = useRef(randomFood(initialSnake()));
  const aiRef = useRef(false);
  const runningRef = useRef(false);
  const deadRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [ai, setAi] = useState(false);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("neural-snake-best") || 0));
  const [log, setLog] = useState(["Neural core idle. Press start."]);

  const pushLog = useCallback((msg) => {
    setLog((l) => [...l.slice(-5), msg]);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0A0C10";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(SIZE, i * CELL);
      ctx.stroke();
    }
    const f = foodRef.current;
    ctx.shadowColor = "#8B5CF6";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#8B5CF6";
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();
    const snake = snakeRef.current;
    snake.forEach((s, i) => {
      const t = 1 - i / snake.length;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = i === 0 ? 16 : 6;
      ctx.fillStyle = i === 0 ? "#A5F3FC" : `rgba(0,240,255,${0.35 + t * 0.55})`;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, 5);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const gameOver = useCallback(() => {
    deadRef.current = true;
    runningRef.current = false;
    setDead(true);
    setRunning(false);
    setScore((s) => {
      setBest((b) => {
        const nb = Math.max(b, s);
        localStorage.setItem("neural-snake-best", String(nb));
        return nb;
      });
      return s;
    });
    pushLog("SYSTEM FAILURE — snake terminated. Reset to retry.");
  }, [pushLog]);

  const aiDecide = useCallback(() => {
    const snake = snakeRef.current;
    const head = snake[0];
    const food = foodRef.current;
    const bodyNoTail = new Set(snake.slice(0, -1).map((s) => key(s.x, s.y)));
    const path = bfs(head, food, bodyNoTail);
    if (path && path.length) {
      if (path.length > 4) pushLog(`BFS lock → food in ${path.length} moves.`);
      return dirTo(head, path[0]);
    }
    const tail = snake[snake.length - 1];
    const bodyNoTail2 = new Set(snake.slice(0, -1).map((s) => key(s.x, s.y)));
    const tailPath = bfs(head, tail, bodyNoTail2);
    if (tailPath && tailPath.length) {
      pushLog("No food route. Chasing tail to survive.");
      return dirTo(head, tailPath[0]);
    }
    for (const d of Object.values(DIRS)) {
      const nx = head.x + d.x;
      const ny = head.y + d.y;
      if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
      if (!snake.some((s) => s.x === nx && s.y === ny)) {
        pushLog("Evasive maneuver — buying time.");
        return d;
      }
    }
    return null;
  }, [pushLog]);

  const tick = useCallback(() => {
    if (!runningRef.current || deadRef.current) return;
    let dir = dirRef.current;
    if (aiRef.current) {
      dir = aiDecide() || dir;
    } else if (queueRef.current.length) {
      const next = queueRef.current.shift();
      if (!(next.x === -dir.x && next.y === -dir.y)) dir = next;
    }
    const snake = snakeRef.current;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const eating = head.x === foodRef.current.x && head.y === foodRef.current.y;
    const body = eating ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID || body.some((s) => s.x === head.x && s.y === head.y)) {
      draw();
      gameOver();
      return;
    }
    const ns = [head, ...snake];
    if (eating) {
      foodRef.current = randomFood(ns);
      setScore((s) => s + 1);
    } else {
      ns.pop();
    }
    snakeRef.current = ns;
    dirRef.current = dir;
    draw();
  }, [aiDecide, draw, gameOver]);

  useEffect(() => {
    aiRef.current = ai;
  }, [ai]);

  useEffect(() => {
    if (!running || dead) return;
    const speed = ai ? 110 : Math.max(80, 150 - score * 3);
    const t = setInterval(tick, speed);
    return () => clearInterval(t);
  }, [running, dead, ai, score, tick]);

  useEffect(() => {
    const onKey = (e) => {
      if (!runningRef.current || aiRef.current) return;
      const map = { ArrowUp: DIRS.up, w: DIRS.up, W: DIRS.up, ArrowDown: DIRS.down, s: DIRS.down, S: DIRS.down, ArrowLeft: DIRS.left, a: DIRS.left, A: DIRS.left, ArrowRight: DIRS.right, d: DIRS.right, D: DIRS.right };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        const cur = dirRef.current;
        if (!(d.x === -cur.x && d.y === -cur.y)) queueRef.current = [d];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  const reset = () => {
    snakeRef.current = initialSnake();
    dirRef.current = DIRS.right;
    queueRef.current = [];
    foodRef.current = randomFood(snakeRef.current);
    deadRef.current = false;
    runningRef.current = false;
    setDead(false);
    setRunning(false);
    setScore(0);
    setLog(["Neural core reset. Press start."]);
    draw();
  };

  const toggleRun = () => {
    if (dead) return;
    const nr = !running;
    runningRef.current = nr;
    setRunning(nr);
    pushLog(nr ? (aiRef.current ? "AI autopilot engaged." : "Manual control engaged.") : "Paused.");
  };

  const toggleAi = () => {
    const na = !ai;
    setAi(na);
    pushLog(na ? "Pathfinding AI online — watch it think." : "AI offline. Manual control restored.");
  };

  const manualMove = (d) => {
    if (!running || ai) return;
    const cur = dirRef.current;
    if (!(d.x === -cur.x && d.y === -cur.y)) queueRef.current = [d];
  };

  return (
    <section id="game" data-testid="playable-ai-game" className="relative py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-violet-400">// INTERACTIVE DEMO — PRODUCT 05</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-100">
            Neural Snake.<br />
          <span className="text-stroke-cyan">Watch the AI think.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Play it yourself with arrow keys — or flip the autopilot and watch a BFS pathfinding agent hunt,
            survive dead-ends and narrate every decision in the thought log.
          </p>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl border border-[#1E222D] bg-[#0D0F14] p-4 sm:p-6">
              <div className="absolute -inset-10 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                data-testid="neural-snake-canvas"
                className="relative w-full max-w-[440px] mx-auto rounded-lg border border-white/10"
              />
              {dead && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm" data-testid="game-over-overlay">
                  <div className="text-center">
                    <div className="font-display text-3xl font-semibold text-red-400">SYSTEM FAILURE</div>
                    <div className="mt-2 font-mono2 text-xs text-slate-400">Score {score} — reset to run it back</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden" data-testid="game-scoreboard">
              <div className="bg-[#0A0C10] px-4 py-4">
                <div className="font-display text-2xl font-semibold text-cyan-300" data-testid="game-score">{score}</div>
                <div className="font-mono2 text-[9px] uppercase tracking-widest text-slate-500">Score</div>
              </div>
              <div className="bg-[#0A0C10] px-4 py-4">
                <div className="font-display text-2xl font-semibold text-violet-300" data-testid="game-best-score">{best}</div>
                <div className="font-mono2 text-[9px] uppercase tracking-widest text-slate-500">Best</div>
              </div>
              <div className="bg-[#0A0C10] px-4 py-4">
                <div className={`font-display text-2xl font-semibold ${ai ? "text-emerald-300" : "text-slate-300"}`} data-testid="game-mode">
                  {ai ? "AI" : "HUMAN"}
                </div>
                <div className="font-mono2 text-[9px] uppercase tracking-widest text-slate-500">Mode</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                data-testid="game-start-pause-button"
                onClick={toggleRun}
                disabled={dead}
                className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-mono2 text-[11px] font-bold uppercase tracking-widest text-[#07080A] hover:bg-cyan-300 disabled:opacity-40 transition-colors duration-300"
              >
                {running ? <Pause className="size-4" /> : <Play className="size-4" />}
                {running ? "Pause" : "Start"}
              </button>
              <button
                data-testid="game-reset-button"
                onClick={reset}
                className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono2 text-[11px] uppercase tracking-widest text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
              >
                <RotateCcw className="size-4" /> Reset
              </button>
              <button
                data-testid="game-ai-toggle-button"
                onClick={toggleAi}
                className={`flex items-center gap-2 rounded-full px-6 py-3 font-mono2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  ai
                    ? "bg-violet-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.4)]"
                    : "border border-violet-500/40 text-violet-300 hover:bg-violet-500/10"
                }`}
              >
                <Bot className="size-4" /> AI Autopilot {ai ? "ON" : "OFF"}
              </button>
            </div>

            <div className="rounded-xl border border-[#1E222D] bg-[#0A0C10] overflow-hidden" data-testid="game-decision-log">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                <span className="size-2 rounded-full bg-red-400/70" />
                <span className="size-2 rounded-full bg-amber-400/70" />
                <span className="size-2 rounded-full bg-emerald-400/70" />
                <span className="ml-2 font-mono2 text-[10px] uppercase tracking-widest text-slate-500">neural_core — thought.log</span>
              </div>
              <div className="px-4 py-3 h-32 overflow-hidden font-mono2 text-xs leading-6 text-slate-400">
                {log.map((l, i) => (
                  <div key={`${i}-${l}`} className={i === log.length - 1 ? "text-cyan-300" : ""}>
                    <span className="text-slate-600">&gt;</span> {l}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto sm:hidden" data-testid="game-dpad">
              <span />
              <button data-testid="dpad-up" onClick={() => manualMove(DIRS.up)} className="rounded-lg border border-white/15 p-3 text-slate-300 active:bg-cyan-400/20"><ArrowUp className="size-4 mx-auto" /></button>
              <span />
              <button data-testid="dpad-left" onClick={() => manualMove(DIRS.left)} className="rounded-lg border border-white/15 p-3 text-slate-300 active:bg-cyan-400/20"><ArrowLeft className="size-4 mx-auto" /></button>
              <button data-testid="dpad-down" onClick={() => manualMove(DIRS.down)} className="rounded-lg border border-white/15 p-3 text-slate-300 active:bg-cyan-400/20"><ArrowDown className="size-4 mx-auto" /></button>
              <button data-testid="dpad-right" onClick={() => manualMove(DIRS.right)} className="rounded-lg border border-white/15 p-3 text-slate-300 active:bg-cyan-400/20"><ArrowRight className="size-4 mx-auto" /></button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
