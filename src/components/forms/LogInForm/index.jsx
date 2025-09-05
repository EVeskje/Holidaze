import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { logIn as loginUser } from "../../../js/api/auth/logIn.jsx";
import { InputField } from "../../form_elements/InputField";
import { PrimaryButton } from "../../ui_elements/Buttons/PrimaryButton";

/* Validation */
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/, "Email must be a stud.noroff.no address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be at least 8 characters.")
    .required("Password is required"),
}).required();

export const LogInForm = () => {
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
      const { email, password } = data;
      await loginUser(email, password);
      reset();               // clear only on success
      navigate("/");
    } catch (error) {
      // Show a friendly message; prefer API error text if present
      setFormError(error?.message || "Login failed. Please try again.");
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

      {/* Email */}
      <div>
        <InputField
          label="Email"
          htmlFor="LogInEmail"
          register={register}
          registerYup="email"
          required
          id="LogInEmail"
          type="email"
          className="h-11 w-full rounded-xl border-secondary/30 bg-background"
          errors={errors}
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div>
        <InputField
          label="Password"
          htmlFor="LogInPassword"
          register={register}
          registerYup="password"
          required
          id="LogInPassword"
          type="password"
          className="h-11 w-full rounded-xl border-secondary/30 bg-background"
          errors={errors}
          togglePassword
          autoComplete="current-password"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Log in"}
        </PrimaryButton>
      </div>
    </form>
  );
};