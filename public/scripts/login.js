const supabaseClient = supabase.createClient(
    'https://jbsfmlvkokplvtyqlcxj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2ZtbHZrb2twbHZ0eXFsY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzk1NjAsImV4cCI6MjA2NDkxNTU2MH0.vYrZCYcud3-yUE2sI32lVR-Ev6gjp5PDFU59dFzSUUI'
  );
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      alert(error.message);
    } else {
      alert('Login successful!');
      window.location.href = 'index.html'; // or wherever you want to redirect
    }
  });  