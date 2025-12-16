import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function GuestRoute({ redirectTo = "/" }) {
  const { isAuthed } = useAuth();
  return isAuthed ? <Navigate to={redirectTo} replace /> : <Outlet />;
}
