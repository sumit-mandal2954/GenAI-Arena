import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  console.log("[Protected] Current state - loading:", loading, "user:", user);

  // Show loading while checking auth state
  if (loading) {
    console.log("[Protected] Still loading, showing spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login only after loading is complete and no user
  if (!user) {
    console.log("[Protected] No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("[Protected] User authenticated, showing dashboard");
  return children;
};