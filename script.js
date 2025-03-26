"use strict";

// Function to toggle visibility and aria-hidden attributes
function toggleVisibility(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
  element.setAttribute("aria-hidden", !isVisible);
}

// Element selectors
const startButton = document.getElementById("start-button");
const introScreen = document.querySelector(".intro");
const quizSelection = document.querySelector(".quiz-selection");
const quizContainer = document.querySelector(".quiz-container");
const movementGrid = document.querySelectorAll(".card-item");
const movementButtons = document.querySelectorAll(".movement-button");
const hintContainer = document.querySelector(".hint-container");
const loadingScreen = document.getElementById("loading-screen");
const counterValue = document.getElementById("counter-value");
const artworkImage = document.getElementById("artwork-image");
const artworkInfo = document.getElementById("artwork-info");
const form = document.getElementById("art-form");
const hintButton = document.getElementById("hint-button");
const quitButton = document.getElementById("quit-button");
const successMessage = document.createElement("div");

successMessage.id = "success-message";
document.querySelector(".quiz-container").appendChild(successMessage);

// Global variables
let selectedMovement;
let currentPaintingIndex = 0;
let paintings = [];
let counter = 0;
let hintIndex = 0;
let hintsExhausted = false;

// Event Listeners
startButton.addEventListener("click", () => {
  toggleVisibility(introScreen, false); // Hide the intro screen
  toggleVisibility(quizSelection, true); // Show the quiz selection screen
  toggleVisibility(quizContainer, false); // Ensure the quiz remains hidden
});

movementGrid.forEach((grid) => {
  grid.addEventListener("mouseover", () => {
    const movementTitle = grid.querySelector(".movement-title");
    const movementInfo = grid.querySelector(".movement-info");
    const quizButtons = grid.getElementsByTagName("button");

    for (let i of quizButtons) {
      i.classList.remove("hidden");
    }

    if (movementTitle) movementTitle.style.display = "none";
    if (movementInfo) movementInfo.classList.remove("hidden");
  });

  grid.addEventListener("mouseout", () => {
    const movementTitle = grid.querySelector(".movement-title");
    const movementInfo = grid.querySelector(".movement-info");
    const quizButtons = grid.getElementsByTagName("button");

    for (let i of quizButtons) {
      i.classList.add("hidden");
    }

    if (movementTitle) movementTitle.style.display = "flex";
    if (movementInfo) movementInfo.classList.add("hidden");
  });
});

movementButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMovement = button.id;
    fetchArtData(selectedMovement); // Fetching painting data and starting quiz
  });
});

// Get data of paintings
async function fetchArtData(selectedMovement) {
  if (!selectedMovement) {
    alert("Please select a movement before starting the quiz.");
    return;
  }

  toggleVisibility(loadingScreen, true);

  try {
    const response = await fetch(
      `https://painting-apik.onrender.com/paintings?movement=${selectedMovement}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const art = await response.json();
    paintings = art;

    if (paintings.length > 0) {
      shuffleArray(paintings);
      currentPaintingIndex = 0;
      startQuiz();
    } else {
      alert(`No paintings found for movement: ${selectedMovement}`);
    }
  } catch (error) {
    console.error("Error fetching art data:", error);
  } finally {
    toggleVisibility(loadingScreen, false);
  }
}

// Shuffles the array of paintings to randomize
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  toggleVisibility(quizSelection, false);
  toggleVisibility(quizContainer, true);
  toggleVisibility(quitButton, true);
  displayPainting(paintings[currentPaintingIndex]);
}

function displayPainting(painting) {
  artworkInfo.textContent = "";
  artworkImage.innerHTML = "";
  toggleVisibility(loadingScreen, true);
  hintContainer.textContent = "";
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

  img.onload = () => {
    toggleVisibility(loadingScreen, false);
  };

  img.onerror = () => {
    loadingScreen.innerHTML = `<p>Failed to load the image. Please try again.</p>`;
    console.error("Error loading image");
  };

  picture.appendChild(sourceSmall);
  picture.appendChild(sourceMedium);
  picture.appendChild(img);
  artworkImage.appendChild(picture);

  form.removeEventListener("submit", handleSubmit);
  form.addEventListener("submit", handleSubmit);

  hintButton.removeEventListener("click", displayHint);
  hintButton.addEventListener("click", displayHint);
}

function handleSubmit(event) {
  event.preventDefault();
  const guessInput = document.getElementById("name").value.trim();
  const correctAnswer = paintings[currentPaintingIndex].artist;

  if (guessInput.toLowerCase() === correctAnswer.toLowerCase()) {
    successMessage.textContent = "Correct! You guessed the artist!";
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

  const currentPainting = paintings[currentPaintingIndex];
  const titleWords = currentPainting.title;

  if (hintIndex === 0) {
    const yearHint = document.createElement("p");
    yearHint.textContent = `Year: ${currentPainting.year}`;
    hintContainer.appendChild(yearHint);
  } else if (hintIndex === 1) {
    const titleHint = document.createElement("p");
    titleHint.textContent = `Title: ${titleWords}`;
    hintContainer.appendChild(titleHint);
  } else {
    const noMoreHints = document.createElement("p");
    noMoreHints.textContent = "No more hints available.";
    hintContainer.appendChild(noMoreHints);
    hintsExhausted = true;
    hintButton.disabled = true;
  }

  hintIndex++;
}

quitButton.addEventListener("click", () => {
  toggleVisibility(quizContainer, false);
  toggleVisibility(introScreen, true);
  counterValue.textContent = "0";
  successMessage.textContent = "";
  alert("You have exited the quiz.");
});
