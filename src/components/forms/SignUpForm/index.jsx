import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";
import { InputField } from "../../form_elements/InputField";

import { register as registerUser } from "../../../js/api/auth/register.jsx";
import { login as loginUser } from "../../../js/api/auth/login.jsx";

/* Validation */
const schema = yup
  .object({
    name: yup
      .string()
      .min(3, "Name should be at least 3 characters.")
      .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores.")
      .required("Name is required."),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
        "Email must be a stud.noroff.no address."
      )
      .required("Email is required."),
    password: yup
      .string()
      .min(8, "Password should be at least 8 characters.")
      .required("Password is required."),
    profileImageUrl: yup
      .string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .url("Please enter a valid URL")
      .test("is-https", "URL must start with https://", (v) => !v || v.startsWith("https://")),
  })
  .required();

export const SignUpForm = () => {
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: "onBlur" });

  const onSubmit = async (data) => {
    setFormError("");
    try {
      const { name, email, password, profileImageUrl } = data;

      await registerUser(name, email, password, profileImageUrl ?? "");
      await loginUser(email, password); // auto sign-in after registration

      reset(); // clear only on success
      navigate("/");
    } catch (error) {
      setFormError(error?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto w-full max-w-sm space-y-4">
      {/* Form-level error */}
      {formError ? (
        <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      ) : (
        <div className="sr-only" aria-live="polite" />
      )}

      {/* Name */}
      <InputField
        label="Name"
        htmlFor="SignUpName"
        register={register}
        registerYup="name"
        required
        id="SignUpName"
        type="text"
        className="h-11 w-full rounded-xl border-secondary/30 bg-background"
        errors={errors}
        autoComplete="username"
      />

      {/* Email */}
      <div>
        <InputField
          label="Email"
          htmlFor="SignUpEmail"
          register={register}
          registerYup="email"
          required
          id="SignUpEmail"
          type="email"
          className="h-11 w-full rounded-xl border-secondary/30 bg-background"
          errors={errors}
          autoComplete="email"
        />
        <p className="mt-1 text-xs text-secondary">Use your stud.noroff.no email.</p>
      </div>

      {/* Password */}
      <InputField
        label="Password"
        htmlFor="SignUpPassword"
        register={register}
        registerYup="password"
        required
        id="SignUpPassword"
        type="password"
        className="h-11 w-full rounded-xl border-secondary/30 bg-background"
        errors={errors}
        togglePassword
        autoComplete="new-password"
      />

      {/* Profile image (optional) */}
      <InputField
        label="Profile image URL (optional)"
        htmlFor="SignUpProfileImage"
        register={register}
        registerYup="profileImageUrl"
        id="SignUpProfileImage"
        type="url"
        className="h-11 w-full rounded-xl border-secondary/30 bg-background"
        errors={errors}
        placeholder="https://example.com/avatar.jpg"
      />

      {/* Submit */}
      <div className="pt-2">
        <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Sign up"}
        </PrimaryButton>
      </div>
    </form>
  );
};