import { Link } from "react-router-dom";
import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";
import { TextLink } from "../../ui_elements/TextLink";

export const BookVenueNotLoggedIn = () => {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-surface/80 p-8 text-center shadow-lg backdrop-blur ring-1 ring-secondary/15">
      {/* Icon */}
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Title + sub */}
      <h2 className="text-xl font-semibold text-primary md:text-2xl">
        Log in to book this venue
      </h2>
      <p className="mt-2 text-sm text-secondary">
        Secure checkout, saved details, and easy trip management.
      </p>

      {/* CTA */}
      <Link to="/login" aria-label="Log in" className="mt-6 block">
        <PrimaryButton className="h-11 w-full justify-center">
          Log in
        </PrimaryButton>
      </Link>

      {/* Divider */}
      <div className="my-4 flex items-center gap-3 text-xs text-secondary">
        <span className="h-px flex-1 bg-secondary/20" />
        or
        <span className="h-px flex-1 bg-secondary/20" />
      </div>

      {/* Secondary CTA */}
      <Link to="/signUp" aria-label="Sign up" className="block">
        <TextLink>
          Don’t have an account? <span className="font-medium">Sign up</span>
        </TextLink>
      </Link>
    </div>
  );
};