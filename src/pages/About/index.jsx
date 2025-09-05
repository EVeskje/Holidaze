/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HolidazeCrew from "../../assets/images/holidazeCrew.jpg";
import { PrimaryButton } from "../../components/ui_elements/Buttons/PrimaryButton";

// ---------------------------------------------
// About Page
// ---------------------------------------------

export const About = () => {
  return (
    <>
      <Helmet>
        <title>About us | Holidaze</title>
        <meta
          name="description"
          content="Holidaze helps travelers discover stays they love with transparent listings, smart search, and human support."
        />
      </Helmet>

      {/* Page wrapper */}
      <main className="mt-[70px] md:mt-[110px] bg-background text-primary">
        {/* Hero */}
        <section className="mx-auto max-w-screen-xl px-4 py-10 md:grid md:grid-cols-2 md:items-center md:gap-10">
          <div className="order-2 md:order-1">
            <header className="mb-4">
              <p className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                Our mission
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Stays you’ll actually love—without the guesswork
              </h1>
            </header>

            <p className="max-w-prose text-lg text-secondary">
              Holidaze is built for travelers who want clarity and comfort.
              From cozy cabins to modern villas, we surface transparent listings,
              helpful reviews, and flexible booking—backed by a friendly team when you need a hand.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/" aria-label="Browse homes">
                <PrimaryButton>Find your stay</PrimaryButton>
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-secondary/30 px-4 py-2 text-secondary hover:border-secondary hover:text-primary"
                aria-label="Contact Holidaze"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <figure className="order-1 md:order-2 relative">
            <img
              src={HolidazeCrew}
              alt="The Holidaze crew hiking together in nature"
              className="w-full rounded-2xl border border-secondary/20 object-cover shadow-sm"
            />
            <figcaption className="mt-2 text-sm text-secondary">
              We’re travelers too—so we design for real trips, not just listings.
            </figcaption>
          </figure>
        </section>

        {/* Stats */}
        <section
          aria-label="Holidaze in numbers"
          className="mx-auto max-w-screen-xl px-4 pb-4"
        >
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-secondary/10 md:grid-cols-4">
            <Stat label="Destinations" value="120+" />
            <Stat label="Active hosts" value="6,500+" />
            <Stat label="Avg. rating" value="4.8/5" />
            <Stat label="Bookings served" value="250k+" />
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-screen-xl px-4 py-10">
          <h2 className="text-2xl font-semibold md:text-3xl">What we value</h2>
          <p className="mt-2 max-w-prose text-secondary">
            Clear info, fair pricing, and stays that match your vibe. Here’s how we keep it simple.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ValueCard
              title="Trust & Transparency"
              body="Detailed amenities, real photos, and clear fees up front—no surprises at checkout."
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3l7 4v6c0 5-3.5 8-7 8s-7-3-7-8V7l7-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              }
            />
            <ValueCard
              title="Effortless Booking"
              body="Filters that actually help, saved searches, and instant confirmations on eligible stays."
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 5h18M3 12h18M3 19h18" />
                </svg>
              }
            />
            <ValueCard
              title="People First"
              body="Human support from a friendly team—and fair policies that respect both guests and hosts."
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a6.5 6.5 0 0113 0" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Testimonial */}
        <section className="mx-auto max-w-screen-xl px-4 pb-16">
          <div className="relative overflow-hidden rounded-2xl bg-accent text-surface">
            <div className="p-6 md:flex md:items-center md:justify-between md:p-8">
              <blockquote className="md:max-w-2xl">
                <p className="text-lg md:text-xl">
                  “We booked a last-minute cabin through Holidaze and it was exactly as shown.
                  Fast, easy, and the support team was awesome.”
                </p>
                <footer className="mt-2 text-sm/6 opacity-90">— Ingrid, Oslo</footer>
              </blockquote>
              <Link to="/" aria-label="Browse listings" className="mt-4 md:mt-0">
                <PrimaryButton>Browse listings</PrimaryButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};


function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-background px-4 py-3 text-center ring-1 ring-secondary/10">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-secondary">{label}</div>
    </div>
  );
}

function ValueCard({ title, body, icon }) {
  return (
    <article className="group rounded-2xl border border-secondary/20 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-secondary">{body}</p>
      <div className="mt-4 h-px bg-secondary/10" />
    </article>
  );
}