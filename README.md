# Children Games Arena 🎮

An interactive educational games platform for children, built with modern web technologies.

## 🚀 Live Demo
The project is optimized for deployment on **Vercel**.

## 🏗️ Included Games
### 🎯 Math Tug-of-War
A two-player educational game where students solve math problems to win a tug-of-war match.
- **Dynamic Difficulty**: Easy, Medium, and Hard modes.
- **Operations**: Addition, Subtraction, Multiplication, Division, and Mixed.
- **Customizable**: Set question limits and timer values.
- **Responsive Design**: Works on Desktop, Mobile, and Smartboards.
- **Teacher Mode**: Large score view for classroom monitoring.

## 🛠️ Technical Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6 Modules)
- **Animation**: Canvas API with `requestAnimationFrame`
- **Deployment**: Optimized for Vercel/Static Hosting

## 📦 How to Deploy to Vercel

1. **Push to GitHub**: (Already initialized in this repo)
2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com).
   - Click "Add New" -> "Project".
   - Import this repository (`children-games-arena`).
   - Click "Deploy".
3. **Configuration**: The `vercel.json` file in the root handles all necessary routing and clean URLs.

## 💻 Local Development

To run the project locally, you need a web server (due to ES6 module security):

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (serve):**
```bash
npx serve
```

---
Built with ❤️ for educational excellence.
