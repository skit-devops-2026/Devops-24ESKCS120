// ============================================================
// settings.js - Settings page logic
// Loads saved settings into the form and saves changes
// back to LocalStorage. Includes a simple light/dark
// theme toggle using a class on <body>.
// ============================================================

// Load saved settings into the form fields when the page opens.
function loadSettings() {
    const settings = getSettings();

    document.getElementById("profileName").value = settings.profileName || "";
    document.getElementById("profileEmail").value = settings.profileEmail || "";
    document.getElementById("themeSelect").value = settings.theme || "light";

    // Apply the saved theme to the page
    applyTheme(settings.theme);
}

// Apply the theme by adding/removing a class on <body>.
// All dark-theme styles live under ".theme-dark" in style.css.
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("theme-dark");
    } else {
        document.body.classList.remove("theme-dark");
    }
}

// Handle the settings form submission.
const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
    settingsForm.addEventListener("submit", function(event) {
        // Prevent the page from reloading
        event.preventDefault();

        // Read the form values
        const settings = {
            profileName: document.getElementById("profileName").value.trim(),
            profileEmail: document.getElementById("profileEmail").value.trim(),
            theme: document.getElementById("themeSelect").value
        };

        // Add simple validation
        if (!settings.profileName) {
            alert("Please enter your name.");
            return;
        }
        if (!settings.profileEmail) {
            alert("Please enter your email.");
            return;
        }

        // Save settings to LocalStorage and apply the theme
        saveSettings(settings);
        applyTheme(settings.theme);

        alert("Settings saved successfully!");
    });
}

// Load settings when the page opens
loadSettings();