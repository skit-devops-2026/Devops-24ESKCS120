function loadBoard() {
    const tasks = getTasks();

    
    
    const todoTasks = tasks.filter(function(task) {
        return task.status === "Todo";
    });

    const inProgressTasks = tasks.filter(function(task) {
        return task.status === "In Progress";
    });

    const doneTasks = tasks.filter(function(task) {
        return task.status === "Done";
    });

    
    document.getElementById("todoCount").textContent = todoTasks.length;
    document.getElementById("progressCount").textContent = inProgressTasks.length;
    document.getElementById("doneCount").textContent = doneTasks.length;

    
    renderColumn("todoColumn", todoTasks);
    renderColumn("progressColumn", inProgressTasks);
    renderColumn("doneColumn", doneTasks);
}


function renderColumn(containerId, tasks) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks</p></div>';
        return;
    }

    
    tasks.forEach(function(task) {
        
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
                
                
                '<select onchange="moveTask(' + task.id + ', this.value)">' +
                    '<option value="Todo"' + (task.status === "Todo" ? " selected" : "") + '>Todo</option>' +
                    '<option value="In Progress"' + (task.status === "In Progress" ? " selected" : "") + '>In Progress</option>' +
                    '<option value="Done"' + (task.status === "Done" ? " selected" : "") + '>Done</option>' +
                '</select>' +
            '</div>';

        container.appendChild(card);
    });
}


function moveTask(taskId, newStatus) {
    
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(function(task) {
        return task.id === taskId;
    });

    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTasks(tasks);
    }

    
    loadBoard();
}


loadBoard();