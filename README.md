# 📋 Advanced Task Manager

A fully-featured, beginner-friendly **Task Manager** built using plain **HTML, CSS, and JavaScript** — no frameworks, no build tools, no backend. Open `index.html` in a browser and it just works.

This project is written specifically to help you **learn core JavaScript & web-dev concepts** by reading real, working, heavily-commented code.

---

## 📁 File Structure

```
task-manager/
├── index.html   → Page structure (form, dashboard, task list)
├── style.css    → All styling (cards, badges, dark mode, responsive layout)
└── script.js    → All logic (state, rendering, storage, events)
```

---

## ✅ Features

| Feature | Description |
|---|---|
| ✅ Add Task | Create a task with title, description, priority, and due date |
| ✅ Edit Task | Load an existing task back into the form and update it |
| ✅ Delete Task | Remove a task (with a confirmation prompt) |
| ✅ Complete Task | Toggle a task between Pending ⇄ Completed |
| ✅ Search | Live search by title or description as you type |
| ✅ Filter | Filter by status (Completed/Pending) or by Priority |
| ✅ Priority | Tasks are tagged High / Medium / Low with color-coded badges |
| ✅ Due Date | Optional due date field, shown on each task card |
| ✅ Statistics | Live dashboard showing Total / Completed / Pending counts |
| ✅ Pending Count | Auto-calculated from total minus completed |
| ✅ Completed Count | Auto-calculated using `.filter()` |
| ✅ Clear Completed | Bulk-remove all completed tasks in one click |
| ✅ Local Storage | Tasks persist even after closing/reopening the browser |
| ✅ Responsive UI | Works cleanly on desktop, tablet, and mobile |
| ✅ Beautiful Dashboard | Card-based stat boxes with a clean grid layout |
| ✅ Dark Mode (Bonus) | One-click theme toggle, remembered across visits |

---

## 🧠 Concepts Used (and where to find them in `script.js`)

### 1. **Arrays of Objects — the core data model**
Every task is a JavaScript object, and all tasks live in one array:
```js
let tasks = [
  { id: 173..., title: "Buy milk", priority: "High", completed: false, ... }
];
```
This is the same pattern used by real-world apps and databases — a list of structured records.

### 2. **localStorage — Browser-Based Persistence**
`localStorage` can only store **strings**, so objects must be converted:
```js
localStorage.setItem("tasks", JSON.stringify(tasks)); // save
JSON.parse(localStorage.getItem("tasks"));              // load
```
This is what makes your tasks "remembered" even after refreshing the page or closing the browser.

### 3. **DOM Manipulation**
Tasks aren't hardcoded in HTML — JavaScript builds them dynamically:
```js
const li = document.createElement("li");
li.innerHTML = `...`;
taskContainer.appendChild(li);
```

### 4. **Array Methods (the real workhorses of this app)**
| Method | Used for |
|---|---|
| `.push()` | Adding a new task to the array |
| `.filter()` | Deleting a task, clearing completed tasks, search, and priority/status filtering |
| `.find()` | Finding one specific task by its `id` (for edit/complete) |
| `.forEach()` | Looping through tasks to build their HTML cards |
| `.some()` | Checking "is there at least one completed task?" before clearing |

### 5. **Event-Driven Programming**
Nothing runs top-to-bottom — the app reacts to user actions:
```js
addTaskButton.addEventListener("click", addTask);
searchBox.addEventListener("input", renderTasks); // fires on every keystroke
```

### 6. **Conditional Rendering**
The UI changes based on data, not hardcoded markup:
- Empty task list → shows a "No tasks found" message
- Completed task → gets a strikethrough style (`finished` class)
- Editing a task → swaps the "Add Task" button for "Update Task"

### 7. **Template Literals (Backtick Strings)**
Used to build HTML with embedded variables cleanly:
```js
li.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
```
Much more readable than string concatenation with `+`.

### 8. **The "Re-render Everything" Pattern**
Instead of manually finding and patching individual elements when data changes, this app simply **re-builds the entire task list from the data array** every time something changes (`renderTasks()`). This is the same core idea used by frameworks like React — just implemented by hand here, which makes it a great stepping stone before learning a framework.

### 9. **Search + Filter Working Together**
Both features narrow down the same array without permanently changing it:
```js
function getVisibleTasks() {
  return tasks.filter(task => matchesSearch && matchesFilter);
}
```
The original `tasks` array is never modified by search/filter — only a temporary filtered copy is rendered.

### 10. **State Management with a Single Source of Truth**
- `tasks` — the array driving everything you see
- `editingTaskId` — tracks which task (if any) is currently being edited

Every function changes this state, then calls `renderTasks()` + `updateDashboard()` to reflect it — keeping the UI in sync with the data.

### 11. **Functions & DRY (Don't Repeat Yourself)**
Small reusable functions like `clearForm()` and `saveTasksToLocalStorage()` avoid repeating the same code in multiple places (e.g., both Add and Update need to clear the form and save data).

### 12. **CSS Class Toggling for Dark Mode**
```js
document.body.classList.toggle("dark");
```
All dark-mode colors are pre-defined in `style.css` under `.dark` selectors — JavaScript's only job is to add/remove a single class. The preference is saved to `localStorage` so it persists across visits.

### 13. **Date Handling**
The due date comes from a native `<input type="date">`, which already gives a clean `YYYY-MM-DD` string — no extra parsing needed.

### 14. **Responsive Design (CSS, not JS)**
Media queries in `style.css` rearrange the dashboard grid and button groups into a single column on smaller screens:
```css
@media (max-width: 600px) { ... }
```

---

## 🧪 How to Run It
1. Download/clone the three files into the same folder.
2. Open `index.html` directly in any modern browser.
3. No server, no build step, no dependencies required.

---

## 🚀 Ideas to Extend This Project
- Add task **categories/tags** in addition to priority
- Add **drag-and-drop reordering** of tasks
- Add **sorting** (by due date, by priority)
- Show a **toast notification** instead of `alert()` for feedback
- Sync tasks to a real backend/database so they're shared across devices
- Add **recurring tasks** or **reminders**

---

## 🛠️ Tech Stack
- **HTML5** — semantic structure
- **CSS3** — Flexbox, Grid, custom properties-free theming via classes, media queries, animations
- **Vanilla JavaScript (ES6+)** — arrays, objects, DOM APIs, localStorage
- **Zero dependencies** — runs by just opening the HTML file
