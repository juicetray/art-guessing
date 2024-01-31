let currentPaintingIndex = 0;
let artData = null; // Variable to store fetched art data

async function fetchArtData() {
    const response = await fetch("https://api.artic.edu/api/v1/artworks?limit=100");
    return await response.json();
}

function filterPaintings(art) {
    return art.data.filter(artwork => artwork.artwork_type_title === "Painting");
}

function getCurrentPainting() {
    if (!artData) {
        console.log("Art data not fetched yet.");
        return {};
    }

    const paintings = filterPaintings(artData);

    if (paintings.length === 0 || currentPaintingIndex >= paintings.length) {
        console.log("No more paintings found.");
        return {};
    }

    return paintings[currentPaintingIndex];
}

function displayPainting(index) {
    if (!artData) {
        console.log("Art data not fetched yet.");
        return;
    }

    const paintings = filterPaintings(artData);

    if (paintings.length === 0 || index >= paintings.length) {
        console.log("No more paintings found.");
        return;
    }

    const currentPainting = paintings[index];
    const title = currentPainting.title;
    const artist = currentPainting.artist_display;
    const date = currentPainting.date_display;
    const artId = currentPainting.image_id;
    const artUrl = `https://www.artic.edu/iiif/2/${artId}/full/843,/0/default.jpg`;

    const imageElement = document.createElement("img");
    imageElement.src = artUrl;
    imageElement.alt = `${title} by ${artist}`;

    const artworkImageDiv = document.getElementById("artwork-image");
    artworkImageDiv.innerText = "";
    artworkImageDiv.appendChild(imageElement);

    const infoDiv = document.createElement("div");
    infoDiv.innerText = `
        Title: ${title}
        Artist: ${artist}
        Date: ${date}
    `;

    const artworkInfoDiv = document.getElementById("artwork-info");
    artworkInfoDiv.innerText = "";
    artworkInfoDiv.appendChild(infoDiv);

    console.log(`Title: ${title}, Artist: ${artist}, Date: ${date}, Image URL: ${artUrl}`);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById("name").value;
    const currentPainting = await getCurrentPainting();
    const currentTitle = currentPainting.title;

    if (userInput.toLowerCase() === currentTitle.toLowerCase()) {
        alert("Correct guess!");
        currentPaintingIndex++;
        displayPainting(currentPaintingIndex);
    } else {
        alert("Incorrect guess. Try again!");
    }
}

const artForm = document.getElementById("artForm");
artForm.addEventListener("submit", handleFormSubmit);

// Fetch art data and display the first painting on page load
fetchArtData()
    .then(data => {
        artData = data;
        displayPainting(currentPaintingIndex);
    })
    .catch(error => console.error("Error fetching art data:", error));



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