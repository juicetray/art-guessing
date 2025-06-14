"use strict";

// Element selectors
const quizContainer = document.querySelector(".quiz-container");
const loadingScreen = document.getElementById("loading-screen");
const artworkImage = document.getElementById("artwork-image");
const artworkInfo = document.getElementById("artwork-info");
const choicesContainer = document.getElementById("choices-container");
const hintContainer = document.querySelector(".hint-container");
const hintButton = document.getElementById("hint-button");
const quitButton = document.getElementById("quit-button");
const counterValue = document.getElementById("counter-value");
const statusEl = document.getElementById("status-message");

// Global variables
let paintings = [];
let allPaintings = [];
let currentPaintingIndex = 0;
let counter = 0;
let hintIndex = 0;
let hintsExhausted = false;

// Toggle visibility utility
function toggleVisibility(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
  element.setAttribute("aria-hidden", !isVisible);
}

// Get token
const token = localStorage.getItem("token");

// Fetch all paintings
async function fetchAllPaintings() {
  try {
    const response = await fetch(`https://painting-apik.onrender.com/paintings/all`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    allPaintings = await response.json();
  } catch (error) {
    statusEl.textContent = "Failed to load all paintings.";
  }
}

// Get selected movement from URL
const urlParams = new URLSearchParams(window.location.search);
const selectedMovement = urlParams.get("movement");

if (!selectedMovement) {
  alert("No movement selected.");
  window.location.href = "quiz-selection.html";
} else {
  initializeQuiz(selectedMovement);
}

async function initializeQuiz(selectedMovement) {
  toggleVisibility(quizContainer, true);
  toggleVisibility(loadingScreen, true);

  try {
    await fetchAllPaintings();
    const response = await fetch(
      `https://painting-apik.onrender.com/paintings?movement=${selectedMovement}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    paintings = await response.json();

    if (paintings.length > 0) {
      shuffleArray(paintings);
      currentPaintingIndex = 0;
      startQuiz();
    } else {
      alert(`No paintings found for movement: ${selectedMovement}`);
      window.location.href = "quiz-selection.html";
    }
  } catch (error) {
    statusEl.textContent = "Error loading paintings.";
  } finally {
    toggleVisibility(loadingScreen, false);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  toggleVisibility(loadingScreen, false);
  displayPainting(paintings[currentPaintingIndex]);
}

function displayPainting(painting) {
  artworkImage.innerHTML = "";
  choicesContainer.innerHTML = "";
  hintContainer.innerHTML = "";
  hintIndex = 0;
  hintsExhausted = false;
  hintButton.disabled = false;

  const picture = document.createElement("picture");
  picture.style.width = "100%";
  picture.style.height = "100%";

  const sourceSmall = document.createElement("source");
  sourceSmall.srcset = painting.images.small;
  sourceSmall.media = "(max-width: 480px)";

  const sourceMedium = document.createElement("source");
  sourceMedium.srcset = painting.images.medium;
  sourceMedium.media = "(max-width: 800px)";

  const img = document.createElement("img");
  img.src = painting.images.large;
  img.alt = painting.alt;

  img.onload = () => toggleVisibility(loadingScreen, false);
  img.onerror = () => {
    loadingScreen.innerHTML = `<p>Failed to load the image. Please try again.</p>`;
  };

  picture.appendChild(sourceSmall);
  picture.appendChild(sourceMedium);
  picture.appendChild(img);
  artworkImage.appendChild(picture);

  const correctTitle = painting.title;
  const wrongOptions = allPaintings
    .filter(p => p.title !== correctTitle)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(p => p.title);

  const allOptions = [...wrongOptions, correctTitle];
  shuffleArray(allOptions);

  allOptions.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => handleChoice(option, correctTitle));
    choicesContainer.appendChild(button);
  });
}

async function handleChoice(selectedOption, correctTitle) {
  if (selectedOption === correctTitle) {
    counter++;
    counterValue.textContent = counter;

    if (++currentPaintingIndex < paintings.length) {
      displayPainting(paintings[currentPaintingIndex]);
    } else {
      statusEl.textContent = "🎉 Quiz completed! Saving score...";
      await saveScore();
      statusEl.textContent = "✅ Score saved! Returning to menu...";
      setTimeout(() => {
        window.location.href = "quiz-selection.html";
      }, 2000);
    }
  } else {
    statusEl.textContent = "❌ Incorrect! Try again.";
  }
}

hintButton.addEventListener("click", displayHint);

function displayHint() {
  const painting = paintings[currentPaintingIndex];
  toggleVisibility(artworkInfo, true);

  if (hintsExhausted) return;

  if (hintIndex === 0) {
    const dateP = document.createElement("p");
    dateP.innerHTML = `<strong>Date:</strong> ${painting.year}`;
    hintContainer.appendChild(dateP);
  } else if (hintIndex === 1) {
    const artistP = document.createElement("p");
    artistP.innerHTML = `<strong>Artist:</strong> ${painting.artist}`;
    hintContainer.appendChild(artistP);
    hintsExhausted = true;
    hintButton.disabled = true;
  }

  hintIndex++;
}

quitButton.addEventListener("click", () => {
  toggleVisibility(quizContainer, false);
  counterValue.textContent = "0";
  statusEl.textContent = "🚪 You have exited the quiz.";
  setTimeout(() => {
    window.location.href = "quiz-selection.html";
  }, 1500);
});

async function saveScore() {
  if (!token) {
    statusEl.textContent = "⚠️ Not logged in.";
    return;
  }

  try {
    const response = await fetch("https://painting-backend-txkz.onrender.com/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        score: counter,
        movement: selectedMovement
      })
    });

    const result = await response.json();

    if (!response.ok) {
      statusEl.textContent = `⚠️ ${result.message || "Error saving score."}`;
    } else {
      statusEl.textContent = "✅ Score saved successfully!";
    }
  } catch (error) {
    statusEl.textContent = "❌ Failed to connect to the server.";
  }
}







