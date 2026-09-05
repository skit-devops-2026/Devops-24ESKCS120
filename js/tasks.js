function loadTasks() {
    const tasks = getTasks();

    
    const searchInput = document.getElementById("taskSearch");
    const statusFilter = document.getElementById("statusFilter");
    const priorityFilter = document.getElementById("priorityFilter");

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedStatus = statusFilter ? statusFilter.value : "";
    const selectedPriority = priorityFilter ? priorityFilter.value : "";

    
    
    let filteredTasks = tasks;

    
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.title.toLowerCase().includes(searchTerm) ||
                   task.assignee.toLowerCase().includes(searchTerm);
        });
    }

    
    if (selectedStatus) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.status === selectedStatus;
        });
    }

    
    if (selectedPriority) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.priority === selectedPriority;
        });
    }

    renderTasks(filteredTasks);
}


function loadProjectDropdown() {
    const projects = getProjects();
    const select = document.getElementById("taskProject");
    select.innerHTML = "";

    
    projects.forEach(function(project) {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}


function renderTasks(tasks) {
    const container = document.getElementById("taskListContainer");
    container.innerHTML = "";

    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks found.</p></div>';
        return;
    }

    
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

    
    tasks.forEach(function(task) {
        
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


function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(function(t) { return t.id === taskId; });

    if (!task) return;

    
    document.getElementById("taskModalTitle").textContent = "Edit Task";
    document.getElementById("editingTaskId").value = task.id;

    
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDesc").value = task.description || "";
    document.getElementById("taskProject").value = task.projectId;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskStatus").value = task.status;
    document.getElementById("taskAssignee").value = task.assignee || "";
    document.getElementById("taskDueDate").value = task.dueDate || "";

    
    document.getElementById("taskModal").classList.add("show");
}


function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    
    let tasks = getTasks();
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    saveTasks(tasks);

    
    loadTasks();
}



const modalOverlay = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");


if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function() {
        
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
        const projectId = parseInt(document.getElementById("taskProject").value);
        const priority = document.getElementById("taskPriority").value;
        const status = document.getElementById("taskStatus").value;
        const assignee = document.getElementById("taskAssignee").value.trim();
        const dueDate = document.getElementById("taskDueDate").value;

        
        if (!title) {
            alert("Please enter a task title.");
            return;
        }

        
        const editingId = document.getElementById("editingTaskId").value;

        
        if (editingId) {
            const tasks = getTasks();
            const taskIndex = tasks.findIndex(function(t) { return t.id === parseInt(editingId); });

            if (taskIndex !== -1) {
                
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

        
        modalOverlay.classList.remove("show");
        loadTasks();
    });
}



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


loadProjectDropdown();
loadTasks();