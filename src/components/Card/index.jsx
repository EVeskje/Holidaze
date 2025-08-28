import HeroImage from "../../assets/images/heroImage.png";
import { PrimaryButton } from "../Buttons/PrimaryButton";

export const Card = () => {
  return (
    <article
      className="
        group relative w-11/12 sm:w-72 mx-auto my-2 overflow-hidden
        rounded-2xl bg-surface border border-secondary/15
        shadow-sm transition-all duration-300
        hover:shadow-md hover:-translate-y-0.5 hover:border-secondary/25
      "
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <img
          src={HeroImage}
          alt="Luxury home with ocean view"
          className="h-full w-full object-cover"
        />
        {/* Bottom gradient for readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface/70 to-transparent" />
        {/* Rating badge */}
        <div className="absolute top-3 left-3 rounded-full bg-surface/95 backdrop-blur px-2.5 py-1 text-sm text-primary shadow">
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-accent"
              viewBox="0 0 22 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031A1.532 1.532 0 0 0 6.482 19.41L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            4.6
          </span>
          <span className="sr-only">Rating: 4.6 out of 5</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="truncate text-lg md:text-xl font-semibold text-primary">
          Luxury Home
        </h2>

        <div className="mt-1 flex items-center gap-1.5 text-secondary">
          <i className="fa-solid fa-location-dot text-xs" aria-hidden="true"></i>
          <p className="text-sm">Trondheim, Norway</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-primary">
            <span className="text-lg font-semibold">$975</span>{" "}
            <span className="text-sm text-secondary">/ night</span>
          </p>
          <div className="shrink-0">
            <PrimaryButton />
          </div>
        </div>
      </div>
    </article>
  );
};