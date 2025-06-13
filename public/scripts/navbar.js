const supabaseClient = supabase.createClient(
  "https://jbsfmlvkokplvtyqlcxj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2ZtbHZrb2twbHZ0eXFsY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzk1NjAsImV4cCI6MjA2NDkxNTU2MH0.vYrZCYcud3-yUE2sI32lVR-Ev6gjp5PDFU59dFzSUUI"
);

window.addEventListener("DOMContentLoaded", async () => {
  const { data: { session }, error } = await supabaseClient.auth.getSession();

  if (session) {
    const userId = session.user.id;
    const { data: userProfile, error: userError } = await supabaseClient
      .from("users")
      .select("username")
      .eq("user_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching username:", userError.message);
    } else if (userProfile && userProfile.username) {
      // Navbar welcome message
      const welcomeMessage = document.getElementById("welcome-message");
      if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${userProfile.username}`;
      }

      // Hide login button
      const loginButton = document.getElementById("login-button");
      if (loginButton) {
        loginButton.style.display = "none";
      }

      // Change signup button to sign out
      const signupButton = document.getElementById("signup-button");
      if (signupButton) {
        signupButton.textContent = "Sign Out";
        signupButton.href = "#";
        signupButton.addEventListener("click", async (e) => {
          e.preventDefault();
          const { error } = await supabaseClient.auth.signOut();
          if (error) {
            console.error("Error signing out:", error.message);
          } else {
            window.location.href = "index.html";
          }
        });
      }

      // Change hero sign-in button to sign out
      const heroSignInButton = document.getElementById("hero-sign-in-button");
      if (heroSignInButton) {
        heroSignInButton.textContent = "Sign Out";
        heroSignInButton.href = "#";
        heroSignInButton.addEventListener("click", async (e) => {
          e.preventDefault();
          const { error } = await supabaseClient.auth.signOut();
          if (error) {
            console.error("Error signing out:", error.message);
          } else {
            window.location.href = "index.html";
          }
        });
      }
    }
  }
});
