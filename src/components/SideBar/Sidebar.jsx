import { NavLink, Link } from "react-router-dom";
import './Sidebar.css';
import logo from '../../assets/logo.svg';
import searchIcon from '../../assets/icons/search.svg';
import savedIcon from '../../assets/icons/bookmark.svg';
import randomIcon from '../../assets/icons/random.svg';
import profileIcon from '../../assets/icons/profile.svg';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-title" aria-label="На головну">
          <img src={logo} alt="logo" className="logo" />
          <h2>RecGen</h2>
        </Link>
        <button className="collapse-btn">❮</button>
      </div>

      <nav className="nav">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <img src={searchIcon} alt="" className="icon-nav" />
              <span>Пошук</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/saved" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <img src={savedIcon} alt="" className="icon-nav" />
              <span>Збережені страви</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/generator" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <img src={randomIcon} alt="" className="icon-nav" />
              <span>Випадкова страва</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <img src={profileIcon} alt="" className="icon-nav" />
              <span>Профіль</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
