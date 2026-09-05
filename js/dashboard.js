function loadDashboard() {
    const projects = getProjects();
    const tasks = getTasks();

    

    
    const totalProjects = projects.length;

    
    const totalTasks = tasks.length;

    
    const completedTasks = tasks.filter(function(task) {
        return task.status === "Done";
    }).length;

    
    const pendingTasks = tasks.filter(function(task) {
        return task.status !== "Done";
    }).length;

    
    document.getElementById("totalProjects").textContent = totalProjects;
    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("pendingTasks").textContent = pendingTasks;

    
    const recentProjects = projects.slice(-3).reverse();
    renderRecentProjects(recentProjects);

    
    const recentTasks = tasks.slice(-5).reverse();
    renderRecentTasks(recentTasks);
}


function renderRecentProjects(projects) {
    const container = document.getElementById("recentProjects");
    container.innerHTML = "";

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects yet.</p></div>';
        return;
    }

    
    const allTasks = getTasks();

    
    projects.forEach(function(project) {
        
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


function renderRecentTasks(tasks) {
    const container = document.getElementById("recentTasks");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks yet.</p></div>';
        return;
    }

    
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


loadDashboard();
