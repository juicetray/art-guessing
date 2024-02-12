currentPaintingIndex = 0;
let popularPaintings;

async function fetchArtData() {
  const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=100");
  const art = await response.json()

  popularPaintings = art.data.filter((artwork) => { 
    return !artwork.has_not_been_viewed_much && artwork.classification_title === "painting"});
  popularPaintings.forEach ((painting) =>
  {
    const artist = painting.artist_title;
    const artworkTitle = painting.title;
    const date = painting.date_display;

    console.log(`Painting: ${artworkTitle} by ${artist}, Created: ${date}`);

  })
  displayPainting(popularPaintings[currentPaintingIndex]);
}

const displayPainting = (painting) => {

  const artworkInfo = document.getElementById("artwork-info");
  artworkInfo.textContent = "";

  const artworkImage = document.getElementById("artwork-image");
  artworkImage.innerHTML = "";




  artworkInfo.textContent = `Title: ${painting.title}\n Artist: ${painting.artist_title}\nDate: ${painting.date_display}`;

  const imgDiv = document.createElement("div");
  let paintingId = painting.image_id;
  const paintingUrl = `https://www.artic.edu/iiif/2/${paintingId}/full/843,/0/default.jpg`;
  const paintingImg = document.createElement("img");
  paintingImg.src = paintingUrl;

  imgDiv.appendChild(paintingImg);
  artworkImage.appendChild(imgDiv);

  const form = document.getElementById("artForm");
  form.addEventListener("submit", handleSubmit);
}

const handleSubmit = (event) => {
  event.preventDefault();

  const guessInput = document.getElementById("name");
  const guess = guessInput.value.trim();

  const correctTitle = popularPaintings[currentPaintingIndex].title.toLowerCase();
  if (guess.toLowerCase() === correctTitle) {
    alert("correct!");
    currentPaintingIndex++;
    if(currentPaintingIndex < popularPaintings.length) {
      displayPainting(popularPaintings[currentPaintingIndex]);
    } else {
      alert("You've guessed all the paintings!");
    }
  } else {
    alert("Incorrect! Try again.");
    guessInput.value = "";
  }
}

fetchArtData();