import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import profileIcon from "../../assets/icons/user-icon.svg";
import "./AuthSwitch.css";

export default function AuthSwitch() {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return (
      <Link to="/login" state={{ from: location }} className="ghost-btn authswitch-login">
        Вхід
      </Link>
    );
  }

  return (
    <Link to="/profile" className="auth-profile-btn" aria-label="Профіль">
      <img src={profileIcon} alt="Профіль" className="profile-icon" />
    </Link>
  );
}
