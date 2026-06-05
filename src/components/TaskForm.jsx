import { useState } from 'react';
import styles from './TaskForm.module.css';

const CATEGORIES = ['work', 'personal', 'shopping', 'health', 'finance', 'education', 'other'];
const PRIORITIES  = ['low', 'medium', 'high'];
const STATUSES    = ['pending', 'in-progress', 'completed'];

const empty = {
  title: '', description: '', category: 'other',
  priority: 'medium', status: 'pending', dueDate: '',
};

export default function TaskForm({ task, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(() => ({
    title:       task?.title       || empty.title,
    description: task?.description || empty.description,
    category:    task?.category    || empty.category,
    priority:    task?.priority    || empty.priority,
    status:      task?.status      || empty.status,
    dueDate:     task?.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : '',
  }));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.title.length > 100) e.title = 'Max 100 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, dueDate: form.dueDate || null });
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} animate-scaleIn`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.close} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>Title <span className={styles.req}>*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`${styles.input} ${errors.title ? styles.inputErr : ''}`}
              autoFocus
            />
            {errors.title && <span className={styles.err}>{errors.title}</span>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details (optional)..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          {/* Row: Category + Priority */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={styles.select}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <div className={styles.chips}>
                {PRIORITIES.map((p) => (
                  <button
                    key={p} type="button"
                    className={`${styles.chip} ${styles[p]} ${form.priority === p ? styles.chipActive : ''}`}
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row: Status + Due Date */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={styles.select}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={styles.input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancel
            </button>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving…</>
                : task ? 'Save Changes' : 'Create Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
