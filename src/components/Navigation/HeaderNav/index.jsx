import { useState } from "react";
// import Logo from "../../../assets/images/holidaze-logo.png";

export const HeaderNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-sm">
      <nav className="mx-auto max-w-screen-xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
    <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-primary">
              Holi<span className="text-accent">daze</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 font-normal text-base">
            {[
              { label: "Home", href: "#" },
              { label: "About us", href: "#" },
              { label: "Contact", href: "#" },
              { label: "My profile", href: "#" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-secondary hover:text-accent transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="px-4 py-2 rounded-md text-secondary hover:text-accent transition-colors"
            >
              Login
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
            >
              Sign up
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          } md:hidden grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out`}
        >
          <div className="overflow-hidden">
            <ul className="border-t border-secondary/20 py-3 space-y-1">
              {[
               { label: "Home", href: "#" },
              { label: "About us", href: "#" },
              { label: "Contact", href: "#" },
              { label: "My profile", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-secondary hover:text-accent hover:bg-background transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="flex gap-2 px-3 pt-1">
                <a
                  href="#"
                  className="flex-1 rounded-md px-3 py-2 text-center text-secondary hover:text-accent transition-colors"
                >
                  Login
                </a>
                <a
                  href="#"
                  className="flex-1 rounded-md px-3 py-2 text-center border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  Sign up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};