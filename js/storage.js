// ============================================================
// storage.js - LocalStorage helper functions
// All data read/write operations go through this file.
// LocalStorage saves data as strings, so we use
// JSON.stringify() to save and JSON.parse() to read.
// ============================================================

// Initialize LocalStorage with default data if empty (first-time visit)
// This ensures the dashboard is not empty when opened for the first time.
function initializeData() {
    const projects = localStorage.getItem("projects");
    const tasks = localStorage.getItem("tasks");

    if (!projects) {
        saveProjects(defaultProjects);
    }

    if (!tasks) {
        saveTasks(defaultTasks);
    }
}

// Get all projects from LocalStorage.
// If no projects exist, return an empty array.
function getProjects() {
    const data = localStorage.getItem("projects");
    return data ? JSON.parse(data) : [];
}

// Save projects array to LocalStorage.
// We convert the array to a JSON string because LocalStorage only stores strings.
function saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// Get all tasks from LocalStorage.
// If no tasks exist, return an empty array.
function getTasks() {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
}

// Save tasks array to LocalStorage.
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get the next available ID for projects.
// We find the highest existing ID and add 1.
function getNextProjectId() {
    const projects = getProjects();
    if (projects.length === 0) return 1;
    const maxId = Math.max.apply(null, projects.map(function(p) { return p.id; }));
    return maxId + 1;
}

// Get the next available ID for tasks.
function getNextTaskId() {
    const tasks = getTasks();
    if (tasks.length === 0) return 1;
    const maxId = Math.max.apply(null, tasks.map(function(t) { return t.id; }));
    return maxId + 1;
}

// Get a single project by its ID.
function getProjectById(id) {
    const projects = getProjects();
    return projects.find(function(p) { return p.id === id; });
}

// Get settings from LocalStorage (profile name, email, theme).
function getSettings() {
    const data = localStorage.getItem("settings");
    return data ? JSON.parse(data) : {
        profileName: "Durgesh Kumar",
        profileEmail: "durgesh@taskflow.com",
        theme: "light"
    };
}

// Save settings to LocalStorage.
function saveSettings(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}

// Run initialization when the page loads.
// This checks if data exists; if not, it loads the sample data.
initializeData();
