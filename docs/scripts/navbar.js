// Mobile hamburger toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// Token-based user greeting and sign-out logic
const token = localStorage.getItem("token");

if (token) {
  fetch("https://painting-backend-txkz.onrender.com/profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok) {
        console.error("Failed to fetch profile:", data.message);
        return;
      }

      const username = data.user.email.split("@")[0];
      const welcomeMessage = document.getElementById("welcome-message");
      if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${username}`;
      }

      const loginButton = document.getElementById("login-button");
      if (loginButton) loginButton.style.display = "none";

      const signupButton = document.getElementById("signup-button");
      if (signupButton) {
        signupButton.textContent = "Sign Out";
        signupButton.href = "#";
        signupButton.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.href = "index.html";
        });
      }

      const heroSignInButton = document.getElementById("hero-sign-in-button");
      if (heroSignInButton) {
        heroSignInButton.textContent = "Sign Out";
        heroSignInButton.href = "#";
        heroSignInButton.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.href = "index.html";
        });
      }
    })
    .catch(err => console.error("Error fetching user data:", err));
}
