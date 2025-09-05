import { Link } from "react-router-dom";
import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";


export const VenueManagerOwnPageView = ({ venue }) => {
  const title = venue?.name || "Your venue";
  const bookingsCount =
    (venue?._count?.bookings ?? (Array.isArray(venue?.bookings) ? venue.bookings.length : 0)) || 0;
  const maxGuests = typeof venue?.maxGuests === "number" ? venue.maxGuests : null;
  const price = typeof venue?.price === "number" ? venue.price : null;

  return (
    <aside
      className="rounded-2xl bg-surface/80 p-5 ring-1 ring-secondary/15"
      aria-label="Owner tools"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
            Owner tools
          </span>
          <h2
            className="mt-2 line-clamp-2 break-words text-lg font-semibold text-primary"
            title={title}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatPill
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 110 7H6" />
            </svg>
          }
          label="Price"
          value={price != null ? `$ ${price}` : "—"}
        />
        <StatPill
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="7" r="3" />
              <path d="M2 21a7 7 0 0114 0" />
            </svg>
          }
          label="Guests"
          value={maxGuests != null ? maxGuests : "—"}
        />
        <StatPill
          icon={
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 7h10M7 12h10M7 17h10" />
            </svg>
          }
          label="Bookings"
          value={bookingsCount}
        />
      </div>

      {/* CTA */}
      <div className="mt-5">
        <Link
          to="/addEditVenue"
          state={{ venue, isEdit: true }}
          aria-label="Edit venue"
          className="block"
        >
          <PrimaryButton className="w-full">Edit venue</PrimaryButton>
        </Link>
      </div>

      {/* Helper note */}
      <p className="mt-2 text-center text-xs text-secondary">
        Update photos, pricing, availability and more.
      </p>
    </aside>
  );
};

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-background px-2 py-2 text-center ring-1 ring-secondary/15">
      <span className="inline-flex items-center gap-1 text-sm text-secondary">
        {icon}
        {label}
      </span>
      <span className="mt-1 text-sm font-medium text-primary">{value}</span>
    </div>
  );
}