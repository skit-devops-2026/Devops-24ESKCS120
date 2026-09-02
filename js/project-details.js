








const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get("id"));


let currentProject = null;


function loadProjectDetails() {
    
    currentProject = getProjectById(projectId);

    const header = document.getElementById("projectHeader");

    
    if (!currentProject) {
        header.innerHTML = '<h1>Project not found.</h1>';
        return;
    }

    
    const tasks = getTasks();
    const projectTasks = tasks.filter(function(task) {
        return task.projectId === currentProject.id;
    });

    
    let progress = 0;
    if (projectTasks.length > 0) {
        const doneCount = projectTasks.filter(function(task) {
            return task.status === "Done";
        }).length;
        progress = Math.round((doneCount / projectTasks.length) * 100);
    }

    
    header.innerHTML =
        '<h1>' + currentProject.name + '</h1>' +
        '<p>' + currentProject.description + '</p>' +
        '<div class="project-detail-meta">' +
            '<span class="badge badge-' + currentProject.status.toLowerCase().replace(" ", "-") + '">' + currentProject.status + '</span>' +
            '<span>' + projectTasks.length + ' tasks</span>' +
            '<span>' + progress + '% complete</span>' +
        '</div>' +
        '<div class="progress-bar"><div class="progress-bar-fill" style="width: ' + progress + '%;"></div></div>';

    
    renderProjectTasks(projectTasks);
}


function renderProjectTasks(projectTasks) {
    const container = document.getElementById("projectTasks");
    container.innerHTML = "";

    
    if (projectTasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks for this project yet.</p></div>';
        return;
    }

    
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


function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    
    let tasks = getTasks();
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    saveTasks(tasks);

    
    loadProjectDetails();
}



const modalOverlay = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");


if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function() {
        modalOverlay.classList.add("show");

        
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        document.getElementById("taskPriority").value = "Medium";
        document.getElementById("taskStatus").value = "Todo";
        document.getElementById("taskAssignee").value = "";
        document.getElementById("taskDueDate").value = "";
    });
}


if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener("click", function() {
        modalOverlay.classList.remove("show");
    });
}


const taskForm = document.getElementById("taskForm");
if (taskForm) {
    taskForm.addEventListener("submit", function(event) {
        
        event.preventDefault();

        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDesc").value.trim();
        const priority = document.getElementById("taskPriority").value;
        const status = document.getElementById("taskStatus").value;
        const assignee = document.getElementById("taskAssignee").value.trim();
        const dueDate = document.getElementById("taskDueDate").value;

        
        if (!title) {
            alert("Please enter a task title.");
            return;
        }

        
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

        
        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);

        
        modalOverlay.classList.remove("show");
        loadProjectDetails();
    });
}


loadProjectDetails();