import { useState } from "react";

import ProfileImagePlaceholder from "../../../assets/images/no_ProfileImg.png";
import { Loader } from "../../ui_elements/Loader";
import { useFetch } from "../../../hooks/useFetch";
import { all_Venues, API_Url } from "../../../js/api/constants";
import { formatDate } from "../../../js/utils/formatDate";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

export const BookingsAccordion = ({ venueId }) => {
  const [openBookingId, setOpenBookingId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenBookingId((prev) => (prev === id ? null : id));
  };

  const {
    data: venueBookings,
    isLoading,
    hasError,
  } = useFetch(`${API_Url}${all_Venues}/${venueId}?_bookings=true`);

  /* ---------- States ---------- */
  if (isLoading) {
    return (
      <article className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl bg-surface/80 p-6 text-center shadow-sm ring-1 ring-secondary/15">
          <Loader />
        </div>
      </article>
    );
  }

  if (hasError) {
    return (
      <article className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
          Error loading venue bookings. Please try again.
        </div>
      </article>
    );
  }

  const bookings = venueBookings?.bookings ?? [];

  if (bookings.length === 0) {
    return (
      <article className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl bg-surface/80 p-6 text-center shadow-sm ring-1 ring-secondary/15">
          <p className="text-sm text-secondary">No bookings found for this venue.</p>
        </div>
      </article>
    );
  }

  /* ---------- List ---------- */
  return (
    <article className="mx-auto w-full max-w-lg space-y-3">
      {bookings.map((booking) => {
        const dateFrom = booking?.dateFrom ? new Date(booking.dateFrom) : null;
        const dateTo = booking?.dateTo ? new Date(booking.dateTo) : null;

        const formattedDateFrom = dateFrom ? formatDate(dateFrom) : "Date unavailable";
        const formattedDateTo = dateTo ? formatDate(dateTo) : "Date unavailable";

        const avatarUrl =
          booking?.customer?.avatar?.url || ProfileImagePlaceholder;
        const customerName = booking?.customer?.name || "Guest";
        const customerEmail = booking?.customer?.email || "Email unavailable";

        const isOpen = openBookingId === booking.id;

        return (
          <div
            key={booking.id}
            id={`accordion-item-${booking.id}`}
            className="overflow-hidden rounded-2xl bg-surface/80 shadow-sm ring-1 ring-secondary/15"
          >
            {/* Header button */}
            <h2 id={`accordion-heading-${booking.id}`}>
              <button
                type="button"
                onClick={() => toggleAccordion(booking.id)}
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${booking.id}`}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-surface/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-1 ring-secondary/20"
                    onError={(e) => handleImageErrors(e, ProfileImagePlaceholder)}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">
                      {customerName}
                    </p>
                    <p className="truncate text-xs text-secondary">
                      {formattedDateFrom} — {formattedDateTo}
                    </p>
                  </div>
                </div>

                <svg
                  className={`h-4 w-4 flex-shrink-0 text-secondary transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M9 5 5 1 1 5" />
                </svg>
              </button>
            </h2>

            {/* Panel */}
            <div
              id={`accordion-panel-${booking.id}`}
              role="region"
              aria-labelledby={`accordion-heading-${booking.id}`}
              className={isOpen ? "block" : "hidden"}
            >
              <div className="border-t border-secondary/15 px-4 py-3 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-secondary">Email</span>
                  <span className="max-w-[60%] truncate font-medium text-primary">
                    {customerEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-secondary">Check-in</span>
                  <span className="font-medium text-primary">{formattedDateFrom}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-secondary">Check-out</span>
                  <span className="font-medium text-primary">{formattedDateTo}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-secondary">Guests</span>
                  <span className="font-medium text-primary">{booking?.guests ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </article>
  );
};