// ============================================================
// team.js - Team page logic
// Displays the hardcoded sample team members as cards.
// This is a frontend-only demo, so there is no real
// authentication or user accounts.
// ============================================================

// Render all team members as cards.
function loadTeam() {
    const container = document.getElementById("teamGrid");
    container.innerHTML = "";

    // Loop through each member and create a card
    defaultTeam.forEach(function(member) {
        const card = document.createElement("div");
        card.className = "team-card";
        card.innerHTML =
            '<div class="team-avatar">' + member.initial + '</div>' +
            '<h3>' + member.name + '</h3>' +
            '<div class="team-role">' + member.role + '</div>' +
            '<div class="team-email">' + member.email + '</div>';

        container.appendChild(card);
    });
}

// Load the team when the page opens
loadTeam();