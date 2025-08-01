// Carousel drag scrolling
const carousel = document.querySelector(".carousel");

if (carousel) {
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    carousel.classList.add("active");
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener("mouseleave", () => {
    isDown = false;
    carousel.classList.remove("active");
  });

  carousel.addEventListener("mouseup", () => {
    isDown = false;
    carousel.classList.remove("active");
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
}

// Handle movement button clicks
document.querySelectorAll(".movement-button").forEach(button => {
  button.addEventListener("click", () => {
    const movement = button.getAttribute("data-movement");
    if (movement) {
      window.location.href = `quiz.html?movement=${encodeURIComponent(movement)}`;
    }
  });
});
