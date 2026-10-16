import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  ListChecks,
  Clock3,
  Zap,
  BatteryCharging,
  CheckCircle2,
  ArrowRight,
  Sun,
} from "lucide-react";

/* Panel Navy #0B1F3A | Cell Blue #1E4E8C | Sun #FFC233 | Sky Wash #EAF2F8 */

const steps = [
  {
    icon: ListChecks,
    title: "Select Appliances",
    text: "Choose the appliances you use at home, such as fans, lights, refrigerator, TV and other electrical devices.",
  },
  {
    icon: Clock3,
    title: "Enter Daily Usage",
    text: "Enter how many appliances you have and how many hours each appliance is used every day.",
  },
  {
    icon: Calculator,
    title: "Calculate Your Load",
    text: "The system calculates your estimated daily electricity consumption based on the information you provide.",
  },
];

const results = [
  "Estimated daily energy consumption",
  "Recommended solar system capacity",
  "Estimated battery backup",
];

const styles = `
@keyframes hw-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
@keyframes hw-spin { to { transform: rotate(360deg); } }
@keyframes hw-glow { 0%,100% { transform: scale(1); opacity: .8; } 50% { transform: scale(1.12); opacity: 1; } }
@keyframes hw-drift { from { background-position: 0 0; } to { background-position: 44px 44px; } }
@keyframes hw-ring { 0% { box-shadow: 0 0 0 0 rgba(11,31,58,.35); } 70%,100% { box-shadow: 0 0 0 12px rgba(11,31,58,0); } }

.hw-rise { animation: hw-rise .85s cubic-bezier(.2,.7,.2,1) both; }
.hw-spin { animation: hw-spin 24s linear infinite; transform-origin: center; }
.hw-glow { animation: hw-glow 7s ease-in-out infinite; }
.hw-pulse { animation: hw-ring 2.4s ease-out infinite; }

/* Solar-cell grid, drifting very slowly */
.hw-cells {
  background-color: #0B1F3A;
  background-image:
    linear-gradient(rgba(120,170,230,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,170,230,0.14) 1px, transparent 1px);
  background-size: 44px 44px;
  animation: hw-drift 40s linear infinite;
}
.hw-cells-light {
  background-color: #EAF2F8;
  background-image:
    linear-gradient(rgba(30,78,140,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30,78,140,0.08) 1px, transparent 1px);
  background-size: 44px 44px;
}

/* Scroll reveal */
.hw-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .7s ease, transform .8s cubic-bezier(.2,.7,.2,1);
  transition-delay: var(--d, 0ms);
}
.hw-reveal[data-v="left"] { transform: translateX(-36px); }
.hw-reveal[data-v="right"] { transform: translateX(36px); }
.hw-reveal[data-v="zoom"] { transform: scale(.92); }
.hw-reveal.is-in { opacity: 1; transform: none; }

/* Card lift on hover (softer shadow for a flat look) */
.hw-lift { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.hw-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px -14px rgba(11,31,58,.25); }

/* The line between steps fills in when scrolled into view */
.hw-line-fill { transform: scaleX(0); transform-origin: left; transition: transform 1.6s ease-in-out .3s; }
.hw-line.is-in .hw-line-fill { transform: scaleX(1); }

/* Bars in the result card fill up */
.hw-bar { transform: scaleX(0); transform-origin: left; transition: transform 1.4s cubic-bezier(.2,.7,.2,1) var(--d, 0ms); }
.hw-bars.is-in .hw-bar { transform: scaleX(1); }

.hw-focus:focus-visible { outline: 2px solid #FFC233; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .hw-rise, .hw-spin, .hw-glow, .hw-pulse, .hw-cells { animation: none; }
  .hw-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .hw-lift, .hw-lift:hover { transition: none; transform: none; }
  .hw-line-fill, .hw-bar { transform: scaleX(1); transition: none; }
}
`;

/* ---------- Helpers ---------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Becomes true once the element is scrolled into view (only once)
function useInView(threshold = 0.2, rootMargin = "0px") {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, seen];
}

// Fades and slides children in when they appear. variant: up | left | right | zoom
function Reveal({ children, delay = 0, variant = "up", className = "" }) {
  const [ref, seen] = useInView(0.12, "0px 0px -6% 0px");
  return (
    <div
      ref={ref}
      data-v={variant}
      style={{ "--d": `${delay}ms` }}
      className={`hw-reveal ${seen ? "is-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// Counts up to `end` once the number is visible
function CountOnView({ end, decimals = 0, duration = 1600 }) {
  const [ref, seen] = useInView(0.5);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!seen) return undefined;
    if (prefersReducedMotion()) {
      setValue(end);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, end, duration]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}

/* ---------- Page ---------- */

function HowItWorks() {
  const navigate = useNavigate();
  const goCalculate = () => navigate("/Calculate/all");

  const [lineRef, lineSeen] = useInView(0.3);
  const [barsRef, barsSeen] = useInView(0.3);

  return (
    <div className="bg-white text-slate-800">
      <style>{styles}</style>

      {/* Page header */}
      <section className="hw-cells relative overflow-hidden text-white">
        <div className="hw-glow pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#FFC233]/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
          <div
            className="hw-rise mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-light text-sky-100"
            style={{ animationDelay: "50ms" }}
          >
            <Sun size={16} className="hw-spin mr-2 text-[#FFC233]" />
            How it works
          </div>

          {/* Thin heading: font-light instead of extrabold */}
          <h1 className="text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="hw-rise block" style={{ animationDelay: "150ms" }}>
              Calculate Your Solar Needs
            </span>
            <span className="hw-rise block" style={{ animationDelay: "300ms" }}>
              in Simple Steps.
            </span>
          </h1>

          <p
            className="hw-rise mt-6 max-w-xl text-base font-light text-sky-100 sm:text-lg"
            style={{ animationDelay: "480ms" }}
          >
            Enter your home appliances and their daily usage. Our calculator
            will estimate your electricity consumption and suggest a suitable
            solar system.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-light text-[#0B1F3A] md:text-4xl">
                From appliances to solar recommendation.
              </h2>
              <p className="mt-3 font-light text-slate-600">
                Follow these simple steps to understand your home's energy
                needs.
              </p>
            </div>
          </Reveal>

          <div className="relative">
            {/* Line that connects the three steps (desktop only) */}
            <div
              ref={lineRef}
              className={`hw-line absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-slate-200 md:block ${
                lineSeen ? "is-in" : ""
              }`}
            >
              <div className="hw-line-fill h-full bg-[#FFC233]" />
            </div>

            <div className="grid gap-10 md:grid-cols-3 md:gap-6">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 180} className="h-full">
                  <div className="group flex h-full flex-col items-center">
                    <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFC233] text-[#0B1F3A] ring-8 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <step.icon size={24} strokeWidth={1.5} />
                    </span>

                    <div className="hw-lift mt-6 w-full flex-1 rounded-xl border border-slate-200 bg-white p-6 text-center hover:border-[#FFC233]">
                      <p className="text-sm font-normal text-[#1E4E8C]">
                        Step {i + 1}
                      </p>
                      <h3 className="mt-2 mb-3 text-xl font-normal text-[#0B1F3A]">
                        {step.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-slate-600">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="hw-cells-light px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal variant="left">
            <h2 className="mb-4 text-3xl font-light text-[#0B1F3A] md:text-4xl">
              Get a clear solar system estimate.
            </h2>
            <p className="mb-6 max-w-md font-light text-slate-600">
              After calculating your electricity load, the system gives you
              useful information about the solar panels, required capacity and
              battery backup.
            </p>

            <ul className="space-y-3">
              {results.map((text, i) => (
                <Reveal key={text} variant="left" delay={250 + i * 140}>
                  <li className="flex items-center rounded-lg border border-slate-200 bg-white p-3.5 transition-colors duration-200 hover:border-[#2E9E6B]">
                    <CheckCircle2
                      size={20}
                      strokeWidth={1.5}
                      className="mr-3 shrink-0 text-[#2E9E6B]"
                    />
                    <span className="text-sm font-normal">{text}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          {/* Sample result card */}
          <Reveal variant="right" delay={150}>
            <div className="hw-cells rounded-xl border border-white/10 p-7 text-white">
              <div className="flex items-center justify-between">
                <Zap size={28} strokeWidth={1.5} className="text-[#FFC233]" />
                <span className="text-xs font-light text-sky-200">Sample home</span>
              </div>

              <h3 className="mt-4 mb-2 text-xl font-normal">Energy Calculation</h3>
              <p className="mb-5 text-sm font-light text-sky-200">
                Your appliance usage is converted into an estimated daily
                electricity requirement.
              </p>

              <div className="mb-5 rounded-md border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-sm font-light text-sky-200">The formula</p>
                <p className="font-normal text-[#FFC233]">
                  Watts × Quantity × Hours ÷ 1000
                </p>
              </div>

              <div
                ref={barsRef}
                className={`hw-bars space-y-4 ${barsSeen ? "is-in" : ""}`}
              >
                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center text-sm font-light">
                      <Calculator size={18} strokeWidth={1.5} className="mr-3 text-[#FFC233]" />
                      Appliance Load
                    </span>
                    <span className="font-normal tabular-nums">
                      <CountOnView end={14.2} decimals={1} /> units
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="hw-bar h-full w-[72%] rounded-full bg-[#FFC233]"
                      style={{ "--d": "200ms" }}
                    />
                  </div>
                </div>

                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center text-sm font-light">
                      <BatteryCharging size={18} strokeWidth={1.5} className="mr-3 text-[#FFC233]" />
                      Battery Backup
                    </span>
                    <span className="font-normal tabular-nums">
                      <CountOnView end={4.8} decimals={1} /> kWh
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="hw-bar h-full w-[48%] rounded-full bg-[#FFC233]"
                      style={{ "--d": "450ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-6 py-20 md:px-12">
        <Reveal variant="zoom">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl bg-[#FFC233] px-8 py-12 md:px-12">
              <div className="hw-glow pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/40 blur-3xl" />

              <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-center md:text-left">
                  <h2 className="mb-2 text-3xl font-light text-[#0B1F3A] md:text-4xl">
                    Ready to calculate your solar needs?
                  </h2>
                  <p className="font-light text-[#0B1F3A]/80">
                    Start adding your appliances and find your estimated solar
                    requirement.
                  </p>
                </div>

                <button
                  onClick={goCalculate}
                  className="hw-focus hw-pulse group inline-flex shrink-0 cursor-pointer items-center rounded-md bg-[#0B1F3A] px-6 py-2.5 text-sm font-normal text-white transition-colors duration-200 hover:bg-[#12305a] active:scale-[0.98]"
                >
                  Start Calculation
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default HowItWorks;