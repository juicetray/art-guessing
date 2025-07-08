async function loadLeaderboard() {
    try {
        const response = await fetch("https://painting-backend-txkz.onrender.com/scores/leaderboard");

        const { leaderboard } = await response.json();

        const leaderboardDiv = document.getElementById("leaderboard");

        leaderboard.forEach(({ score, movement, users }) => {
        const row = document.createElement("div");
        row.className = "score-entry";
        row.textContent = `${users.username} - ${movement}: ${score}`;
        leaderboardDiv.appendChild(row);
    });
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
    }
}

loadLeaderboard();
