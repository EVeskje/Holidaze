import React, { useEffect, useState } from "react";

import { SecondaryButton } from "../../../components/ui_elements/Buttons/SecondaryButton";
import { PrimaryButton } from "../../../components/ui_elements/Buttons/PrimaryButton";
import { Modal } from "../../../components/ui_elements/Modal";
import { Loader } from "../../ui_elements/Loader";

import { usePut } from "../../../hooks/usePut";
import { useFetch } from "../../../hooks/useFetch";

import { load } from "../../../js/storage/load";
import { API_Url, profile_Url } from "../../../js/api/constants";

/* =========================================
   BecomeVenueManager
   ========================================= */
export const BecomeVenueManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [localError, setLocalError] = useState("");

  const userProfile = load("profile");
  const userId = userProfile?.name;

  const {
    data: profileData,
    isLoading: isProfileLoading,
    hasError: profileError,
    refetch,
  } = useFetch(`${API_Url}${profile_Url}/${userId}`);

  const { putData, isLoading: isUpdating, hasError: updateError } = usePut(
    `${API_Url}${profile_Url}/${userId}`
  );

  useEffect(() => {
    if (typeof profileData?.venueManager === "boolean") {
      setIsVenueManager(profileData.venueManager);
    }
  }, [profileData]);

  const handleBecomeManager = async () => {
    setLocalError("");
    try {
      await putData({ venueManager: true });
      if (!updateError) {
        setIsVenueManager(true);    
        setIsModalOpen(false);
      } else {
        setLocalError("We couldn’t update your role. Please try again.");
      }
    } catch {
      setLocalError("We couldn’t update your role. Please try again.");
    }
  };

  if (!userId) return null; 

  if (isProfileLoading) {
    return (
      <div className="my-4">
        <Loader />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="my-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Failed to load profile.{" "}
        <button
          onClick={refetch}
          className="underline decoration-red-300 underline-offset-2 hover:decoration-red-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <aside className="mt-4">
      {/* Already a manager → subtle info card */}
      {isVenueManager ? (
        <div className="rounded-2xl bg-surface/80 p-5 ring-1 ring-secondary/15">
          <div className="flex items-center gap-3">
            <Badge>Venue manager</Badge>
            <p className="text-sm text-secondary">
              You can create and manage listings from your profile.
            </p>
          </div>
        </div>
      ) : (
        // Not a manager → CTA card
        <div className="rounded-2xl bg-surface/80 p-5 ring-1 ring-secondary/15">
          <h3 className="text-lg font-semibold text-primary">Start hosting</h3>
          <p className="mt-1 text-sm text-secondary">
            Become a venue manager to create listings and manage bookings.
          </p>
          <div className="mt-4">
            <PrimaryButton onClick={() => setIsModalOpen(true)}>
              Become a venue manager
            </PrimaryButton>
          </div>

          {localError && (
            <p className="mt-3 text-sm text-red-600">{localError}</p>
          )}
        </div>
      )}

      {/* Confirm modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm role change"
          footer={
            <>
              <SecondaryButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleBecomeManager} disabled={isUpdating}>
                {isUpdating ? "Updating…" : "Confirm"}
              </PrimaryButton>
            </>
          }
        >
          <p className="text-sm text-secondary">
            You’re about to enable hosting features on your account. You can
            still use Holidaze to book stays as usual.
          </p>
        </Modal>
      )}

      {/* Server-side update error (fallback) */}
      {updateError && !localError && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Failed to update profile. Please try again.
        </div>
      )}
    </aside>
  );
};

/* =========================================
   Tiny UI
   ========================================= */
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs text-secondary ring-1 ring-secondary/20">
      {children}
    </span>
  );
}