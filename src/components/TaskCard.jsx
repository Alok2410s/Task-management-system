import styles from './TaskCard.module.css';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'red',   dot: '#ff5f6d' },
  medium: { label: 'Medium', color: 'amber', dot: '#f59e0b' },
  low:    { label: 'Low',    color: 'green', dot: '#22d3a1' },
};

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     cls: 'pending' },
  'in-progress': { label: 'In Progress', cls: 'inProgress' },
  completed:   { label: 'Completed',   cls: 'completed' },
};

const CATEGORY_ICONS = {
  work: '💼', personal: '👤', shopping: '🛒', health: '❤️',
  finance: '💰', education: '📚', other: '📌',
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status   = STATUS_CONFIG[task.status]     || STATUS_CONFIG.pending;

  const isOverdue = task.dueDate && !task.completed &&
    new Date(task.dueDate) < new Date();

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
  };

  return (
    <div className={`${styles.card} ${task.completed ? styles.done : ''} animate-fadeUp`}>
      <div className={styles.header}>
        <button
          className={`${styles.toggle} ${task.completed ? styles.checked : ''}`}
          onClick={() => onToggle(task)}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>

        <div className={styles.meta}>
          <span className={styles.category}>
            {CATEGORY_ICONS[task.category] || '📌'} {task.category}
          </span>
          <span className={`${styles.priority} ${styles[priority.color]}`}>
            <span className={styles.dot} style={{ background: priority.dot }} />
            {priority.label}
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => onEdit(task)} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className={`${styles.btn} ${styles.del}`} onClick={() => onDelete(task._id)} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 className={`${styles.title} ${task.completed ? styles.striked : ''}`}>
        {task.title}
      </h3>

      {task.description && (
        <p className={styles.desc}>{task.description}</p>
      )}

      <div className={styles.footer}>
        <span className={`${styles.status} ${styles[status.cls]}`}>
          {status.label}
        </span>

        {task.dueDate && (
          <span className={`${styles.due} ${isOverdue ? styles.overdue : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {isOverdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
