import { MARQUEE_ITEMS } from "../data/portfolio";

export const Marquee = () => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section
      data-testid="editorial-marquee"
      className="relative border-y border-white/10 bg-[#0A0C10] py-5 overflow-hidden"
    >
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-lg sm:text-xl font-medium tracking-wide text-slate-200">
              {item}
            </span>
            <span className="font-mono2 text-cyan-400 text-sm">//</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#07080A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07080A] to-transparent" />
    </section>
  );
};
