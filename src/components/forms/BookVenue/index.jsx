import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";
import { BookVenueNotLoggedIn } from "../../../components/bookings/BookVenueNotLoggedIn";

import { usePost } from "../../../hooks/usePost";
import { useFetch } from "../../../hooks/useFetch";

import { load } from "../../../js/storage/load";
import { formatDate } from "../../../js/utils/formatDate";
import { all_Venues, API_Url, bookings_Url } from "../../../js/api/constants";


const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const currency = (value, code = "USD") =>
  Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(value);

/* ------------------------------------------
   Component
------------------------------------------- */
export const BookVenue = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = load("accessToken");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedCheckInDate, setSelectedCheckInDate] = useState(addDays(today, 1));
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(addDays(today, 2));
  const [errorMessage, setErrorMessage] = useState("");

  // Validation
  const schema = yup
    .object({
      checkIn: yup.date().required("Please add a check-in date"),
      checkOut: yup
        .date()
        .required("Please add a check-out date")
        .test("after-checkin", "Check-out must be at least 1 night after check-in", function (value) {
          const { checkIn } = this.parent;
          return value && checkIn && new Date(value) > addDays(new Date(checkIn), 0);
        }),
      numberOfGuests: yup
        .number()
        .typeError("Please add the number of guests")
        .min(1, "Minimum number of guests is 1")
        .max(data.maxGuests, `Maximum number of guests is ${data.maxGuests}`)
        .required("Please add the number of guests"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      checkIn: selectedCheckInDate,
      checkOut: selectedCheckOutDate,
      numberOfGuests: 1,
    },
  });

  const { postData, isLoading, hasError } = usePost(API_Url + bookings_Url);
  const { data: bookingsData } = useFetch(`${API_Url}${all_Venues}/${id}?_bookings=true`);

  // Register fields used by DatePicker
  useEffect(() => {
    register("checkIn");
    register("checkOut");
  }, [register]);

  // Booked intervals from API
  const bookedIntervals = useMemo(() => {
    const list = bookingsData?.bookings ?? [];
    return list.map((b) => ({
      start: new Date(b.dateFrom),
      end: new Date(b.dateTo),
    }));
  }, [bookingsData]);

  const isDateBookable = (date) =>
    !bookedIntervals.some((b) => date >= b.start && date <= b.end);

  const getDayClassName = (date) => {
    let cls = "";
    if (date >= selectedCheckInDate && date <= selectedCheckOutDate && isDateBookable(date)) {
      cls += " react-datepicker__day--in-range";
    }
    if (!isDateBookable(date)) {
      cls += " react-datepicker__day--booked";
    }
    return cls.trim();
  };

  const isRangeOverlapping = (checkIn, checkOut) => {
    const start = new Date(checkIn).setHours(0, 0, 0, 0);
    const end = new Date(checkOut).setHours(23, 59, 59, 999);
    return bookedIntervals.some((b) => {
      const bs = new Date(b.start).setHours(0, 0, 0, 0);
      const be = new Date(b.end).setHours(23, 59, 59, 999);
      return start <= be && end >= bs;
    });
  };

  const handleCheckInDateChange = (date) => {
    const nextIn = new Date(date);
    const minOut = addDays(nextIn, 1);

    setSelectedCheckInDate(nextIn);
    setValue("checkIn", nextIn);

 
    if (selectedCheckOutDate <= nextIn) {
      setSelectedCheckOutDate(minOut);
      setValue("checkOut", minOut);
    }

    // Overlap guard
    if (isRangeOverlapping(nextIn, selectedCheckOutDate)) {
      setErrorMessage(
        "The selected date range overlaps with unavailable dates. Please choose different dates."
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleCheckOutDateChange = (date) => {
    const minOut = addDays(selectedCheckInDate, 1);
    const nextOut = date < minOut ? minOut : date;

    setSelectedCheckOutDate(nextOut);
    setValue("checkOut", nextOut);

    if (isRangeOverlapping(selectedCheckInDate, nextOut)) {
      setErrorMessage(
        "The selected date range overlaps with unavailable dates. Please choose different dates."
      );
    } else {
      setErrorMessage("");
    }
  };

  // Pricing
  const nights = useMemo(() => {
    const ms = new Date(selectedCheckOutDate) - new Date(selectedCheckInDate);
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [selectedCheckInDate, selectedCheckOutDate]);

  const total = useMemo(() => {
    const price = Number(data?.price ?? 0);
    return price * nights;
  }, [data?.price, nights]);

  const onSubmit = async (formData) => {
    // extra guards
    if (isRangeOverlapping(selectedCheckInDate, selectedCheckOutDate)) {
      setErrorMessage(
        "The selected date range overlaps with unavailable dates. Please choose different dates."
      );
      return;
    }

    const payload = {
      dateFrom: formatDate(selectedCheckInDate),
      dateTo: formatDate(selectedCheckOutDate),
      guests: formData.numberOfGuests,
      venueId: id,
    };

    try {
      const result = await postData(payload);
      if (result && !hasError) {
        reset();
        navigate("/confirmedBooking", {
          state: { payload, venue: data, totalPrice: total.toLocaleString() },
        });
      } else {
        console.error("Error submitting booking:", hasError);
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };

  const guests = watch("numberOfGuests");

  /* ------------------------------------------
     UI
  ------------------------------------------- */
  return (
    <section className="mx-auto w-full rounded-2xl bg-surface p-4 ring-1 ring-secondary/15 sm:p-5 md:p-6">
      <header className="mb-4">
        <h2 className="text-xl font-semibold md:text-2xl">Book this venue</h2>
        <p className="mt-1 text-sm text-secondary">
          Secure your dates in a few clicks. Free cancellation on most stays.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Price summary (top) */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background px-4 py-3 ring-1 ring-secondary/10">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary">
              {currency(Number(data?.price ?? 0))}
            </span>
            <span className="text-sm text-secondary">/ night</span>
          </div>
          <div className="text-sm text-secondary">
            Max {data?.maxGuests} guest{data?.maxGuests === 1 ? "" : "s"}
          </div>
        </div>

        {/* Grid: Dates + Guests */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Check-in */}
          <div>
            <label htmlFor="checkIn" className="mb-1 block text-sm font-medium text-secondary">
              Check-in
            </label>
            <DatePicker
              id="checkIn"
              selected={selectedCheckInDate}
              onChange={handleCheckInDateChange}
              selectsStart
              startDate={selectedCheckInDate}
              endDate={selectedCheckOutDate}
              dateFormat="dd/MM/yyyy"
              minDate={addDays(today, 0)}
              excludeDateIntervals={bookedIntervals}
              dayClassName={getDayClassName}
              className="w-full rounded-xl border border-secondary/30 bg-background px-3 py-2 text-center text-primary outline-none transition focus:border-secondary focus:bg-surface"
            />
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn.message}</p>
            )}
          </div>

          {/* Check-out */}
          <div>
            <label htmlFor="checkOut" className="mb-1 block text-sm font-medium text-secondary">
              Check-out
            </label>
            <DatePicker
              id="checkOut"
              selected={selectedCheckOutDate}
              onChange={handleCheckOutDateChange}
              selectsEnd
              startDate={selectedCheckInDate}
              endDate={selectedCheckOutDate}
              dateFormat="dd/MM/yyyy"
              minDate={addDays(selectedCheckInDate, 1)}
              excludeDateIntervals={bookedIntervals}
              dayClassName={getDayClassName}
              className="w-full rounded-xl border border-secondary/30 bg-background px-3 py-2 text-center text-primary outline-none transition focus:border-secondary focus:bg-surface"
            />
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut.message}</p>
            )}
          </div>

          {/* Guests */}
          <div className="sm:col-span-2">
            <label htmlFor="numberOfGuests" className="mb-1 block text-sm font-medium text-secondary">
              Number of guests
            </label>
            <div className="relative">
              <select
                {...register("numberOfGuests", { required: true, valueAsNumber: true })}
                id="numberOfGuests"
                className="w-full appearance-none rounded-xl border border-secondary/30 bg-background px-3 py-2 pr-10 text-center text-primary outline-none transition focus:border-secondary focus:bg-surface"
                defaultValue={1}
              >
                {Array.from({ length: data.maxGuests }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {errors.numberOfGuests && (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests.message}</p>
            )}
          </div>
        </div>

        {/* Overlap error */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Totals */}
        <div className="rounded-2xl bg-background p-4 ring-1 ring-secondary/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-secondary">
              {nights} night{nights === 1 ? "" : "s"} · {guests || 1} guest
              {guests === 1 ? "" : "s"}
            </div>
            <div className="text-right">
              <div className="text-sm text-secondary">Total</div>
              <div className="text-lg font-semibold text-primary">
                {currency(total)}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {token ? (
          <PrimaryButton
            className="w-full justify-center md:w-auto"
            type="submit"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? "Booking…" : "Book now"}
          </PrimaryButton>
        ) : (
          <BookVenueNotLoggedIn />
        )}
      </form>
    </section>
  );
};