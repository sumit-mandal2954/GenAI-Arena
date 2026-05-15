// Google OAuth requires a full page redirect to Google's servers
// This cannot be done with axios (XHR) - must use window.location.href

export const GoogleLogin = () => {
  // Redirect to backend Google OAuth endpoint
  // Backend will handle redirecting to Google, and after auth,
  // Google will redirect back to /auth/google/callback
  window.location.href = "https://genai-arena-2.onrender.com/auth/google";
};