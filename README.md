<p align="center">
  <img src="docs/assets/hero-logo.svg" alt="WhoPainted Logo" width="700" />
</p>

# 🎨 WhoPainted – Art Guessing Game

**WhoPainted** is an interactive full-stack quiz app where users test their art knowledge by identifying the artist behind each painting. Featuring various art movements, layered hints, and secure user accounts, the app blends accessibility and design with rich art history content.

🔗 Live Demo: [https://whopainted.com](https://whopainted.com)  
🔗 API Repo: [painting-api](https://github.com/jdanderson01/painting-api)

User login/registrarion currently on pause due to a database migration!

---

## ✨ Features

- 🎨 Guess-the-artist quiz with real paintings  
- 🖼️ Art movement selection (Baroque, Impressionism, Surrealism, etc.)  
- 💡 Hints available via lightbulb icon  
- 🔐 Login & registration (Supabase + Node.js backend)  
- 🎯 2-attempt quiz logic with score tracking  
- 🧱 Modular CSS and scalable frontend structure  
- 📱 Responsive UI with accessibility enhancements  
- 🧠 Learn page for exploring movements and history  
- 🚀 Custom REST API to serve painting data  
- ☁️ Images hosted on AWS S3 + CloudFront
-  🏆 Leaderboards 

---

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS (modular), JavaScript (Vanilla)  
- **Backend**: Node.js + Express  
- **Authentication & DB**: Supabase  
- **Hosting**: GitHub Pages (frontend), AWS S3, CloudFront (images)  
- **Planned**: WebSockets for real-time multiplayer  

---

## 📂 Project Structure

```
├── assets/              # Logos, icons, painting metadata
├── backend/             # Express API + Supabase integration
├── docs/                # JavaScript modules (quiz, auth, navigation)
├── styles/              # CSS modules
├── index.html           # Landing page
├── quiz.html            # Main quiz UI
├── learn.html           # Informational content about art movements
└── quiz-results.html    # Summary screen post-quiz
```

---

## 🚧 In Progress / Planned Features
- [ ] 🧠 “Learn” section with in-depth art movement overviews  
- [ ] 🔁 WebSocket multiplayer mode  
- [ ] 📈 Enhanced accessibility (ARIA, keyboard support)  
- [ ] 🖼️ More paintings and movements  
- [ ] ℹ️ “About” / credits section  

---

## 📥 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/your-username/art-guessing.git

# Backend setup
cd backend
npm install
npm start
```

The frontend is static — open `index.html` in your browser or deploy via GitHub Pages.

---

## 👤 Author

**Justice Anderson**  
[LinkedIn](https://www.linkedin.com/in/andersonjd01/) • [Portfolio](https://jdanderson.me/) • [GitHub](https://github.com/jdanderson01)

---

## 📝 License

This project is licensed under the MIT License.

