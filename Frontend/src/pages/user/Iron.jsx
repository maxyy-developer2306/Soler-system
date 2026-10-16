import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Config ---------- */
const PEAK_SUN_HOURS = 5;
const SYSTEM_EFFICIENCY = 0.8; // 20% system loss
const PANEL_KW = 0.55; // 550W panel
const MAX_PANEL_TILES = 30;

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const fmt = (n, d = 1) =>
  n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });

/* ---------- Animation styles ---------- */
const animationStyles = `
@keyframes aa-spin { to { transform: rotate(360deg); } }
@keyframes aa-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes aa-pop { 0% { opacity: 0; transform: scale(0.4); } 70% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
@keyframes aa-sheen { 0% { background-position: -120% 0; } 100% { background-position: 220% 0; } }
.aa-sun-rays { transform-origin: 12px 12px; animation: aa-spin 18s linear infinite; }
.aa-rise { opacity: 0; animation: aa-rise 700ms cubic-bezier(.2,.7,.2,1) forwards; }
.aa-pop { opacity: 0; animation: aa-pop 420ms cubic-bezier(.2,.8,.3,1.2) forwards; }
.aa-sheen {
  background-image: linear-gradient(110deg, transparent 30%, rgba(255,194,51,0.22) 50%, transparent 70%);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  animation: aa-sheen 900ms ease-out 1;
}
.aa-cells {
  background-color: #0B1F3A;
  background-image:
    linear-gradient(rgba(120,170,230,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,170,230,0.14) 1px, transparent 1px);
  background-size: 40px 40px;
}
.aa-tile {
  background-color: #1E4E8C;
  background-image:
    linear-gradient(rgba(255,255,255,0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.28) 1px, transparent 1px);
  background-size: 8px 8px;
}
@media (prefers-reduced-motion: reduce) {
  .aa-sun-rays, .aa-rise, .aa-pop, .aa-sheen { animation: none !important; opacity: 1 !important; }
}
`;

/* ---------- Helpers ---------- */
function useAnimatedNumber(target, duration = 700) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      fromRef.current = target;
      setDisplay(target);
      return undefined;
    }

    const from = fromRef.current;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const value = from + (target - from) * (1 - Math.pow(1 - p, 3));
      fromRef.current = value;
      setDisplay(value);
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return display;
}

function AnimatedNumber({ value, decimals = 1 }) {
  const shown = useAnimatedNumber(value);
  return <>{fmt(shown, decimals)}</>;
}

function PanelTiles({ count }) {
  const shown = Math.min(count, MAX_PANEL_TILES);
  const extra = count - shown;

  if (count === 0) {
    return <p className="text-xs text-sky-200">Add your appliances and your panels will appear here.</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: shown }).map((_, i) => (
        <span
          key={i}
          style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
          className="aa-pop aa-tile block h-8 w-6 rounded-sm border border-sky-200/40"
        />
      ))}
      {extra > 0 && <span className="self-center text-xs text-sky-200 ml-1">+{extra} more</span>}
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder = "0", max }) {
  return (
    <label className="block">
      <span className="md:hidden text-xs font-medium text-slate-500 mb-1 block">{label}</span>
      <input
        type="number"
        min="0"
        max={max}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC233] focus:border-[#FFC233]"
      />
    </label>
  );
}

function Stat({ label, value, decimals = 1, unit, hint, strong }) {
  // Replay the light sweep each time the value of the main card changes
  const [sweepKey, setSweepKey] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSweepKey((k) => k + 1);
  }, [value]);

  return (
    <div
      key={strong ? sweepKey : undefined}
      className={
        strong
          ? "aa-cells aa-sheen relative overflow-hidden rounded-xl p-5 text-white"
          : "rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-md"
      }
    >
      <p className={strong ? "text-sm text-sky-200" : "text-sm text-slate-500"}>{label}</p>
      <p className="mt-1.5 flex items-baseline gap-1.5">
        <span
          className={
            strong
              ? "text-4xl font-bold text-[#FFC233] tabular-nums"
              : "text-2xl font-bold text-[#0B1F3A] tabular-nums"
          }
        >
          <AnimatedNumber value={value} decimals={decimals} />
        </span>
        <span className={strong ? "text-sm text-sky-200" : "text-sm text-slate-500"}>{unit}</span>
      </p>
      {hint && <p className={strong ? "mt-1 text-xs text-sky-200" : "mt-1 text-xs text-slate-500"}>{hint}</p>}
    </div>
  );
}

/* ---------- Page ---------- */
const APPLIANCES = [
  { id: "iron", name: "Electric Iron", note: "Dry iron", watts: 1000 },
  { id: "steamIron", name: "Steam Iron", note: "With steam function", watts: 1200 },
];

function Iron() {
  const buildInitial = () =>
    Object.fromEntries(APPLIANCES.map((a) => [a.id, { watts: a.watts, quantity: "", days: "", hours: "" }]));

  const [values, setValues] = useState(buildInitial);
  const [rate, setRate] = useState(50);

  const update = (id, field, val) =>
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const result = useMemo(() => {
    const rows = APPLIANCES.map((a) => {
      const v = values[a.id];
      const watts = toNum(v.watts);
      const qty = toNum(v.quantity);
      const days = Math.min(toNum(v.days), 30);
      const hours = Math.min(toNum(v.hours), 24);
      return { ...a, units: (watts * qty * days * hours) / 1000, load: watts * qty };
    });

    const totalUnits = rows.reduce((s, r) => s + r.units, 0);
    const connectedLoad = rows.reduce((s, r) => s + r.load, 0);
    const dailyUsage = totalUnits / 30;
    const solarKw = dailyUsage / PEAK_SUN_HOURS / SYSTEM_EFFICIENCY;
    const panels = solarKw > 0 ? Math.ceil(solarKw / PANEL_KW) : 0;
    const bill = totalUnits * toNum(rate);

    return { rows, totalUnits, connectedLoad, dailyUsage, solarKw, panels, bill };
  }, [values, rate]);

  return (
    <div className="min-h-screen bg-[#EAF2F8]">
      <style>{animationStyles}</style>

      <header className="aa-cells">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="aa-rise flex items-center gap-3" style={{ animationDelay: "50ms" }}>
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 text-[#FFC233]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.25" />
              <g className="aa-sun-rays">
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </g>
            </svg>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">Iron Calculator</h1>
          </div>
          <p
            className="aa-rise mt-3 max-w-2xl text-sky-100 text-sm sm:text-base"
            style={{ animationDelay: "250ms" }}
          >
            Enter your iron usage to estimate electricity consumption.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <section
            className="aa-rise lg:col-span-2 rounded-xl border border-slate-200 bg-white overflow-hidden"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#0B1F3A]">Iron</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Days = days per month (max 30), Hours = hours per day (max 24)
                </p>
              </div>
              <button
                onClick={() => setValues(buildInitial())}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFC233]"
              >
                Reset
              </button>
            </div>

            <div className="hidden md:grid md:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_80px] gap-3 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-600 border-b border-slate-200">
              <span>Appliance</span>
              <span>Watts</span>
              <span>Quantity</span>
              <span>Days</span>
              <span>Hours/Day</span>
              <span className="text-right">Units</span>
            </div>

            <ul className="divide-y divide-slate-100">
              {result.rows.map((a) => {
                const v = values[a.id];
                const active = a.units > 0;
                return (
                  <li
                    key={a.id}
                    className={`grid grid-cols-1 gap-3 px-3 py-4 transition-colors duration-500 sm:grid-cols-2 sm:px-5 md:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_80px] md:items-center ${
                      active ? "bg-[#FFC233]/10" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="col-span-1 flex items-baseline justify-between md:col-span-1 md:block sm:col-span-2">
                      <div>
                        <p className="text-sm font-medium text-[#0B1F3A]">{a.name}</p>
                        <p className="text-xs text-slate-500">{a.note}</p>
                      </div>
                      <p className="md:hidden text-sm font-semibold text-[#0B1F3A] tabular-nums">
                        <AnimatedNumber value={a.units} decimals={2} />{" "}
                        <span className="text-xs font-normal text-slate-500">kWh</span>
                      </p>
                    </div>

                    <NumberInput label="Watts" value={v.watts} placeholder="W" onChange={(x) => update(a.id, "watts", x)} />
                    <NumberInput label="Quantity" value={v.quantity} onChange={(x) => update(a.id, "quantity", x)} />
                    <NumberInput label="Days" value={v.days} placeholder="30" max={30} onChange={(x) => update(a.id, "days", x)} />
                    <NumberInput label="Hours/Day" value={v.hours} max={24} onChange={(x) => update(a.id, "hours", x)} />

                    <p className="hidden md:block text-right text-sm font-semibold text-[#0B1F3A] tabular-nums">
                      <AnimatedNumber value={a.units} decimals={2} />
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm">
              <span className="text-slate-600">Total monthly units</span>
              <span className="font-bold text-[#0B1F3A] tabular-nums">
                <AnimatedNumber value={result.totalUnits} decimals={2} /> kWh
              </span>
            </div>
          </section>

          <aside className="aa-rise space-y-4 lg:sticky lg:top-6" style={{ animationDelay: "550ms" }}>
            <Stat
              strong
              label="Recommended solar system"
              value={result.solarKw}
              decimals={2}
              unit="kW"
              hint={`Requires ${result.panels} panels of 550W`}
            />

            <div className="aa-cells rounded-xl p-5">
              <p className="text-sm text-sky-200 mb-3">Your panels</p>
              <PanelTiles count={result.panels} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Stat label="Daily usage" value={result.dailyUsage} decimals={2} unit="kWh/day" />
              <Stat label="Monthly estimated" value={result.totalUnits} decimals={1} unit="kWh/mo" hint="Based on 30 days" />
            </div>

            <Stat
              label="Connected load"
              value={result.connectedLoad}
              decimals={0}
              unit="W"
              hint="Total load if all appliances run at the same time"
            />

            <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-md">
              <p className="text-sm text-slate-500">Estimated monthly bill</p>
              <p className="mt-1.5 text-2xl font-bold text-[#0B1F3A] tabular-nums">
                Rs <AnimatedNumber value={result.bill} decimals={0} />
              </p>
              <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                Rate per unit (Rs)
                <input
                  type="number"
                  min="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFC233]"
                />
              </label>
              <p className="mt-2 text-xs text-slate-400">This is an estimate. Slabs and taxes are not included.</p>
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          This calculator is for guidance only. Please consult a certified installer for the final system design.
        </p>
      </main>
    </div>
  );
}

export default Iron;