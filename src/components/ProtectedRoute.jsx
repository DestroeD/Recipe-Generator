import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ redirectTo = "/login" }) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
