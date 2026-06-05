# 📁 Assets Folder

```
frontend/src/assets/
├── icons/                     # UI action / navigation icons (24×24 SVG)
│   ├── logo.svg               # App logo (40×40, branded)
│   ├── dashboard.svg
│   ├── tasks.svg
│   ├── profile.svg
│   ├── add.svg
│   ├── edit.svg
│   ├── delete.svg
│   ├── search.svg
│   ├── logout.svg
│   ├── priority-high.svg      # Red flame
│   ├── priority-medium.svg    # Amber lines
│   ├── priority-low.svg       # Green chevrons
│   ├── calendar.svg
│   ├── category.svg
│   ├── check.svg
│   ├── close.svg
│   ├── filter.svg
│   ├── notification.svg
│   └── settings.svg
│
├── illustrations/             # Larger decorative SVGs
│   ├── empty-tasks.svg        # Shown when task list is empty
│   ├── hero.svg               # Login / Register page hero
│   ├── success.svg            # Task completed / all done state
│   └── not-found.svg          # 404 page
│
├── images/                    # Raster-equivalent assets (SVG here for scale)
│   └── default-avatar.svg     # User avatar placeholder
│
└── index.js                   # Barrel file — import everything from here
```

---

## ⚙️ Setup — SVGR for Vite

SVGs are used as React components via `@svgr/rollup`.

### 1. Install

```bash
npm install --save-dev @svgr/rollup
```

### 2. `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';

export default defineConfig({
  plugins: [
    svgr(),   // must come before react()
    react(),
  ],
});
```

---

## 🧩 Usage Examples

### Import an icon as a React component

```jsx
import { EditIcon, DeleteIcon, PriorityHighIcon } from '@/assets';

function TaskCard() {
  return (
    <div>
      <EditIcon className="w-5 h-5 text-indigo-500" />
      <DeleteIcon className="w-5 h-5 text-red-500" />
      <PriorityHighIcon />
    </div>
  );
}
```

### Use an illustration

```jsx
import { EmptyTasksIllustration } from '@/assets';

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16">
      <EmptyTasksIllustration className="w-64 h-48" />
      <p className="mt-4 text-gray-500">No tasks yet — add one!</p>
    </div>
  );
}
```

### Use the default avatar

```jsx
import { DefaultAvatar } from '@/assets';

function Avatar({ src, alt }) {
  return (
    <img
      src={src || DefaultAvatar}
      alt={alt}
      className="w-10 h-10 rounded-full object-cover"
      onError={(e) => { e.target.src = DefaultAvatar; }}
    />
  );
}
```

### Dynamic priority icon

```jsx
import {
  PriorityHighIcon,
  PriorityMediumIcon,
  PriorityLowIcon,
} from '@/assets';

const PRIORITY_ICONS = {
  high:   <PriorityHighIcon />,
  medium: <PriorityMediumIcon />,
  low:    <PriorityLowIcon />,
};

function PriorityBadge({ priority }) {
  return (
    <span className="flex items-center gap-1">
      {PRIORITY_ICONS[priority]}
      <span className="capitalize text-sm">{priority}</span>
    </span>
  );
}
```

---

## 🎨 Icon Theming

All icons use `stroke="currentColor"` — you control their color via CSS:

```css
/* Tailwind */
<EditIcon className="text-indigo-600 hover:text-indigo-800 transition-colors" />

/* Plain CSS */
.icon { color: #6366f1; }
.icon:hover { color: #4338ca; }
```

Priority icons are pre-colored (`#EF4444`, `#F59E0B`, `#10B981`) by design.
