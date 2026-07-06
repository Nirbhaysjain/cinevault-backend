# CineVault Backend

Node.js + Express REST API for CineVault — a film tracking web app.

## Tech Stack

- Node.js
- Express.js
- MySQL
- CORS

## Setup

1. Clone the repo
2. Install dependencies
3. Create a MySQL database called `cinevault` and run the table setup queries
4. Update the DB credentials in `index.js`
5. Start the server

Server runs on `http://localhost:5000`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /signup | Register a new user |
| POST | /login | Login with email & password |
| POST | /watchlist | Add a film to watchlist |
| GET | /watchlist/:userId | Get user's watchlist |
| DELETE | /watchlist/:id | Remove from watchlist |
| POST | /log | Log a watched film |
| GET | /logs/:userId | Get user's film logs |
| GET | /members | Get all users |
| GET | /user/:userId | Get a user's profile |
| POST | /follow | Follow a user |
| DELETE | /follow | Unfollow a user |
| GET | /following/:userId | Get who a user follows |

## Database Tables

- `users` — id, name, email, password
- `watchlist` — id, user_id, tmdb_film_id, film_title, poster_url, added_at
- `logs` — id, user_id, tmdb_film_id, film_title, poster_url, rating, mood, logged_at
- `follows` — follower_id, following_id

## Related

- Frontend repo: [cinevault-frontend](https://github.com/Nirbhaysjain/cinevault-frontend)
