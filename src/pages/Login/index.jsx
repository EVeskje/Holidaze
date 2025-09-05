import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { LogInForm } from "../../components/forms/LogInForm";
import { TextLink } from "../../components/ui_elements/TextLink";

export const LogIn = () => {
  return (
    <>
      <Helmet>
        <title>Log in | Holidaze</title>
        <meta name="description" content="Log in to your Holidaze account." />
      </Helmet>

      <main className="mt-[90px] md:mt-[120px] text-primary">
        <section className="mx-auto w-11/12 max-w-md">
          <article className="overflow-hidden rounded-3xl bg-surface/80 ring-1 ring-secondary/15">
            {/* Header */}
            <div className="flex items-center gap-3 bg-secondary/5 px-5 py-4 ring-1 ring-secondary/10 md:px-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <div>
                <h1 className="text-lg font-semibold md:text-xl">Welcome back</h1>
                <p className="text-sm text-secondary">Log in to manage bookings and venues.</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-5 md:p-6 ">
              <LogInForm />

              {/* Divider */}
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-full bg-secondary/10" />
                <span className="text-xs text-secondary">or</span>
                <span className="h-px w-full bg-secondary/10" />
              </div>

              {/* Sign up link */}
              <div className="mt-4 text-center">
                <Link to="/signup" aria-label="Sign up">
                  <TextLink>
                    Don’t have an account? <span className="font-medium">Sign up</span>
                  </TextLink>
                </Link>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};