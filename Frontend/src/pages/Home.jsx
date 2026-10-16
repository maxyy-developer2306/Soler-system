
import { useEffect, useState } from "react";
import {
  Calculator,
  Zap,
  BatteryCharging,
  Home as HomeIcon,
  Store,
  ArrowRight,
  Sun,
  Lightbulb,
  Fan,
  Tv,
  Refrigerator,
  PlugZap,
  CheckCircle2,
  Plus,
  Minus,
  ChevronDown,
  CloudSun,
  Wallet,
  Gauge,
  ShieldCheck,
  Wind,
  Waves,
} from "lucide-react";

import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import MiniChatbot from "../components/MiniChatbot";
import { API_BASE } from "../config/api";

function Home() {
  const [items, setItems] = useState([
    { id: 1, name: "LED lights", watts: 12, qty: 6, hours: 6, icon: Lightbulb },
    { id: 2, name: "Ceiling fans", watts: 75, qty: 3, hours: 10, icon: Fan },
    { id: 3, name: "LED TV", watts: 100, qty: 1, hours: 4, icon: Tv },
    { id: 4, name: "Fridge", watts: 180, qty: 1, hours: 10, icon: Refrigerator },
  ]);

  const [openFaq, setOpenFaq] = useState(-1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const sections = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch(
          API_BASE + "/api/products/products"
        );

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.log(error);
      }
    }

    getProducts();
  }, []);

  function updateItem(id, field, value) {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function goToCalculator() {
    document.querySelector(".calculator-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  let dailyUnits = 0;
  let connectedWatts = 0;

  items.forEach((item) => {
    dailyUnits += (item.watts * item.qty * item.hours) / 1000;
    connectedWatts += item.watts * item.qty;
  });

  const panels = Math.ceil(dailyUnits / (4.5 * 0.75) / 0.55);
  const battery = (connectedWatts * 3) / 1000 / 0.8;
  const inverter = Math.ceil((connectedWatts * 1.25) / 500) * 0.5;

  return (
    <div className="overflow-hidden bg-white text-slate-800">
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .reveal {
          opacity: 0;
          transform: translateY(35px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal.show {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .fade-in {
          animation: fadeIn 0.8s ease both;
        }

        .float-animation {
          animation: float 4s ease-in-out infinite;
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-7px);
          box-shadow: 0 16px 35px rgba(11, 31, 58, 0.12);
        }

        .button-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            background-color 0.25s ease;
        }

        .button-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 18px rgba(11, 31, 58, 0.15);
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .fade-in,
          .float-animation,
          .card-hover,
          .button-hover {
            animation: none;
            transition: none;
            transform: none;
          }

          .reveal {
            opacity: 1;
          }
        }
      `}</style>

      <Hero />
      <MiniChatbot />

      {/* Introduction */}
      <section className="reveal bg-[#EAF2F8] px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold text-[#1E4E8C]">
              SMART SOLAR PLANNING
            </p>

            <h1 className="text-4xl font-bold leading-tight text-[#0B1F3A] md:text-5xl">
              Understand Your Energy.
              <br />
              Plan Your Solar System.
            </h1>

            <p className="my-6 max-w-lg leading-7 text-slate-600">
              Find out how much electricity your home uses and get a simple
              solar estimate based on the appliances you use every day.
            </p>

            <button
              onClick={goToCalculator}
              className="button-hover inline-flex items-center gap-2 rounded-md bg-[#FFC233] px-4 py-3 font-semibold text-[#0B1F3A]"
            >
              Start Calculation <ArrowRight size={17} />
            </button>

            <Link
              to="/products"
              className="button-hover ml-3 inline-block rounded-md border border-[#0B1F3A] px-4 py-3 text-sm text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
            >
              Browse Products
            </Link>
          </div>

          <div className="float-animation rounded-2xl bg-[#0B1F3A] p-6 text-white shadow-xl">
            <Sun size={35} className="text-[#FFC233]" />

            <p className="mt-3 text-sm text-sky-200">Sample home</p>
            <h2 className="mb-5 mt-2 text-2xl font-bold">
              Solar Calculator
            </h2>

            <div className="mb-3 flex items-center justify-between rounded-lg bg-white/10 p-3 transition hover:bg-white/15">
              <span className="flex items-center gap-2 text-sm">
                <Zap className="text-[#FFC233]" size={20} />
                Daily energy use
              </span>
              <b>14.2 units</b>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-lg bg-white/10 p-3 transition hover:bg-white/15">
              <span className="flex items-center gap-2 text-sm">
                <BatteryCharging className="text-[#FFC233]" size={20} />
                Battery backup
              </span>
              <b>4.8 kWh</b>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/10 p-3 transition hover:bg-white/15">
              <span className="flex items-center gap-2 text-sm">
                <Sun className="text-[#FFC233]" size={20} />
                Solar panels
              </span>
              <b>7 panels</b>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="reveal bg-[#0B1F3A] px-6 py-10 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["12,500+", "Calculations done"],
            ["48", "Appliances in the list"],
            ["30 sec", "Average time to a result"],
            ["100%", "Free to use"],
          ].map(([number, label]) => (
            <div key={label} className="card-hover rounded-lg p-3">
              <h2 className="text-3xl font-bold text-[#FFC233]">
                {number}
              </h2>
              <p className="mt-2 text-sm text-sky-200">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="reveal px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-[#0B1F3A]">
            How It Works
          </h2>

          <p className="mb-10 mt-3 text-center text-slate-500">
            Three easy steps. No complicated forms.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Calculator,
                title: "Add Appliances",
                text: "Choose lights, fans, TV, fridge and other devices.",
              },
              {
                icon: Zap,
                title: "Enter Usage",
                text: "Select quantity and how many hours each device runs daily.",
              },
              {
                icon: BatteryCharging,
                title: "See Your Result",
                text: "Get an estimate of panels, battery and inverter capacity.",
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className="card-hover rounded-xl border bg-white p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#1E4E8C]">
                    <Icon size={27} />
                  </div>

                  <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="calculator-section reveal bg-[#EAF2F8] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#0B1F3A]">
            Try It Right Here
          </h2>

          <p className="mb-8 mt-3 text-slate-600">
            Change the quantity and hours to update your solar estimate.
          </p>

          <div className="grid items-stretch gap-6 lg:grid-cols-5">
            <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-3">
              <div className="mb-4 hidden grid-cols-3 gap-3 border-b pb-3 text-sm text-slate-500 sm:grid">
                <span>Appliance</span>
                <span>Quantity</span>
                <span>Hours per day</span>
              </div>

              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 items-center gap-4 border-b py-5 last:border-0 sm:grid-cols-3"
                  >
                    <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                      <div className="rounded-lg bg-[#EAF2F8] p-2 text-[#1E4E8C]">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">{item.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.watts} W each
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-slate-500 sm:hidden">
                        Quantity
                      </p>

                      <div className="flex w-fit items-center rounded-md border">
                        <button
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() =>
                            updateItem(
                              item.id,
                              "qty",
                              Math.max(0, item.qty - 1)
                            )
                          }
                          className="p-2 transition hover:bg-[#EAF2F8]"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-7 text-center text-sm">
                          {item.qty}
                        </span>

                        <button
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() =>
                            updateItem(
                              item.id,
                              "qty",
                              Math.min(99, item.qty + 1)
                            )
                          }
                          className="p-2 transition hover:bg-[#EAF2F8]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-slate-500 sm:hidden">
                        Hours per day
                      </p>

                      <div className="flex w-fit items-center rounded-md border">
                        <button
                          aria-label={`Decrease ${item.name} hours`}
                          onClick={() =>
                            updateItem(
                              item.id,
                              "hours",
                              Math.max(0, item.hours - 1)
                            )
                          }
                          className="p-2 transition hover:bg-[#EAF2F8]"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-7 text-center text-sm">
                          {item.hours}
                        </span>

                        <button
                          aria-label={`Increase ${item.name} hours`}
                          onClick={() =>
                            updateItem(
                              item.id,
                              "hours",
                              Math.min(24, item.hours + 1)
                            )
                          }
                          className="p-2 transition hover:bg-[#EAF2F8]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-[#0B1F3A] p-6 text-white shadow-lg lg:col-span-2">
              <p className="text-sm text-sky-200">Your daily energy use</p>

              <h2 className="my-3 text-5xl font-bold text-[#FFC233]">
                {dailyUnits.toFixed(2)}
                <span className="ml-2 text-lg text-white">units</span>
              </h2>

              <p className="mb-6 text-sm text-sky-200">
                About {(dailyUnits * 30).toFixed(1)} units every month
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/10 p-3 transition hover:bg-white/15">
                  <span className="flex items-center gap-2 text-sm">
                    <Sun size={18} className="text-[#FFC233]" />
                    Solar panels
                  </span>
                  <b>{panels}</b>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/10 p-3 transition hover:bg-white/15">
                  <span className="flex items-center gap-2 text-sm">
                    <BatteryCharging size={18} className="text-[#FFC233]" />
                    Battery backup
                  </span>
                  <b>{battery.toFixed(1)} kWh</b>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/10 p-3 transition hover:bg-white/15">
                  <span className="flex items-center gap-2 text-sm">
                    <PlugZap size={18} className="text-[#FFC233]" />
                    Inverter size
                  </span>
                  <b>{inverter.toFixed(1)} kW</b>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-sky-200">
                This is an estimate. Ask a solar installer to confirm the
                final system size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formula */}
      <section className="reveal bg-[#0B1F3A] px-6 py-16 text-white md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold">
              Know Where Your Electricity Goes
            </h2>

            <p className="mb-4 leading-7 text-sky-100">
              Every appliance adds to your electricity bill. A fan, light and
              AC all use different amounts of power.
            </p>

            <p className="leading-7 text-sky-100">
              Enter watts, quantity and hours to calculate your daily units.
            </p>
          </div>

          <div className="card-hover rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-sky-200">The simple formula</p>

            <h3 className="my-4 text-xl font-bold text-[#FFC233]">
              Watts × Quantity × Hours ÷ 1000
            </h3>

            <p className="mb-3 text-sm text-sky-200">
              Example: 3 ceiling fans
            </p>

            <p className="mb-4">
              75 W × 3 × 10 ÷ 1000 ={" "}
              <b className="text-[#FFC233]">2.25 units</b>
            </p>

            <p className="font-semibold">Result: units per day</p>
          </div>
        </div>
      </section>

      {/* Watt Table */}
      <section className="reveal px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#0B1F3A]">
            How Much Power Does Each Device Use?
          </h2>

          <p className="mb-8 mt-3 text-slate-600">
            These are typical values. Check your device label for exact wattage.
          </p>

          <div className="overflow-x-auto rounded-xl border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-[#0B1F3A] text-white">
                <tr>
                  <th className="p-4">Device</th>
                  <th className="p-4">Typical power</th>
                  <th className="p-4">Good to know</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["LED bulb", "10–15 W", "Low electricity use"],
                  ["Tube light", "20–40 W", "Older ones use more"],
                  ["Ceiling fan", "70–90 W", "DC fans use less"],
                  ["LED TV", "80–120 W", "Depends on screen size"],
                  ["Refrigerator", "150–250 W", "Compressor cycles on and off"],
                  ["Inverter AC", "1000–1500 W", "Depends on AC and usage"],
                  ["Water pump (1 hp)", "~750 W", "High starting load"],
                  ["Washing machine", "400–500 W", "Depends on the cycle"],
                ].map(([device, power, note], index) => (
                  <tr
                    key={device}
                    className={`border-b transition hover:bg-yellow-50 ${
                      index % 2 === 1 ? "bg-[#EAF2F8]" : "bg-white"
                    }`}
                  >
                    <td className="p-4 font-semibold">{device}</td>
                    <td className="p-4">{power}</td>
                    <td className="p-4">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sunlight */}
      <section className="reveal bg-[#EAF2F8] px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-[#0B1F3A]">
              Panels Work While the Sun Is Up
            </h2>

            <p className="mb-4 leading-7 text-slate-600">
              Most solar energy is produced during daylight. A battery can
              store energy for later use.
            </p>

            <p className="mb-5 leading-7 text-slate-600">
              This estimate uses 4.5 peak sun hours and allows for system losses.
            </p>

            <p className="flex items-center gap-2 text-sm text-[#1E4E8C]">
              <CloudSun size={22} />
              Cloudy days produce less solar energy.
            </p>
          </div>

          <div className="card-hover rounded-xl border bg-white p-6">
            <h3 className="mb-5 font-semibold text-[#0B1F3A]">
              Solar output through the day
            </h3>

            <svg viewBox="0 0 320 150" className="w-full">
              <path
                d="M10 130 C80 130 100 20 160 20 S240 130 310 130 Z"
                fill="#FFC233"
                fillOpacity="0.35"
              />

              <path
                d="M10 130 C80 130 100 20 160 20 S240 130 310 130"
                fill="none"
                stroke="#1E4E8C"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <line
                x1="10"
                y1="130"
                x2="310"
                y2="130"
                stroke="#94a3b8"
              />

              <circle
                cx="160"
                cy="20"
                r="8"
                fill="#FFC233"
                stroke="#0B1F3A"
                strokeWidth="2"
              />

              <text x="10" y="146" fill="#64748b" fontSize="10">
                6 am
              </text>
              <text x="146" y="146" fill="#64748b" fontSize="10">
                12 pm
              </text>
              <text x="282" y="146" fill="#64748b" fontSize="10">
                6 pm
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Solar Results */}
      <section className="reveal px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-[#0B1F3A]">
            From Electricity Use to Solar Plan
          </h2>

          <p className="mb-8 mt-3 text-center text-slate-500">
            Understand what size system may suit your home.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sun,
                title: "Solar Panels",
                text: "Estimate the number of panels your home may need.",
              },
              {
                icon: BatteryCharging,
                title: "Battery Backup",
                text: "Estimate battery capacity for load shedding.",
              },
              {
                icon: PlugZap,
                title: "Inverter Size",
                text: "Estimate inverter capacity for your appliances.",
              },
            ].map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="card-hover rounded-xl bg-[#EAF2F8] p-6 text-center"
                >
                  <Icon size={30} className="mx-auto text-[#1E4E8C]" />
                  <h3 className="mb-2 mt-4 text-xl font-bold">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Sizes */}
      <section className="reveal bg-[#0B1F3A] px-6 py-16 text-white md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-3xl font-bold">
            Which System Size Fits Your Home?
          </h2>

          <p className="mb-8 text-sky-200">
            A general guide using 550 W solar panels.
          </p>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["3 kW", "6 panels", "~10 units/day", "Lights, fans, TV and fridge"],
              ["5 kW", "9 panels", "~17 units/day", "Home with some AC usage"],
              ["8 kW", "15 panels", "~27 units/day", "Home with two ACs and a pump"],
              ["10 kW", "18 panels", "~34 units/day", "Large home or small shop"],
            ].map(([size, panelCount, units, description]) => (
              <div
                key={size}
                className="card-hover rounded-xl border border-white/10 p-5 hover:border-[#FFC233]"
              >
                <h3 className="text-3xl font-bold text-[#FFC233]">{size}</h3>
                <p className="mt-3 font-semibold">{panelCount}</p>
                <p className="mt-2 text-sm text-sky-200">{units}</p>
                <p className="mt-3 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appliances */}
      <section className="reveal px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-[#0B1F3A]">
            Common Appliances
          </h2>

          <p className="mb-8 mt-3 text-center text-slate-500">
            Learn about the appliances you use every day.
          </p>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              {
                icon: Lightbulb,
                title: "Lights",
                text: "LED bulbs and tube lights",
              },
              {
                icon: Fan,
                title: "Fans",
                text: "Ceiling and pedestal fans",
              },
              {
                icon: Tv,
                title: "TV",
                text: "LED and LCD televisions",
              },
              {
                icon: Refrigerator,
                title: "Fridge",
                text: "Fridges and freezers",
              },
            ].map((appliance) => {
              const Icon = appliance.icon;

              return (
                <div
                  key={appliance.title}
                  className="card-hover rounded-xl border p-6 text-center"
                >
                  <Icon size={30} className="mx-auto text-[#1E4E8C]" />
                  <h3 className="mb-2 mt-3 font-bold">
                    {appliance.title}
                  </h3>
                  <p className="text-sm text-slate-500">{appliance.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="reveal bg-[#EAF2F8] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-bold text-[#0B1F3A]">
            Why Plan Before You Buy?
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Wallet,
                title: "Lower Monthly Bills",
                text: "Solar energy can reduce the electricity you buy from the grid.",
              },
              {
                icon: ShieldCheck,
                title: "Backup During Outages",
                text: "A suitable battery can power selected appliances during outages.",
              },
              {
                icon: Gauge,
                title: "Right-Sized System",
                text: "Estimate your needs before selecting a solar system.",
              },
            ].map((reason) => {
              const Icon = reason.icon;

              return (
                <div
                  key={reason.title}
                  className="card-hover rounded-xl bg-white p-6"
                >
                  <Icon size={28} className="text-[#1E4E8C]" />
                  <h3 className="mb-2 mt-4 text-xl font-bold">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {reason.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="card-hover flex items-start gap-4 rounded-xl bg-white p-5">
              <Wind size={25} className="shrink-0 text-[#1E4E8C]" />
              <p className="text-sm leading-6 text-slate-600">
                <b className="text-slate-800">Keep panels clean.</b> Dust can
                reduce solar output. Follow the panel manufacturer's cleaning
                guidance.
              </p>
            </div>

            <div className="card-hover flex items-start gap-4 rounded-xl bg-white p-5">
              <Waves size={25} className="shrink-0 text-[#1E4E8C]" />
              <p className="text-sm leading-6 text-slate-600">
                <b className="text-slate-800">
                  Use appliances during daylight.
                </b>{" "}
                Running suitable appliances when the sun is strong can help
                use solar energy directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section className="reveal px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 font-semibold text-[#1E4E8C]">
                OUR MARKETPLACE
              </p>

              <h2 className="text-3xl font-bold text-[#0B1F3A]">
                Explore Solar Products
              </h2>

              <p className="mt-3 text-slate-600">
                Browse solar panels, batteries and inverters for your home.
              </p>
            </div>

            <Link
              to="/products"
              className="button-hover inline-flex items-center gap-2 rounded-md bg-[#FFC233] px-5 py-3 font-semibold text-[#0B1F3A]"
            >
              View All Products <ArrowRight size={17} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="rounded-xl border bg-[#EAF2F8] py-10 text-center">
              <Store size={32} className="mx-auto text-[#1E4E8C]" />
              <p className="mt-3 text-slate-600">
                No products available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="card-hover overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-4">
                    <p className="mb-2 text-xs font-medium text-[#1E4E8C]">
                      {product.category}
                    </p>

                    <h3 className="line-clamp-1 font-bold text-[#0B1F3A]">
                      {product.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {product.description}
                    </p>

                    <p className="mt-4 text-lg font-bold text-[#1E4E8C]">
                      Rs. {Number(product.price).toLocaleString("en-PK")}
                    </p>

                    <Link
                      to="/products"
                      className="mt-4 block rounded-md bg-[#FFC233] py-2 text-center font-semibold text-[#0B1F3A] hover:bg-[#f5b414]"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 4 && (
            <div className="mt-8 text-center">
              <Link
                to="/products"
                className="button-hover inline-flex items-center gap-2 rounded-md border border-[#0B1F3A] px-6 py-3 font-semibold text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
              >
                View All {products.length} Products <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="reveal bg-[#EAF2F8] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          <HomeIcon size={32} className="mx-auto text-[#1E4E8C]" />

          <h2 className="mb-8 mt-3 text-center text-3xl font-bold text-[#0B1F3A]">
            Why Use Our Solar Estimator?
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Free and easy to use",
              "No technical knowledge needed",
              "Clear and simple results",
              "Find solar products in one place",
              "Works for homes, shops and offices",
              "Share results with an installer",
            ].map((benefit) => (
              <div
                key={benefit}
                className="card-hover flex items-center gap-3 rounded-lg border bg-white p-4"
              >
                <CheckCircle2
                  className="shrink-0 text-[#1E4E8C]"
                  size={20}
                />
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reveal px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#0B1F3A]">
            Questions People Ask
          </h2>

          <div className="space-y-3">
            {[
              {
                question: "How accurate is the estimate?",
                answer:
                  "It is a planning estimate. Sunlight, weather, appliance usage and system losses can change the final result.",
              },
              {
                question: "What is one electricity unit?",
                answer:
                  "One unit is equal to 1 kWh, or 1000 watts used for one hour.",
              },
              {
                question: "Do I need a battery?",
                answer:
                  "A battery is useful when you need power at night or during load shedding.",
              },
              {
                question: "How many solar panels will I need?",
                answer:
                  "It depends on daily energy use, panel wattage, sunlight and system efficiency.",
              },
              {
                question: "Why does an AC change the result?",
                answer:
                  "An AC usually consumes much more power than lights and fans.",
              },
              {
                question: "Can I add my own appliance?",
                answer:
                  "You can calculate its usage by entering its wattage, quantity and daily operating hours. This demo starts with four appliances.",
              },
            ].map((faq, index) => (
              <div
                key={faq.question}
                className="card-hover overflow-hidden rounded-xl border bg-white"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? -1 : index)
                  }
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold"
                >
                  {faq.question}

                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    openFaq === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="reveal bg-[#FFC233] px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-[#0B1F3A]">
              Ready to Know Your Solar Needs?
            </h2>

            <p className="mt-3 text-[#0B1F3A]">
              Add your appliances and get an estimate in a few minutes.
            </p>
          </div>

          <button
            onClick={goToCalculator}
            className="button-hover inline-flex items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E4E8C]"
          >
            Calculate My Solar Needs <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
