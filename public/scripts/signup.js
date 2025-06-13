const supabaseClient = supabase.createClient(
    'https://jbsfmlvkokplvtyqlcxj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2ZtbHZrb2twbHZ0eXFsY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzk1NjAsImV4cCI6MjA2NDkxNTU2MH0.vYrZCYcud3-yUE2sI32lVR-Ev6gjp5PDFU59dFzSUUI'
  );
  
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target['confirm-password'].value;
    const username = e.target.username ? e.target.username.value : '';  // Only if you have a username field
  
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    // Sign up user in Supabase Auth
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });
  
    if (error) {
      alert(error.message);
    } else {
      const user = data.user;
      // Insert user profile row (optional)
      if (user && username) {
        const { error: insertError } = await supabaseClient
          .from('users')
          .insert([
            { user_id: user.id, username }
          ]);
        if (insertError) {
          console.error('Error inserting user profile:', insertError.message);
        }
      }
      alert('Signup successful! Please check your email to confirm.');
      window.location.href = 'login.html';
    }
  });
  