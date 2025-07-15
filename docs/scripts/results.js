"use strict";

const summaryContainer = document.getElementById("summary-container");
const results = JSON.parse(localStorage.getItem("quizResults"));

if (!results || results.length === 0) {
  summaryContainer.innerHTML = "<p>No results to display.</p>";
} else {
  results.forEach((entry, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("result-entry");

    const statusIcon = entry.correct ? "✅" : "❌";

    const guessText = entry.guesses && entry.guesses.length > 0
      ? `<strong>Your ${entry.guesses.length > 1 ? "Answers" : "Answer"}:</strong> ${entry.guesses.join(", ")}`
      : `<strong>Your Answer:</strong> Skipped`;

    entryDiv.innerHTML = `
      <p><strong>Painting ${index + 1}</strong> ${statusIcon}</p>
      <p><strong>Title:</strong> ${entry.title}</p>
      <p>${guessText}</p>
    `;

    summaryContainer.appendChild(entryDiv);
  });
}

