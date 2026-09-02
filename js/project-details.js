// ============================================================
// project-details.js - Project details page logic
// Reads the project ID from the URL (?id=...), finds the
// project from LocalStorage, and displays it along with
// its tasks. Also supports adding tasks to this project.
// ============================================================

// Get the project ID from the URL query parameter (?id=5)
// window.location.search returns the part of the URL after "?"
const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get("id"));

// Variable to hold the current project after loading
let currentProject = null;

// Load and display the project details page.
function loadProjectDetails() {
    // Find the project using the ID from the URL
    currentProject = getProjectById(projectId);

    const header = document.getElementById("projectHeader");

    // If the project is not found, show an error message
    if (!currentProject) {
        header.innerHTML = '<h1>Project not found.</h1>';
        return;
    }

    // Count tasks for this project
    const tasks = getTasks();
    const projectTasks = tasks.filter(function(task) {
        return task.projectId === currentProject.id;
    });

    // Calculate progress percentage
    let progress = 0;
    if (projectTasks.length > 0) {
        const doneCount = projectTasks.filter(function(task) {
            return task.status === "Done";
        }).length;
        progress = Math.round((doneCount / projectTasks.length) * 100);
    }

    // Display the project information
    header.innerHTML =
        '<h1>' + currentProject.name + '</h1>' +
        '<p>' + currentProject.description + '</p>' +
        '<div class="project-detail-meta">' +
            '<span class="badge badge-' + currentProject.status.toLowerCase().replace(" ", "-") + '">' + currentProject.status + '</span>' +
            '<span>' + projectTasks.length + ' tasks</span>' +
            '<span>' + progress + '% complete</span>' +
        '</div>' +
        '<div class="progress-bar"><div class="progress-bar-fill" style="width: ' + progress + '%;"></div></div>';

    // Display the tasks belonging to this project
    renderProjectTasks(projectTasks);
}

// Render the list of tasks for this project.
function renderProjectTasks(projectTasks) {
    const container = document.getElementById("projectTasks");
    container.innerHTML = "";

    // Show empty state if no tasks exist for this project
    if (projectTasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks for this project yet.</p></div>';
        return;
    }

    // Create a table for the tasks
    const table = document.createElement("table");
    table.className = "task-table";
    table.innerHTML =
        '<thead>' +
            '<tr>' +
                '<th>Title</th>' +
                '<th>Priority</th>' +
                '<th>Status</th>' +
                '<th>Assignee</th>' +
                '<th>Due Date</th>' +
                '<th>Actions</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody></tbody>';

    const tbody = table.querySelector("tbody");

    // Loop through each task and add a row
    projectTasks.forEach(function(task) {
        const row = document.createElement("tr");
        row.innerHTML =
            '<td>' + task.title + '</td>' +
            '<td><span class="badge badge-' + task.priority.toLowerCase() + '">' + task.priority + '</span></td>' +
            '<td><span class="badge badge-' + task.status.toLowerCase().replace(" ", "-") + '">' + task.status + '</span></td>' +
            '<td>' + task.assignee + '</td>' +
            '<td>' + task.dueDate + '</td>' +
            '<td>' +
                '<div class="task-actions">' +
                    '<button class="btn btn-sm btn-secondary" onclick="deleteTask(' + task.id + ')">Delete</button>' +
                '</div>' +
            '</td>';

        tbody.appendChild(row);
    });

    container.appendChild(table);
}

// Delete a task by ID from this project, then refresh using URL.
function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    // Remove the task with the matching ID and save back
    let tasks = getTasks();
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    saveTasks(tasks);

    // Refresh the page content
    loadProjectDetails();
}

// --- Add Task Modal Logic ---

const modalOverlay = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

// Show the task modal when "Add Task" is clicked
if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function() {
        modalOverlay.classList.add("show");

        // Clear the form fields
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        document.getElementById("taskPriority").value = "Medium";
        document.getElementById("taskStatus").value = "Todo";
        document.getElementById("taskAssignee").value = "";
        document.getElementById("taskDueDate").value = "";
    });
}

// Hide the modal when "Cancel" is clicked
if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener("click", function() {
        modalOverlay.classList.remove("show");
    });
}

// Handle the task form submission
const taskForm = document.getElementById("taskForm");
if (taskForm) {
    taskForm.addEventListener("submit", function(event) {
        // Prevent the page from reloading
        event.preventDefault();

        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDesc").value.trim();
        const priority = document.getElementById("taskPriority").value;
        const status = document.getElementById("taskStatus").value;
        const assignee = document.getElementById("taskAssignee").value.trim();
        const dueDate = document.getElementById("taskDueDate").value;

        // Simple validation
        if (!title) {
            alert("Please enter a task title.");
            return;
        }

        // Create a new task object with the current project ID
        const newTask = {
            id: getNextTaskId(),
            title: title,
            description: description,
            projectId: currentProject.id,
            priority: priority,
            status: status,
            assignee: assignee,
            dueDate: dueDate
        };

        // Add it to the task list and save to LocalStorage
        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);

        // Hide modal and refresh the page
        modalOverlay.classList.remove("show");
        loadProjectDetails();
    });
}

// Load the page when the script runs
loadProjectDetails();