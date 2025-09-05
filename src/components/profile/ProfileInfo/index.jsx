import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import ProfileImagePlaceholder from "../../../assets/images/no_ProfileImg.png";
import { usePut } from "../../../hooks/usePut";

import { Modal } from "../../ui_elements/Modal";
import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";
import { SecondaryButton } from "../../ui_elements/Buttons/SecondaryButton";
import { InputField } from "../../form_elements/InputField";

import { API_Url, profile_Url } from "../../../js/api/constants";
import { load } from "../../../js/storage/load";
import { handleImageErrors } from "../../../js/utils/handleImageErrors";

const editProfileImageSchema = yup.object({
  editImg: yup
    .string()
    .url("Please enter a valid image URL")
    .required("Image URL is required"),
});

export const ProfileInfo = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(
    data?.avatar?.url || ProfileImagePlaceholder,
  );

  const userProfile = load("profile");
  const userId = userProfile?.name;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(editProfileImageSchema),
    defaultValues: { editImg: data?.avatar?.url || "" },
  });

  const {
    putData,
    response,
    hasError,
    isLoading: isSaving,
  } = usePut(`${API_Url}${profile_Url}/${userId}`);

  const previewUrl = watch("editImg");
  const livePreview = useMemo(
    () => (previewUrl?.trim() ? previewUrl.trim() : localAvatar),
    [previewUrl, localAvatar],
  );

  useEffect(() => {
    setLocalAvatar(data?.avatar?.url || ProfileImagePlaceholder);
    setValue("editImg", data?.avatar?.url || "");
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const body = { avatar: { url: formData.editImg, alt: "Profile image" } };
      await putData(body);
      if (!hasError) {
        setLocalAvatar(formData.editImg);
        setIsModalOpen(false);
        reset({ editImg: formData.editImg });
      }
    } catch {
      /* no-op; error surfaced below */
    }
  };

  const displayName = data?.name || "Profile";
  const roleLabel = data?.venueManager ? "Venue manager" : "Traveler";

  return (
    <section className="bg-surface/80 ring-secondary/15 rounded-2xl p-5 ring-1">
      <div className="flex items-start gap-4 sm:items-center">
        <div className="ring-secondary/15 relative h-20 w-20 overflow-hidden rounded-2xl ring-1 sm:h-24 sm:w-24">
          <img
            src={localAvatar}
            alt="Profile image"
            onError={(e) => handleImageErrors(e, ProfileImagePlaceholder)}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold md:text-2xl">
              {displayName}
            </h2>
            <span className="text-secondary ring-secondary/20 inline-flex items-center rounded-full px-3 py-1 text-xs ring-1">
              {roleLabel}
            </span>
          </div>

          <p className="text-secondary mt-2 text-sm">
            Keep your profile image up to date.
          </p>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-secondary ring-secondary/25 hover:text-primary mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Update image
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Update profile image"
          footer={
            <>
              <SecondaryButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving || isSubmitting}
              >
                {isSaving || isSubmitting ? "Saving…" : "Save"}
              </PrimaryButton>
            </>
          }
        >
          <div className="flex flex-col items-center gap-3">
            <img
              src={livePreview || ProfileImagePlaceholder}
              alt="Profile image preview"
              className="ring-secondary/15 h-32 w-32 rounded-2xl object-cover ring-1 sm:h-36 sm:w-36"
              onError={(e) => handleImageErrors(e, ProfileImagePlaceholder)}
            />
            <p className="text-secondary text-xs">
              Paste a direct image URL (JPG/PNG). Square images look best.
            </p>
          </div>

          <form
            id="editProfileForm"
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 space-y-3"
          >
            <InputField
              label="Image URL"
              htmlFor="editProfileImg"
              register={register}
              registerYup="editImg"
              id="editProfileImg"
              type="url"
              className="border-secondary/30 bg-background h-10 w-full rounded-xl"
              errors={errors}
            />

            {errors?.editImg?.message && (
              <p className="text-sm text-red-600">{errors.editImg.message}</p>
            )}
            {hasError && response && (
              <p className="text-sm text-red-600">
                Could not update the image. Please check the URL and try again.
              </p>
            )}
          </form>
        </Modal>
      )}
    </section>
  );
};
