import styles from './CategoryFilter.module.css';

const CATEGORIES = [
  { value: 'all',       label: 'All',       icon: '⊞' },
  { value: 'work',      label: 'Work',      icon: '💼' },
  { value: 'personal',  label: 'Personal',  icon: '👤' },
  { value: 'shopping',  label: 'Shopping',  icon: '🛒' },
  { value: 'health',    label: 'Health',    icon: '❤️' },
  { value: 'finance',   label: 'Finance',   icon: '💰' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'other',     label: 'Other',     icon: '📌' },
];

const PRIORITIES = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
];

const STATUSES = [
  { value: 'all',         label: 'All Status' },
  { value: 'pending',     label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
];

export default function CategoryFilter({ filters, onChange, search, onSearch }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className={styles.wrapper}>
      {/* Search */}
      <div className={styles.searchBox}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={styles.search}
        />
        {search && (
          <button className={styles.clearSearch} onClick={() => onSearch('')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className={styles.tabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`${styles.tab} ${filters.category === c.value ? styles.active : ''}`}
            onClick={() => set('category', c.value)}
          >
            <span className={styles.tabIcon}>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Priority + Status selects */}
      <div className={styles.selects}>
        <select
          value={filters.priority}
          onChange={(e) => set('priority', e.target.value)}
          className={styles.select}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
          className={styles.select}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
