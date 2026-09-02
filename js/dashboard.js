// ============================================================
// dashboard.js - Dashboard page logic
// Calculates statistics from stored data and shows
// recent projects and tasks.
// ============================================================

// Main function called when the page loads.
// It calculates statistics and renders recent items.
function loadDashboard() {
    const projects = getProjects();
    const tasks = getTasks();

    // --- Calculate statistics from actual stored data ---

    // Total number of projects is simply the array length
    const totalProjects = projects.length;

    // Total number of tasks is simply the array length
    const totalTasks = tasks.length;

    // Count tasks where status is "Done" (completed)
    const completedTasks = tasks.filter(function(task) {
        return task.status === "Done";
    }).length;

    // Count tasks that are NOT done (pending)
    const pendingTasks = tasks.filter(function(task) {
        return task.status !== "Done";
    }).length;

    // Update the HTML elements with these calculated numbers
    document.getElementById("totalProjects").textContent = totalProjects;
    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("pendingTasks").textContent = pendingTasks;

    // --- Show recent projects (last 3) ---
    const recentProjects = projects.slice(-3).reverse();
    renderRecentProjects(recentProjects);

    // --- Show recent tasks (last 5) ---
    const recentTasks = tasks.slice(-5).reverse();
    renderRecentTasks(recentTasks);
}

// Create and display recent project items in the dashboard.
function renderRecentProjects(projects) {
    const container = document.getElementById("recentProjects");
    container.innerHTML = "";

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects yet.</p></div>';
        return;
    }

    // Read all tasks once, then count per project in the loop
    const allTasks = getTasks();

    // Loop through each recent project and create a list item
    projects.forEach(function(project) {
        // Find the number of tasks for this project
        const taskCount = allTasks.filter(function(t) {
            return t.projectId === project.id;
        }).length;

        const item = document.createElement("div");
        item.className = "recent-item";
        item.innerHTML =
            '<div class="recent-item-info">' +
                '<h4>' + project.name + '</h4>' +
                '<p>' + taskCount + ' tasks</p>' +
            '</div>' +
            '<span class="badge badge-' + project.status.toLowerCase().replace(" ", "-") + '">' + project.status + '</span>';
        container.appendChild(item);
    });
}

// Create and display recent task items in the dashboard.
function renderRecentTasks(tasks) {
    const container = document.getElementById("recentTasks");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks yet.</p></div>';
        return;
    }

    // Loop through each recent task and create a list item
    tasks.forEach(function(task) {
        const item = document.createElement("div");
        item.className = "recent-item";
        item.innerHTML =
            '<div class="recent-item-info">' +
                '<h4>' + task.title + '</h4>' +
                '<p>' + task.assignee + ' · Due ' + task.dueDate + '</p>' +
            '</div>' +
            '<span class="badge badge-' + task.status.toLowerCase().replace(" ", "-") + '">' + task.status + '</span>';
        container.appendChild(item);
    });
}

// Run the dashboard loader when this script loads.
loadDashboard();
