







function loadTeam() {
    const container = document.getElementById("teamGrid");
    container.innerHTML = "";

    
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


loadTeam();