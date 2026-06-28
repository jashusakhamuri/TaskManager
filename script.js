/* ====================================================================
   ADVANCED TASK MANAGER — script.js
   ====================================================================

   This file is written with LEARNING in mind.
   Every concept used is explained in a comment right above the code
   that uses it, so you can read this top-to-bottom like a tutorial.

   Concepts you'll see in this file:
   - Arrays & Objects (to store tasks)
   - localStorage (to save data even after closing the browser)
   - DOM manipulation (createElement, innerHTML, classList, etc.)
   - Event Listeners (click, input, change)
   - Array methods: map(), filter(), forEach(), find(), findIndex()
   - Conditional rendering (showing/hiding things based on state)
   - Template literals (building HTML strings with backticks)
   - Functions & reusability (DRY — Don't Repeat Yourself)
   - Date handling
   - JSON.stringify() / JSON.parse() (converting objects <-> text)

   ==================================================================== */


/* ====================================================================
   1. GRABBING ELEMENTS FROM THE HTML (DOM REFERENCES)
   ====================================================================

   We store references to HTML elements in variables ONCE,
   at the top of the file, instead of calling
   document.getElementById() again and again everywhere.

   This is good practice — it's faster and keeps the code clean.
==================================================================== */

// ---- Add Task form fields ----
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

// ---- Buttons ----
const addTaskButton = document.getElementById("addTaskButton");
const updateTaskButton = document.getElementById("updateTaskButton");
const clearCompletedButton = document.getElementById("clearCompleted");
const darkModeToggle = document.getElementById("darkModeToggle");

// ---- Search & Filter ----
const searchBox = document.getElementById("searchBox");
const filterSelect = document.getElementById("filter");

// ---- Dashboard counters ----
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

// ---- Where all task <li> cards get displayed ----
const taskContainer = document.getElementById("taskContainer");


/* ====================================================================
   2. APPLICATION STATE
   ====================================================================

   "State" means: the data that controls what the user sees.

   tasks            -> array of all task objects
   editingTaskId    -> remembers WHICH task is being edited right now
                       (null = we are not editing anything,
                        we are simply adding a new task)

   Every task object looks like this:
   {
     id: 1700000000000,       // unique number, generated from Date.now()
     title: "Buy groceries",
     description: "Milk, eggs, bread",
     priority: "High",        // "High" | "Medium" | "Low"
     dueDate: "2026-07-01",
     completed: false
   }
==================================================================== */

let tasks = [];
let editingTaskId = null;


/* ====================================================================
   3. LOCAL STORAGE — SAVING & LOADING DATA
   ====================================================================

   localStorage can only store STRINGS.
   Our tasks are an array of OBJECTS, so we must convert:

   - Saving:   object/array  --> JSON.stringify() --> string
   - Loading:  string        --> JSON.parse()     --> object/array

   This is exactly how the app "remembers" your tasks
   even after you close and reopen the browser.
==================================================================== */

// Save the current `tasks` array into localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage when the page first opens.
// If nothing is saved yet, default to an empty array.
function loadTasksFromLocalStorage() {
  const savedTasks = localStorage.getItem("tasks");
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
}


/* ====================================================================
   4. ADD TASK
   ====================================================================

   Steps:
   1. Read values from the input fields
   2. Validate (don't allow an empty title)
   3. Create a new task object
   4. Push it into the tasks array
   5. Save to localStorage
   6. Re-render the task list & dashboard
   7. Clear the form
==================================================================== */

function addTask() {

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  // Basic validation — title is required
  if (title === "") {
    alert("⚠ Please enter a task title!");
    return; // stop the function here, don't add an empty task
  }

  // Build the task object.
  // Date.now() gives a unique number (milliseconds since 1970),
  // which is a simple way to create a unique ID without a database.
  const newTask = {
    id: Date.now(),
    title: title,
    description: description,
    priority: priority,
    dueDate: dueDate,
    completed: false
  };

  // Add the new task to our array.
  // push() adds an item to the END of an array.
  tasks.push(newTask);

  saveTasksToLocalStorage();
  renderTasks();
  updateDashboard();
  clearForm();
}


/* ====================================================================
   5. DELETE TASK
   ====================================================================

   filter() creates a NEW array containing only the items
   that pass a test — here, "keep every task whose id
   does NOT match the one we want to delete".

   This is the standard way to "remove an item" in JavaScript,
   since arrays don't have a simple removeById() method.
==================================================================== */

function deleteTask(id) {

  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return; // user clicked "Cancel"

  tasks = tasks.filter(function (task) {
    return task.id !== id; // keep tasks that are NOT this id
  });

  saveTasksToLocalStorage();
  renderTasks();
  updateDashboard();
}


/* ====================================================================
   6. COMPLETE TASK (toggle Pending <-> Completed)
   ====================================================================

   find() searches an array and returns the FIRST item
   that matches a condition (or undefined if none match).

   We flip the boolean: completed = !completed
   "!" means "NOT" — true becomes false, false becomes true.
==================================================================== */

function toggleComplete(id) {

  const task = tasks.find(function (t) {
    return t.id === id;
  });

  if (task) {
    task.completed = !task.completed;
  }

  saveTasksToLocalStorage();
  renderTasks();
  updateDashboard();
}


/* ====================================================================
   7. EDIT TASK
   ====================================================================

   Editing is done in TWO steps:

   STEP A — startEditTask(id)
     - Find the task
     - Fill the form inputs with its current values
     - Remember its id in `editingTaskId`
     - Show the "Update Task" button, hide "Add Task" button

   STEP B — updateTask()
     - Runs when the user clicks "Update Task"
     - Finds the task again using `editingTaskId`
     - Overwrites its fields with the new form values
     - Resets back to "Add Task" mode
==================================================================== */

// STEP A: Load a task's data into the form for editing
function startEditTask(id) {

  const task = tasks.find(function (t) {
    return t.id === id;
  });

  if (!task) return;

  // Fill the form with the existing task's data
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  priorityInput.value = task.priority;
  dueDateInput.value = task.dueDate;

  // Remember which task we're editing
  editingTaskId = id;

  // Switch the buttons: hide "Add", show "Update"
  addTaskButton.style.display = "none";
  updateTaskButton.style.display = "block";

  // Smooth scroll up to the form so the user can see it
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// STEP B: Save the edited values back into the task
function updateTask() {

  const title = taskTitleInput.value.trim();

  if (title === "") {
    alert("⚠ Task title cannot be empty!");
    return;
  }

  const task = tasks.find(function (t) {
    return t.id === editingTaskId;
  });

  if (task) {
    task.title = title;
    task.description = taskDescriptionInput.value.trim();
    task.priority = priorityInput.value;
    task.dueDate = dueDateInput.value;
  }

  saveTasksToLocalStorage();
  renderTasks();
  updateDashboard();
  clearForm();

  // Switch back: hide "Update", show "Add"
  editingTaskId = null;
  updateTaskButton.style.display = "none";
  addTaskButton.style.display = "block";
}


/* ====================================================================
   8. CLEAR THE ADD-TASK FORM
   ====================================================================
   A small helper function so we don't repeat the same
   four lines of code in both addTask() and updateTask().
==================================================================== */

function clearForm() {
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  priorityInput.value = "Medium";
  dueDateInput.value = "";
}


/* ====================================================================
   9. CLEAR COMPLETED TASKS
   ====================================================================
   Same filter() technique as delete — but this time we keep
   every task that is NOT completed, removing all completed ones
   in a single operation.
==================================================================== */

function clearCompletedTasks() {

  const hasCompleted = tasks.some(function (t) {
    return t.completed;
  });

  if (!hasCompleted) {
    alert("There are no completed tasks to clear.");
    return;
  }

  const confirmClear = confirm("Remove all completed tasks?");
  if (!confirmClear) return;

  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveTasksToLocalStorage();
  renderTasks();
  updateDashboard();
}


/* ====================================================================
   10. SEARCH + FILTER (working together)
   ====================================================================

   Both Search and Filter narrow down the SAME `tasks` array,
   so we combine them into one function: getVisibleTasks().

   - Search: matches task title OR description (case-insensitive)
   - Filter: matches status (Completed/Pending) OR priority

   We don't mutate the original `tasks` array — we always build
   a new filtered array, then hand it to renderTasks().
   This keeps the original data safe and untouched.
==================================================================== */

function getVisibleTasks() {

  const searchTerm = searchBox.value.trim().toLowerCase();
  const filterValue = filterSelect.value;

  return tasks.filter(function (task) {

    // ---- Search match ----
    // toLowerCase() makes the search case-insensitive,
    // so "MILK" and "milk" are treated the same.
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm);

    // ---- Filter match ----
    let matchesFilter = true; // default: show everything

    if (filterValue === "Completed") {
      matchesFilter = task.completed === true;
    } else if (filterValue === "Pending") {
      matchesFilter = task.completed === false;
    } else if (filterValue === "High" || filterValue === "Medium" || filterValue === "Low") {
      matchesFilter = task.priority === filterValue;
    }
    // if filterValue is "All", matchesFilter stays true

    // A task is visible only if BOTH conditions are true
    return matchesSearch && matchesFilter;
  });
}


/* ====================================================================
   11. RENDER TASKS (the heart of the app)
   ====================================================================

   "Rendering" means: take the current data (the tasks array)
   and turn it into actual HTML on the screen.

   We do this EVERY TIME the data changes (add/edit/delete/complete/
   search/filter), instead of trying to manually patch the DOM.
   This "re-render everything from data" pattern is the same idea
   used by frameworks like React — just done by hand here.

   Steps:
   1. Clear out whatever is currently shown
   2. Get the tasks that should be visible (search + filter applied)
   3. If there are none, show an "empty" message
   4. Otherwise, build an HTML card for each task and insert it
==================================================================== */

function renderTasks() {

  // Step 1: Clear current content
  taskContainer.innerHTML = "";

  // Step 2: Apply search + filter
  const visibleTasks = getVisibleTasks();

  // Step 3: Handle the "no tasks" case
  if (visibleTasks.length === 0) {
    taskContainer.innerHTML = `<li class="empty">No tasks found 📭</li>`;
    return;
  }

  // Step 4: Build a card for every visible task
  visibleTasks.forEach(function (task) {

    // Create the <li> element that will hold this task
    const li = document.createElement("li");

    // Combine multiple CSS classes conditionally.
    // If the task is completed, also add the "finished" class
    // (which applies the strikethrough text style from CSS).
    li.className = "task-card" + (task.completed ? " finished" : "");

    // data-priority drives the colored corner "tab" in CSS
    // (lowercased so it matches data-priority="high"/"medium"/"low")
    li.setAttribute("data-priority", task.priority.toLowerCase());

    const statusClass = task.completed ? "status-completed" : "status-pending";
    const statusText = task.completed ? "Completed" : "Pending";

    // Show "No due date" if the user left the date field empty
    const dueDateText = task.dueDate ? task.dueDate : "No due date";

    // Single-letter tab label: H / M / L
    const tabLetter = task.priority.charAt(0).toUpperCase();

    // Template literals (backticks ` `) let us build a big HTML
    // string and insert variables using ${ } -- cleaner than
    // gluing strings together with the + operator.
    li.innerHTML = `
      <span class="priority-tab">${tabLetter}</span>

      <div class="task-body">
        <h3>${task.title}</h3>
        <p>${task.description ? task.description : "No description"}</p>

        <div class="task-meta">
          <span class="meta-chip">Due: ${dueDateText}</span>
          <span class="meta-chip ${statusClass}">${statusText}</span>
        </div>
      </div>

      <div class="task-actions">
        <button class="stamp-btn" title="${task.completed ? "Mark pending" : "Mark complete"}">&check;</button>
        <button class="icon-btn edit-btn" title="Edit">&#9998;</button>
        <button class="icon-btn delete-btn" title="Delete">&#128465;</button>
      </div>
    `;

    // ----------------------------------------------------------
    // Attach click events to the buttons we just created.
    //
    // We use querySelector() to find the button INSIDE this
    // specific <li>, then attach the matching function.
    // We pass task.id so each button knows which task it
    // belongs to.
    // ----------------------------------------------------------
    li.querySelector(".stamp-btn").addEventListener("click", function () {
      toggleComplete(task.id);
    });

    li.querySelector(".edit-btn").addEventListener("click", function () {
      startEditTask(task.id);
    });

    li.querySelector(".delete-btn").addEventListener("click", function () {
      deleteTask(task.id);
    });

    // Finally, add this finished card into the page
    taskContainer.appendChild(li);
  });
}


/* ====================================================================
   12. DASHBOARD / STATISTICS
   ====================================================================

   We calculate three numbers every time tasks change:
   - total tasks
   - completed tasks
   - pending tasks

   tasks.length            -> total count
   tasks.filter(...).length -> count of items matching a condition
==================================================================== */

function updateDashboard() {

  const total = tasks.length;

  const completed = tasks.filter(function (t) {
    return t.completed;
  }).length;

  const pending = total - completed;
  // (pending = total minus completed — simpler than filtering twice)

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
}


/* ====================================================================
   13. DARK MODE (Bonus Feature)
   ====================================================================

   All the dark-mode COLORS already exist in style.css as CSS
   variable overrides under the [data-theme="dark"] selector.

   So in JavaScript we only need ONE line of real logic:
   set/remove a data-theme="dark" attribute on the <html> tag.

   We also save the user's choice in localStorage so the
   dark mode preference survives a page refresh.
==================================================================== */

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  const nowDark = !isDark;

  // Save true/false as a string so we can restore it next time
  localStorage.setItem("darkMode", nowDark);

  // Update the button icon to reflect the current mode
  darkModeToggle.querySelector(".theme-icon").textContent = nowDark ? "☀" : "🌙";
}

// Restore dark mode preference when the page loads
function loadDarkModePreference() {
  const isDark = localStorage.getItem("darkMode") === "true";

  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    darkModeToggle.querySelector(".theme-icon").textContent = "☀";
  }
}


/* ====================================================================
   14. EVENT LISTENERS
   ====================================================================

   This section "wires up" every interactive element on the page
   to the function that should run when the user interacts with it.

   Keeping all event listeners together (instead of scattering
   them throughout the file) makes the code easier to scan.
==================================================================== */

addTaskButton.addEventListener("click", addTask);
updateTaskButton.addEventListener("click", updateTask);
clearCompletedButton.addEventListener("click", clearCompletedTasks);
darkModeToggle.addEventListener("click", toggleDarkMode);

// "input" fires on every keystroke — gives a live search-as-you-type feel
searchBox.addEventListener("input", renderTasks);

// "change" fires when the dropdown selection changes
filterSelect.addEventListener("change", renderTasks);


/* ====================================================================
   15. INITIALIZE THE APP
   ====================================================================

   This runs once, immediately when script.js loads:
   1. Load saved tasks from localStorage
   2. Load saved dark mode preference
   3. Render the task list for the first time
   4. Update the dashboard numbers
==================================================================== */

function initApp() {
  loadTasksFromLocalStorage();
  loadDarkModePreference();
  renderTasks();
  updateDashboard();
}

initApp();