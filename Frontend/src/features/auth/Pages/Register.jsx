import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const { loading } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    username: "",
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
      await handleRegister(formState);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.log("Register error object:", error);
      console.log("Error response:", error?.response);
      const errorMessage = error?.response?.data?.message || "Registration failed";
      console.log("Showing toast:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 bottom-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              New Challenger
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Create account
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Join the arena and build your first match.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm text-slate-200">
              Username
              <input
                type="text"
                name="username"
                value={formState.username}
                onChange={handleChange}
                placeholder="arena-hacker"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                required
              />
            </label>

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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
