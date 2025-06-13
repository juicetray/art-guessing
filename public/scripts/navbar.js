window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("https://painting-backend-txkz.onrender.com/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch profile:", result.message);
      return;
    }

    const username = result.user.email.split("@")[0]; // fallback

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
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
});
