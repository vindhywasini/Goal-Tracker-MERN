import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signinSchema } from "../schemas";
import API from "../api";
import { useAuthStore } from "../store";
import { useNavigate, Link } from "react-router-dom";

type SigninForm = z.infer<typeof signinSchema>;

const Signin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();

  const onSubmit = async (data: SigninForm) => {
    const res = await API.post("/auth/signin", data);
    setAuth(res.data.user, res.data.token);
    nav("/todos");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Sign in to continue tracking your tasks.
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

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="field-error">{errors.password.message}</p>
            )}
          </label>

          <div style={{ textAlign: "right", marginBottom: 8 }}>
            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
