
import { useState } from "react";

const PEAK_SUN_HOURS = 5;
const SYSTEM_EFFICIENCY = 0.8;
const PANEL_KW = 0.55;
const MAX_PANEL_TILES = 30;

const APPLIANCES = [
  { id: "lights", name: "Lights (LED)", note: "Per bulb", watts: 24 },
  { id: "ac", name: "Air Conditioner", note: "1.5 ton, non-inverter", watts: 1500 },
  { id: "refrigerator", name: "Refrigerator", note: "Average running load", watts: 150 },
  { id: "fan", name: "Fan", note: "Ceiling / pedestal", watts: 80 },
  { id: "tv", name: "Television", note: "LED / LCD", watts: 120 },
  { id: "computer", name: "Computer", note: "Desktop with monitor", watts: 200 },
  { id: "iron", name: "Iron", note: "Dry iron", watts: 1000 },
  { id: "kitchen", name: "Kitchen Appliances", note: "Blender, kettle, etc.", watts: 1000 },
  { id: "microwave", name: "Microwave", note: "Oven", watts: 1200 },
  { id: "washingMachine", name: "Washing Machine", note: "Automatic / twin tub", watts: 500 },
];

const SOLAR_SIZES = [
  { kw: 3, panels: 6, daily: 12 },
  { kw: 5, panels: 10, daily: 20 },
  { kw: 8, panels: 15, daily: 32 },
  { kw: 10, panels: 19, daily: 40 },
];

const TIPS = [
  {
    title: "The AC is the biggest load",
    text: "A single AC can use more units than all the other appliances in your home put together. An inverter AC and a 26°C setting cut the cost a lot.",
  },
  {
    title: "LED and inverter appliances",
    text: "LED bulbs use much less power than old bulbs. Inverter fridges and fans also save units over the long run.",
  },
  {
    title: "Don't run iron and heavy loads together",
    text: "Heating appliances like irons, microwaves and kettles draw a lot of power even for a short time. It is better to run them during peak solar hours.",
  },
  {
    title: "Standby power counts too",
    text: "TVs, computers and chargers left plugged in quietly use units. Switch them off when you are not using them.",
  },
];

const FAQS = [
  {
    q: "What are peak sun hours?",
    a: "These are the hours of the day when the sun is strong enough for panels to produce close to their full rated power. An average of 5 hours is assumed for Pakistan, and this calculator uses the same value.",
  },
  {
    q: "Why is a 20% system loss added?",
    a: "Wiring, inverter conversion, heat and dust make the real output of panels lower than their rated power. A 20% loss is a practical margin.",
  },
  {
    q: "Which is better, battery or on-grid?",
    a: "An on-grid (net metering) system has no battery cost and can send extra units to the grid. A battery system helps during load shedding but costs more. Make the final choice based on your budget and how much load shedding you face.",
  },
  {
    q: "Is this result final?",
    a: "No, it is an estimate. For proper sizing, have a certified solar installer survey your site after checking your bill, roof space, shading and the nameplate wattage of your appliances.",
  },
];

/* CSS is kept in this same file */
const animationStyles = `
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

.aa-sun-rays {
  transform-origin: 12px 12px;
  animation: aa-spin 18s linear infinite;
}

.aa-rise {
  animation: aa-rise 700ms ease-out both;
}

.aa-pop {
  animation: aa-pop 420ms ease-out both;
}

.aa-sheen {
  background-image: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255,194,51,0.22) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: aa-sheen 900ms ease-out;
}

.aa-reveal {
  animation: aa-rise 650ms ease-out both;
}

.aa-bar {
  transition: width 700ms ease-out;
}

.aa-faq-content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms ease, opacity 300ms ease;
}

.aa-faq-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

@keyframes aa-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes aa-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aa-pop {
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  70% {
    transform: scale(1.12);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes aa-sheen {
  from {
    background-position: -100% 0;
  }
  to {
    background-position: 100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .aa-sun-rays,
  .aa-rise,
  .aa-pop,
  .aa-sheen,
  .aa-reveal {
    animation: none;
  }

  .aa-bar,
  .aa-faq-content {
    transition: none;
  }

  .aa-faq-content {
    display: block;
  }

  .aa-faq-content:not(.aa-faq-open) {
    display: none;
  }
}
`;

function createInitialValues() {
  const values = {};

  APPLIANCES.forEach((appliance) => {
    values[appliance.id] = {
      watts: appliance.watts,
      quantity: "",
      days: "",
      hours: "",
    };
  });

  return values;
}

function toNum(value) {
  const number = Number(value);

  if (Number.isFinite(number) && number > 0) {
    return number;
  }

  return 0;
}

function fmt(number, decimals = 1) {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
}

function NumberInput({ label, value, onChange, placeholder = "0", max }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500 md:hidden">
        {label}
      </span>

      <input
        type="number"
        min="0"
        max={max}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow duration-200 focus:border-[#FFC233] focus:outline-none focus:ring-2 focus:ring-[#FFC233]"
      />
    </label>
  );
}

function AnimatedNumber({ value, decimals = 1 }) {
  return <>{fmt(value, decimals)}</>;
}

function PanelTiles({ count }) {
  const shown = Math.min(count, MAX_PANEL_TILES);
  const extra = count - shown;

  if (count === 0) {
    return (
      <p className="text-xs text-sky-200">
        Add your appliances and your panels will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: shown }).map((_, index) => (
        <span
          key={index}
          style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
          className="aa-pop aa-tile block h-8 w-6 rounded-sm border border-sky-200/40"
        />
      ))}

      {extra > 0 && (
        <span className="ml-1 self-center text-xs text-sky-200">
          +{extra} more
        </span>
      )}
    </div>
  );
}

function Stat({ label, value, decimals = 1, unit, hint, strong }) {
  let cardClass =
    "rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-md";

  if (strong) {
    cardClass =
      "aa-cells aa-sheen relative overflow-hidden rounded-xl p-5 text-white";
  }

  return (
    <div className={cardClass}>
      <p className={strong ? "text-sm text-sky-200" : "text-sm text-slate-500"}>
        {label}
      </p>

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

        <span
          className={
            strong ? "text-sm text-sky-200" : "text-sm text-slate-500"
          }
        >
          {unit}
        </span>
      </p>

      {hint && (
        <p
          className={
            strong
              ? "mt-1 text-xs text-sky-200"
              : "mt-1 text-xs text-slate-500"
          }
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-[#0B1F3A]">{title}</h2>

      {subtitle && (
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between rounded py-4 text-left text-sm font-medium text-[#0B1F3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC233]"
      >
        {q}

        <span
          className={`ml-4 text-lg leading-none text-slate-400 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div className={`aa-faq-content ${open ? "aa-faq-open" : ""}`}>
        <div className="overflow-hidden">
          <p className="max-w-3xl pb-4 text-sm text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

function AllAppliances() {
  const [values, setValues] = useState(createInitialValues());
  const [rate, setRate] = useState("50");

  function update(id, field, value) {
    setValues({
      ...values,
      [id]: {
        ...values[id],
        [field]: value,
      },
    });
  }

  function reset() {
    setValues(createInitialValues());
    setRate("50");
  }

  const rows = APPLIANCES.map((appliance) => {
    const value = values[appliance.id];

    const watts = toNum(value.watts);
    const quantity = toNum(value.quantity);
    const days = Math.min(toNum(value.days), 30);
    const hours = Math.min(toNum(value.hours), 24);

    const units = (watts * quantity * days * hours) / 1000;
    const load = watts * quantity;

    return {
      ...appliance,
      units,
      load,
    };
  });

  let totalUnits = 0;
  let connectedLoad = 0;

  rows.forEach((appliance) => {
    totalUnits = totalUnits + appliance.units;
    connectedLoad = connectedLoad + appliance.load;
  });

  const dailyUsage = totalUnits / 30;
  const solarKw = dailyUsage / PEAK_SUN_HOURS / SYSTEM_EFFICIENCY;

  let panels = 0;

  if (solarKw > 0) {
    panels = Math.ceil(solarKw / PANEL_KW);
  }

  const bill = totalUnits * toNum(rate);

  const breakdown = rows
    .filter((appliance) => appliance.units > 0)
    .sort((a, b) => b.units - a.units);

  const hasData = totalUnits > 0;
  const top = breakdown[0];

  return (
    <div className="min-h-screen bg-[#EAF2F8]">
      <style>{animationStyles}</style>

      <header className="aa-cells">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="aa-rise flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="aa-sun h-9 w-9 text-[#FFC233]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="currentColor"
                fillOpacity="0.25"
              />

              <g className="aa-sun-rays">
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </g>
            </svg>

            <h1 className="text-2xl font-bold text-white sm:text-4xl">
              All Appliances Calculator
            </h1>
          </div>

          <p className="aa-rise mt-3 max-w-2xl text-sm text-sky-100 sm:text-base">
            Enter the quantity and usage of every appliance in your home. Your
            monthly units, estimated bill and the right solar system size will
            appear instantly below.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <section className="aa-rise overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#0B1F3A]">
                  Household appliances
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Days = days per month (max 30), Hours = hours per day (max 24)
                </p>
              </div>

              <button
                onClick={reset}
                className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFC233]"
              >
                Reset
              </button>
            </div>

            <div className="hidden grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_80px] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-600 md:grid">
              <span>Appliance</span>
              <span>Watts</span>
              <span>Quantity</span>
              <span>Days</span>
              <span>Hours/Day</span>
              <span className="text-right">Units</span>
            </div>

            <ul className="divide-y divide-slate-100">
              {rows.map((appliance) => {
                const value = values[appliance.id];
                const active = appliance.units > 0;

                return (
                  <li
                    key={appliance.id}
                    className={`grid grid-cols-2 gap-3 px-5 py-4 transition-colors duration-500 md:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_80px] md:items-center ${
                      active ? "bg-[#FFC233]/10" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="col-span-2 flex items-baseline justify-between md:col-span-1 md:block">
                      <div>
                        <p className="text-sm font-medium text-[#0B1F3A]">
                          {appliance.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {appliance.note}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-[#0B1F3A] tabular-nums md:hidden">
                        <AnimatedNumber value={appliance.units} decimals={2} />{" "}
                        <span className="text-xs font-normal text-slate-500">
                          kWh
                        </span>
                      </p>
                    </div>

                    <NumberInput
                      label="Watts"
                      value={value.watts}
                      placeholder="W"
                      onChange={(number) =>
                        update(appliance.id, "watts", number)
                      }
                    />

                    <NumberInput
                      label="Quantity"
                      value={value.quantity}
                      onChange={(number) =>
                        update(appliance.id, "quantity", number)
                      }
                    />

                    <NumberInput
                      label="Days"
                      value={value.days}
                      placeholder="30"
                      max={30}
                      onChange={(number) =>
                        update(appliance.id, "days", number)
                      }
                    />

                    <NumberInput
                      label="Hours/Day"
                      value={value.hours}
                      max={24}
                      onChange={(number) =>
                        update(appliance.id, "hours", number)
                      }
                    />

                    <p className="hidden text-right text-sm font-semibold text-[#0B1F3A] tabular-nums md:block">
                      <AnimatedNumber value={appliance.units} decimals={2} />
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm">
              <span className="text-slate-600">Total monthly units</span>

              <span className="font-bold text-[#0B1F3A] tabular-nums">
                <AnimatedNumber value={totalUnits} decimals={2} /> kWh
              </span>
            </div>
          </section>

          <aside className="aa-rise space-y-4 bg-[#0B1F3A] lg:sticky lg:top-6 rounded-2xl ">
            <Stat
              strong
              label="Recommended solar system"
              value={solarKw}
              decimals={2}
              unit="kW"
              hint={`${panels} panels of 550W`}
            />

            <div className="aa-cells rounded-xl p-5 ">
              <p className="mb-3 text-sm text-sky-200">Your panels</p>
              <PanelTiles count={panels} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Stat
                label="Daily usage"
                value={dailyUsage}
                decimals={2}
                unit="kWh"
              />

              <Stat
                label="Monthly usage"
                value={totalUnits}
                decimals={1}
                unit="kWh"
              />
            </div>

            <Stat
              label="Connected load"
              value={connectedLoad}
              decimals={0}
              unit="W"
              hint="Total load if all appliances run at the same time"
            />

            <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-md">
              <p className="text-sm text-slate-500">Estimated monthly bill</p>

              <p className="mt-1.5 text-2xl font-bold text-[#0B1F3A] tabular-nums">
                Rs <AnimatedNumber value={bill} decimals={0} />
              </p>

              <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                Rate per unit (Rs)

                <input
                  type="number"
                  min="0"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFC233]"
                />
              </label>

              <p className="mt-2 text-xs text-slate-400">
                This is an estimate. Slabs and taxes are not included.
              </p>
            </div>
          </aside>
        </div>

        <section className="aa-reveal mt-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionTitle
            title="Usage breakdown"
            subtitle="See how much each appliance contributes to your monthly units."
          />

          {hasData ? (
            <>
              <ul className="space-y-3">
                {breakdown.map((appliance) => {
                  const percentage = (appliance.units / totalUnits) * 100;

                  return (
                    <li key={appliance.id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-700">
                          {appliance.name}
                        </span>

                        <span className="text-slate-500 tabular-nums">
                          {fmt(appliance.units, 1)} kWh (
                          {fmt(percentage, 0)}%)
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="aa-bar h-full rounded-full bg-[#FFC233]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {top && (
                <p className="mt-5 rounded-lg border border-[#FFC233]/50 bg-[#FFC233]/15 px-4 py-3 text-sm text-[#0B1F3A]">
                  <strong>{top.name}</strong> uses the most units (
                  {fmt((top.units / totalUnits) * 100, 0)}%). Optimizing it can
                  reduce both your bill and the size of your solar system.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Enter the quantity, days and hours for your appliances above, and
              the breakdown will appear here.
            </p>
          )}
        </section>

        <section className="mt-10">
          <div className="aa-reveal">
            <SectionTitle
              title="How this is calculated"
              subtitle="This calculator works on a few simple assumptions."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Units per appliance",
                text: "Watts × Quantity × Days × Hours ÷ 1000 gives the monthly kWh.",
              },
              {
                title: "Daily usage",
                text: "Monthly units are divided by 30 days.",
              },
              {
                title: "Solar size",
                text: `Daily units ÷ ${PEAK_SUN_HOURS} sun hours ÷ ${SYSTEM_EFFICIENCY} efficiency = system kW.`,
              },
              {
                title: "Panels",
                text: "System kW is divided by 0.55 (a 550W panel) and rounded up.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                style={{ animationDelay: `${index * 90}ms` }}
                className="aa-reveal h-full rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="aa-reveal mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="p-5 pb-3 sm:p-6">
            <SectionTitle
              title="Common solar system sizes"
              subtitle="Approximate numbers based on 550W panels and 5 peak sun hours."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-5 py-3 font-semibold">System</th>
                  <th className="px-5 py-3 font-semibold">550W panels</th>
                  <th className="px-5 py-3 font-semibold">Daily generation</th>
                  <th className="px-5 py-3 font-semibold">Monthly generation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {SOLAR_SIZES.map((size, index) => {
                  let previousSize = 0;

                  if (index > 0) {
                    previousSize = SOLAR_SIZES[index - 1].kw;
                  }

                  const active =
                    hasData &&
                    solarKw <= size.kw &&
                    solarKw > previousSize;

                  return (
                    <tr
                      key={size.kw}
                      className={`transition-colors duration-500 ${
                        active ? "bg-[#FFC233]/20" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-[#0B1F3A]">
                        {size.kw} kW

                        {active && (
                          <span className="aa-pop ml-2 inline-block rounded-full bg-[#FFC233] px-2 py-0.5 text-xs font-semibold text-[#0B1F3A]">
                            Closest for you
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {size.panels}
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        ~{size.daily} kWh
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        ~{size.daily * 30} kWh
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <div className="aa-reveal">
            <SectionTitle
              title="Tips to save electricity"
              subtitle="Small changes can reduce both your monthly units and the solar system you need."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TIPS.map((tip, index) => (
              <div
                key={tip.title}
                style={{ animationDelay: `${index * 90}ms` }}
                className="aa-reveal h-full rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  {tip.title}
                </h3>

                <p className="mt-1.5 text-sm text-slate-600">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="aa-reveal">
            <SectionTitle title="Frequently asked questions" />
          </div>

          <div className="aa-reveal divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-slate-400">
          This calculator is for guidance only. Please consult a certified
          installer for the final system design.
        </p>
      </main>
    </div>
  );
}

export default AllAppliances;
