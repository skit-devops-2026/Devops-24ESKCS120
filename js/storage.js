








function initializeData() {
    const projects = localStorage.getItem("projects");
    const tasks = localStorage.getItem("tasks");

    if (!projects) {
        saveProjects(defaultProjects);
    }

    if (!tasks) {
        saveTasks(defaultTasks);
    }
}



function getProjects() {
    const data = localStorage.getItem("projects");
    return data ? JSON.parse(data) : [];
}



function saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
}



function getTasks() {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
}


function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



function getNextProjectId() {
    const projects = getProjects();
    if (projects.length === 0) return 1;
    const maxId = Math.max.apply(null, projects.map(function(p) { return p.id; }));
    return maxId + 1;
}


function getNextTaskId() {
    const tasks = getTasks();
    if (tasks.length === 0) return 1;
    const maxId = Math.max.apply(null, tasks.map(function(t) { return t.id; }));
    return maxId + 1;
}


function getProjectById(id) {
    const projects = getProjects();
    return projects.find(function(p) { return p.id === id; });
}


function getSettings() {
    const data = localStorage.getItem("settings");
    return data ? JSON.parse(data) : {
        profileName: "Durgesh Kumar",
        profileEmail: "durgesh@Durgesh.com",
        theme: "light"
    };
}


function saveSettings(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}



initializeData();
