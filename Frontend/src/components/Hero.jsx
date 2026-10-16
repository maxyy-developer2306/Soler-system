
import React, { useEffect, useState } from "react";
import HeroImage from "../assets/img/Hero.jfif";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  LayoutGrid,
  ShieldCheck,
  Sun,
  BatteryCharging,
  Zap,
} from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  const [units, setUnits] = useState(0);
  const [panels, setPanels] = useState(0);
  const [battery, setBattery] = useState(0);

  useEffect(() => {
    let count = 0;

    const timer = setInterval(() => {
      count += 1;

      setUnits((14.2 / 30) * count);
      setPanels((7 / 30) * count);
      setBattery((4.8 / 30) * count);

      if (count >= 30) {
        clearInterval(timer);
        setUnits(14.2);
        setPanels(7);
        setBattery(4.8);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#0B1F3A] text-white">
      <img
        src={HeroImage}
        alt="Solar Energy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/85 to-[#0B1F3A]/40"></div>

      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,170,230,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,230,0.10) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      ></div>

      <div className="relative mx-auto flex min-h-[640px] max-w-6xl flex-col justify-between px-6 py-10 md:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>
            <div className="mb-6 flex items-center">
              <Sun size={30} className="text-[#FFC233]" />

              <p className="ml-3 text-sm text-sky-100">
                Free solar and load calculator
              </p>
            </div>

            <h1 className="text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
              Know Your Home's Energy.
              <br />
              Choose the Right Solar System.
            </h1>

            <p className="mt-6 max-w-xl text-base font-light text-sky-100 sm:text-lg">
              Calculate your home's electricity consumption based on your
              appliances and get an estimated solar system recommendation
              with battery backup options.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/Calculate/all")}
                className="flex cursor-pointer items-center rounded-md bg-[#FFC233] px-5 py-3 text-sm text-[#0B1F3A] hover:bg-[#ffd25e]"
              >
                Calculate My Solar Needs
                <ArrowRight size={16} className="ml-2" />
              </button>

              <button
                onClick={() => navigate("/products")}
                className="cursor-pointer rounded-md border border-white/30 px-5 py-3 text-sm hover:bg-white/10"
              >
                Explore Solar Products
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-xl border border-white/10 bg-[#0B1F3A]/70 p-6 backdrop-blur-md">

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-sky-100">
                  <Zap size={16} className="mr-2 text-[#FFC233]" />
                  Sample home
                </div>

                <p className="text-xs text-sky-200">Estimate</p>
              </div>

              <p className="mt-4 text-sm text-sky-200">
                Daily energy use
              </p>

              <p className="mt-1 text-5xl font-light text-[#FFC233]">
                {units.toFixed(1)}
                <span className="ml-2 text-xl text-white">units</span>
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#FFC233]"
                  style={{ width: `${(units / 14.2) * 72}%` }}
                ></div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <Sun size={18} className="text-[#FFC233]" />

                  <p className="mt-2 text-2xl font-light">
                    {Math.round(panels)}
                  </p>

                  <p className="text-xs text-sky-200">Solar panels</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <BatteryCharging size={18} className="text-[#FFC233]" />

                  <p className="mt-2 text-2xl font-light">
                    {battery.toFixed(1)}
                    <span className="ml-1 text-sm text-sky-200">kWh</span>
                  </p>

                  <p className="text-xs text-sky-200">Battery backup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">

          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <Calculator size={18} className="text-[#FFC233]" />
            </div>

            <div>
              <p className="text-sm">Interactive Estimator</p>
              <p className="text-sm text-sky-200">Preset load options</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <LayoutGrid size={18} className="text-[#FFC233]" />
            </div>

            <div>
              <p className="text-sm">Appliance Library</p>
              <p className="text-sm text-sky-200">Marketplace included</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <ShieldCheck size={18} className="text-[#FFC233]" />
            </div>

            <div>
              <p className="text-sm">Verified Vendors</p>
              <p className="text-sm text-sky-200">Trusted sellers only</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;
