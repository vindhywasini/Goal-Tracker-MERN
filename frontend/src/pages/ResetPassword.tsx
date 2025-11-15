import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { resetPasswordSchema } from "../schemas";
import API from "../api";

type ResetForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: initialToken,
      password: "",
    },
  });

  const nav = useNavigate();
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const onSubmit = async (data: ResetForm) => {
    setServerMessage(null);
    await API.post("/auth/reset", data);
    setServerMessage("Password reset successful. Redirecting to sign in...");
    setTimeout(() => {
      nav("/signin");
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset password</h2>
        <p className="auth-subtitle">
          Paste your reset token and choose a new password.
        </p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Reset token
            <input
              placeholder="Paste your reset token here"
              {...register("token")}
            />
            {errors.token && (
              <p className="field-error">{errors.token.message}</p>
            )}
          </label>

          <label>
            New password
            <input
              type="password"
              placeholder="At least 6 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="field-error">{errors.password.message}</p>
            )}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        {serverMessage && (
          <p
            style={{
              marginTop: 12,
              fontSize: "0.85rem",
              color: "#16a34a",
            }}
          >
            {serverMessage}
          </p>
        )}

        <p className="auth-footer-text">
          Go back to <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
