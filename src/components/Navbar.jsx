import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#7c6aff"/>
          <path d="M10 14h20M10 20h14M10 26h17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="30" cy="26" r="5" fill="#22d3a1"/>
          <path d="M27.5 26l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.brandName}>TaskFlow</span>
      </Link>

      <div className={styles.links}>
        <Link to="/" className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </Link>
      </div>

      <div className={styles.right}>
        <Link to="/profile" className={styles.avatar} title={user?.name}>
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} />
            : <span>{initials}</span>
          }
        </Link>
        <button onClick={handleLogout} className={styles.logout} title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
