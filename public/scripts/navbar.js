window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("https://api.whopainted.com/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { user } = await res.json();

    if (user?.username) {
      const welcomeMessage = document.getElementById("welcome-message");
      if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${user.username}`;
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
    console.error("Failed to load user profile", err);
  }
});
