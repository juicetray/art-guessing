"use strict";

const urlParams = new URLSearchParams(window.location.search);
const selectedMovement = urlParams.get("movement");

if (!selectedMovement) {
  alert("No movement selected.");
  window.location.href = "quiz-selection.html";
}

// Element selectors
const loadingScreen = document.getElementById("loading-screen");
const quizContainer = document.querySelector(".quiz-container");
const artworkImage = document.getElementById("artwork-image");
const artworkInfo = document.getElementById("artwork-info");
const hintContainer = document.querySelector(".hint-container");
const form = document.getElementById("art-form");
const hintButton = document.getElementById("hint-button");
const quitButton = document.getElementById("quit-button");
const counterValue = document.getElementById("counter-value");
const successMessage = document.createElement("div");
successMessage.id = "success-message";
quizContainer.appendChild(successMessage);

let paintings = [];
let currentPaintingIndex = 0;
let counter = 0;
let hintIndex = 0;
let hintsExhausted = false;

// Fetch paintings
fetchArtData(selectedMovement);

async function fetchArtData(movement) {
  toggleVisibility(loadingScreen, true);

  try {
    const response = await fetch(
      `https://painting-apik.onrender.com/paintings?movement=${movement}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    paintings = await response.json();

    if (paintings.length > 0) {
      shuffleArray(paintings);
      currentPaintingIndex = 0;
      startQuiz();
    } else {
      alert(`No paintings found for movement: ${movement}`);
      window.location.href = "quiz-selection.html";
    }
  } catch (error) {
    console.error("Error fetching art data:", error);
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
  toggleVisibility(quizContainer, true);
  displayPainting(paintings[currentPaintingIndex]);
}

function displayPainting(painting) {
  artworkInfo.textContent = "";
  artworkImage.innerHTML = "";
  hintContainer.textContent = "";
  hintIndex = 0;
  hintsExhausted = false;
  hintButton.disabled = false;

  const img = document.createElement("img");
  img.src = painting.images.large;
  img.alt = painting.alt;
  img.onload = () => toggleVisibility(loadingScreen, false);
  img.onerror = () => {
    loadingScreen.textContent = "Failed to load image.";
    console.error("Image loading error");
  };

  artworkImage.appendChild(img);

  form.removeEventListener("submit", handleSubmit);
  form.addEventListener("submit", handleSubmit);

  hintButton.removeEventListener("click", displayHint);
  hintButton.addEventListener("click", displayHint);
}

function handleSubmit(e) {
  e.preventDefault();
  const guess = document.getElementById("name").value.trim();
  const correct = paintings[currentPaintingIndex].artist;

  if (guess.toLowerCase() === correct.toLowerCase()) {
    successMessage.textContent = "Correct!";
    counterValue.textContent = ++counter;

    if (++currentPaintingIndex < paintings.length) {
      displayPainting(paintings[currentPaintingIndex]);
    } else {
      successMessage.textContent = "You've guessed all the artists!";
    }
  } else {
    successMessage.textContent = "Incorrect! Try again.";
  }
}

function displayHint() {
  if (hintsExhausted) return;

  const painting = paintings[currentPaintingIndex];
  if (hintIndex === 0) {
    const year = document.createElement("p");
    year.textContent = `Year: ${painting.year}`;
    hintContainer.appendChild(year);
  } else if (hintIndex === 1) {
    const title = document.createElement("p");
    title.textContent = `Title: ${painting.title}`;
    hintContainer.appendChild(title);
  } else {
    const noMore = document.createElement("p");
    noMore.textContent = "No more hints available.";
    hintContainer.appendChild(noMore);
    hintsExhausted = true;
    hintButton.disabled = true;
  }
  hintIndex++;
}

function toggleVisibility(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
  element.setAttribute("aria-hidden", !isVisible);
}

quitButton.addEventListener("click", () => {
  toggleVisibility(quizContainer, false);
  alert("You have exited the quiz.");
  window.location.href = "quiz-selection.html";
});
