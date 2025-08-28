import HeroImage from "../../assets/images/heroImage.png";
import { SearchBar } from "../SearchBar";

export const Hero = () => {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-screen-xl px-4 pt-10 pb-12 md:pt-16 md:pb-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Text */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-primary">
              Find your next <span className="text-accent">adventure</span>
            </h1>
            <p className="mt-4 text-secondary max-w-prose">
              Discover curated stays, seaside escapes, and city hideaways—book in minutes with Holidaze.
            </p>

            {/* Search */}
            <div className="mt-6">
              <SearchBar />
            </div>

            {/* CTAs */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="px-5 py-2.5 rounded-md bg-accent text-white hover:opacity-90 transition"
              >
                Explore venues
              </a>
              <a
                href="#"
                className="px-5 py-2.5 rounded-md border border-secondary/30 text-primary hover:border-accent hover:text-accent transition"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-background" />
            <img
              src={HeroImage}
              alt="Holiday by the sea"
              className="w-full h-[260px] md:h-[420px] object-cover rounded-3xl shadow-lg ring-1 ring-secondary/20"
            />
           
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-background/0 via-background/0 to-background/0 md:from-background/10" />
          </div>
        </div>
      </div>
    </section>
  );
};