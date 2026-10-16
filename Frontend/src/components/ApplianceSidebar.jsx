import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Lightbulb,
  Snowflake,
  Refrigerator,
  Fan,
  Tv,
  Monitor,
  Flame,
  CookingPot,
  Microwave,
  WashingMachine,
  Home,
  Zap,
} from "lucide-react";

/* Panel Navy #0B1F3A | Cell Blue #1E4E8C | Sun #FFC233 | Sky Wash #EAF2F8 */

// One list drives both the desktop sidebar and the mobile bar.
// "hint" is the typical wattage used by that page's calculator.
const overview = [
  { to: "/Calculate/all", label: "All Appliances", icon: Home, hint: "Total" },
];

const appliances = [
  { to: "/Calculate", label: "Lights", icon: Lightbulb, hint: "24 W" },
  { to: "/Calculate/ac", label: "Air Conditioner", icon: Snowflake, hint: "1500 W" },
  { to: "/Calculate/refrigerator", label: "Refrigerator", icon: Refrigerator, hint: "150 W" },
  { to: "/Calculate/fan", label: "Fans", icon: Fan, hint: "80 W" },
  { to: "/Calculate/tv", label: "Television", icon: Tv, hint: "120 W" },
  { to: "/Calculate/computer", label: "Computer", icon: Monitor, hint: "200 W" },
  { to: "/Calculate/iron", label: "Iron", icon: Flame, hint: "1000 W" },
  { to: "/Calculate/kitchen", label: "Kitchen", icon: CookingPot, hint: "1000 W" },
  { to: "/Calculate/microwave", label: "Microwave", icon: Microwave, hint: "1200 W" },
  { to: "/Calculate/washing-machine", label: "Washing Machine", icon: WashingMachine, hint: "500 W" },
];

const styles = `
@keyframes sb-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
.sb-in { animation: sb-in .4s cubic-bezier(.2,.7,.2,1) both; }
.sb-scroll { scrollbar-width: none; }
.sb-scroll::-webkit-scrollbar { display: none; }
.sb-focus:focus-visible { outline: 2px solid #FFC233; outline-offset: 1px; }
@media (prefers-reduced-motion: reduce) { .sb-in { animation: none; } }
`;

// One slim row in the desktop sidebar (GitHub / Vercel style)
function SideLink({ item, index }) {
  return (
    <NavLink
      to={item.to}
      end
      style={{ animationDelay: `${index * 35}ms` }}
      className={({ isActive }) =>
        `sb-in sb-focus relative flex h-8 items-center rounded-md px-2.5 text-[13px] transition-colors duration-150 ${
          isActive
            ? "bg-slate-100 font-semibold text-[#0B1F3A]"
            : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1F3A]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Thin sun-colored marker on the left edge of the active row */}
          <span
            aria-hidden="true"
            className={`absolute -left-1 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#FFC233] transition-transform duration-200 origin-center ${
              isActive ? "scale-y-100" : "scale-y-0"
            }`}
          />
          <item.icon
            size={16}
            strokeWidth={1.9}
            className={`shrink-0 transition-colors ${
              isActive ? "text-[#0B1F3A]" : "text-slate-400"
            }`}
          />
          <span className="ml-2.5 flex-1 truncate">{item.label}</span>
          <span className="ml-2 text-[11px] tabular-nums text-slate-400">
            {item.hint}
          </span>
        </>
      )}
    </NavLink>
  );
}

// One slim tab in the mobile bar
function PillLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `sb-focus flex h-8 shrink-0 items-center rounded-md px-3 text-[13px] transition-colors ${
          isActive
            ? "bg-slate-100 font-semibold text-[#0B1F3A] ring-1 ring-inset ring-slate-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1F3A]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={15}
            strokeWidth={1.9}
            className={isActive ? "text-[#0B1F3A]" : "text-slate-400"}
          />
          <span className="ml-2 whitespace-nowrap">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function ApplianceSidebar() {
  const location = useLocation();
  const barRef = useRef(null);

  // On mobile, keep the active tab visible inside the scrolling bar
  useEffect(() => {
    const active = barRef.current?.querySelector('[aria-current="page"]');
    active?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      <style>{styles}</style>

      {/* Mobile: horizontal scrolling tabs */}
      <nav
        ref={barRef}
        aria-label="Appliance calculators"
        className="sb-scroll md:hidden flex gap-1 overflow-x-auto px-4 py-2.5 border-b border-slate-200 bg-white"
      >
        {[...overview, ...appliances].map((item) => (
          <PillLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Desktop: sticky sidebar */}
      
      
      <aside className="hidden md:block w-60 shrink-0 self-start sticky top-4 border-r border-slate-200 pl-3 pr-3 pb-6 ml-3">
         
        
        <div className="mt-8 mb-5 px-2.5">
          <h2 className="text-sm font-semibold text-[#0B1F3A]">Load calculator</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pick one appliance, or check everything at once.
          </p>
        </div>

        <nav aria-label="Appliance calculators">
          <p className="mb-1 px-2.5 text-xs font-medium text-slate-400">Overview</p>
          <div className="mb-4 space-y-0.5">
            {overview.map((item, i) => (
              <SideLink key={item.to} item={item} index={i} />
            ))}
          </div>

          <p className="mb-1 px-2.5 text-xs font-medium text-slate-400">
            Single appliance
          </p>
          <div className="space-y-0.5">
            {appliances.map((item, i) => (
              <SideLink key={item.to} item={item} index={i + 1} />
            ))}
          </div>
        </nav>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
          <Zap size={16} className="text-[#1E4E8C]" />
          <p className="mt-2 text-[13px] font-semibold text-[#0B1F3A]">
            Not sure where to start?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Open All Appliances to see your full daily units and solar size in one place.
          </p>
        </div>
      </aside>
    </>
  );
}

export default ApplianceSidebar;