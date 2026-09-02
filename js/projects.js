// ============================================================
// projects.js - Projects page logic
// Displays projects, allows adding and deleting projects,
// and provides a simple search feature.
// ============================================================

// Load and display all projects when the page loads.
function loadProjects() {
    const projects = getProjects();
    const searchInput = document.getElementById("projectSearch");
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

    // Filter projects based on the search term
    const filteredProjects = projects.filter(function(project) {
        return project.name.toLowerCase().includes(searchTerm);
    });

    renderProjects(filteredProjects);
}

// Render project cards into the grid container.
function renderProjects(projects) {
    const container = document.getElementById("projectsGrid");
    container.innerHTML = "";

    // Show empty state if there are no projects
    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No projects found.</p></div>';
        return;
    }

    // Loop through each project and create a card
    const allTasks = getTasks();
    projects.forEach(function(project) {
        // Count tasks belonging to this project
        const taskCount = allTasks.filter(function(task) {
            return task.projectId === project.id;
        }).length;

        // Calculate progress: percentage of done tasks out of total tasks
        let progress = 0;
        if (taskCount > 0) {
            const doneCount = allTasks.filter(function(task) {
                return task.projectId === project.id && task.status === "Done";
            }).length;
            progress = Math.round((doneCount / taskCount) * 100);
        }

        // Create the card element with all project details
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

// Navigate to the project details page, passing the ID in the URL.
function viewProject(id) {
    window.location.href = "project-details.html?id=" + id;
}

// Delete a project after confirmation.
function deleteProject(id) {
    const confirmDelete = confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    // Get current projects, remove the one with matching ID, save back
    let projects = getProjects();
    projects = projects.filter(function(project) {
        return project.id !== id;
    });
    saveProjects(projects);

    // Also delete all tasks belonging to this project
    let tasks = getTasks();
    tasks = tasks.filter(function(task) {
        return task.projectId !== id;
    });
    saveTasks(tasks);

    // Re-render the list
    loadProjects();
}

// --- Add Project Modal Logic ---

// Get the modal elements
const modalOverlay = document.getElementById("projectModal");
const addProjectBtn = document.getElementById("addProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");

// Show the modal when "Add Project" is clicked
if (addProjectBtn) {
    addProjectBtn.addEventListener("click", function() {
        modalOverlay.classList.add("show");
        document.getElementById("projectName").value = "";
        document.getElementById("projectDesc").value = "";
        document.getElementById("projectStatus").value = "Active";
    });
}

// Hide the modal when "Cancel" is clicked
if (cancelProjectBtn) {
    cancelProjectBtn.addEventListener("click", function() {
        modalOverlay.classList.remove("show");
    });
}

// Handle the project form submission
const projectForm = document.getElementById("projectForm");
if (projectForm) {
    projectForm.addEventListener("submit", function(event) {
        // Prevent the page from reloading
        event.preventDefault();

        const name = document.getElementById("projectName").value.trim();
        const description = document.getElementById("projectDesc").value.trim();
        const status = document.getElementById("projectStatus").value;

        // Simple validation
        if (!name) {
            alert("Please enter a project name.");
            return;
        }

        // Create a new project object with a unique ID
        const newProject = {
            id: getNextProjectId(),
            name: name,
            description: description,
            status: status
        };

        // Add it to the existing list and save to LocalStorage
        const projects = getProjects();
        projects.push(newProject);
        saveProjects(projects);

        // Hide modal and refresh the project list
        modalOverlay.classList.remove("show");
        loadProjects();
    });
}

// Live search: re-render projects as the user types
const searchInput = document.getElementById("projectSearch");
if (searchInput) {
    searchInput.addEventListener("input", loadProjects);
}

// Initial load when the page opens
loadProjects();
