"use strict";

// Get movement from URL
const urlParams = new URLSearchParams(window.location.search);
const movementName = urlParams.get("name");

const titleElement = document.getElementById("movement-title");
const imageElement = document.getElementById("movement-painting");
const descriptionElement = document.getElementById("movement-description");
const sourceElement = document.getElementById("movement-source");

if (!movementName) {
  titleElement.textContent = "Movement not found";
  descriptionElement.textContent = "No movement name was specified in the URL.";
} else {
  fetch(`https://painting-apik.onrender.com/movements/${movementName}`)
    .then(response => {
      if (!response.ok) throw new Error("Movement not found.");
      return response.json();
    })
    .then(data => {
      titleElement.textContent = data.name;
      descriptionElement.textContent = data.description;
      imageElement.src = data.image;
      imageElement.alt = `${data.name} artwork`;
      if (data.source) {
        sourceElement.innerHTML = `Source: <a href="${data.source}" target="_blank" rel="noopener noreferrer">${data.source}</a>`;
      }
    })
    .catch(error => {
      titleElement.textContent = "Error";
      descriptionElement.textContent = error.message;
    });
}
