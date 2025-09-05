/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ContactImage from "../../assets/images/contactImage.jpg";

// ---------------------------------------------
// Contact Page
// ---------------------------------------------
export const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact us | Holidaze</title>
        <meta
          name="description"
          content="Questions about a booking or listing? Contact Holidaze—friendly support, fast replies, real people."
        />
        
      </Helmet>

      <main className="mt-[70px] md:mt-[110px] text-primary">
        {/* Hero */}
        <section className="mx-auto max-w-screen-xl px-4 py-10 md:grid md:grid-cols-2 md:items-center md:gap-10">
          <div className="order-2 md:order-1">
            <header className="mb-4">
              <p className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                We’re here to help
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Contact Holidaze
              </h1>
            </header>
            <p className="max-w-prose text-lg text-secondary">
              Have a question about a stay, hosting, or your account? Our team
              answers most messages within {" "}
              <span className="font-medium text-primary">24 hours</span>.
            </p>

            {/* Contact channels */}
            <div className="mt-6 grid gap-3 sm:grid-cols-1">
              <InfoCard
                title="Email"
                detail="support@holidaze.com"
                sub="We typically respond in a day."
                href="mailto:support@holidaze.com"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M4 6h16v12H4z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                }
              />
              <InfoCard
                title="Live chat"
                detail="Weekdays 09:00–17:00 CET"
                sub="Look for the chat bubble."
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 15a4 4 0 01-4 4H8l-5 3V6a4 4 0 014-4h10a4 4 0 014 4z" />
                  </svg>
                }
              />
            </div>
          </div>

          <figure className="order-1 md:order-2 relative">
            <img
              src={ContactImage}
              alt="Two people chatting at a table"
              loading="lazy"
              decoding="async"
              sizes="(min-width: 768px) 560px, 100vw"
              className="w-full max-h-[360px] rounded-2xl border border-secondary/20 object-cover shadow-sm"
            />
            <figcaption className="mt-1 text-sm text-secondary">
              Real support from real people—no endless loops.
            </figcaption>
          </figure>
        </section>

        {/* Form + Details */}
        <section className="mx-auto max-w-screen-xl px-4 pb-16">
          <div className="grid gap-8 md:grid-cols-5">
            {/* Form panel */}
            <div className="md:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-secondary/20 bg-surface shadow-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/15 to-secondary/10 px-6 py-4">
                  <h2 className="text-xl font-semibold text-primary">
                    Send us a message
                  </h2>
                  <p className="text-sm text-secondary">
                    We usually reply within {" "}
                    <span className="font-medium text-primary">24 hours</span>.
                  </p>
                </div>

                {/* Form */}
                <div className="p-6">
                  <ContactFormFresh />
                  <p className="mt-3 text-xs text-secondary">
                    By submitting, you agree to our {" "}
                    <Link
                      to="/about"
                      className="underline decoration-secondary/40 underline-offset-2 hover:text-primary"
                    >
                      service principles
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar info */}
            <aside className="md:col-span-2">
              <div className="space-y-4">
                <InfoBand
                  title="Response time"
                  body="Most emails are answered within 24 hours. Complex booking issues may take a bit longer."
                />
                <InfoBand
                  title="Support hours"
                  body="Mon–Fri 09:00–17:00 CET. Limited weekend coverage for urgent booking issues."
                />
                <InfoBand
                  title="For urgent bookings"
                  body="Reply directly to your confirmation email to prioritize your case."
                />
                <div className="rounded-2xl bg-accent p-5 text-surface">
                  <p className="text-lg font-medium">Prefer browsing?</p>
                  <p className="mt-1 text-surface/90">
                    Explore places with instant booking and clear policies.
                  </p>
                  <Link
                    to="/"
                    className="mt-3 inline-flex items-center rounded-xl bg-surface px-4 py-2 text-primary hover:opacity-90"
                  >
                    Browse listings
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
};

// ---------------------------------------------
// Contact Form (with a11y + honeypot)
// ---------------------------------------------
function ContactFormFresh({ onSubmit }) {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    const formEntries = Object.fromEntries(new FormData(e.currentTarget));
    const { company, ...formData } = formEntries; // honeypot

    try {
      if (company) throw new Error("Bot detected");
      onSubmit?.(formData);
      setStatus({ state: "success", message: "Thanks! We’ll be in touch shortly." });
      e.currentTarget.reset();
    } catch (err) {
      setStatus({
        state: "error",
        message:
          "Something went wrong. Please try again or email us at support@holidaze.com",
      });
    }
  };

  const isLoading = status.state === "loading";

  return (
    <form onSubmit={handleSubmit} aria-busy={isLoading} className="space-y-6">
      {/* Honeypot (hidden from users) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {/* Contact details */}
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          required
          disabled={isLoading}
        />
        <FloatField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          required
          disabled={isLoading}
        />
      </div>

      {/* Meta */}
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="What can we help with?"
          name="topic"
          required
          disabled={isLoading}
          options={[
            { value: "", label: "Select a topic", disabled: true },
            { value: "booking", label: "A booking" },
            { value: "listing", label: "A listing/host question" },
            { value: "account", label: "Account & billing" },
            { value: "other", label: "Something else" },
          ]}
        />
      </div>

      <FloatField
        label="Subject"
        name="subject"
        type="text"
        minLength={3}
        required
        disabled={isLoading}
      />
      <FloatTextArea
        label="Your message"
        name="message"
        rows={6}
        minLength={10}
        maxLength={1000}
        required
        disabled={isLoading}
      />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <label className="inline-flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            disabled={isLoading}
            className="h-5 w-5 rounded-md border border-secondary/40 bg-surface accent-primary"
          />
          <span className="text-sm text-secondary">
            You may contact me about this inquiry. We don’t share your details with third parties.
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 font-medium text-surface transition hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? "Sending…" : "Send message"}
        </button>
      </div>

      {/* Status banners */}
      <div aria-live="polite">
        {status.state === "success" && (
          <div className="rounded-xl border border-green-300/40 bg-green-50 px-4 py-3 text-green-800">
            {status.message}
          </div>
        )}
        {status.state === "error" && (
          <div className="rounded-2xl border border-red-300/40 bg-red-50 px-4 py-3 text-red-800">
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------
// Floating Label Inputs
// ---------------------------------------------
function FloatField({ label, name, type = "text", required, autoComplete, ...rest }) {
  return (
    <label className="group relative block">
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        placeholder=" "
        {...rest}
        className="peer w-full rounded-xl border border-secondary/30 bg-background px-4 py-3 text-primary outline-none transition placeholder-transparent focus:border-secondary focus:bg-surface focus:shadow-sm disabled:opacity-60"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1 text-secondary transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary">
        {label}
      </span>
    </label>
  );
}

function FloatTextArea({ label, name, rows = 5, required, ...rest }) {
  return (
    <label className="group relative block">
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder=" "
        {...rest}
        className="peer w-full resize-y rounded-xl border border-secondary/30 bg-background px-4 py-3 text-primary outline-none transition placeholder-transparent focus:border-secondary focus:bg-surface focus:shadow-sm disabled:opacity-60"
      />
      <span className="pointer-events-none absolute left-3 top-4 bg-background px-1 text-secondary transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary">
        {label}
      </span>
    </label>
  );
}

function SelectField({ label, name, options = [], required, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-secondary">{label}</span>
      <div className="relative">
        <select
          name={name}
          required={required}
          defaultValue=""
          {...rest}
          className="w-full appearance-none rounded-xl border border-secondary/30 bg-background px-4 py-3 pr-10 text-primary outline-none transition focus:border-secondary focus:bg-surface focus:shadow-sm disabled:opacity-60"
        >
          {options.map((o) => (
            <option key={o.label} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

// ---------------------------------------------
// Small UI helpers
// ---------------------------------------------
function InfoCard({ title, detail, sub, icon, href, external }) {
  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-secondary/20 bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-primary/90">
          {href ? (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="underline decoration-secondary/40 underline-offset-2 hover:text-primary"
            >
              {detail}
            </a>
          ) : (
            detail
          )}
        </div>
        {sub && <div className="text-sm text-secondary">{sub}</div>}
      </div>
    </div>
  );
}

function InfoBand({ title, body }) {
  return (
    <div className="rounded-2xl border border-secondary/20 bg-surface p-4 shadow-sm">
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-secondary">{body}</p>
    </div>
  );
}
