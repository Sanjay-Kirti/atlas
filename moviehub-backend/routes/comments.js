const express = require('express');
const { body, param, validationResult } = require('express-validator');
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

// Get all comments for a movie
router.get('/movie/:movieId', [
  param('movieId').isInt().withMessage('Valid movie ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { movieId } = req.params;

    const query = `
      SELECT 
        c.id,
        c.body,
        c.created_at,
        c.user_id,
        u.name as user_name,
        u.role as user_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.movie_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(query, [movieId]);

    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// Add new comment
router.post('/', [
  authMiddleware,
  body('movie_id').isInt().withMessage('Valid movie ID is required'),
  body('body').trim().notEmpty().withMessage('Comment body is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { movie_id, body } = req.body;
    const user_id = req.user.id;

    // Check if movie exists
    const movieCheck = await pool.query(
      'SELECT id FROM movies WHERE id = $1',
      [movie_id]
    );

    if (movieCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Insert comment
    const result = await pool.query(
      `INSERT INTO comments (user_id, movie_id, body) 
       VALUES ($1, $2, $3) 
       RETURNING id, body, created_at, user_id`,
      [user_id, movie_id, body]
    );

    const comment = result.rows[0];

    // Get user info
    const userResult = await pool.query(
      'SELECT name, role FROM users WHERE id = $1',
      [user_id]
    );

    comment.user_name = userResult.rows[0].name;
    comment.user_role = userResult.rows[0].role;

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Edit comment (owner only)
router.put('/:id', [
  authMiddleware,
  param('id').isInt().withMessage('Valid comment ID is required'),
  body('body').trim().notEmpty().withMessage('Comment body is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const user_id = req.user.id;

    // Check if comment exists and user is the owner
    const commentCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    // Update comment
    const result = await pool.query(
      `UPDATE comments 
       SET body = $1, created_at = NOW() 
       WHERE id = $2 
       RETURNING id, body, created_at, user_id`,
      [body, id]
    );

    const comment = result.rows[0];

    // Get user info
    const userResult = await pool.query(
      'SELECT name, role FROM users WHERE id = $1',
      [user_id]
    );

    comment.user_name = userResult.rows[0].name;
    comment.user_role = userResult.rows[0].role;

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Edit comment error:', error);
    res.status(500).json({ error: 'Failed to edit comment' });
  }
});

// Delete comment (owner or admin)
router.delete('/:id', [
  authMiddleware,
  param('id').isInt().withMessage('Valid comment ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    // Check if comment exists
    const commentCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is owner or admin
    if (commentCheck.rows[0].user_id !== user_id && user_role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    // Delete comment
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
