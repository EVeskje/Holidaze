/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Gallery } from "../../components/ui_elements/Gallery";
import { VenueInfo } from "../../components/venues/VenueInfo";
import { BookVenue } from "../../components/forms/BookVenue";
import { VenueManagerOwnPageView } from "../../components/venues/VenueManagerOwnPageView";
import { useFetch } from "../../hooks/useFetch";
import { API_Url, all_Venues } from "../../js/api/constants";
import { load } from "../../js/storage/load";

// ---------------------------------------------
// Single Venue Page
// ---------------------------------------------

export const SingleVenue = () => {
  const { id } = useParams();
  const {
    data: venue,
    isLoading,
    hasError,
    refetch,
  } = useFetch(`${API_Url}${all_Venues}/${id}?_owner=true`);

  const userProfile = load("profile");
  const userEmail = userProfile?.email;
  const venueOwnerEmail = venue?.owner?.email;

  const isOwner = useMemo(
    () =>
      Boolean(userEmail && venueOwnerEmail && userEmail === venueOwnerEmail),
    [userEmail, venueOwnerEmail],
  );

  /* ---------- Head meta ---------- */
  const title = venue ? `${venue.name} | Holidaze` : "Loading…";
  const description =
    venue?.description ||
    "View venue details, amenities, availability and book your stay with Holidaze.";

  return (
    <main className="bg-background text-primary mt-[70px] md:mt-[110px]">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Wrapper */}
      <section className="mx-auto w-11/12 max-w-screen-xl px-0 pb-12">
        {/* Back / Breadcrumb */}
        <nav className="pt-4 md:pt-6">
          <Link
            to="/"
            aria-label="Back to home"
            className="text-secondary hover:text-primary inline-flex items-center gap-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm">Back</span>
          </Link>
        </nav>

        {/* Loading */}
        {isLoading && (
          <>
            <HeaderSkeleton />
            <GallerySkeleton />
            <MainSkeleton />
          </>
        )}

        {/* Error */}
        {!isLoading && hasError && (
          <div className="mx-auto max-w-screen-md py-16 text-center">
            <h1 className="text-2xl font-semibold">
              We couldn’t load this venue
            </h1>
            <p className="text-secondary mt-2">Please try again in a moment.</p>
            <button
              onClick={refetch}
              className="ring-secondary/30 hover:ring-secondary/50 mt-6 rounded-xl px-5 py-2.5 ring-1"
            >
              Retry
            </button>
          </div>
        )}

        {/* Not found */}
        {!isLoading && !hasError && !venue && (
          <div className="mx-auto max-w-screen-md py-16 text-center">
            <h1 className="text-2xl font-semibold">Venue not found</h1>
            <p className="text-secondary mt-2">
              It may have been removed or is unavailable.
            </p>
            <Link
              to="/"
              className="bg-accent text-surface mt-6 inline-flex items-center rounded-xl px-5 py-2.5 hover:opacity-90"
            >
              Browse other stays
            </Link>
          </div>
        )}

        {/* Content */}
        {!isLoading && !hasError && venue && (
          <>
            {/* Header */}
            <header className="mt-3 md:mt-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {venue.name}
                  </h1>

                  {/* Location / rating / price */}
                  <div className="text-secondary mt-1 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M17.657 16.657L13 21.314l-4.657-4.657A8 8 0 1117.657 16.657z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {venue?.location?.city || "Unknown city"},{" "}
                        {venue?.location?.country || "Unknown country"}
                      </span>
                    </span>

                    {typeof venue.rating === "number" && (
                      <span className="inline-flex items-center gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z" />
                        </svg>
                        <span>{venue.rating.toFixed(1)}</span>
                      </span>
                    )}

                    {typeof venue.price === "number" && (
                      <span className="inline-flex items-center gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 110 7H6" />
                        </svg>
                        <span className="text-primary font-medium">
                          {Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                          }).format(venue.price)}
                        </span>
                        <span className="text-secondary">/ night</span>
                      </span>
                    )}
                  </div>

                  {/* Amenities chip row */}
                  <AmenitiesChips
                    maxGuests={venue?.maxGuests}
                    meta={venue?.meta}
                  />
                </div>

                {/* Quick action */}
                <div className="flex flex-wrap gap-3">
                  {isOwner ? (
                    <div className="text-secondary ring-secondary/20 rounded-xl px-3 py-1 text-sm ring-1">
                      You are the owner
                    </div>
                  ) : (
                    <a
                      href="#book"
                      className="text-secondary ring-secondary/25 hover:text-primary rounded-xl px-4 py-2 ring-1"
                    >
                      Check availability
                    </a>
                  )}
                </div>
              </div>
            </header>

            {/* Gallery */}
            <section className="mt-4">
              <div className="bg-surface/80 ring-secondary/15 overflow-hidden rounded-2xl ring-1">
                <Gallery data={venue} key={venue.id} />
              </div>
            </section>

            {/* Main grid */}
            <section className="mt-6 grid gap-6 md:grid-cols-12">
              {/* Left: details */}
              <div className="md:col-span-7 lg:col-span-8">
                <div className="bg-surface/80 ring-secondary/15 rounded-2xl p-4 ring-1 md:p-6">
                  <VenueInfo data={venue} key={`info-${venue.id}`} />
                </div>
              </div>

              {/* Right: booking or owner tools */}
              <aside className="md:col-span-5 lg:col-span-4">
                <div className="sticky top-24">
                  <div className="bg-surface/80 ring-secondary/15 rounded-2xl p-4 ring-1 md:p-5">
                    {isOwner ? (
                      <VenueManagerOwnPageView venue={venue} />
                    ) : (
                      <div id="book">
                        <BookVenue data={venue} />
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </section>

            {/* Mobile CTA */}
            {!isOwner && (
              <div className="mt-8 flex items-center justify-center md:hidden">
                <a
                  href="#book"
                  className="bg-accent text-surface inline-flex items-center rounded-xl px-5 py-2.5 hover:opacity-90"
                >
                  Book this stay
                </a>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

/* ==============================
   Amenities Chips
   ============================== */
function AmenitiesChips({ maxGuests, meta }) {
 
  const chips = [];

  if (typeof maxGuests === "number") {
    chips.push({
      key: "guests",
      label: `${maxGuests} guest${maxGuests === 1 ? "" : "s"}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="7" r="3" />
          <path d="M5.5 21a6.5 6.5 0 0113 0" />
        </svg>
      ),
    });
  }

  if (meta?.wifi) {
    chips.push({
      key: "wifi",
      label: "Wi-Fi",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12a10 10 0 0114 0" />
          <path d="M8.5 15.5a6 6 0 016 0" />
          <path d="M12 20h.01" />
        </svg>
      ),
    });
  }

  if (meta?.parking) {
    chips.push({
      key: "parking",
      label: "Parking",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 4h7a5 5 0 010 10H6z" />
          <path d="M6 14v6" />
        </svg>
      ),
    });
  }

  if (meta?.breakfast) {
    chips.push({
      key: "breakfast",
      label: "Breakfast",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 10h16" />
          <path d="M5 10a7 7 0 0014 0" />
          <path d="M12 3v4" />
        </svg>
      ),
    });
  }

  if (meta?.pets) {
    chips.push({
      key: "pets",
      label: "Pets allowed",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="5" cy="9" r="2" />
          <circle cx="19" cy="9" r="2" />
          <circle cx="7" cy="5" r="2" />
          <circle cx="17" cy="5" r="2" />
          <path d="M12 13c4 0 6 3 6 6H6c0-3 2-6 6-6z" />
        </svg>
      ),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((c) => (
        <span
          key={c.key}
          className="bg-surface/80 text-secondary ring-secondary/15 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
        >
          {c.icon}
          {c.label}
        </span>
      ))}
    </div>
  );
}

/* ==============================
   Skeletons (lightweight)
   ============================== */
function HeaderSkeleton() {
  return (
    <div className="mt-3 md:mt-6">
      <div className="animate-pulse space-y-2">
        <div className="bg-secondary/10 h-7 w-2/3 rounded md:w-1/3" />
        <div className="bg-secondary/10 h-4 w-1/2 rounded" />
        <div className="bg-secondary/10 mt-2 h-6 w-3/4 rounded" />{" "}
        {/* chips row placeholder */}
      </div>
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="bg-surface/80 ring-secondary/15 mt-4 animate-pulse overflow-hidden rounded-2xl ring-1">
      <div className="bg-secondary/10 h-64 w-full md:h-96" />
    </div>
  );
}

function MainSkeleton() {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-12">
      <div className="animate-pulse md:col-span-7 lg:col-span-8">
        <div className="bg-surface/80 ring-secondary/15 h-72 rounded-2xl ring-1 md:h-80" />
      </div>
      <div className="animate-pulse md:col-span-5 lg:col-span-4">
        <div className="bg-surface/80 ring-secondary/15 h-72 rounded-2xl ring-1 md:h-80" />
        <div className="bg-secondary/10 mt-3 h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}
