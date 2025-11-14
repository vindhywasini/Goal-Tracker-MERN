import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signupSchema } from "../schemas";
import API from "../api";
import { useAuthStore } from "../store";
import { useNavigate, Link } from "react-router-dom";

type SignupForm = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();

  const onSubmit = async (data: SignupForm) => {
    const res = await API.post("/auth/signup", data);
    setAuth(res.data.user, res.data.token);
    nav("/todos");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Start managing your goals and daily todos.
        </p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Name
            <input placeholder="Your name" {...register("name")} />
            {errors.name && (
              <p className="field-error">{errors.name.message}</p>
            )}
          </label>

          <label>
            Email
            <input placeholder="you@example.com" {...register("email")} />
            {errors.email && (
              <p className="field-error">{errors.email.message}</p>
            )}
          </label>

          <label>
            Password
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
