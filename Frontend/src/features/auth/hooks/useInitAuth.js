import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../auth.slice";
import { getCurrentUser } from "../services/auth.api";

// Hook to initialize auth state from current session
export const useInitAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("[useInitAuth] Starting auth initialization...");
        dispatch(setLoading(true));
        
        const data = await getCurrentUser();
        console.log("[useInitAuth] Got user data:", data);
        
        if (data.user) {
          console.log("[useInitAuth] Setting user:", data.user);
          dispatch(setUser(data.user));
        } else {
          console.log("[useInitAuth] No user in response data");
        }
      } catch (error) {
        console.log("[useInitAuth] Auth check failed:", error.response?.status, error.message);
      } finally {
        console.log("[useInitAuth] Setting loading to false");
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);
};
