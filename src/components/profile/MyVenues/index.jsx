import React from "react";
import { Link } from "react-router-dom";

import ImagePlaceholder from "../../../assets/images/no_img.png";
import { BookingsAccordion } from "../../bookings/BookingsAccordion";
import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";

import { formatPrice } from "../../../js/utils/formatPrice";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

/* ==============================
   MyVenues – Modern row cards
   ============================== */
export const MyVenues = ({ venuesData = [] }) => {
  return (
    <section className="mx-auto w-11/12 max-w-screen-2xl py-6">
      <header className="mb-5 px-1 sm:mb-7">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My venues</h1>
        <p className="mt-1 text-secondary">Manage your listings, pricing, and bookings.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:gap-5">
        {venuesData.map((venue) => (
          <VenueRow key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
};

/* ==============================
   Row-style Venue Card
   ============================== */
function VenueRow({ venue }) {
  const imgUrl = venue?.media?.[0]?.url || ImagePlaceholder;
  const imgAlt = venue?.media?.[0]?.alt || "Venue image";
  const title = venue?.name || "Untitled venue";
  const location =
    venue?.location?.city && venue?.location?.country
      ? `${venue.location.city}, ${venue.location.country}`
      : "Location not available";

  const pricePerNight = Number(venue?.price ?? 0);
  const priceFormatted = formatPrice(pricePerNight);
  const maxGuests = Number(venue?.maxGuests ?? 0);
  const bookingsCount = Number(venue?._count?.bookings ?? 0);
  const rating = typeof venue?.rating === "number" ? venue.rating : null;
  const description = venue?.description || "No description added";

  return (
    <article className="group rounded-2xl bg-surface ring-1 ring-secondary/15 transition hover:-translate-y-0.5 hover:ring-secondary/30">
      <div className="flex flex-col overflow-hidden sm:flex-row">
        {/* Image (links to venue) */}
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
            {/* Rating badge */}
            {rating !== null && (
              <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-primary ring-1 ring-secondary/20 backdrop-blur">
                <StarIcon className="h-3.5 w-3.5" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          {/* Title + action + price */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link to={`/singleVenue/${venue?.id || ""}`} className="block min-w-0">
                <h3 className="truncate text-lg font-semibold hover:underline md:text-xl">
                  {title}
                </h3>
              </Link>
              <div className="mt-1 flex items-center gap-2 text-secondary">
                <PinIcon className="h-4 w-4" />
                <span className="truncate text-sm">{location}</span>
              </div>
            </div>

            {/* Price + Edit */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
              <div className="rounded-xl bg-background px-3 py-2 text-right ring-1 ring-secondary/10">
                <div className="text-xs text-secondary">Price / night</div>
                <div className="text-base font-semibold text-primary">${priceFormatted}</div>
              </div>
              <Link
                to="/addEditVenue"
                state={{ venue, isEdit: true }}
                aria-label="Edit venue"
              >
                <PrimaryButton>Edit venue</PrimaryButton>
              </Link>
            </div>
          </div>

          {/* Chips: capacity + amenities + bookings */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {maxGuests > 0 && <Chip icon={<UsersIcon className="h-4 w-4" />} label={`${maxGuests} guest${maxGuests === 1 ? "" : "s"}`} />}
            {venue?.meta?.wifi && <Chip icon={<WifiIcon className="h-4 w-4" />} label="Wi-Fi" />}
            {venue?.meta?.parking && <Chip icon={<ParkingIcon className="h-4 w-4" />} label="Parking" />}
            {venue?.meta?.pets && <Chip icon={<PetsIcon className="h-4 w-4" />} label="Pets" />}
            {venue?.meta?.breakfast && <Chip icon={<BreakfastIcon className="h-4 w-4" />} label="Breakfast" />}
            <Chip label={`Bookings: ${bookingsCount}`} />
          </div>

          {/* Description */}
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-secondary">
            {description}
          </p>

          {/* Bookings accordion */}
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold text-primary">
              Bookings ({bookingsCount})
            </h4>
            <BookingsAccordion venueId={venue?.id} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ==============================
   Tiny UI atoms
   ============================== */
function Chip({ label, icon = null }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-secondary ring-1 ring-secondary/10">
      {icon}
      {label}
    </span>
  );
}

/* Icons */
function StarIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
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

function UsersIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21a7 7 0 0114 0" />
      <circle cx="17" cy="7" r="3" />
      <path d="M17 14a7 7 0 017 7" />
    </svg>
  );
}

function WifiIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12a10 10 0 0114 0" />
      <path d="M8.5 15.5a6 6 0 016 0" />
      <path d="M12 20h.01" />
    </svg>
  );
}

function ParkingIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 4h7a5 5 0 010 10H6z" />
      <path d="M6 14v6" />
    </svg>
  );
}

function PetsIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="5" cy="9" r="2" />
      <circle cx="19" cy="9" r="2" />
      <circle cx="7" cy="5" r="2" />
      <circle cx="17" cy="5" r="2" />
      <path d="M12 13c4 0 6 3 6 6H6c0-3 2-6 6-6z" />
    </svg>
  );
}

function BreakfastIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 10h16" />
      <path d="M5 10a7 7 0 0014 0" />
      <path d="M12 3v4" />
    </svg>
  );
}