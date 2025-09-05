import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";
import { Loader } from "../../ui_elements/Loader";
import { MyBookings } from "../MyBookings";
import { MyVenues } from "../MyVenues";

import { useFetch } from "../../../hooks/useFetch";

import {
  all_Venues,
  API_Url,
  bookings_Url,
  profile_Url,
} from "../../../js/api/constants";
import { load } from "../../../js/storage/load";

export const ProfileTabs = () => {
  const userProfile = load("profile");
  const userId = userProfile?.name;

  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    hasError: hasBookingsError,
  } = useFetch(
    `${API_Url}${profile_Url}/${userId}${bookings_Url}?_booking=true`,
  );

  const {
    data: venuesData,
    isLoading: isVenuesLoading,
    hasError: hasVenuesError,
  } = useFetch(`${API_Url}${profile_Url}/${userId}${all_Venues}`);

  const isLoading = isBookingsLoading || isVenuesLoading;
  const hasError = hasBookingsError || hasVenuesError;

  const hasBookings = bookingsData && bookingsData.length > 0;
  const hasVenues = venuesData && venuesData.length > 0;

  const [activeTab, setActiveTab] = useState(
    hasVenues ? "venues" : hasBookings ? "bookings" : "none",
  );

  useEffect(() => {
    if (hasVenues) {
      setActiveTab("venues");
    } else if (hasBookings) {
      setActiveTab("bookings");
    }
  }, [hasVenues, hasBookings]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  let content;

  if (isLoading) {
    content = <Loader />;
  } else if (hasError) {
    content = <div className="mt-96">Error when trying to load page</div>;
  } else if (!bookingsData && !venuesData) {
    content = <div className="mt-96">Page not found</div>;
  } else if (!hasBookings && !hasVenues) {
    content = (
      <section className="mx-auto my-8 mt-4 w-11/12 rounded-lg bg-background text-center xl:w-5/12">
        <h2 className="sr-only">No Bookings or Venues</h2>
        <p className="px-4 py-10 text-center sm:text-xl">
          You have no bookings or venues at the moment
        </p>
        <Link
          to="/"
          aria-label="home"
          className="flex flex-col items-center pb-10"
        >
          <PrimaryButton>Find a venue to book</PrimaryButton>
        </Link>
      </section>
    );
  } else {
    content = (
      <section className="mx-auto max-w-screen-lg p-1">
        <h2 className="sr-only">Manage My Bookings and Venues</h2>
        <nav>
          <ul className="flex justify-start text-center font-medium text-gray-500">
            {hasBookings && (
              <li className="me-2">
                <button
                  className={`inline-block rounded-t-lg px-5 py-3 font-normal sm:text-xl ${
                    activeTab === "bookings"
                      ? "bg-background text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabClick("bookings")}
                >
                  My bookings ({bookingsData.length})
                </button>
              </li>
            )}
            {hasVenues && (
              <li className="me-2">
                <button
                  className={`inline-block rounded-t-lg px-5 py-3 font-normal sm:text-xl ${
                    activeTab === "venues"
                      ? "bg-background text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabClick("venues")}
                >
                  My venues ({venuesData.length})
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="mb-3 rounded-b-lg rounded-tr-lg bg-background p-3">
          {activeTab === "bookings" && hasBookings && (
            <div className="flex flex-col gap-10">
              <MyBookings data={bookingsData} key={bookingsData} />
            </div>
          )}
          {activeTab === "venues" && hasVenues && (
            <div className="flex flex-col gap-10">
              <MyVenues venuesData={venuesData} key={venuesData} />{" "}
            </div>
          )}
        </div>
      </section>
    );
  }

  return <div>{content}</div>;
};
