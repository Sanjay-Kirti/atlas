import { useState, useEffect } from 'react'
import { commentsAPI } from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import toast from 'react-hot-toast'

const CommentSection = ({ movieId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddComment, setShowAddComment] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [movieId])

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByMovie(movieId)
      setComments(response.data.comments)
    } catch (error) {
      toast.error('Failed to load comments')
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments])
    setShowAddComment(false)
  }

  const handleCommentUpdated = (updatedComment) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    )
  }

  const handleCommentDeleted = (commentId) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Comment Button/Form */}
      {user ? (
        <div>
          {!showAddComment ? (
            <button
              onClick={() => setShowAddComment(true)}
              className="btn-secondary text-sm"
            >
              Add Comment
            </button>
          ) : (
            <div className="animate-slide-up">
              <CommentForm
                movieId={movieId}
                onCommentAdded={handleCommentAdded}
                onCancel={() => setShowAddComment(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          <a href="/login" className="text-primary-600 hover:text-primary-700">
            Login
          </a>{' '}
          to add a comment
        </p>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
