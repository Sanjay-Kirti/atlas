const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all movies sorted by score
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.created_at,
        m.added_by,
        u.name as added_by_name,
        COALESCE(SUM(v.vote_type), 0) as score,
        COUNT(DISTINCT c.id) as comment_count
      FROM movies m
      LEFT JOIN users u ON m.added_by = u.id
      LEFT JOIN votes v ON m.id = v.movie_id
      LEFT JOIN comments c ON m.id = c.movie_id
      GROUP BY m.id, m.title, m.description, m.created_at, m.added_by, u.name
      ORDER BY score DESC, m.created_at DESC
    `;

    const result = await pool.query(query);

    // If user is authenticated, get their votes
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.substring(7);
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const votesResult = await pool.query(
          'SELECT movie_id, vote_type FROM votes WHERE user_id = $1',
          [decoded.id]
        );
        
        const userVotes = {};
        votesResult.rows.forEach(vote => {
          userVotes[vote.movie_id] = vote.vote_type;
        });

        result.rows = result.rows.map(movie => ({
          ...movie,
          user_vote: userVotes[movie.id] || 0
        }));
      } catch (error) {
        // If token is invalid, just return movies without user votes
      }
    }

    res.json({ movies: result.rows });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ error: 'Failed to get movies' });
  }
});

// Add new movie
router.post('/', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO movies (title, description, added_by) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, description, added_by, created_at`,
      [title, description, req.user.id]
    );

    const movie = result.rows[0];

    // Get user name
    const userResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );

    movie.added_by_name = userResult.rows[0].name;
    movie.score = 0;
    movie.comment_count = 0;

    res.status(201).json({
      message: 'Movie added successfully',
      movie
    });
  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Delete movie (admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM movies WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Get top movies leaderboard (admin only)
router.get('/top', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.created_at,
        u.name as added_by_name,
        COALESCE(SUM(CASE WHEN v.vote_type = 1 THEN 1 ELSE 0 END), 0) as upvotes,
        COALESCE(SUM(CASE WHEN v.vote_type = -1 THEN 1 ELSE 0 END), 0) as downvotes,
        COALESCE(SUM(v.vote_type), 0) as score,
        COUNT(DISTINCT c.id) as comment_count
      FROM movies m
      LEFT JOIN users u ON m.added_by = u.id
      LEFT JOIN votes v ON m.id = v.movie_id
      LEFT JOIN comments c ON m.id = c.movie_id
      GROUP BY m.id, m.title, m.description, m.created_at, u.name
      ORDER BY score DESC, m.created_at DESC
      LIMIT 10
    `;

    const result = await pool.query(query);

    res.json({ topMovies: result.rows });
  } catch (error) {
    console.error('Get top movies error:', error);
    res.status(500).json({ error: 'Failed to get top movies' });
  }
});

// Get vote counts for a movie
router.get('/:id/votes', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END), 0) as upvotes,
        COALESCE(SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END), 0) as downvotes,
        COALESCE(SUM(vote_type), 0) as score
      FROM votes
      WHERE movie_id = $1
    `;

    const result = await pool.query(query, [id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ error: 'Failed to get votes' });
  }
});

module.exports = router;
