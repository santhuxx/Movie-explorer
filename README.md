# 🎬 MovieMaster - Modern Movie Discovery Platform

**MovieMaster** is a responsive web application that helps users discover movies, manage favorites, and enjoy a personalized movie exploration experience. Built with modern technologies, it offers a seamless interface for film enthusiasts.

---

## 🚀 Features

- **🔎 Movie Discovery** - Search films by title, genre, year, or sort by popularity/rating
- **❤️ Favorites Management** - Save and organize your must-watch movies with localStorage persistence
- **🔐 User Authentication** - Secure login and registration with JWT and bcrypt
- **🌓 Theme Options** - Toggle between light and dark mode for comfortable browsing
- **📱 Responsive Design** - Optimized viewing experience across all devices

---

## 🛠️ Tech Stack

- **Frontend:** React, Material-UI, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Security:** bcrypt, jsonwebtoken
- **API:** TMDB Movie Database

---

## 🌐 Live Demo

Experience MovieMaster in action: [moviemaster-app.vercel.app](https://movie-explorer-client-iota.vercel.app/)

---

## 📋 Project Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- TMDB API Key ([get one here](https://www.themoviedb.org/settings/api))

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables
JWT_SECRET=your_secure_jwt_secret
MONGO_URI=mongodb://localhost:27017/moviemaster
TMDB_API_KEY=your_tmdb_api_key
PORT=5001

# Start the server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file with the following variables
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_BASE_URL=http://localhost:5001

# Start development server
npm start
```

The application will be available at `http://localhost:5173`

---

## 🔌 API Usage

### Authentication Endpoints

| Endpoint | Method | Body | Response | Description |
|----------|--------|------|----------|-------------|
| `/api/auth/register` | POST | `{ "username": "string", "password": "string" }` | `{ "token": "jwt", "user": { "username": "string", "id": "string" } }` | Register new user |
| `/api/auth/login` | POST | `{ "username": "string", "password": "string" }` | `{ "token": "jwt", "user": { "username": "string", "id": "string" } }` | Login existing user |
| `/api/auth/validate` | GET | Headers: `Authorization: Bearer <token>` | `{ "user": { "username": "string", "id": "string" } }` | Validate JWT token |

### Movie Endpoints

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/api/movies/trending` | GET | None | Get trending movies |
| `/api/movies/search` | GET | `query`, `genre`, `year`, `sort` | Search for movies with filters |

### TMDB API Integration

The application leverages the TMDB API for rich movie data. Key endpoints used:

```javascript
// Example API requests
const trendingMovies = `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
const searchMovies = `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`;
const movieGenres = `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
```

---

## 💡 Implementation Details

### State Management

- **MovieContext:** Central React Context for managing:
  - User authentication state
  - Favorite movies collection
  - Search parameters and results
  - Theme preferences

### Error Handling

- Form validation for user inputs
- API error handling with user-friendly messages
- "No results found" indicators for empty searches

### LocalStorage Utilization

- Dark/light theme preference
- Favorite movies collection
- Authentication tokens

---

## 🔍 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

---

## 🔧 Troubleshooting

- **Connection Issues:** Verify MongoDB connection string and ensure the service is running
- **API Key Problems:** Confirm your TMDB API key is valid and properly configured
- **JWT Errors:** Check that JWT_SECRET is consistently set in your environment

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ by santhuxx
</div>
