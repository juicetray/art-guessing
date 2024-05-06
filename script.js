"use strict";

let currentPaintingIndex = 0;
let popularPaintings;
const hintContainer = document.querySelector(".hint-container");
const loadingScreen = document.getElementById("loading-screen");
const hintButton = document.getElementById("hint-button");
const artworkInfo = document.getElementById("artwork-info");
const artworkImage = document.getElementById("artwork-image");
const form = document.getElementById("art-form");

async function fetchArtData() {
  loadingScreen.style.display = "block";
  const response = await fetch("https://painting-apik.onrender.com/paintings");
  const art = await response.json();

  console.log(art); // Check the structure of the API response

  popularPaintings = art;

  displayPainting(popularPaintings[currentPaintingIndex]);
}

const displayPainting = (painting) => {
  artworkInfo.textContent = "";
  artworkImage.innerHTML = "";

  const imgDiv = document.createElement("div");
  const paintingUrl = painting.imageUrl;
  const paintingImg = document.createElement("img");
  paintingImg.src = paintingUrl;

  paintingImg.onload = () => {
    loadingScreen.style.display = "none";
  };

  imgDiv.appendChild(paintingImg);
  artworkImage.appendChild(imgDiv);

  form.removeEventListener("submit", handleSubmit); // Remove previous listener
  form.addEventListener("submit", handleSubmit); // Add event listener

  hintButton.removeEventListener("click", displayHint); // Remove previous listener
  hintButton.addEventListener("click", displayHint); // Add event listener
};

const handleSubmit = (event) => {
  event.preventDefault();

  const guessInput = document.getElementById("name");
  const guess = guessInput.value.trim();

  const correctTitle = popularPaintings[currentPaintingIndex].title;
  if (guess.toLowerCase() === correctTitle.toLowerCase()) {
    alert("Correct!");
    currentPaintingIndex++;
    if (currentPaintingIndex < popularPaintings.length) {
      displayPainting(popularPaintings[currentPaintingIndex]);
    } else {
      alert("You've guessed all the paintings!");
    }
  } else {
    alert("Incorrect! Try again.");
    guessInput.value = "";
  }
};

const displayHint = () => {
  const painting = popularPaintings[currentPaintingIndex];
  const artistSpan = document.createElement("span");
  artistSpan.textContent = `Artist: ${painting.artist}`;
  hintContainer.appendChild(artistSpan);

  const yearSpan = document.createElement("span");
  yearSpan.textContent = `Year: ${painting.year}`;
  hintContainer.appendChild(yearSpan);

  hintButton.disabled = true;
};

fetchArtData();
