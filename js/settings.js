







function loadSettings() {
    const settings = getSettings();

    document.getElementById("profileName").value = settings.profileName || "";
    document.getElementById("profileEmail").value = settings.profileEmail || "";
    document.getElementById("themeSelect").value = settings.theme || "light";

    
    applyTheme(settings.theme);
}



function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("theme-dark");
    } else {
        document.body.classList.remove("theme-dark");
    }
}


const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
    settingsForm.addEventListener("submit", function(event) {
        
        event.preventDefault();

        
        const settings = {
            profileName: document.getElementById("profileName").value.trim(),
            profileEmail: document.getElementById("profileEmail").value.trim(),
            theme: document.getElementById("themeSelect").value
        };

        
        if (!settings.profileName) {
            alert("Please enter your name.");
            return;
        }
        if (!settings.profileEmail) {
            alert("Please enter your email.");
            return;
        }

        
        saveSettings(settings);
        applyTheme(settings.theme);

        alert("Settings saved successfully!");
    });
}


loadSettings();