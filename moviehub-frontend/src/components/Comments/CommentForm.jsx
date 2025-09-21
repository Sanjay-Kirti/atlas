import { useState } from 'react'
import { commentsAPI } from '../../utils/api'
import toast from 'react-hot-toast'

const CommentForm = ({ movieId, onCommentAdded, onCancel, initialComment = null, onCommentUpdated }) => {
  const [body, setBody] = useState(initialComment?.body || '')
  const [loading, setLoading] = useState(false)
  const isEditing = !!initialComment

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!body.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setLoading(true)
    try {
      if (isEditing) {
        const response = await commentsAPI.update(initialComment.id, { body })
        onCommentUpdated(response.data.comment)
        toast.success('Comment updated successfully!')
      } else {
        const response = await commentsAPI.create({ movie_id: movieId, body })
        onCommentAdded(response.data.comment)
        toast.success('Comment added successfully!')
      }
      
      setBody('')
      if (onCancel) onCancel()
    } catch (error) {
      const message = error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} comment`
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          rows={3}
          className="input-field resize-none"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-sm"
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add Comment')}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
