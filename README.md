# TaskFlow – Project Management SaaS

TaskFlow is a simple, frontend-only Project Management SaaS application. It uses only HTML, CSS, Vanilla JavaScript, and Browser LocalStorage. It is built for a college project and is designed to be simple, readable, and easy to explain.

## Technologies

* HTML (structure of the pages)
* CSS (styling and responsive layout)
* JavaScript (interactivity and dynamic rendering)
* LocalStorage (persisting data between page refreshes)

## Features

* Dashboard with statistics calculated from saved data
* Create, view, and delete projects
* View project details with its tasks
* Create, edit, and delete tasks
* Search tasks
* Filter tasks by status and priority
* Simple Kanban board (Todo / In Progress / Done) with a status dropdown
* Team page with sample members
* Settings page with profile details and a light/dark theme toggle
* All data persists after a browser refresh (LocalStorage)

## How to Run

No build tools or packages are needed. Simply open:

```text
index.html
```

in any modern browser (double-click the file).

The sample projects and tasks load automatically on the first visit.

## Project Structure

| File | Purpose |
| ---- | ------- |
| `index.html` | Dashboard page |
| `projects.html` | Project list with add/delete/search |
| `project-details.html` | Details page for one project (reads `?id=` from URL) |
| `tasks.html` | Task list with add/edit/delete/search/filter |
| `board.html` | Kanban board grouped by task status |
| `team.html` | Team member cards |
| `settings.html` | Profile settings and theme preference |
| `css/style.css` | The single stylesheet for all pages |
| `js/data.js` | Default/sample projects, tasks, and team data |
| `js/storage.js` | All LocalStorage read/write helpers |
| `js/dashboard.js` | Dashboard statistics and recent items |
| `js/projects.js` | Projects page logic |
| `js/project-details.js` | Project details page logic |
| `js/tasks.js` | Tasks page logic (CRUD, search, filter) |
| `js/board.js` | Kanban board logic |
| `js/team.js` | Team page logic |
| `js/settings.js` | Settings page logic and theme toggle |

## Viva Concepts

### HTML
The skeleton of every page. Semantic tags like `<header>`, `<nav>`, `<main>`, `<section>`, and `<form>` describe the meaning of content to the browser.

### CSS
Styles the HTML. TaskFlow uses one stylesheet (`css/style.css`) with Flexbox and Grid for layout, spacing, colors, and responsive behavior.

### Flexbox
Used for arranging items in a row or column, e.g., the top navigation bar, page headers, and card action buttons.

### Grid
Used for layouts that naturally form rows and columns, e.g., the statistics cards (`grid-template-columns: repeat(4, 1fr)`), project cards, and Kanban columns.

### JavaScript DOM
`document.querySelector` / `document.getElementById` select elements so JavaScript can read values, change text, or attach event listeners. `createElement` builds new elements dynamically (task rows, project cards).

### Events
User actions (click, typing, form submit, select change) fire events. `addEventListener` lets JavaScript "listen" and run a function when the event happens.

### LocalStorage
A browser API that stores key-value data on the user's machine. It persists after refresh. TaskFlow stores `projects`, `tasks`, and `settings` keys.

### JSON
A text format for exchanging data. LocalStorage only stores strings, so:
* `JSON.stringify(array)` converts a JS array into a JSON string before saving.
* `JSON.parse(string)` converts the JSON string back into a JS array when reading.

### CRUD Operations
Create, Read, Update, Delete:
* Create – `tasks.push(newTask)` then `saveTasks(tasks)`
* Read – `getTasks()` / `getProjects()` reads from LocalStorage
* Update – find the task by ID and change its fields, then save
* Delete – `tasks.filter(...)` keeps everything except the deleted task, then save

### Search
The search box value is compared (lowercased) against each task's title/assignee or each project's name using `filter()` and `includes()`. Results re-render on every keystroke.

### Filtering
Dropdown selects (status/priority) are read and used inside `filter()`, keeping only tasks whose field matches the selected option. Multiple filters combine because each `filter()` returns a new array.

## Data Flow

```text
HTML
  ↓  (user clicks / submits a form)
JavaScript  (event listener runs)
  ↓  (JSON.stringify)
LocalStorage (data stored persistently)
  ↓  (JSON.parse)
JavaScript  (reads data back)
  ↓  (dynamic DOM creation)
HTML UI  (updated view)
```