






function loadProjects() {
    const projects = getProjects();
    const searchInput = document.getElementById("projectSearch");
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

    
    const filteredProjects = projects.filter(function(project) {
        return project.name.toLowerCase().includes(searchTerm);
    });

    renderProjects(filteredProjects);
}


function renderProjects(projects) {
    const container = document.getElementById("projectsGrid");
    container.innerHTML = "";

    
    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects found.</p></div>';
        return;
    }

    
    const allTasks = getTasks();
    projects.forEach(function(project) {
        
        const taskCount = allTasks.filter(function(task) {
            return task.projectId === project.id;
        }).length;

        
        let progress = 0;
        if (taskCount > 0) {
            const doneCount = allTasks.filter(function(task) {
                return task.projectId === project.id && task.status === "Done";
            }).length;
            progress = Math.round((doneCount / taskCount) * 100);
        }

        
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML =
            '<h3>' + project.name + '</h3>' +
            '<p>' + project.description + '</p>' +
            '<span class="badge badge-' + project.status.toLowerCase().replace(" ", "-") + '">' + project.status + '</span>' +
            '<div class="project-card-meta">' +
                '<span>' + taskCount + ' tasks</span>' +
                '<span>' + progress + '% done</span>' +
            '</div>' +
            '<div class="progress-bar"><div class="progress-bar-fill" style="width: ' + progress + '%;"></div></div>' +
            '<div class="project-card-footer">' +
                '<button class="btn btn-sm btn-primary" onclick="viewProject(' + project.id + ')">View</button>' +
                '<button class="btn btn-sm btn-danger" onclick="deleteProject(' + project.id + ')">Delete</button>' +
            '</div>';

        container.appendChild(card);
    });
}


function viewProject(id) {
    window.location.href = "project-details.html?id=" + id;
}


function deleteProject(id) {
    const confirmDelete = confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    
    let projects = getProjects();
    projects = projects.filter(function(project) {
        return project.id !== id;
    });
    saveProjects(projects);

    
    let tasks = getTasks();
    tasks = tasks.filter(function(task) {
        return task.projectId !== id;
    });
    saveTasks(tasks);

    
    loadProjects();
}




const modalOverlay = document.getElementById("projectModal");
const addProjectBtn = document.getElementById("addProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");


if (addProjectBtn) {
    addProjectBtn.addEventListener("click", function() {
        modalOverlay.classList.add("show");
        document.getElementById("projectName").value = "";
        document.getElementById("projectDesc").value = "";
        document.getElementById("projectStatus").value = "Active";
    });
}


if (cancelProjectBtn) {
    cancelProjectBtn.addEventListener("click", function() {
        modalOverlay.classList.remove("show");
    });
}


const projectForm = document.getElementById("projectForm");
if (projectForm) {
    projectForm.addEventListener("submit", function(event) {
        
        event.preventDefault();

        const name = document.getElementById("projectName").value.trim();
        const description = document.getElementById("projectDesc").value.trim();
        const status = document.getElementById("projectStatus").value;

        
        if (!name) {
            alert("Please enter a project name.");
            return;
        }

        
        const newProject = {
            id: getNextProjectId(),
            name: name,
            description: description,
            status: status
        };

        
        const projects = getProjects();
        projects.push(newProject);
        saveProjects(projects);

        
        modalOverlay.classList.remove("show");
        loadProjects();
    });
}


const searchInput = document.getElementById("projectSearch");
if (searchInput) {
    searchInput.addEventListener("input", loadProjects);
}


loadProjects();
