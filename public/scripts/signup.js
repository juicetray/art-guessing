document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  const confirmPassword = e.target["confirm-password"].value;
  const username = e.target.username.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch("https://api.whopainted.com/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username })
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Signup failed.");
    } else {
      alert("Signup successful! Check your email to confirm.");
      window.location.href = "login.html";
    }
  } catch (err) {
    alert("An error occurred during signup.");
  }
});
