/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { PrimaryButton } from "../../components/ui_elements/Buttons/PrimaryButton";
import { ProfileTabs } from "../../components/profile/ProfileTabs";
import { BecomeVenueManager } from "../../components/profile/BecomeVenueManager";

import { useFetch } from "../../hooks/useFetch";
import { API_Url, profile_Url } from "../../js/api/constants";
import { load } from "../../js/storage/load";

// ---------------------------------------------
// Profile Page
// ---------------------------------------------

export const Profile = () => {
  const [isVenueManager, setIsVenueManager] = useState(false);

  const userProfile = load("profile");
  const userId = userProfile?.name;
  if (!userId) return <Navigate to="/logIn" replace />;

  const { data, isLoading, hasError, refetch } = useFetch(
    `${API_Url}${profile_Url}/${userId}?_bookings=true&_venues=true`
  );

  useEffect(() => {
    if (typeof data?.venueManager === "boolean") setIsVenueManager(data.venueManager);
  }, [data]);

  const { bookingsCount, venuesCount } = useMemo(() => {
    const b = Array.isArray(data?.bookings) ? data.bookings.length : (data?._count?.bookings ?? 0);
    const v = Array.isArray(data?.venues) ? data.venues.length : (data?._count?.venues ?? 0);
    return { bookingsCount: b, venuesCount: v };
  }, [data]);

  const displayName = data?.name || userId || "My profile";

  return (
    <>
      <Helmet>
        <title>My profile | Holidaze</title>
        <meta
          name="description"
          content="Your profile page with bookings, venues, and account details."
        />
      </Helmet>

      {isLoading && (
        <main className="mt-[70px] md:mt-[110px] bg-background">
          <HeroSkeleton />
          <div className="mx-auto max-w-screen-xl px-4 py-8">
            <SkeletonRow />
          </div>
        </main>
      )}

      {!isLoading && hasError && (
        <main className="mt-[70px] md:mt-[110px] bg-background text-primary">
          <section className="mx-auto max-w-screen-md px-4 py-16 text-center" aria-live="polite">
            <h1 className="text-2xl font-semibold">We couldn’t load your profile</h1>
            <p className="mt-2 text-secondary">
              Please try again. If it continues, contact support.
            </p>
            <button
              onClick={refetch}
              className="mt-6 inline-flex items-center rounded-xl px-5 py-2.5 ring-1 ring-secondary/30 hover:ring-secondary/50"
            >
              Retry
            </button>
          </section>
        </main>
      )}

      {!isLoading && !hasError && !data && (
        <main className="mt-[70px] md:mt-[110px] bg-background text-primary">
          <section className="mx-auto max-w-screen-md px-4 py-16 text-center" aria-live="polite">
            <h1 className="text-2xl font-semibold">Profile not found</h1>
            <p className="mt-2 text-secondary">Check your account and try again.</p>
          </section>
        </main>
      )}

      {!isLoading && !hasError && data && (
        <main className="mt-[70px] md:mt-[110px] bg-background text-primary">
          {/* Hero */}
          <section className="relative" aria-label="Profile header">
            <div className="mx-auto max-w-screen-xl px-4">
              <div className="overflow-hidden rounded-3xl bg-surface/80 backdrop-blur ring-1 ring-secondary/15">
                <div className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
                  <div className="min-w-0 flex-1 md:max-w-[70%]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1
                        className="text-2xl font-semibold tracking-tight text-balance break-words line-clamp-2 md:text-3xl md:line-clamp-1"
                        title={displayName}
                      >
                        {displayName}
                      </h1>
                 <span className="inline-flex items-center rounded-full border border-accent px-3 py-1 text-sm font-medium text-accent bg-surface/80">
  {isVenueManager ? "Venue manager" : "Traveler"}
</span>
                    </div>
                    <p className="mt-2 max-w-prose text-secondary">
                      Manage your bookings, keep listings up to date, and personalize your account.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {isVenueManager && (
                        <Link to="/addEditVenue" aria-label="Add or edit venue">
                          <PrimaryButton>+ Add new venue</PrimaryButton>
                        </Link>
                      )}

                      <Link
                        to="/contact"
                        className="rounded-xl px-4 py-2 text-secondary ring-1 ring-secondary/25 hover:text-primary"
                      >
                        Get help
                      </Link>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:min-w-[260px]">
                    <Stat label="Bookings" value={bookingsCount} />
                    <Stat label="Venues" value={venuesCount} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main */}
          <section className="mx-auto max-w-screen-xl px-4 py-8">
            <div className="grid gap-8 md:grid-cols-12">
              {/* Left: Profile card + Become manager (if not manager) */}
              <div className="space-y-6 md:col-span-4">
                <ProfileInfo data={data} />
                {!isVenueManager && (
                  <div id="become-manager">
                    <BecomeVenueManager />
                  </div>
                )}
              </div>

              {/* Right: Tabs */}
              <div className="md:col-span-8">
                <div className="rounded-2xl bg-surface/80 p-4 ring-1 ring-secondary/15 md:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Your activity</h2>
                    <span className="text-sm text-secondary">
                      {bookingsCount} bookings · {venuesCount} venues
                    </span>
                  </div>
                  <ProfileTabs />
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
};

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-surface/80 p-4 text-center ring-1 ring-secondary/15">
      <div className="text-2xl font-semibold">{Number(value) || 0}</div>
      <div className="mt-1 text-sm text-secondary">{label}</div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section className="mx-auto max-w-screen-xl px-4 pt-6">
      <div className="animate-pulse overflow-hidden rounded-3xl bg-surface/80 p-6 ring-1 ring-secondary/15">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-secondary/10" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-1/3 rounded bg-secondary/10" />
            <div className="h-4 w-2/3 rounded bg-secondary/10" />
            <div className="flex gap-3">
              <div className="h-9 w-28 rounded-lg bg-secondary/10" />
              <div className="h-9 w-28 rounded-lg bg-secondary/10" />
            </div>
          </div>
          <div className="grid min-w-[260px] grid-cols-2 gap-3">
            <div className="h-20 rounded-xl bg-secondary/10" />
            <div className="h-20 rounded-xl bg-secondary/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="animate-pulse md:col-span-4">
        <div className="h-64 rounded-2xl bg-surface/80 p-5 ring-1 ring-secondary/15" />
        <div className="mt-6 h-56 rounded-2xl bg-surface/80 ring-1 ring-secondary/15" />
      </div>
      <div className="animate-pulse md:col-span-8">
        <div className="h-80 rounded-2xl bg-surface/80 ring-1 ring-secondary/15" />
      </div>
    </div>
  );
}