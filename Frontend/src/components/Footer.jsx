import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, ArrowUp } from "lucide-react";

/* Panel Navy #0B1F3A | Cell Blue #1E4E8C | Sun #FFC233 | Sky Wash #EAF2F8 */

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/HowItWorks", label: "How It Works" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
];

const services = [
  { to: "/Calculate/all", label: "Solar Calculator" },
  { to: "/Calculate/all", label: "Appliance Library" },
  { to: "/products", label: "Battery Backup" },
  { to: "/products", label: "Marketplace" },
];

const contacts = [
  { icon: Mail, text: "info@solarsystem.com", href: "mailto:info@solarsystem.com" },
  { icon: Phone, text: "+92 300 0000000", href: "tel:+923000000000" },
  { icon: MapPin, text: "Bannu, Pakistan" },
];

// Change the "to" values below when your Privacy, Terms and Support pages exist
const legal = [
  { to: "#", label: "Privacy Policy" },
  { to: "#", label: "Terms & Conditions" },
  { to: "#", label: "Support" },
];

const styles = `
@keyframes ft-spin { to { transform: rotate(360deg); } }
.ft-rays { transform-origin: 12px 12px; animation: ft-spin 20s linear infinite; }

/* Same solar-cell grid as the hero */
.ft-cells {
  background-image:
    linear-gradient(rgba(120,170,230,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,170,230,0.08) 1px, transparent 1px);
  background-size: 44px 44px;
}

.ft-focus:focus-visible { outline: 3px solid #FFC233; outline-offset: 3px; border-radius: 6px; }

@media (prefers-reduced-motion: reduce) { .ft-rays { animation: none; } }
`;

// A link that slides a little to the right and turns yellow on hover
function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="ft-focus group inline-flex items-center text-sm text-sky-100 transition-all duration-200 hover:text-[#FFC233] motion-safe:hover:translate-x-1"
    >
      <span className="mr-0 w-0 overflow-hidden text-[#FFC233] opacity-0 transition-all duration-200 group-hover:mr-1.5 group-hover:w-3 group-hover:opacity-100">
        <ArrowRight size={12} />
      </span>
      {children}
    </Link>
  );
}

function Footer() {
  const navigate = useNavigate();

  const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-[#0B1F3A] text-white">
      <style>{styles}</style>

      {/* Grid pattern and a soft sun glow */}
      <div className="ft-cells pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#FFC233]/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-8 md:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="ft-focus group inline-flex items-center">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-[#FFC233] transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" />
                <g className="ft-rays">
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </g>
              </svg>
              <span className="ml-2.5 text-xl font-extrabold tracking-tight">
                Solar System
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sky-200">
              Understand your home's energy consumption and find the right
              solar system for your daily needs.
            </p>

            <button
              onClick={() => navigate("/Calculate/all")}
              className="ft-focus group mt-6 inline-flex cursor-pointer items-center rounded-lg bg-[#FFC233] px-5 py-2.5 text-sm font-semibold text-[#0B1F3A] transition-all duration-200 hover:bg-[#ffd25e] hover:shadow-lg hover:shadow-[#FFC233]/20 active:scale-[0.98]"
            >
              Calculate Your Needs
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-4 font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-2">
            <h3 className="mb-4 font-bold">Services</h3>
            <ul className="space-y-3">
              {services.map((l) => (
                <li key={l.label}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 font-bold">Contact</h3>
            <ul className="space-y-4">
              {contacts.map((c) => {
                const content = (
                  <>
                    <span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 transition-colors duration-200 group-hover:bg-[#FFC233]">
                      <c.icon
                        size={17}
                        className="text-[#FFC233] transition-colors duration-200 group-hover:text-[#0B1F3A]"
                      />
                    </span>
                    <span className="text-sm text-sky-100">{c.text}</span>
                  </>
                );
                return (
                  <li key={c.text}>
                    {c.href ? (
                      <a href={c.href} className="ft-focus group flex items-center">
                        {content}
                      </a>
                    ) : (
                      <div className="group flex items-center">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-sm text-sky-200">
            © {new Date().getFullYear()} Solar System. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <a
                key={l.label}
                href={l.to}
                className="ft-focus text-sm text-sky-100 transition-colors duration-200 hover:text-[#FFC233]"
              >
                {l.label}
              </a>
            ))}

            <button
              type="button"
              onClick={backToTop}
              aria-label="Back to top"
              className="ft-focus flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/30 transition-all duration-200 hover:bg-[#FFC233] hover:text-[#0B1F3A] motion-safe:hover:-translate-y-0.5"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;