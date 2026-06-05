import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import Navbar from '../components/Navbar';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ name: user?.name || '', email: user?.email || '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (form.password && form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const { data } = await updateProfile(payload);
      updateUser(data);
      setForm((f) => ({ ...f, password: '', confirm: '' }));
      showToast('Profile updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <button className={styles.back} onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
          <h1 className={styles.title}>Profile Settings</h1>
        </div>

        <div className={styles.layout}>
          {/* Left: avatar + info */}
          <div className={styles.sidebar}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <p className={styles.avatarName}>{user?.name}</p>
                <p className={styles.avatarEmail}>{user?.email}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Member since</span>
                <span className={styles.infoVal}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : '—'}
                </span>
              </div>
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>

          {/* Right: form */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Edit Profile</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
                />
                {errors.name && <span className={styles.err}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
                />
                {errors.email && <span className={styles.err}>{errors.email}</span>}
              </div>

              <div className={styles.divider}>
                <span>Change Password</span>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>New Password <span className={styles.optional}>(optional)</span></label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
                />
                {errors.password && <span className={styles.err}>{errors.password}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Confirm New Password</label>
                <input
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${styles.input} ${errors.confirm ? styles.inputErr : ''}`}
                />
                {errors.confirm && <span className={styles.err}>{errors.confirm}</span>}
              </div>

              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading
                  ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving…</>
                  : 'Save Changes'
                }
              </button>
            </form>
          </div>
        </div>
      </main>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]} animate-fadeUp`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
