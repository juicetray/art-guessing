async function fetchArtData() {
  const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=100");
  const art = await response.json()

  const popularPaintings = art.data.filter((artwork) => { 
    return !artwork.has_not_been_viewed_much && artwork.classification_title === "painting"});
  popularPaintings.forEach ((painting) =>
  {
    const artist = painting.artist_title;
    const artworkTitle = painting.title;
    const date = painting.date_display;

    console.log(`Painting: ${artworkTitle} by ${artist}, Created: ${date}`);

    displayPainting(painting);
  })
}

const displayPainting = (painting) => {

  const imgDiv = document.createElement("div");
  let paintingId = painting.image_id;
  const paintingUrl = `https://www.artic.edu/iiif/2/${paintingId}/full/843,/0/default.jpg`;
  const paintingImg = document.createElement("img");
  paintingImg.src = paintingUrl;

  imgDiv.appendChild(paintingImg);
  document.body.append(imgDiv);
}

fetchArtData();


  /* // script.js

async function displayArtwork() {
  const response = await fetch("https://api.artic.edu/api/v1/artworks?page=2&limit=1");
  const data = await response.json();

  // Access the first artwork in the array
  const artwork = data.data[0];

  // Access individual properties of the artwork
  const title = artwork.title;
  const artist = artwork.artist_display;
  const date = artwork.date_display;

  // Display artwork information on the page
  const artworkInfoElement = document.getElementById("artwork-info");
  artworkInfoElement.innerHTML = `
    Title: ${title}</p>
    Artist: ${artist}</p>
    Date: ${date}</p>
  `;

  // Display artwork image on the page
  const artworkImageElement = document.getElementById("artwork-img");
  artworkImageElement.src = artwork.thumbnail.lqip;
  artworkImageElement.alt = artwork.thumbnail.alt_text;
}

// Call the function to display the artwork when the page loads
displayArtwork();
 */