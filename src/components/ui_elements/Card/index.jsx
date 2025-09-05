/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

import ImagePlaceholder from "../../../assets/images/no_img.png";
import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";

import { formatPrice } from "../../../js/utils/formatPrice";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

export const Card = ({ data }) => {
  const imageArray = data?.media;
  const imageUrl = imageArray?.[0]?.url ?? ImagePlaceholder;
  const imageAltText = imageArray?.[0]?.alt ?? "Venue image";
  const venueTitle = data?.name || "Venue title not available";
  const location =
    data?.location?.city && data?.location?.country
      ? `${data.location.city}, ${data.location.country}`
      : "Location not available";

  const price = data?.price || 0;
  const formattedPrice = formatPrice(price);
  const rating = typeof data?.rating === "number" ? data.rating.toFixed(1) : "—";

  return (
    <article id="venues"
      className="
        group relative w-full max-w-sm mx-auto
        overflow-hidden rounded-2xl bg-surface border border-secondary/15
        shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md hover:border-secondary/25
      "
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <img
          src={imageUrl}
          alt={imageAltText}
          loading="lazy"
          onError={(e) => handleImageErrors(e, ImagePlaceholder)}
          className="h-full w-full object-cover"
        />

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface/60 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 left-3 rounded-full bg-surface/95 backdrop-blur px-2.5 py-1 text-sm text-primary shadow">
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-accent"
              viewBox="0 0 22 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            {rating}
          </span>
          <span className="sr-only">Rating</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="truncate text-lg md:text-xl font-semibold text-primary">
          {venueTitle}
        </h2>

        <div className="mt-1 flex items-center gap-1.5 text-secondary">
          <i className="fa-solid fa-location-dot text-xs" aria-hidden="true"></i>
          <p className="text-sm">{location}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-primary">
            <span className="text-lg font-semibold">${formattedPrice}</span>{" "}
            <span className="text-sm text-secondary">/ night</span>
          </p>
          <Link to={`/singleVenue/${data?.id}`} className="shrink-0">
            <PrimaryButton>View more</PrimaryButton>
          </Link>
        </div>
      </div>
    </article>
  );
};