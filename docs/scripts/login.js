document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  const response = await fetch("https://painting-backend-txkz.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  if (!response.ok) {
    alert(result.message || "Login failed");
    return;
  }

  localStorage.setItem("token", result.session.access_token);
  alert("Login successful!");
  window.location.href = "index.html";
})