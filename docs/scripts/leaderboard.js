
async function loadLeaderboard() {
    try {
        const response = await fetch("https://painting-backend-txkz.onrender.com/scores/leaderboard");

        const { leaderboard } = await response.json();
        console.log("Leaderboard data:", leaderboard);



        const leaderboardDiv = document.getElementById("leaderboard");

        const groupedByMovement = leaderboard.reduce((acc, entry) => {
            const { movement } = entry;
            if (!acc[movement]) {
                acc[movement] = [];
            }
            acc[movement].push(entry);
            return acc;
        }, {});

        Object.entries(groupedByMovement).forEach(([movement, entries]) => {

            const { topEntries } = entries.reduce((acc, entry) => {
                if (entry.score > acc.maxScore) {
                    acc.maxScore = entry.score;
                    acc.topEntries = [entry];
                } else if (entry.score === acc.maxScore) {
                    acc.topEntries.push(entry);
                }
                return acc;
            }, { maxScore: -Infinity, topEntries: [] });

            console.log(topEntries);

            const section = document.createElement("div");
            section.className = "movement-section";

            const title = document.createElement("h2");
            title.textContent = movement.charAt(0).toUpperCase() + movement.slice(1);
            title.className = "movement-title";

            section.appendChild(title);

            topEntries.sort((a, b) => {
                const nameA = a.users.username.toLowerCase();
                const nameB = b.users.username.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            topEntries.forEach(({ score, users }, index) => {
                const row = document.createElement("div");
                row.className = "score-entry";

                const rank = index + 1;
                const trophy = rank === 1 ? "🏆 " : "";
                row.textContent = `${trophy}#${rank} - ${users.username} : ${score}`;

                section.appendChild(row);
            })

            leaderboardDiv.appendChild(section);
        });
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
    }
}

loadLeaderboard();