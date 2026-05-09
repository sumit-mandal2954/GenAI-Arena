import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../app/App";
import Login from "../features/auth/Pages/Login";
import Register from "../features/auth/Pages/Register";
import { Protected } from "../features/auth/components/Protected";
import { useInitAuth } from "../features/auth/hooks/useInitAuth";

const AppRoutes = () => {
  // Initialize auth state from current session
  useInitAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Protected><App /></Protected>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
