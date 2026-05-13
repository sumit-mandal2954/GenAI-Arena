import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, handleGoogleLogin, handleGuestLogin } = useAuth();
  const { loading } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleLogin(formState);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  const handleGoogle = async () => {
    await handleGoogleLogin();
  };

  const handleGuest = async () => {
    try {
      await handleGuestLogin();
      toast.success("Guest login successful!");
      navigate("/");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Guest login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              Arena Access
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Log in to continue your next GenAI Arena challenge.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm text-slate-200">
              Email
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Password
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/70 hover:text-emerald-300"
            disabled={loading}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1f2937"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className="mt-3 w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/70 hover:text-cyan-300"
            disabled={loading}
          >
            Continue as Guest
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
