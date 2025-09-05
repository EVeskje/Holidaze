/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { InputField } from "../../components/form_elements/InputField";
import { Checkbox } from "../../components/form_elements/Checkbox";
import { PrimaryButton } from "../../components/ui_elements/Buttons/PrimaryButton";
import { SecondaryButton } from "../../components/ui_elements/Buttons/SecondaryButton";
import { AddImageForm } from "../../components/forms/AddImageForm";
import { Modal } from "../../components/ui_elements/Modal";

import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";
import { useDelete } from "../../hooks/useDelete";

import { all_Venues, API_Url } from "../../js/api/constants";

// ---------------------------------------------
// Add Edit Venue Page
// ---------------------------------------------

/* ------------------------------------------
   Validation
------------------------------------------- */
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Venue title is required"),
  description: Yup.string()
    .required("Description of venue is required")
    .min(20, "Must be at least 20 characters"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  wifi: Yup.boolean(),
  pets: Yup.boolean(),
  breakfast: Yup.boolean(),
  parking: Yup.boolean(),
  maxGuests: Yup.number().min(1, "Minimum number of guests is 1").required("Please add the number of guests"),
  pricePrNight: Yup.number()
    .required("Please add price per night")
    .min(1, "Price per night must be at least 1")
    .max(10000, "Price per night is max $ 10 000"),
  images: Yup.array()
    .of(Yup.string().url("Invalid URL").required("At least one image is required"))
    .min(1, "At least one image is required"),
});

/* ------------------------------------------
   Component
------------------------------------------- */
export const AddEditVenue = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const venue = useMemo(() => location.state?.venue || {}, [location.state?.venue]);
  const isEdit = Boolean(location.state?.isEdit);
  const venueId = venue?.id;

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      country: "",
      wifi: false,
      pets: false,
      breakfast: false,
      parking: false,
      maxGuests: 1,
      pricePrNight: 1,
      images: [""],
    },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitted },
  } = methods;

  // API hooks
  const { postData, isLoading: isPostLoading, hasError: postError } = usePost(API_Url + all_Venues);
  const { putData, isLoading: isPutLoading, hasError: putError } = usePut(`${API_Url + all_Venues}/${venueId}`);
  const { deleteData, isLoading: isDeleteLoading, hasError: deleteError } = useDelete(`${API_Url + all_Venues}/${venueId}`);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 Basics, 2 Location & amenities, 3 Pricing & media

  // Prefill on edit
  useEffect(() => {
    if (isEdit && venue) {
      reset({
        title: venue.name ?? "",
        description: venue.description ?? "",
        city: venue.location?.city ?? "",
        country: venue.location?.country ?? "",
        wifi: Boolean(venue.meta?.wifi),
        pets: Boolean(venue.meta?.pets),
        breakfast: Boolean(venue.meta?.breakfast),
        parking: Boolean(venue.meta?.parking),
        maxGuests: venue.maxGuests ?? 1,
        pricePrNight: venue.price ?? 1,
        images: Array.isArray(venue.media) && venue.media.length > 0 ? venue.media.map((m) => m.url) : [""],
      });
    }
  }, [isEdit, venue, reset]);

  // Submit
  const onSubmit = async (data) => {
    const payload = {
      name: data.title,
      description: data.description,
      media: data.images.map((url) => ({ url, alt: "Venue image" })),
      price: data.pricePrNight,
      maxGuests: data.maxGuests,
      meta: {
        wifi: Boolean(data.wifi),
        parking: Boolean(data.parking),
        breakfast: Boolean(data.breakfast),
        pets: Boolean(data.pets),
      },
      location: {
        city: data.city,
        country: data.country,
      },
    };

    if (isEdit) {
      await putData(payload);
    } else {
      await postData(payload);
    }

    if (!(postError || putError)) {
      navigate("/profile");
    }
  };

  // Delete
  const handleDelete = async () => {
    setIsModalOpen(false);
    await deleteData();
    if (!deleteError) navigate("/profile");
  };

  const pageTitle = isEdit ? "Edit venue" : "Add new venue";
  const isBusy = isPostLoading || isPutLoading;

  // guests 1..15
  const guestOptions = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 1), []);

  // Live Preview (watches)
  const title = watch("title");
  const description = watch("description");
  const city = watch("city");
  const country = watch("country");
  const maxGuests = watch("maxGuests");
  const price = watch("pricePrNight");
  const wifi = watch("wifi");
  const pets = watch("pets");
  const breakfast = watch("breakfast");
  const parking = watch("parking");
  const images = watch("images") || [];
  const heroImage = images?.[0];

  // Step guards
  const validateStep = async (n) => {
    if (n === 1) return trigger(["title", "description"]);
    if (n === 2) return trigger(["city", "country"]);
    if (n === 3) return trigger(["maxGuests", "pricePrNight", "images"]);
    return true;
  };

  const goNext = async () => {
    const ok = await validateStep(step);
    if (ok && step < 3) setStep(step + 1);
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <>
      <Helmet>
        <title>{isEdit ? "Edit Venue" : "Add New Venue"} | Holidaze</title>
        <meta
          name="description"
          content={isEdit ? "Edit your venue details with a simple 3-step flow." : "Create a new venue in 3 easy steps."}
        />
      </Helmet>

      <FormProvider {...methods}>
        <main className="mt-[90px] md:mt-[120px] bg-background text-primary">
          {/* Header bar */}
          <header className="mx-auto w-11/12 max-w-screen-xl">
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-surface/80 p-4 ring-1 ring-secondary/15 md:flex-row md:items-center md:p-5">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{pageTitle}</h1>
                <p className="mt-1 text-sm text-secondary">Step {step} of 3</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <SecondaryButton
                  type="button"
                  onClick={() => (isEdit ? setIsModalOpen(true) : navigate("/profile"))}
                >
                  {isEdit ? "Delete" : "Cancel"}
                </SecondaryButton>
                <PrimaryButton type="submit" form="venueForm" disabled={isBusy}>
                  {isBusy ? "Submitting…" : isEdit ? "Save changes" : "Publish venue"}
                </PrimaryButton>
              </div>
            </div>
          </header>

          {/* Progress bar */}
          <div className="mx-auto mt-3 w-11/12 max-w-screen-xl">
            <div className="h-2 rounded-full bg-secondary/10">
              <div
                className="h-2 rounded-full bg-accent transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form + Preview */}
          <section className="mx-auto w-11/12 max-w-screen-xl py-6">
            <div className="grid gap-6 md:grid-cols-12">
              {/* Main form card */}
              <form
                id="venueForm"
                onSubmit={handleSubmit(onSubmit)}
                className="md:col-span-8 rounded-2xl bg-surface/80 p-4 ring-1 ring-secondary/15 md:p-6"
                aria-live="polite"
              >
                {/* Stepper content */}
                {step === 1 && (
                  <div>
                    <h2 className="text-lg font-semibold">Basics</h2>
                    <p className="mt-1 text-sm text-secondary">Give travelers the essentials.</p>

                    <div className="mt-4 grid gap-4 justify-start">
                      <InputField
                        label="Title"
                        htmlFor="venueTitle"
                        register={register}
                        registerYup="title"
                        required
                        id="venueTitle"
                        type="text"
                        className="h-10 w-full rounded-xl border-secondary/30 bg-background"
                        errors={errors}
                      />

                      <div>
                        <label htmlFor="venueDescription" className="mb-1 block text-sm font-medium text-secondary">
                          Description
                        </label>
                        <textarea
                          {...register("description")}
                          id="venueDescription"
                          rows={6}
                          className="w-full rounded-xl border border-secondary/30 bg-background p-3 outline-none focus:border-secondary"
                          placeholder="Describe your place, what makes it special, nearby attractions…"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-lg font-semibold">Location & amenities</h2>
                    <p className="mt-1 text-sm text-secondary">Help guests understand where and what you offer.</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="City"
                        htmlFor="venueCity"
                        register={register}
                        registerYup="city"
                        required
                        id="venueCity"
                        type="text"
                        className="h-10 w-full rounded-xl border-secondary/30 bg-background"
                        errors={errors}
                      />
                      <InputField
                        label="Country"
                        htmlFor="venueCountry"
                        register={register}
                        registerYup="country"
                        required
                        id="venueCountry"
                        type="text"
                        className="h-10 w-full rounded-xl border-secondary/30 bg-background"
                        errors={errors}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Checkbox register={register} registerYup="wifi" id="venueWifi" checkboxHtmlFor="venueWifi" label="Wi-Fi" />
                      <Checkbox register={register} registerYup="breakfast" id="venueBreakfast" checkboxHtmlFor="venueBreakfast" label="Breakfast" />
                      <Checkbox register={register} registerYup="pets" id="venuePets" checkboxHtmlFor="venuePets" label="Pets" />
                      <Checkbox register={register} registerYup="parking" id="venueParking" checkboxHtmlFor="venueParking" label="Parking" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-lg font-semibold">Pricing & media</h2>
                    <p className="mt-1 text-sm text-secondary">Set a price and add images.</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="venueMaxGuests" className="mb-1 block text-sm font-medium text-secondary">
                          Max guests
                        </label>
                        <select
                          {...register("maxGuests")}
                          id="venueMaxGuests"
                          className="w-full rounded-xl border border-secondary/30 bg-background px-3 py-2 text-center outline-none focus:border-secondary"
                          defaultValue={1}
                        >
                          {guestOptions.map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                        {errors.maxGuests && <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message}</p>}
                      </div>

                      <div>
                        <InputField
                          label="Price per night"
                          htmlFor="venuePricePrNight"
                          register={register}
                          registerYup="pricePrNight"
                          required
                          min="1"
                          max="10000"
                          id="venuePricePrNight"
                          type="number"
                          className="h-10 w-full rounded-xl border-secondary/30 bg-background text-center"
                          errors={errors}
                        />
                        <p className="mt-1 text-xs text-secondary">You can change this later.</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <AddImageForm
                        isEdit={isEdit}
                        venue={venue}
                        setImages={setValue}
                        errors={errors}
                        isSubmitted={isSubmitted}
                      />
                    </div>
                  </div>
                )}

                {/* Step navigation */}
                <div className="mt-6 flex items-center justify-between">
                  <SecondaryButton type="button" onClick={goBack} disabled={step === 1}>
                    Back
                  </SecondaryButton>

            {step < 3 ? (
  <PrimaryButton type="button" onClick={goNext}>Next</PrimaryButton>
) : (
  <PrimaryButton
    type="button"
    disabled={isBusy}
    onClick={() => document.getElementById("venueForm")?.requestSubmit()}
  >
    {isBusy ? "Submitting…" : isEdit ? "Save changes" : "Publish venue"}
  </PrimaryButton>
)}
                </div>

                {(postError || putError) && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    Failed to {isEdit ? "update" : "create"} the venue. Please try again.
                  </div>
                )}
              </form>

              {/* Live Preview */}
              <aside className="md:col-span-4">
                <div className="sticky top-24 rounded-2xl bg-surface/80 p-4 ring-1 ring-secondary/15 md:p-5">
                  <div className="overflow-hidden rounded-xl ring-1 ring-secondary/15">
                    {heroImage ? (
                     
                      <img src={heroImage} alt="Venue preview image" className="h-44 w-full object-cover" />
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-secondary/10 to-primary/10" />
                    )}
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold">
                    {title || "Your great place"}
                  </h3>
                  <p className="mt-1 text-sm text-secondary">
                    {`${city || "City"}, ${country || "Country"}`}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {maxGuests ? (
                      <Chip>{maxGuests} guest{Number(maxGuests) === 1 ? "" : "s"}</Chip>
                    ) : null}
                    {wifi && <Chip>Wi-Fi</Chip>}
                    {breakfast && <Chip>Breakfast</Chip>}
                    {pets && <Chip>Pets</Chip>}
                    {parking && <Chip>Parking</Chip>}
                  </div>

                  <div className="mt-4 rounded-xl bg-background px-3 py-2 text-right ring-1 ring-secondary/10">
                    <div className="text-xs text-secondary">Price / night</div>
                    <div className="text-base font-semibold">{price ? `$ ${price}` : "—"}</div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-secondary">
                    {description || "Write a short, inviting description so guests know what makes your place special."}
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </main>
      </FormProvider>

      {/* Delete modal */}
      {isModalOpen && isEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Delete this venue?"
          footer={
            <>
              <SecondaryButton type="button" onClick={handleDelete} disabled={isDeleteLoading}>
                {isDeleteLoading ? "Deleting…" : "Delete venue"}
              </SecondaryButton>
              <PrimaryButton type="button" onClick={() => setIsModalOpen(false)}>
                Keep venue
              </PrimaryButton>
            </>
          }
        >
          <p className="text-sm text-secondary">
            This action can’t be undone. Your listing and its bookings will no longer be visible to guests.
          </p>
          {deleteError && (
            <p className="mt-3 text-sm text-red-600">We couldn’t delete the venue. Please try again.</p>
          )}
        </Modal>
      )}
    </>
  );
};

/* ------------------------------
   Tiny UI
------------------------------ */
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-background px-3 py-1 text-xs font-medium text-secondary ring-1 ring-secondary/10">
      {children}
    </span>
  );
}