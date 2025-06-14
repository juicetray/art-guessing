document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  const confirmPassword = e.target['confirm-password'].value;
  const username = e.target.username ? e.target.username.value : "";

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const response = await fetch("https://painting-backend-txkz.onrender.com/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username })
  });

  const result = await response.json();
  if (!response.ok) {
    alert(result.message || "Signup failed");
    return;
  }

  alert("Signup successful! Please check your email to confirm.");
  window.location.href = "login.html";
});
