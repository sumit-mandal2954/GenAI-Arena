import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, handleGoogleLogin } = useAuth();
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
      console.log("Login error object:", error);
      console.log("Error response:", error?.response);
      const errorMessage = error?.response?.data?.message || "Login failed";
      console.log("Showing toast:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogle = async () => {
    await handleGoogleLogin();
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
              Log in to continue your next AI battle.
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
            className="w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/70 hover:text-emerald-300"
            disabled={loading}
          >
            Continue with Google
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
