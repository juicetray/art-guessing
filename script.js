"use strict";

// Element selectors
const startButton = document.getElementById("start-button");
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

// Event Listeners
startButton.addEventListener("click", () => {
  document.querySelector(".intro").style.display = "none";
  document.querySelector(".quiz-selection").style.display = "flex";
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

  loadingScreen.style.display = "block";

  try {
    const response = await fetch(`https://painting-apik.onrender.com/paintings?movement=${selectedMovement}`);
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
    loadingScreen.style.display = "none";
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
  document.querySelector(".quiz-selection").style.display = "none";
  document.querySelector(".quiz-container").style.display = "block";
  quitButton.classList.remove("hidden");
  displayPainting(paintings[currentPaintingIndex]);
}

function displayPainting(painting) {
  // Reset artwork container and loading state
  artworkInfo.textContent = "";
  artworkImage.innerHTML = "";
  loadingScreen.style.display = "block"; // Show loading text

  // <picture> element for responsive images
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

  // Hiding the loading text after the paintings have loaded
  img.onload = () => {
    loadingScreen.style.display = "none";
  };

  // Catch error for paintings failing to load
  img.onerror = () => {
    loadingScreen.innerHTML = `<p>Failed to load the image. Please try again.</p>`;
    console.error("Error loading image");
  };

  // Append sources and image to the picture element
  picture.appendChild(sourceSmall);
  picture.appendChild(sourceMedium);
  picture.appendChild(img);

  // Append the picture to the artwork container
  artworkImage.appendChild(picture);

  // Event listeners for form submission & hint button
  form.removeEventListener("submit", handleSubmit);
  form.addEventListener("submit", handleSubmit);

  hintButton.removeEventListener("click", displayHint);
  hintButton.addEventListener("click", displayHint);
}

// Submission handler
function handleSubmit(event) {
  event.preventDefault();
  const guessInput = document.getElementById("name").value.trim();
  const correctTitle = paintings[currentPaintingIndex].title;

  if (guessInput.toLowerCase() === correctTitle.toLowerCase()) {
    successMessage.textContent = "Correct! You guessed the painting!";
    counterValue.textContent = ++counter;

    if (++currentPaintingIndex < paintings.length) {
      displayPainting(paintings[currentPaintingIndex]);
    } else {
      successMessage.textContent = "You've guessed all the paintings!";
    }
  } else {
    successMessage.textContent = "Incorrect! Try again.";
  }
}

// Hint function
function displayHint() {
  const currentPainting = paintings[currentPaintingIndex];
  hintContainer.textContent = currentPainting.hint || "No hint available.";
}

quitButton.addEventListener("click", () => {
  // Hide the quiz container and reset the UI to the introduction screen
  document.querySelector(".quiz-container").style.display = "none";
  document.querySelector(".intro").style.display = "block";
  counterValue.textContent = "0"; // Reset the counter
  alert("You have exited the quiz.");
});
