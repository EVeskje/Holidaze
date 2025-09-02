import { useMemo } from "react";
import HeroImage from "../../../assets/images/heroImage.jpg";
import { SearchBar } from "../../forms/SearchBar";

/* ---------- helpers ---------- */
const normalize = (s = "") =>
  s.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

const tokensOf = (s = "") => normalize(s).split(/\s+/).filter(Boolean);
const hasToken = (s, t) => tokensOf(s).includes(normalize(t));
const addToken = (s, t) => {
  const tks = tokensOf(s);
  const n = normalize(t);
  return tks.includes(n) ? tks.join(" ") : [...tks, n].join(" ");
};
const removeToken = (s, t) => tokensOf(s).filter((x) => x !== normalize(t)).join(" ");
const toggleToken = (s, t) => (hasToken(s, t) ? removeToken(s, t) : addToken(s, t));


export const Hero = ({
  onSearch,
  searchTerm = "",
  align = "auto",
  chips = ["Oslo", "London", "Beach", "Hotel", "City"],
  showChips = true,
}) => {
  const isCenter = align === "center";
  const isLeft = align === "left";

  const textAlign = isCenter ? "text-center" : isLeft ? "text-left" : "text-center md:text-left";
  const itemAlign = isCenter ? "items-center" : isLeft ? "items-start" : "items-center md:items-start";
  const ctaJustify = isCenter ? "justify-center" : isLeft ? "justify-start" : "justify-center sm:justify-start";

  const isMac = useMemo(
    () => typeof navigator !== "undefined" && navigator.platform?.toUpperCase().includes("MAC"),
    []
  );

  const clickChip = (label) => {
    if (typeof onSearch !== "function") return;
    const next = toggleToken(searchTerm, label);
    onSearch(next);
  };

  return (
    <header className="relative mx-auto isolate">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HeroImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchpriority="high"  
          sizes="100vw"
        />
        {/* Contrast overlays */}
        <div className="absolute inset-0 bg-black/55 md:bg-black/50" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_10%,transparent,rgba(0,0,0,0.35))]" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-2xl px-6">
        <div className={`grid min-h-[62vh] md:min-h-[68vh] ${itemAlign} content-center py-10 md:py-16`}>
          {/* Skip link */}
          <a
            href="#hero-search"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:rounded-md focus:bg-white/90 focus:px-3 focus:py-2"
          >
            Skip to search
          </a>

          <div className={`max-w-2xl ${textAlign}`}>
            <div className="rounded-2xl bg-black/25 p-6 backdrop-blur-md ring-1 ring-white/10 md:p-7">
              <h1 className="font-display leading-tight text-white text-4xl md:text-5xl lg:text-6xl">
                Find your next <span className="text-accent">adventure</span>
              </h1>

              <p className="mt-4 max-w-prose text-white/85 md:text-lg">
                Discover curated stays, seaside escapes, and city hideaways — book in minutes with Holidaze.
              </p>

              {/* Search bar */}
              <div className="mt-6" id="hero-search">
                <SearchBar
                  value={searchTerm}                 /* controlled value */
                  onChange={onSearch}                /* update as user types */
                  onSearch={onSearch}                /* debounced + submit */
                  className="mx-0 w-full max-w-none drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)]"
                />
              </div>

              {/* Chips (multi-select, persistent) */}
              {showChips && chips?.length > 0 && (
                <div
                  className={`mt-3 flex flex-wrap gap-2 ${isCenter ? "justify-center" : "justify-start"}`}
                  aria-label="Popular searches"
                >
                  {chips.map((label) => {
                    const active = hasToken(searchTerm, label);
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => clickChip(label)}
                        className={[
                          "rounded-full px-3 py-1.5 text-sm backdrop-blur transition",
                          active
                            ? "border border-accent bg-accent text-white"
                            : "border border-white/35 bg-white/10 text-white hover:border-accent hover:bg-accent/15 hover:text-accent",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* CTAs */}
              <div className={`mt-6 flex flex-col items-center gap-3 sm:flex-row ${ctaJustify}`}>
                <button
                  type="button"
                  aria-label="Scroll to venues"
                  aria-controls="venues"
                  onClick={() => document.getElementById("venues")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-md bg-accent px-5 py-2.5 text-white transition hover:opacity-90"
                >
                  Explore venues
                </button>

                <a
                  href="/about"
                  className="rounded-md border border-white/40 px-5 py-2.5 text-white transition hover:border-accent hover:text-accent"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};