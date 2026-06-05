import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTasks, fetchStats, createTask, updateTask, deleteTask } from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import CategoryFilter from '../components/CategoryFilter';
import styles from './Dashboard.module.css';

const defaultFilters = { category: 'all', priority: 'all', status: 'all' };

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks]       = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [filters, setFilters]   = useState(defaultFilters);
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.status   !== 'all') params.status   = filters.status;
      if (search) params.search = search;

      const { data } = await fetchTasks(params);
      setTasks(data);
    } catch {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await fetchStats();
      setStats(data);
    } catch { /* silent */ }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadTasks(); }, [loadTasks]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadStats(); }, [loadStats]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => loadTasks(), 300);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const { data: task } = await createTask(data);
      setTasks((prev) => [task, ...prev]);
      setShowForm(false);
      showToast('Task created!');
      loadStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const { data: updated } = await updateTask(editTask._id, data);
      setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
      setEditTask(null);
      showToast('Task updated!');
      loadStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast('Task deleted');
      loadStats();
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleToggle = async (task) => {
    const completed = !task.completed;
    try {
      const { data: updated } = await updateTask(task._id, {
        completed,
        status: completed ? 'completed' : 'pending',
      });
      setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
      loadStats();
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  // Stat helpers
  const statCount = (arr, key, val) =>
    arr?.find((s) => s._id === val)?.count || 0;

  const totalTasks     = tasks.length;
  const completedCount = statCount(stats?.statusStats, '_id', 'completed');
  const pendingCount   = statCount(stats?.statusStats, '_id', 'pending');
  const highCount      = statCount(stats?.priorityStats, '_id', 'high');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div>
            <p className={styles.greet}>{greeting},</p>
            <h1 className={styles.name}>{user?.name?.split(' ')[0]} 👋</h1>
            <p className={styles.sub}>
              {completedCount > 0
                ? `You've completed ${completedCount} task${completedCount > 1 ? 's' : ''} — keep going!`
                : 'Ready to tackle your tasks today?'}
            </p>
          </div>

          <button className={styles.addBtn} onClick={() => { setEditTask(null); setShowForm(true); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </button>
        </section>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { label: 'Total Tasks',  value: totalTasks,     color: 'accent' },
            { label: 'Completed',    value: completedCount, color: 'green' },
            { label: 'Pending',      value: pendingCount,   color: 'amber' },
            { label: 'High Priority',value: highCount,      color: 'red' },
          ].map((s) => (
            <div key={s.label} className={`${styles.statCard} ${styles[s.color]}`}>
              <span className={styles.statVal}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <CategoryFilter
          filters={filters}
          onChange={setFilters}
          search={search}
          onSearch={setSearch}
        />

        {/* Task grid */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.empty}>
            <svg width="120" height="100" viewBox="0 0 300 220" fill="none">
              <circle cx="150" cy="110" r="90" fill="#1a1a24"/>
              <rect x="90" y="60" width="120" height="140" rx="10" fill="#13131a" stroke="#2a2a38" strokeWidth="1.5"/>
              <rect x="125" y="52" width="50" height="18" rx="9" fill="#13131a" stroke="#2a2a38" strokeWidth="1.5"/>
              <rect x="133" y="56" width="34" height="8" rx="4" fill="#2a2a38"/>
              <rect x="120" y="92" width="72" height="7" rx="3.5" fill="#2a2a38"/>
              <rect x="120" y="112" width="52" height="7" rx="3.5" fill="#2a2a38"/>
              <rect x="120" y="132" width="62" height="7" rx="3.5" fill="#2a2a38"/>
              <rect x="120" y="152" width="44" height="7" rx="3.5" fill="#2a2a38"/>
              <rect x="108" y="90" width="10" height="10" rx="3" fill="#2a2a38"/>
              <rect x="108" y="110" width="10" height="10" rx="3" fill="#2a2a38"/>
              <rect x="108" y="130" width="10" height="10" rx="3" fill="#2a2a38"/>
              <rect x="108" y="150" width="10" height="10" rx="3" fill="#2a2a38"/>
            </svg>
            <p className={styles.emptyTitle}>No tasks found</p>
            <p className={styles.emptyMsg}>
              {search || Object.values(filters).some((v) => v !== 'all')
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {!search && !Object.values(filters).some((v) => v !== 'all') && (
              <button className={styles.emptyBtn} onClick={() => setShowForm(true)}>
                + Add your first task
              </button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {tasks.map((task, i) => (
              <div key={task._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <TaskCard
                  task={task}
                  onEdit={(t) => { setEditTask(t); setShowForm(true); }}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <TaskForm
          key={editTask ? editTask._id : 'new'}
          task={editTask}
          onSubmit={editTask ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditTask(null); }}
          loading={saving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]} animate-fadeUp`}>
          {toast.type === 'success'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}
