import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name     = 'Name is required';
    if (!form.email.trim())      e.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((e2) => ({ ...e2, [e.target.name]: '' }));
    setServerErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);

    if (result.success) navigate('/');
    else setServerErr(result.message);
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#7c6aff"/>
            <path d="M10 14h20M10 20h14M10 26h17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="30" cy="26" r="5" fill="#22d3a1"/>
            <path d="M27.5 26l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>TaskFlow</span>
        </div>

        <div className={styles.formWrap}>
          <div className={styles.heading}>
            <h1>Create account</h1>
            <p>Start managing tasks for free</p>
          </div>

          {serverErr && <div className={styles.alert}>{serverErr}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alok Kumar"
                className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
                autoFocus
              />
              {errors.name && <span className={styles.err}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              />
              {errors.email && <span className={styles.err}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              />
              {errors.password && <span className={styles.err}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
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

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Creating account…</>
                : 'Create Account'
              }
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.illustration}>
          <div className={styles.features}>
            {[
              { icon: '✅', title: 'Smart Task Tracking',   desc: 'Organize tasks by category, priority, and status' },
              { icon: '🎯', title: 'Priority Management',   desc: 'Never miss a deadline with due dates and alerts' },
              { icon: '📊', title: 'Progress Dashboard',    desc: 'Visualize your productivity at a glance' },
              { icon: '🔒', title: 'Secure & Private',      desc: 'Your tasks are protected with JWT authentication' },
            ].map((f, i) => (
              <div key={i} className={styles.feature} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <h4 className={styles.featureTitle}>{f.title}</h4>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.illCaption}>Everything you need to stay on top.</p>
        </div>
      </div>
    </div>
  );
}
