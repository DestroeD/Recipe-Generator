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
        <div className="sidebar-title">
          <img src={logo} alt="logo" className="logo" />
          <h2>RecGen</h2>
        </div>
        <button className="collapse-btn">❮</button>
      </div>

      <nav className="nav">
        <ul>
          <li>
            <img src={searchIcon} alt="" className="icon-nav" /> Пошук
          </li>
          <li>
            <img src={savedIcon} alt="" className="icon-nav" /> Збережені страви
          </li>
          <li>
            <img src={randomIcon} alt="" className="icon-nav" /> Випадкова страва
          </li>
          <li>
            <img src={profileIcon} alt="" className="icon-nav" /> Профіль
          </li>
        </ul>
      </nav>
    </aside>
  );
}
