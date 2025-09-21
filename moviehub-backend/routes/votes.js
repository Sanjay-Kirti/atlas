const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create or update vote for a movie
router.post('/', [
  authMiddleware,
  body('movie_id').isInt().withMessage('Valid movie ID is required'),
  body('vote_type').isIn([1, -1, 0]).withMessage('Vote type must be 1 (upvote), -1 (downvote), or 0 (remove vote)'),
  handleValidationErrors
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { movie_id, vote_type } = req.body;
    const user_id = req.user.id;

    await client.query('BEGIN');

    // Check if movie exists
    const movieCheck = await client.query(
      'SELECT id FROM movies WHERE id = $1',
      [movie_id]
    );

    if (movieCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Movie not found' });
    }

    // If vote_type is 0, delete the vote
    if (vote_type === 0) {
      await client.query(
        'DELETE FROM votes WHERE user_id = $1 AND movie_id = $2',
        [user_id, movie_id]
      );
    } else {
      // Insert or update vote
      await client.query(
        `INSERT INTO votes (user_id, movie_id, vote_type) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (user_id, movie_id) 
         DO UPDATE SET vote_type = $3, created_at = NOW()`,
        [user_id, movie_id, vote_type]
      );
    }

    // Get updated vote counts
    const voteStats = await client.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END), 0) as upvotes,
        COALESCE(SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END), 0) as downvotes,
        COALESCE(SUM(vote_type), 0) as score
       FROM votes
       WHERE movie_id = $1`,
      [movie_id]
    );

    await client.query('COMMIT');

    res.json({
      message: vote_type === 0 ? 'Vote removed' : 'Vote recorded',
      vote_type: vote_type,
      stats: voteStats.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to process vote' });
  } finally {
    client.release();
  }
});

module.exports = router;
