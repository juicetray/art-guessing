async function loadLeaderboard() {
    try {
        const response = await fetch("https://painting-backend-txkz.onrender.com/scores/leaderboard");
        const { leaderboard } = await response.json();

        const leaderboardDiv = document.getElementById("leaderboard");

        // Group entries by movement
        const groupedByMovement = leaderboard.reduce((acc, entry) => {
            const { movement } = entry;
            if (!acc[movement]) {
                acc[movement] = [];
            }
            acc[movement].push(entry);
            return acc;
        }, {});

        Object.entries(groupedByMovement).forEach(([movement, entries]) => {
            const section = document.createElement("div");
            section.className = "movement-section";

            const title = document.createElement("h2");
            title.textContent = movement.charAt(0).toUpperCase() + movement.slice(1);
            title.className = "movement-title";
            section.appendChild(title);

            // Sort by score descending and take the top 5 scores
            const sortedEntries = entries
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            const topScore = sortedEntries[0]?.score;

            // Sort identical scores alphabetically
            sortedEntries.sort((a, b) => {
                if (a.score === b.score) {
                    return a.users.username.localeCompare(b.users.username);
                }
                return b.score - a.score;
            });

            sortedEntries.forEach(({ score, users }, index) => {
                const row = document.createElement("div");
                row.className = "score-entry";

                const rank = index + 1;
                const trophy = score === topScore ? "🏆 " : "";
                row.textContent = `${trophy}#${rank} - ${users.username} : ${score}`;

                section.appendChild(row);
            });

            leaderboardDiv.appendChild(section);
        });
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
    }
}

loadLeaderboard();
