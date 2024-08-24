"use strict";

document.getElementById("start-button").addEventListener("click", function () {
  document.querySelector(".intro").style.display = "none";
  document.querySelector(".quiz-container").style.display = "flex";
});

let currentPaintingIndex = 0;
let popularPaintings;
let counter = 0;

const hintContainer = document.querySelector(".hint-container");
const loadingScreen = document.getElementById("loading-screen");
const hintButton = document.getElementById("hint-button");
const artworkInfo = document.getElementById("artwork-info");
const artworkImage = document.getElementById("artwork-image");
const counterValue = document.getElementById("counter-value");
const form = document.getElementById("art-form");

const successMessage = document.createElement("div");
successMessage.id = "success-message";
document.querySelector(".quiz-container").appendChild(successMessage);

async function fetchArtData() {
  loadingScreen.style.display = "block";
  const response = await fetch("https://painting-apik.onrender.com/paintings");
  const art = await response.json();

  popularPaintings = art;
  shuffleArray(popularPaintings);

  displayPainting(popularPaintings[currentPaintingIndex]);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const displayPainting = (painting) => {
  artworkInfo.textContent = "";
  artworkImage.innerHTML = "";

  const imgDiv = document.createElement("div");
  const paintingImg = document.createElement("img");

  paintingImg.src = painting.imageUrl;
  paintingImg.alt = painting.alt;

  // When the image loads, determine its orientation
  paintingImg.onload = () => {
    loadingScreen.style.display = "none";

    // Check orientation: landscape or portrait
    if (paintingImg.naturalWidth > paintingImg.naturalHeight) {
      imgDiv.classList.add("landscape");
    } else {
      imgDiv.classList.add("portrait");
    }
  };

  imgDiv.appendChild(paintingImg);
  artworkImage.appendChild(imgDiv);

  form.removeEventListener("submit", handleSubmit);
  form.addEventListener("submit", handleSubmit);

  hintButton.removeEventListener("click", displayHint);
  hintButton.addEventListener("click", displayHint);
};

const handleSubmit = (event) => {
  event.preventDefault();

  const guessInput = document.getElementById("name");
  const guess = guessInput.value.trim();

  const correctTitle = popularPaintings[currentPaintingIndex].title;
  if (guess.toLowerCase() === correctTitle.toLowerCase()) {
    successMessage.textContent = "Correct! You guessed the painting!";
    currentPaintingIndex++;
    counter++;
    counterValue.textContent = counter;
    if (currentPaintingIndex < popularPaintings.length) {
      displayPainting(popularPaintings[currentPaintingIndex]);
    } else {
      successMessage.textContent = "You've guessed all the paintings!";
    }

    hintButton.textContent = "Get Hint";
    hintButton.disabled = false;
    hintContainer.innerHTML = "";
  } else {
    successMessage.textContent = "Incorrect! Try again.";
    guessInput.value = "";
  }
};

const displayHint = () => {
  const painting = popularPaintings[currentPaintingIndex];
  if (hintContainer.children.length >= 2) {
    hintButton.textContent = "No more hints";
    hintButton.disabled = true;
  } else {
    const artistSpan = document.createElement("span");
    artistSpan.textContent = `Artist: ${painting.artist}`;
    hintContainer.appendChild(artistSpan);

    const yearSpan = document.createElement("span");
    yearSpan.textContent = `Year: ${painting.year}`;
    hintContainer.appendChild(yearSpan);
  }
};

fetchArtData();
