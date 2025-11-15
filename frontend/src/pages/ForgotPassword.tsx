import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { forgotPasswordSchema } from "../schemas";
import API from "../api";
import { Link } from "react-router-dom";

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const onSubmit = async (data: ForgotForm) => {
    setServerMessage(null);
    setResetToken(null);

    const res = await API.post("/auth/forgot", data);
    setServerMessage(res.data.message || "If that email exists, a link was sent.");

    // backend returns resetToken for testing – show it to user
    if (res.data.resetToken) {
      setResetToken(res.data.resetToken);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Forgot password</h2>
        <p className="auth-subtitle">
          Enter your email address and we&apos;ll generate a reset token.
        </p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email
            <input
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="field-error">{errors.email.message}</p>
            )}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
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

        {resetToken && (
          <div
            style={{
              marginTop: 10,
              fontSize: "0.8rem",
              background: "#f9fafb",
              borderRadius: 8,
              padding: "8px 10px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ marginBottom: 4, fontWeight: 500 }}>
              Reset token (for testing):
            </div>
            <code
              style={{
                wordBreak: "break-all",
                display: "block",
                color: "#1f2933",
              }}
            >
              {resetToken}
            </code>
            <p style={{ marginTop: 6 }}>
              Copy this token and use it on the{" "}
              <Link to={`/reset-password?token=${resetToken}`}>
                reset password
              </Link>{" "}
              page.
            </p>
          </div>
        )}

        <p className="auth-footer-text">
          Remembered it? <Link to="/signin">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
