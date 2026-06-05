import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
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
    const result = await login(form.email, form.password);
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
            <h1>Welcome back</h1>
            <p>Sign in to manage your tasks</p>
          </div>

          {serverErr && <div className={styles.alert}>{serverErr}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
                autoFocus
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
                placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              />
              {errors.password && <span className={styles.err}>{errors.password}</span>}
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing in…</>
                : 'Sign In'
              }
            </button>
          </form>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>Create one</Link>
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.illustration}>
          <div className={styles.card3d}>
            <div className={styles.cardInner}>
              <div className={styles.cardHeader}>
                <div className={styles.dots}>
                  <span style={{ background: '#ff5f6d' }} />
                  <span style={{ background: '#f59e0b' }} />
                  <span style={{ background: '#22d3a1' }} />
                </div>
                <span className={styles.cardTitle}>My Tasks</span>
              </div>
              {[
                { text: 'Design new dashboard',  done: true,  tag: 'work',     color: '#7c6aff' },
                { text: 'Review pull requests',  done: false, tag: 'work',     color: '#7c6aff' },
                { text: 'Morning run 5k',        done: true,  tag: 'health',   color: '#22d3a1' },
                { text: 'Update API docs',       done: false, tag: 'education',color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} className={styles.taskRow}>
                  <div className={`${styles.checkbox} ${item.done ? styles.cbDone : ''}`}>
                    {item.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span className={`${styles.taskText} ${item.done ? styles.struck : ''}`}>{item.text}</span>
                  <span className={styles.tag} style={{ background: item.color + '22', color: item.color }}>{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.illCaption}>Stay organized, stay ahead.</p>
        </div>
      </div>
    </div>
  );
}
