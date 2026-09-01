// ============================================================
// tasks.js - Tasks page logic
// Provides full CRUD for tasks (create, read, update, delete),
// plus search and filtering by status and priority.
// Also loads the project dropdown for the task form.
// ============================================================

// Load all tasks and render the table.
function loadTasks() {
    const tasks = getTasks();

    // Get the search term and filter values
    const searchInput = document.getElementById("taskSearch");
    const statusFilter = document.getElementById("statusFilter");
    const priorityFilter = document.getElementById("priorityFilter");

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedStatus = statusFilter ? statusFilter.value : "";
    const selectedPriority = priorityFilter ? priorityFilter.value : "";

    // Apply search + filters to the full task list.
    // Each filter() keeps only matching tasks.
    let filteredTasks = tasks;

    // Filter by search text (title or assignee)
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.title.toLowerCase().includes(searchTerm) ||
                   task.assignee.toLowerCase().includes(searchTerm);
        });
    }

    // Filter by the selected status
    if (selectedStatus) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.status === selectedStatus;
        });
    }

    // Filter by the selected priority
    if (selectedPriority) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.priority === selectedPriority;
        });
    }

    renderTasks(filteredTasks);
}

// Fill the project dropdown in the task modal.
function loadProjectDropdown() {
    const projects = getProjects();
    const select = document.getElementById("taskProject");
    select.innerHTML = "";

    // Create one option element for each project
    projects.forEach(function(project) {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

// Render the task table with the given filtered tasks.
function renderTasks(tasks) {
    const container = document.getElementById("taskListContainer");
    container.innerHTML = "";

    // Show an empty state if no tasks match
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks found.</p></div>';
        return;
    }

    // Build the table structure
    const table = document.createElement("table");
    table.className = "task-table";
    table.innerHTML =
        '<thead>' +
            '<tr>' +
                '<th>Title</th>' +
                '<th>Project</th>' +
                '<th>Priority</th>' +
                '<th>Status</th>' +
                '<th>Assignee</th>' +
                '<th>Due Date</th>' +
                '<th>Actions</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody></tbody>';

    const tbody = table.querySelector("tbody");

    // Loop through each task and create a table row
    tasks.forEach(function(task) {
        // Find the project name for this task
        const project = getProjectById(task.projectId);
        const projectName = project ? project.name : "Unknown";

        const row = document.createElement("tr");
        row.innerHTML =
            '<td>' + task.title + '</td>' +
            '<td>' + projectName + '</td>' +
            '<td><span class="badge badge-' + task.priority.toLowerCase() + '">' + task.priority + '</span></td>' +
            '<td><span class="badge badge-' + task.status.toLowerCase().replace(" ", "-") + '">' + task.status + '</span></td>' +
            '<td>' + task.assignee + '</td>' +
            '<td>' + task.dueDate + '</td>' +
            '<td>' +
                '<div class="task-actions">' +
                    '<button class="btn btn-sm btn-secondary" onclick="editTask(' + task.id + ')">Edit</button>' +
                    '<button class="btn btn-sm btn-danger" onclick="deleteTask(' + task.id + ')">Delete</button>' +
                '</div>' +
            '</td>';

        tbody.appendChild(row);
    });

    container.appendChild(table);
}

// Open the modal pre-filled with the selected task's data.
function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(function(t) { return t.id === taskId; });

    if (!task) return;

    // Set the modal title to "Edit Task"
    document.getElementById("taskModalTitle").textContent = "Edit Task";
    document.getElementById("editingTaskId").value = task.id;

    // Fill all form fields with the task's current data
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDesc").value = task.description || "";
    document.getElementById("taskProject").value = task.projectId;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskStatus").value = task.status;
    document.getElementById("taskAssignee").value = task.assignee || "";
    document.getElementById("taskDueDate").value = task.dueDate || "";

    // Show the modal
    document.getElementById("taskModal").classList.add("show");
}

// Delete a task after confirmation.
function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    // Keep only tasks that do NOT have the matching ID, then save
    let tasks = getTasks();
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    saveTasks(tasks);

    // Refresh the table
    loadTasks();
}

// --- Modal Logic ---

const modalOverlay = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

// Show the modal in "Add" mode when "Add Task" is clicked
if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function() {
        // Reset the form to default values
        document.getElementById("taskModalTitle").textContent = "Add New Task";
        document.getElementById("editingTaskId").value = "";
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        document.getElementById("taskPriority").value = "Medium";
        document.getElementById("taskStatus").value = "Todo";
        document.getElementById("taskAssignee").value = "";
        document.getElementById("taskDueDate").value = "";

        modalOverlay.classList.add("show");
    });
}

// Hide the modal when "Cancel" is clicked
if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener("click", function() {
        modalOverlay.classList.remove("show");
    });
}

// Handle form submission (used for both Add and Edit)
const taskForm = document.getElementById("taskForm");
if (taskForm) {
    taskForm.addEventListener("submit", function(event) {
        // Prevent the page from reloading
        event.preventDefault();

        // Read all the form values
        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDesc").value.trim();
        const projectId = parseInt(document.getElementById("taskProject").value);
        const priority = document.getElementById("taskPriority").value;
        const status = document.getElementById("taskStatus").value;
        const assignee = document.getElementById("taskAssignee").value.trim();
        const dueDate = document.getElementById("taskDueDate").value;

        // Simple validation: a task must have a title
        if (!title) {
            alert("Please enter a task title.");
            return;
        }

        // Check which mode we are in using the hidden field
        const editingId = document.getElementById("editingTaskId").value;

        // If editingId has a value, we are editing an existing task
        if (editingId) {
            const tasks = getTasks();
            const taskIndex = tasks.findIndex(function(t) { return t.id === parseInt(editingId); });

            if (taskIndex !== -1) {
                // Update the existing task with the new values
                tasks[taskIndex].title = title;
                tasks[taskIndex].description = description;
                tasks[taskIndex].projectId = projectId;
                tasks[taskIndex].priority = priority;
                tasks[taskIndex].status = status;
                tasks[taskIndex].assignee = assignee;
                tasks[taskIndex].dueDate = dueDate;
                saveTasks(tasks);
            }
        } else {
            // Otherwise we are creating a brand new task
            const newTask = {
                id: getNextTaskId(),
                title: title,
                description: description,
                projectId: projectId,
                priority: priority,
                status: status,
                assignee: assignee,
                dueDate: dueDate
            };

            const tasks = getTasks();
            tasks.push(newTask);
            saveTasks(tasks);
        }

        // Close the modal and refresh the task list
        modalOverlay.classList.remove("show");
        loadTasks();
    });
}

// --- Live search and filter events ---

const searchInput = document.getElementById("taskSearch");
if (searchInput) {
    searchInput.addEventListener("input", loadTasks);
}

const statusFilter = document.getElementById("statusFilter");
if (statusFilter) {
    statusFilter.addEventListener("change", loadTasks);
}

const priorityFilter = document.getElementById("priorityFilter");
if (priorityFilter) {
    priorityFilter.addEventListener("change", loadTasks);
}

// Load the project dropdown and tasks when the page opens
loadProjectDropdown();
loadTasks();