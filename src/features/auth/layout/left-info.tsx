export const AuthLeftInfo = () => {
  return (
    <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-espresso lg:flex">
      <img
        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=70"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative z-10 flex items-center gap-2 px-10 pt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-active">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Est. 2026 — Bilzen, Tanjungbalai
      </div>

      <div className="relative z-10 flex flex-col items-center px-10">
        <div className="bc-sway flex flex-col items-center">
          <span className="h-10 w-px bg-cream-active/60" />
          <span
            className="h-10 w-px bg-cream-active/60 translate-x-14 -mt-10"
            style={{ height: 40 }}
          />
          <div
            className="mt-2 rounded-2xl bg-cream px-10 py-7 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]"
            style={{ perspective: 800 }}
          >
            <div
              className="relative h-16 w-44 transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="font-display text-2xl font-bold tracking-[0.3em] text-destructive">
                  CLOSED
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-roast">
                  Staff terminal locked
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-12 font-display text-4xl font-semibold text-cream">
          Back of house.
        </h2>
        <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-cream-active">
          The counter opens for staff only. Grab your keys and the till is yours
          — everything behind this door stays behind it.
        </p>

        <div className="mt-10 -rotate-3 rounded-xl bg-cream px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-roast">
            Punch card
          </p>
          <div className="mt-2 flex items-center gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span
                key={i}
                className={`h-3.5 w-3.5 rounded-full border-2 border-roast ${i < 3 ? "bg-roast" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 overflow-hidden bg-roast py-2.5">
        <div className="bc-ticker-track flex w-max whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.3em] text-cream">
          <span className="px-4">Bean Counter staff terminal</span>
          <span className="px-4">·</span>
          <span className="px-4">No loitering past the counter</span>
          <span className="px-4">·</span>
          <span className="px-4">Fresh roast daily</span>
          <span className="px-4">·</span>
          <span className="px-4">Bean Counter staff terminal</span>
          <span className="px-4">·</span>
          <span className="px-4">No loitering past the counter</span>
          <span className="px-4">·</span>
          <span className="px-4">Fresh roast daily</span>
          <span className="px-4">·</span>
        </div>
      </div>
    </div>
  );
};
