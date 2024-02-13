let currentPaintingIndex = 0;
let currentHintIndex = 0;
let popularPaintings;
const hintContainer = document.querySelector(".hint-container");

async function fetchArtData() {
  const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=100");
  const art = await response.json();

  popularPaintings = art.data.filter((artwork) => { 
    return !artwork.has_not_been_viewed_much && artwork.classification_title === "painting";
  });

  popularPaintings.forEach((painting) => {
    const artist = painting.artist_title;
    const artworkTitle = painting.title;
    const date = painting.date_display;
    console.log(`Painting: ${artworkTitle} by ${artist}, Created: ${date}`);
  });

  displayPainting(popularPaintings[currentPaintingIndex]);
}

const displayPainting = (painting) => {
  const artworkInfo = document.getElementById("artwork-info");
  artworkInfo.textContent = "";

  const artworkImage = document.getElementById("artwork-image");
  artworkImage.innerHTML = "";

  const imgDiv = document.createElement("div");
  let paintingId = painting.image_id;
  const paintingUrl = `https://www.artic.edu/iiif/2/${paintingId}/full/843,/0/default.jpg`;
  const paintingImg = document.createElement("img");
  paintingImg.src = paintingUrl;

  imgDiv.appendChild(paintingImg);
  artworkImage.appendChild(imgDiv);

  const form = document.getElementById("artForm");
  form.addEventListener("submit", handleSubmit);

  const hintButton = document.getElementById("hintButton");
  hintButton.addEventListener("click", displayHint);
};

const handleSubmit = (event) => {
  event.preventDefault();

  const guessInput = document.getElementById("name");
  const guess = guessInput.value.trim();

  const correctTitle = popularPaintings[currentPaintingIndex].title.toLowerCase();
  if (guess.toLowerCase() === correctTitle) {
    alert("Correct!");
    currentPaintingIndex++;
    currentHintIndex = 0;
    hintContainer.textContent = "";
    if(currentPaintingIndex < popularPaintings.length) {
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
  if (currentHintIndex < 2) {
    const painting = popularPaintings[currentPaintingIndex];
    if (currentHintIndex === 0) {
        const artistSpan = document.createElement("span");
      artistSpan.textContent = `Artist: ${painting.artist_title}`;
      hintContainer.appendChild(artistSpan)
    } else {
        const dateSpan = document.createElement("span");
        dateSpan.textContent = `Date: ${painting.date_display}`;
        hintContainer.appendChild(dateSpan);
    }
    currentHintIndex++;
  } else {
    alert("No more hints available!");
  }
};

fetchArtData();
