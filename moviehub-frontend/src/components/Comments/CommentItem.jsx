import { useState } from 'react'
import { commentsAPI } from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import CommentForm from './CommentForm'
import { FiEdit2, FiTrash2, FiUser, FiClock } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CommentItem = ({ comment, onCommentUpdated, onCommentDeleted }) => {
  const { user, isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canEdit = user && user.id === comment.user_id
  const canDelete = user && (user.id === comment.user_id || isAdmin())

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setDeleting(true)
    try {
      await commentsAPI.delete(comment.id)
      onCommentDeleted(comment.id)
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete comment')
    } finally {
      setDeleting(false)
    }
  }

  const handleCommentUpdated = (updatedComment) => {
    onCommentUpdated(updatedComment)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Comment Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiUser className="h-4 w-4" />
          <span className="font-medium">{comment.user_name}</span>
          {comment.user_role === 'admin' && (
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
              Admin
            </span>
          )}
          <div className="flex items-center space-x-1">
            <FiClock className="h-4 w-4" />
            <span>{formatDate(comment.created_at)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {(canEdit || canDelete) && (
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-primary-600 transition-colors"
                title="Edit comment"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="Delete comment"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comment Body */}
      {isEditing ? (
        <CommentForm
          initialComment={comment}
          onCommentUpdated={handleCommentUpdated}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-gray-800 whitespace-pre-wrap">{comment.body}</p>
      )}
    </div>
  )
}

export default CommentItem
