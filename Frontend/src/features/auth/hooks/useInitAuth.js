import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice";
import { getCurrentUser } from "../services/auth.api";

// Hook to initialize auth state from current session
export const useInitAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch(setLoading(true));
        
        const data = await getCurrentUser();
        
        if (data.user) {
          dispatch(setUser(data.user));
        }
      } catch (error) {
        dispatch(setError(error?.message || "Auth check failed"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);
};
