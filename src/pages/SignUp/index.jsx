import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { SignUpForm } from "../../components/forms/SignUpForm";
import { TextLink } from "../../components/ui_elements/TextLink";

// ---------------------------------------------
// Sign up Page
// ---------------------------------------------

export const SignUp = () => {
  return (
    <>
      <Helmet>
        <title>Sign up | Holidaze</title>
        <meta
          name="description"
          content="Create a Holidaze account to book stays and manage your venues."
        />
      </Helmet>

      <main className="mt-[90px] md:mt-[120px] text-primary">
        <section className="mx-auto w-11/12 max-w-md">
          <article className="overflow-hidden rounded-3xl bg-surface/80 ring-1 ring-secondary/15">
            {/* Header strip */}
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
                  <path d="M16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              </span>
              <div>
                <h1 className="text-lg font-semibold md:text-xl">Create your account</h1>
                <p className="text-sm text-secondary">It only takes a moment.</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-5 md:p-6">
              <SignUpForm />

              {/* Divider */}
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-full bg-secondary/10" />
                <span className="text-xs text-secondary">or</span>
                <span className="h-px w-full bg-secondary/10" />
              </div>

              {/* Log in link */}
              <div className="mt-4 text-center">
                <Link to="/login" aria-label="Log in">
                  <TextLink>
                    Already have an account? <span className="font-medium">Log in</span>
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