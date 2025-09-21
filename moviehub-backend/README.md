# MovieHub Backend

A Node.js/Express backend API for the MovieHub movie recommendation board application.

## Features

- JWT-based authentication
- PostgreSQL database
- RESTful API endpoints
- Role-based access control (User/Admin)
- Rate limiting and security headers
- Input validation and sanitization

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database named `moviehub`:

```sql
CREATE DATABASE moviehub;
```

Run the schema file to create tables:

```bash
psql -U your_username -d moviehub -f database/schema.sql
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/moviehub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### 4. Seed the Database (Optional)

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 users (1 admin, 2 regular users)
- 10 sample movies
- Random votes and comments

Test accounts:
- Admin: `admin@moviehub.com` / `admin123`
- User 1: `alice@example.com` / `password123`
- User 2: `bob@example.com` / `password123`

### 5. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- Body: `{ name, email, password }`
- Returns: User object and JWT token

#### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: User object and JWT token

#### Get Profile
- **GET** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`
- Returns: Current user profile

### Movie Endpoints

#### Get All Movies
- **GET** `/api/movies`
- Returns: All movies sorted by score (upvotes - downvotes)
- Includes user's vote if authenticated

#### Add Movie
- **POST** `/api/movies`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, description }`
- Returns: Created movie object

#### Delete Movie (Admin Only)
- **DELETE** `/api/movies/:id`
- Headers: `Authorization: Bearer <token>`
- Requires admin role

#### Get Top Movies (Admin Only)
- **GET** `/api/movies/top`
- Headers: `Authorization: Bearer <token>`
- Returns: Top 10 movies with detailed statistics

#### Get Movie Votes
- **GET** `/api/movies/:id/votes`
- Returns: Vote statistics for a specific movie

### Vote Endpoints

#### Create/Update Vote
- **POST** `/api/votes`
- Headers: `Authorization: Bearer <token>`
- Body: `{ movie_id, vote_type }`
- vote_type: 1 (upvote), -1 (downvote), 0 (remove vote)

### Comment Endpoints

#### Get Movie Comments
- **GET** `/api/comments/movie/:movieId`
- Returns: All comments for a specific movie

#### Add Comment
- **POST** `/api/comments`
- Headers: `Authorization: Bearer <token>`
- Body: `{ movie_id, body }`

#### Edit Comment
- **PUT** `/api/comments/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ body }`
- Only comment owner can edit

#### Delete Comment
- **DELETE** `/api/comments/:id`
- Headers: `Authorization: Bearer <token>`
- Comment owner or admin can delete

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- Rate limiting (100 requests per 15 minutes per IP)
- Security headers with Helmet
- CORS configuration

## Project Structure

```
moviehub-backend/
├── config/
│   └── database.js         # Database connection configuration
├── database/
│   └── schema.sql          # Database schema
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   ├── admin.js           # Admin role check middleware
│   └── errorHandler.js    # Global error handler
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── movies.js          # Movie routes
│   ├── votes.js           # Vote routes
│   └── comments.js        # Comment routes
├── .env                    # Environment variables
├── server.js              # Main server file
├── seed.js                # Database seeding script
└── package.json           # Dependencies and scripts
```

## Deployment

### Environment Variables for Production

```env
DATABASE_URL=your_production_database_url
JWT_SECRET=strong_random_secret_key
PORT=your_port
NODE_ENV=production
```

### Deployment Steps

1. Set up PostgreSQL database
2. Run schema.sql to create tables
3. Set environment variables
4. Install dependencies: `npm install --production`
5. Start server: `npm start`

### Recommended Platforms

- **Heroku**: Supports Node.js and PostgreSQL add-on
- **Railway**: Easy deployment with PostgreSQL
- **Render**: Free tier available with PostgreSQL
- **DigitalOcean App Platform**: Full control with managed database

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (if applicable)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## License

ISC
