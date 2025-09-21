import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { votesAPI } from '../../utils/api'
import { FiThumbsUp, FiThumbsDown, FiMessageCircle, FiUser, FiCalendar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import CommentSection from '../Comments/CommentSection'

const MovieCard = ({ movie, onVoteUpdate, onDelete }) => {
  const { user, isAdmin } = useAuth()
  const [voting, setVoting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleVote = async (voteType) => {
    if (!user) {
      toast.error('Please login to vote')
      return
    }

    if (voting) return

    setVoting(true)
    try {
      // If clicking the same vote type, remove the vote (set to 0)
      const newVoteType = movie.user_vote === voteType ? 0 : voteType
      
      const response = await votesAPI.vote({
        movie_id: movie.id,
        vote_type: newVoteType
      })

      // Update the movie with new vote data
      onVoteUpdate(movie.id, {
        ...response.data.stats,
        user_vote: newVoteType
      })

      toast.success(
        newVoteType === 0 ? 'Vote removed' : 
        newVoteType === 1 ? 'Upvoted!' : 'Downvoted!'
      )
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to vote')
    } finally {
      setVoting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return
    }

    setDeleting(true)
    try {
      await onDelete(movie.id)
    } catch (error) {
      toast.error('Failed to delete movie')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="card animate-fade-in">
      {/* Movie Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h3>
          <p className="text-gray-600 mb-3">{movie.description}</p>
          
          {/* Movie Meta */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FiUser className="h-4 w-4" />
              <span>Added by {movie.added_by_name || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiCalendar className="h-4 w-4" />
              <span>{formatDate(movie.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Admin Delete Button */}
        {isAdmin() && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger text-sm ml-4"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {/* Voting and Comments */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {/* Vote Buttons */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(1)}
              disabled={voting || !user}
              className={`vote-button ${
                movie.user_vote === 1 
                  ? 'bg-green-100 text-green-600 active' 
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
              title={user ? 'Upvote' : 'Login to vote'}
            >
              <FiThumbsUp className="h-5 w-5" />
            </button>
            
            <span className="font-bold text-lg text-gray-900">
              Score: {movie.score || 0}
            </span>
            
            <button
              onClick={() => handleVote(-1)}
              disabled={voting || !user}
              className={`vote-button ${
                movie.user_vote === -1 
                  ? 'bg-red-100 text-red-600 active' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
              title={user ? 'Downvote' : 'Login to vote'}
            >
              <FiThumbsDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <FiMessageCircle className="h-5 w-5" />
          <span>{movie.comment_count || 0} Comments</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <CommentSection movieId={movie.id} />
        </div>
      )}
    </div>
  )
}

export default MovieCard
