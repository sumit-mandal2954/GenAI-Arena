import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import {login, register, guestLogin } from "../services/auth.api";
import { GoogleLogin } from "../services/googleAuth.api";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({ username, email, password }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await register({ username, email, password });
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      dispatch(
        setError(error?.response?.data?.message || "Registration failed"),
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      console.error("Login error:", error);
      dispatch(setError(error?.response?.data?.message || "Login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGuestLogin = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await guestLogin();
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      console.error("Guest login error:", error);
      dispatch(setError(error?.response?.data?.message || "Guest login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth redirects the entire page to Google's servers
    // No error handling needed here - page will redirect
    GoogleLogin();
  };

  return{
    handleRegister,
    handleLogin,
    handleGuestLogin,
    handleGoogleLogin
  }
};
