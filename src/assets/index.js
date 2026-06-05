// ─── Icons ───────────────────────────────────────────────────────────────────
export { ReactComponent as LogoIcon }           from './icons/logo.svg';
export { ReactComponent as DashboardIcon }      from './icons/dashboard.svg';
export { ReactComponent as TasksIcon }          from './icons/tasks.svg';
export { ReactComponent as ProfileIcon }        from './icons/profile.svg';
export { ReactComponent as AddIcon }            from './icons/add.svg';
export { ReactComponent as EditIcon }           from './icons/edit.svg';
export { ReactComponent as DeleteIcon }         from './icons/delete.svg';
export { ReactComponent as SearchIcon }         from './icons/search.svg';
export { ReactComponent as LogoutIcon }         from './icons/logout.svg';
export { ReactComponent as PriorityHighIcon }   from './icons/priority-high.svg';
export { ReactComponent as PriorityMediumIcon } from './icons/priority-medium.svg';
export { ReactComponent as PriorityLowIcon }    from './icons/priority-low.svg';
export { ReactComponent as CalendarIcon }       from './icons/calendar.svg';
export { ReactComponent as CategoryIcon }       from './icons/category.svg';
export { ReactComponent as CheckIcon }          from './icons/check.svg';
export { ReactComponent as CloseIcon }          from './icons/close.svg';
export { ReactComponent as FilterIcon }         from './icons/filter.svg';
export { ReactComponent as NotificationIcon }   from './icons/notification.svg';
export { ReactComponent as SettingsIcon }       from './icons/settings.svg';

// ─── Illustrations ────────────────────────────────────────────────────────────
export { ReactComponent as EmptyTasksIllustration } from './illustrations/empty-tasks.svg';
export { ReactComponent as HeroIllustration }       from './illustrations/hero.svg';
export { ReactComponent as SuccessIllustration }    from './illustrations/success.svg';
export { ReactComponent as NotFoundIllustration }   from './illustrations/not-found.svg';

// ─── Images (URL strings for <img> tags) ──────────────────────────────────────
export { default as DefaultAvatar } from './images/default-avatar.svg';

// ─── Priority map helper ──────────────────────────────────────────────────────
// Usage: <PriorityIcon priority="high" />
// (Import individual icons above and use this map in components)
export const PRIORITY_ICON_MAP = {
  high:   'priority-high',
  medium: 'priority-medium',
  low:    'priority-low',
};
