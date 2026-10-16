import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Calculator,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

/* Panel Navy #0B1F3A | Cell Blue #1E4E8C | Sun #FFC233 | Sky Wash #EAF2F8 */

const features = [
  {
    icon: Zap,
    title: "Energy Calculator",
    text: "Calculate your estimated daily electricity consumption.",
  },
  {
    icon: BatteryCharging,
    title: "Battery Backup",
    text: "Understand your estimated battery backup requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Results",
    text: "Get simple results that are easy to understand.",
  },
  {
    icon: Users,
    title: "For Homeowners",
    text: "Designed to help homeowners make informed solar planning decisions.",
  },
];

const tagline = ["Calculate.", "Understand.", "Plan."];

const styles = `
@keyframes ab-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
@keyframes ab-spin { to { transform: rotate(360deg); } }
@keyframes ab-glow { 0%,100% { transform: scale(1); opacity: .8; } 50% { transform: scale(1.12); opacity: 1; } }
@keyframes ab-drift { from { background-position: 0 0; } to { background-position: 44px 44px; } }
@keyframes ab-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes ab-ring { 0% { box-shadow: 0 0 0 0 rgba(11,31,58,.45); } 70%,100% { box-shadow: 0 0 0 14px rgba(11,31,58,0); } }

.ab-rise { animation: ab-rise .85s cubic-bezier(.2,.7,.2,1) both; }
.ab-spin { animation: ab-spin 24s linear infinite; transform-origin: center; }
.ab-glow { animation: ab-glow 7s ease-in-out infinite; }
.ab-float { animation: ab-float 5s ease-in-out infinite; }
.ab-pulse { animation: ab-ring 2.4s ease-out infinite; }

/* Solar-cell grid, drifting very slowly */
.ab-cells {
  background-color: #0B1F3A;
  background-image:
    linear-gradient(rgba(120,170,230,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,170,230,0.14) 1px, transparent 1px);
  background-size: 44px 44px;
  animation: ab-drift 40s linear infinite;
}
.ab-cells-light {
  background-color: #EAF2F8;
  background-image:
    linear-gradient(rgba(30,78,140,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30,78,140,0.08) 1px, transparent 1px);
  background-size: 44px 44px;
}

/* Scroll reveal */
.ab-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .7s ease, transform .8s cubic-bezier(.2,.7,.2,1);
  transition-delay: var(--d, 0ms);
}
.ab-reveal[data-v="left"] { transform: translateX(-36px); }
.ab-reveal[data-v="right"] { transform: translateX(36px); }
.ab-reveal[data-v="zoom"] { transform: scale(.92); }
.ab-reveal.is-in { opacity: 1; transform: none; }

.ab-lift { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.ab-lift:hover { transform: translateY(-6px); box-shadow: 0 18px 30px -14px rgba(11,31,58,.5); }

/* Tagline words light up one after another */
.ab-word { opacity: .25; transition: opacity .6s ease, color .6s ease; transition-delay: var(--d, 0ms); }
.ab-tagline.is-in .ab-word { opacity: 1; }
.ab-tagline.is-in .ab-word:last-child { color: #FFC233; }

.ab-focus:focus-visible { outline: 3px solid #FFC233; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .ab-rise, .ab-spin, .ab-glow, .ab-float, .ab-pulse, .ab-cells { animation: none; }
  .ab-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .ab-lift, .ab-lift:hover { transition: none; transform: none; }
  .ab-word { opacity: 1; transition: none; }
}
`;

/* ---------- Helpers ---------- */

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
      className={`ab-reveal ${seen ? "is-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Page ---------- */

function About() {
  const navigate = useNavigate();
  const [taglineRef, taglineSeen] = useInView(0.5);

  return (
    <div className="bg-white text-slate-800">
      <style>{styles}</style>

      {/* Page header */}
      <section className="ab-cells relative overflow-hidden text-white">
        <div className="ab-glow pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#FFC233]/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
          <div
            className="ab-rise mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-sky-100"
            style={{ animationDelay: "50ms" }}
          >
            <Sun size={16} className="ab-spin mr-2 text-[#FFC233]" />
            About Solar System
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="ab-rise block" style={{ animationDelay: "150ms" }}>
              Making Solar Planning
            </span>
            <span className="ab-rise block" style={{ animationDelay: "300ms" }}>
              Simple for Everyone.
            </span>
          </h1>

          <p
            className="ab-rise mt-6 max-w-xl text-base text-sky-100 sm:text-lg"
            style={{ animationDelay: "480ms" }}
          >
            Our platform helps homeowners understand their electricity usage
            and find a suitable solar system through simple calculations and
            clear recommendations.
          </p>
        </div>
      </section>

      {/* Our purpose */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal variant="left">
            <div className="mb-5 flex items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFC233] text-[#0B1F3A]">
                <Sun size={26} />
              </span>
              <h2 className="ml-4 text-3xl font-extrabold text-[#0B1F3A] md:text-4xl">
                Our Purpose
              </h2>
            </div>

            <p className="mb-4 max-w-lg text-slate-600">
              Choosing a solar system can be confusing when you do not know how
              much electricity your home actually uses.
            </p>
            <p className="max-w-lg text-slate-600">
              We created this platform to make that process easier. Users can
              enter their appliances, quantity and daily usage hours to
              understand their estimated energy consumption.
            </p>
          </Reveal>

          <Reveal variant="right" delay={150}>
            <div className="ab-float">
              <div className="rounded-2xl border border-[#2E9E6B]/30 bg-[#EAF2F8] p-7 shadow-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B1F3A]">
                  <Calculator size={28} className="text-[#FFC233]" />
                </span>
                <h3 className="mt-5 mb-3 text-xl font-bold text-[#0B1F3A]">
                  Simple Solar Calculation
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Enter your appliances and usage details to get an estimated
                  electricity load and solar system recommendation.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we provide */}
      <section className="ab-cells relative overflow-hidden px-6 py-20 text-white md:px-12">
        <div className="ab-glow pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#FFC233]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <h2 className="mb-12 max-w-2xl text-3xl font-extrabold md:text-4xl">
              Tools designed for simple solar planning.
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} variant="zoom" delay={i * 120} className="h-full">
                <div className="ab-lift group h-full rounded-2xl border border-white/10 bg-[#0B1F3A]/90 p-6 hover:border-[#FFC233]/60">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-colors duration-300 group-hover:bg-[#FFC233]">
                    <f.icon
                      size={24}
                      className="text-[#FFC233] transition-colors duration-300 group-hover:text-[#0B1F3A]"
                    />
                  </span>
                  <h3 className="mt-5 mb-2 text-lg font-bold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-sky-200">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our vision */}
      <section className="ab-cells-light px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal variant="left">
            <h2 className="mb-4 text-3xl font-extrabold text-[#0B1F3A] md:text-4xl">
              A smarter way to understand your home's energy.
            </h2>
            <p className="max-w-lg text-slate-600">
              We want solar planning to be understandable for everyone. Instead
              of guessing your requirements, use your actual appliance usage to
              create a clear starting point for your solar journey.
            </p>
          </Reveal>

          <Reveal variant="right" delay={150}>
            <div className="rounded-2xl bg-[#0B1F3A] p-8 text-white shadow-xl">
              <Sun size={36} className="ab-spin text-[#FFC233]" />
              <h3 className="mt-4 mb-4 text-xl font-bold">Solar Made Simple</h3>

              <p
                ref={taglineRef}
                className={`ab-tagline text-3xl font-extrabold leading-tight ${
                  taglineSeen ? "is-in" : ""
                }`}
              >
                {tagline.map((word, i) => (
                  <span
                    key={word}
                    className="ab-word mr-2 inline-block"
                    style={{ "--d": `${300 + i * 500}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 py-20 md:px-12">
        <Reveal variant="zoom">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl bg-[#FFC233] px-8 py-12 md:px-12">
              <div className="ab-glow pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/40 blur-3xl" />

              <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-center md:text-left">
                  <h2 className="mb-2 text-3xl font-extrabold text-[#0B1F3A] md:text-4xl">
                    Start with your own appliances.
                  </h2>
                  <p className="text-[#0B1F3A]/80">
                    It takes a few minutes to get your estimated solar
                    requirement.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/Calculate/all")}
                  className="ab-focus ab-pulse group inline-flex shrink-0 cursor-pointer items-center rounded-lg bg-[#0B1F3A] px-7 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#12305a] active:scale-[0.98]"
                >
                  Calculate My Solar Needs
                  <ArrowRight
                    size={18}
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

export default About;