document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch("https://api.whopaintend.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Login failed.");
    } else {
      localStorage.setItem("token", result.token);
      alert("Login successful!");
      window.location.href = "index.html";
    }
  } catch (err) {
    alert("An error occurred during login.");
  }
});
