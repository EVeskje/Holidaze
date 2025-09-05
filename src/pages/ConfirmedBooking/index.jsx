import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import ProfileImagePlaceholder from "../../assets/images/no_ProfileImg.png";
import ImagePlaceholder from "../../assets/images/no_img.png";

import { PrimaryButton } from "../../components/ui_elements/Buttons/PrimaryButton";

import { formatPrice } from "../../js/utils/formatPrice";
import { handleImageErrors } from "../../js/utils/handleImageErrors";

// ---------------------------------------------
// Confirmed Booking page
// ---------------------------------------------

export const ConfirmedBooking = () => {
  const { state } = useLocation();
  const { payload, venue, totalPrice } = state || {};

  // Friendly fallback if navigated here without state
  if (!payload || !venue || totalPrice == null) {
    return (
      <main className="mt-[90px] md:mt-[120px] bg-background text-primary">
        <section className="mx-auto w-11/12 max-w-screen-sm">
          <div className="rounded-2xl bg-surface/80 p-6 text-center ring-1 ring-secondary/15">
            <h1 className="text-xl font-semibold">Booking details are missing</h1>
            <p className="mt-2 text-secondary">Please try again from the venue page.</p>
            <div className="mt-6">
              <Link to="/">
                <PrimaryButton>Return to homepage</PrimaryButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const formattedPrice = formatPrice(totalPrice);
  const venueTitle = venue?.name || "Venue title not available";
  const venueLocation =
    venue?.location?.city && venue?.location?.country
      ? `${venue.location.city}, ${venue.location.country}`
      : "Location not available";

  const heroImg = venue?.media?.[0]?.url || ImagePlaceholder;
  const owner = venue?.owner || {};
  const ownerAvatar = owner?.avatar?.url || ProfileImagePlaceholder;

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(payload.dateTo).getTime() - new Date(payload.dateFrom).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <>
      <Helmet>
        <title>Booking confirmed | Holidaze</title>
        <meta
          name="description"
          content="Your booking has been confirmed. We look forward to welcoming you!"
        />
      </Helmet>

      <main className="mt-[90px] md:mt-[120px] bg-background text-primary">
        <section className="mx-auto w-11/12 max-w-screen-lg">
          {/* Card */}
          <article className="overflow-hidden rounded-3xl bg-surface/80 ring-1 ring-secondary/15">
            {/* Success banner */}
            <div className="flex items-center gap-3 bg-highlight/20 px-4 py-3 ring-1 ring-highlight/40 md:px-6">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
              <p className="font-medium">Booking confirmed!</p>
            </div>

            {/* Content */}
            <div className="grid gap-6 p-4 md:grid-cols-5 md:p-6">
              {/* Image */}
              <div className="md:col-span-2">
                <div className="overflow-hidden rounded-2xl ring-1 ring-secondary/15">
                  <img
                    src={heroImg}
                    alt="Venue image"
                    className="h-56 w-full object-cover md:h-full"
                    onError={(e) => handleImageErrors(e, ImagePlaceholder)}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-3">
                {/* Title / rating */}
                <div className="flex items-start justify-between gap-4">
                  <h1
                    className="text-balance text-2xl font-semibold leading-tight md:text-3xl"
                    title={venueTitle}
                  >
                    {venueTitle}
                  </h1>

                  {typeof venue?.rating === "number" && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm text-secondary ring-1 ring-secondary/20">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 17.3l6.18 3.7-1.64-7.05L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.71L5.82 21z" />
                      </svg>
                      {venue.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="mt-1 inline-flex items-center gap-2 text-secondary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{venueLocation}</span>
                </div>

                {/* Booking facts */}
                <div className="mt-4 divide-y divide-secondary/10 overflow-hidden rounded-2xl ring-1 ring-secondary/15">
                  <Row label="Owner">
                    <div className="flex items-center gap-2">
                      <img
                        src={ownerAvatar}
                        alt="Owner avatar"
                        className="h-7 w-7 rounded-full object-cover"
                        onError={(e) => handleImageErrors(e, ProfileImagePlaceholder)}
                      />
                      <span>{owner?.name || "—"}</span>
                    </div>
                  </Row>

                  <Row label="Email">
                    <span className="break-all">{owner?.email || "—"}</span>
                  </Row>

                  <Row label="Check-in">
                    <span>{payload.dateFrom}</span>
                  </Row>

                  <Row label="Check-out">
                    <span>{payload.dateTo}</span>
                  </Row>

                  <Row label="Nights">
                    <span>{nights}</span>
                  </Row>

                  <Row label="Guests">
                    <span>{payload.guests}</span>
                  </Row>
                </div>

                {/* Total */}
                <div className="mt-4 rounded-2xl bg-background px-4 py-3 ring-1 ring-secondary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary">Total amount</span>
                    <span className="text-xl font-semibold">${formattedPrice}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link to="/">
                    <PrimaryButton>Return to homepage</PrimaryButton>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

/* ---------- Small UI helper ---------- */
function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[140px,1fr] items-center gap-3 bg-surface/80 px-4 py-3">
      <span className="text-sm text-secondary">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}