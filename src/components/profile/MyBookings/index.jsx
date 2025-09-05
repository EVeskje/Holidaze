import React from "react";
import { Link, Navigate } from "react-router-dom";

import ImagePlaceholder from "../../../assets/images/no_img.png";
import { Loader } from "../../ui_elements/Loader";

import { useFetch } from "../../../hooks/useFetch";
import { API_Url, profile_Url, bookings_Url } from "../../../js/api/constants";
import { load } from "../../../js/storage/load";
import { formatPrice } from "../../../js/utils/formatPrice";
import { formatDate } from "../../../js/utils/formatDate";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

/* ==============================
   MyBookings
   ============================== */
export const MyBookings = () => {
  const profile = load("profile");
  const userId = profile?.name;

  if (!userId) return <Navigate to="/logIn" replace />;

  const {
    data: bookings = [],
    isLoading,
    hasError,
    refetch,
  } = useFetch(
    `${API_Url}${profile_Url}/${userId}${bookings_Url}?_venue=true&_customer=true`,
  );

  if (isLoading) {
    return (
      <section className="py-10">
        <Loader />
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="mx-auto max-w-screen-md px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">
          We couldn’t load your bookings
        </h2>
        <p className="text-secondary mt-2">Please try again in a moment.</p>
        <button
          onClick={refetch}
          className="ring-secondary/30 hover:ring-secondary/50 mt-6 rounded-xl px-5 py-2.5 ring-1"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return (
      <section className="mx-auto max-w-screen-md px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">You have no bookings yet</h2>
        <p className="text-secondary mt-2">
          Find a place you’ll love for your next trip.
        </p>
        <Link
          to="/"
          className="bg-accent text-surface mt-6 inline-flex items-center rounded-xl px-5 py-2.5 hover:opacity-90"
        >
          Browse stays
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-11/12 max-w-screen-2xl py-6">
      <header className="mb-5 px-1 sm:mb-7">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          My bookings
        </h1>
        <p className="text-secondary mt-1">
          Upcoming and past stays at a glance.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:gap-5">
        {bookings.map((b) => (
          <BookingRow key={b.id} booking={b} />
        ))}
      </div>
    </section>
  );
};

/* ==============================
   Row-style Card
   ============================== */
function BookingRow({ booking }) {
  const { dateFrom, dateTo, guests, venue } = booking || {};

  const start = dateFrom ? new Date(dateFrom) : null;
  const end = dateTo ? new Date(dateTo) : null;

  const from = start ? formatDate(start) : "Date unavailable";
  const to = end ? formatDate(end) : "Date unavailable";

  const nights =
    start && end ? Math.max(1, Math.ceil((end - start) / 86400000)) : 0;

  const pricePerNight = Number(venue?.price ?? 0);
  const totalPrice = pricePerNight * nights;
  const totalFormatted = formatPrice(totalPrice);

  const imgUrl = venue?.media?.[0]?.url || ImagePlaceholder;
  const imgAlt = venue?.media?.[0]?.alt || "Venue image";
  const title = venue?.name || "Untitled venue";
  const rating = typeof venue?.rating === "number" ? venue.rating : null;
  const location =
    venue?.location?.city && venue?.location?.country
      ? `${venue.location.city}, ${venue.location.country}`
      : "Location not available";

  return (
    <article className="bg-surface ring-secondary/15 hover:ring-secondary/30 group rounded-2xl ring-1 transition hover:-translate-y-0.5">
      <div className="flex flex-col overflow-hidden sm:flex-row">
        {/* Image (clickable) */}
        <Link
          to={`/singleVenue/${venue?.id || ""}`}
          className="sm:w-[320px] md:w-[360px] lg:w-[380px]"
          aria-label={`Open ${title}`}
        >
          <div className="relative h-48 w-full overflow-hidden sm:h-full">
            <img
              src={imgUrl}
              alt={imgAlt}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              onError={(e) => handleImageErrors(e, ImagePlaceholder)}
              loading="lazy"
              decoding="async"
            />
            {rating !== null && (
              <div className="bg-background/90 text-primary ring-secondary/20 absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 backdrop-blur">
                <StarIcon className="h-3.5 w-3.5" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          {/* Title + location */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link
                to={`/singleVenue/${venue?.id || ""}`}
                className="block min-w-0"
              >
                <h3 className="truncate text-lg font-semibold hover:underline md:text-xl">
                  {title}
                </h3>
              </Link>
              <div className="text-secondary mt-1 flex items-center gap-2">
                <PinIcon className="h-4 w-4" />
                <span className="truncate text-sm">{location}</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-0">
              <div className="bg-background ring-secondary/10 rounded-xl px-3 py-2 text-right ring-1">
                <div className="text-secondary text-xs">Total</div>
                <div className="text-primary text-base font-semibold">
                  ${totalFormatted}
                </div>
              </div>
            </div>
          </div>

          {/* Meta strip */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip label={`Check-in: ${from}`} />
            <Chip label={`Check-out: ${to}`} />
            <Chip label={`${nights} night${nights === 1 ? "" : "s"}`} />
            <Chip
              label={`${guests ?? 0} guest${(guests ?? 0) === 1 ? "" : "s"}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ==============================
   Tiny UI atoms
   ============================== */
function Chip({ label }) {
  return (
    <span className="bg-background text-secondary ring-secondary/10 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
      {label}
    </span>
  );
}

function StarIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z" />
    </svg>
  );
}

function PinIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M17.657 16.657L13 21.314l-4.657-4.657A8 8 0 1117.657 16.657z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}
