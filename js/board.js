// ============================================================
// board.js - Kanban board logic
// Groups tasks by their status into three columns:
// Todo, In Progress, Done.
// A simple status dropdown on each card lets you move a
// task between columns (no drag-and-drop needed).
// ============================================================

// Load and display tasks grouped by status.
function loadBoard() {
    const tasks = getTasks();

    // Split tasks into three groups using filter().
    // Each group contains only tasks with the matching status.
    const todoTasks = tasks.filter(function(task) {
        return task.status === "Todo";
    });

    const inProgressTasks = tasks.filter(function(task) {
        return task.status === "In Progress";
    });

    const doneTasks = tasks.filter(function(task) {
        return task.status === "Done";
    });

    // Update the column header counters
    document.getElementById("todoCount").textContent = todoTasks.length;
    document.getElementById("progressCount").textContent = inProgressTasks.length;
    document.getElementById("doneCount").textContent = doneTasks.length;

    // Render each group of tasks into its column
    renderColumn("todoColumn", todoTasks);
    renderColumn("progressColumn", inProgressTasks);
    renderColumn("doneColumn", doneTasks);
}

// Render a list of tasks inside one column container.
function renderColumn(containerId, tasks) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    // Show a placeholder if the column is empty
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks</p></div>';
        return;
    }

    // Loop through each task and create a card
    tasks.forEach(function(task) {
        // Find the project name for this task
        const project = getProjectById(task.projectId);
        const projectName = project ? project.name : "Unknown";

        const card = document.createElement("div");
        card.className = "board-card";
        card.innerHTML =
            '<h4>' + task.title + '</h4>' +
            '<p>' + projectName + '</p>' +
            '<div class="board-card-footer">' +
                '<span class="badge badge-' + task.priority.toLowerCase() + '">' + task.priority + '</span>' +
                '<span>' + task.assignee + '</span>' +
            '</div>' +
            '<div class="form-group" style="margin-top: 10px; margin-bottom: 0;">' +
                // Dropdown to change status. The task moves to the matching column
                // because the board re-renders after any change.
                '<select onchange="moveTask(' + task.id + ', this.value)">' +
                    '<option value="Todo"' + (task.status === "Todo" ? " selected" : "") + '>Todo</option>' +
                    '<option value="In Progress"' + (task.status === "In Progress" ? " selected" : "") + '>In Progress</option>' +
                    '<option value="Done"' + (task.status === "Done" ? " selected" : "") + '>Done</option>' +
                '</select>' +
            '</div>';

        container.appendChild(card);
    });
}

// Update a task's status directly from the board dropdown.
function moveTask(taskId, newStatus) {
    // Find the task in LocalStorage and change its status
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(function(task) {
        return task.id === taskId;
    });

    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTasks(tasks);
    }

    // Re-render the whole board so the task appears in the new column
    loadBoard();
}

// Load the board when the page opens
loadBoard();