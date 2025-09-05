import ProfileImagePlaceholder from "../../../assets/images/no_ProfileImg.png";
import { formatPrice } from "../../../js/utils/formatPrice";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

export const VenueInfo = ({ data }) => {
  const title = data?.name || "Venue title not available";

  const location =
    data?.location?.city && data?.location?.country
      ? `${data.location.city}, ${data.location.country}`
      : "Location not available";

  const rating =
    typeof data?.rating === "number" ? data.rating.toFixed(1) : null;

  const maxGuests =
    typeof data?.maxGuests === "number" ? data.maxGuests : null;

  const pricePerNight = typeof data?.price === "number" ? data.price : 0;
  const formattedPrice = formatPrice(pricePerNight);

  const ownerAvatar = data?.owner?.avatar?.url || ProfileImagePlaceholder;
  const ownerName = data?.owner?.name || "Owner name not available";
  const ownerEmail = data?.owner?.email || "Owner email not available";
  const description = data?.description || "No description available";

  const amenities = [
    data?.meta?.wifi && { key: "wifi", label: "Wi-Fi", icon: WifiIcon },
    data?.meta?.pets && { key: "pets", label: "Pets", icon: PetsIcon },
    data?.meta?.parking && { key: "parking", label: "Parking", icon: ParkingIcon },
    data?.meta?.breakfast && { key: "breakfast", label: "Breakfast", icon: BreakfastIcon },
  ].filter(Boolean);

  return (
    <article className="rounded-2xl bg-surface/80 p-4 ring-1 ring-secondary/15 md:p-6">
      {/* Header: title / rating / location */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1
            className="text-balance break-words text-2xl font-semibold tracking-tight md:text-3xl"
            title={title}
          >
            {title}
          </h1>

          {rating && (
            <span className="inline-flex items-center gap-1 rounded-full border border-secondary/20 bg-background px-2.5 py-1 text-sm text-primary">
              <StarIcon className="h-4 w-4" />
              {rating}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-secondary">
          <MapPinIcon className="h-5 w-5" />
          <p className="text-sm md:text-base">{location}</p>
        </div>
      </header>

      {/* Stats: guests / price */}
      <section className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-background px-3 py-1.5 text-sm text-primary ring-1 ring-secondary/15">
          <UsersIcon className="h-4 w-4" />
          <span>
            {maxGuests ?? "Max guests not available"}
            {typeof maxGuests === "number" ? ` guest${maxGuests === 1 ? "" : "s"}` : ""}
          </span>
        </div>

        <p className="text-lg md:text-xl">
          <span className="font-semibold text-primary">$ {formattedPrice}</span>
          <span className="ml-1 text-secondary">/ night</span>
        </p>
      </section>

      {/* Amenities */}
      {amenities.length > 0 && (
        <section className="mt-4 flex flex-wrap gap-2">
          {amenities.map(({ key, label, icon: Icon }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm text-secondary ring-1 ring-secondary/15"
            >
              <Icon className="h-4 w-4" />
              {label}
            </span>
          ))}
        </section>
      )}

      {/* Description */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="mt-2 max-w-prose text-primary/90">{description}</p>
      </section>

      {/* Owner */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Owner</h2>
        <div className="mt-3 flex items-center gap-3">
          <img
            src={ownerAvatar}
            alt="Owner avatar"
            onError={(e) => handleImageErrors(e, ProfileImagePlaceholder)}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-secondary/15 md:h-14 md:w-14"
          />
          <div className="min-w-0">
            <p className="truncate text-primary md:text-lg">{ownerName}</p>
            <p className="truncate text-sm text-secondary md:text-base">{ownerEmail}</p>
          </div>
        </div>
      </section>
    </article>
  );
};

/* ---------- Minimal inline icons ---------- */
function StarIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z" />
    </svg>
  );
}

function MapPinIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z" />
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
      <path d="M14.5 21a6.5 6.5 0 016.5 0" />
    </svg>
  );
}

function WifiIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12a12 12 0 0114 0" />
      <path d="M8.5 15.5a7 7 0 017 0" />
      <circle cx="12" cy="20" r="1" />
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

function ParkingIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 4h7a5 5 0 010 10H6z" />
      <path d="M6 14v6" />
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