async function loadLeaderboard() {
    try {
        const response = await fetch("https://painting-backend-txkz.onrender.com/scores/leaderboard");

        const { scores } = await response.json();

        const leaderboard = document.getElementById("leaderboard");

        scores.forEach(({ score, movement, users }) => {
            const row = document.createElement("div");
            row.className = "score-entry";
            row.textContent = `${users.username} - ${movement}: ${score}`;
            leaderboard.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
    }
}

loadLeaderboard();
