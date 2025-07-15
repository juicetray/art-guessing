"use strict";

const quizContainer = document.querySelector(".quiz-container");
const loadingScreen = document.getElementById("loading-screen");
const artworkImage = document.getElementById("artwork-image");
const artworkInfo = document.getElementById("artwork-info");
const choicesContainer = document.getElementById("choices-container");
const hintContainer = document.querySelector(".hint-container");
const hintButton = document.getElementById("hint-button");
const quitButton = document.getElementById("quit-button");
const counterValue = document.getElementById("counter-value");

let paintings = [];
let allPaintings = [];
let currentPaintingIndex = 0;
let counter = 0;
let hintIndex = 0;
let hintsExhausted = false;
let lives = 2;
let quizResults = [];

function toggleVisibility(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
  element.setAttribute("aria-hidden", !isVisible);
}

const quizToken = localStorage.getItem("token");

async function fetchAllPaintings() {
  try {
    const response = await fetch("https://painting-apik.onrender.com/paintings/all");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    allPaintings = await response.json();
  } catch (error) {
    const err = document.createElement("p");
    err.textContent = "Failed to load all paintings.";
    err.classList.add("incorrect");
    hintContainer.appendChild(err);
  }
}

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
    const response = await fetch(`https://painting-apik.onrender.com/paintings?movement=${selectedMovement}`);
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
    const err = document.createElement("p");
    err.textContent = "Error loading paintings.";
    err.classList.add("incorrect");
    hintContainer.appendChild(err);
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
  lives = 2;

  const picture = document.createElement("picture");

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

  const currentGuesses = [];

  allOptions.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => handleChoice(option, correctTitle, currentGuesses));
    choicesContainer.appendChild(button);
  });
}

function handleChoice(selectedOption, correctTitle, currentGuesses) {
  const existingFeedback = hintContainer.querySelector(".feedback");
  if (existingFeedback) existingFeedback.remove();

  const feedback = document.createElement("p");
  feedback.classList.add("feedback");

  currentGuesses.push(selectedOption);

  const isCorrect = selectedOption === correctTitle;

  if (isCorrect) {
    counter++;
    counterValue.textContent = counter;
    quizResults.push({
      title: paintings[currentPaintingIndex].title,
      correct: true,
      guesses: [selectedOption],
      correctAnswer: correctTitle
    });
    nextPainting();
  } else {
    lives--;

    if (lives > 0) {
      feedback.textContent = `❌ Incorrect! ${lives} ${lives === 1 ? "life" : "lives"} left.`;
      feedback.classList.add("incorrect");
      hintContainer.appendChild(feedback);
      setTimeout(() => feedback.remove(), 2000);
    } else {
      quizResults.push({
        title: paintings[currentPaintingIndex].title,
        correct: false,
        guesses: [...currentGuesses],
        correctAnswer: correctTitle
      });
      feedback.textContent = `❌ Out of lives! Moving on...`;
      feedback.classList.add("incorrect");
      hintContainer.appendChild(feedback);
      setTimeout(() => {
        feedback.remove();
        nextPainting();
      }, 1500);
    }
  }
}

function nextPainting() {
  if (++currentPaintingIndex < paintings.length) {
    displayPainting(paintings[currentPaintingIndex]);
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  await saveScore();
  localStorage.setItem("quizResults", JSON.stringify(quizResults));
  window.location.href = "quiz-results.html";
}

hintButton.addEventListener("click", displayHint);

function displayHint() {
  const painting = paintings[currentPaintingIndex];
  toggleVisibility(artworkInfo, true);

  if (hintsExhausted) return;

  const p = document.createElement("p");

  if (hintIndex === 0) {
    p.innerHTML = `<strong>Date:</strong> ${painting.year}`;
  } else if (hintIndex === 1) {
    p.innerHTML = `<strong>Artist:</strong> ${painting.artist}`;
    hintsExhausted = true;
    hintButton.disabled = true;
  }

  hintContainer.appendChild(p);
  hintIndex++;
}

quitButton.addEventListener("click", () => {
  toggleVisibility(quizContainer, false);
  counterValue.textContent = "0";

  const quitMsg = document.createElement("p");
  quitMsg.textContent = "🚪 You have exited the quiz.";
  quitMsg.classList.add("exit");
  hintContainer.innerHTML = "";
  hintContainer.appendChild(quitMsg);

  setTimeout(() => {
    window.location.href = "quiz-selection.html";
  }, 1500);
});

async function saveScore() {
  if (!quizToken) return;

  try {
    const response = await fetch("https://painting-backend-txkz.onrender.com/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${quizToken}`
      },
      body: JSON.stringify({
        score: counter,
        movement: selectedMovement
      })
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(result.message || "Error saving score.");
    }
  } catch (error) {
    console.error("❌ Failed to connect to the server.");
  }
}
