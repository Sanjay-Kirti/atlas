import { useState, useEffect } from 'react'
import { moviesAPI } from '../../utils/api'
import MovieCard from './MovieCard'
import AddMovie from './AddMovie'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const MovieList = () => {
  const { user } = useAuth()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddMovie, setShowAddMovie] = useState(false)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await moviesAPI.getAll()
      setMovies(response.data.movies)
    } catch (error) {
      toast.error('Failed to load movies')
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMovieAdded = (newMovie) => {
    setMovies(prevMovies => [newMovie, ...prevMovies])
    setShowAddMovie(false)
  }

  const handleVoteUpdate = (movieId, voteData) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === movieId 
          ? { ...movie, ...voteData }
          : movie
      ).sort((a, b) => (b.score || 0) - (a.score || 0)) // Re-sort by score
    )
  }

  const handleMovieDelete = async (movieId) => {
    try {
      await moviesAPI.delete(movieId)
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId))
      toast.success('Movie deleted successfully')
    } catch (error) {
      toast.error('Failed to delete movie')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Movie Recommendations</h1>
          <p className="text-gray-600 mt-2">
            Discover and vote on the best movies. Movies are sorted by score (upvotes - downvotes).
          </p>
        </div>
        
        {user && (
          <button
            onClick={() => setShowAddMovie(!showAddMovie)}
            className="btn-primary"
          >
            {showAddMovie ? 'Cancel' : 'Add Movie'}
          </button>
        )}
      </div>

      {/* Add Movie Form */}
      {showAddMovie && (
        <div className="animate-slide-up">
          <AddMovie onMovieAdded={handleMovieAdded} />
        </div>
      )}

      {/* Movies List */}
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No movies yet</h3>
          <p className="text-gray-600 mb-4">Be the first to add a movie recommendation!</p>
          {user && !showAddMovie && (
            <button
              onClick={() => setShowAddMovie(true)}
              className="btn-primary"
            >
              Add First Movie
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onVoteUpdate={handleVoteUpdate}
              onDelete={handleMovieDelete}
            />
          ))}
        </div>
      )}

      {/* Login Prompt */}
      {!user && movies.length > 0 && (
        <div className="text-center py-8 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            Join the Community!
          </h3>
          <p className="text-primary-700 mb-4">
            Login to vote on movies, add your own recommendations, and join the discussion.
          </p>
          <div className="space-x-4">
            <a href="/login" className="btn-primary">
              Login
            </a>
            <a href="/register" className="btn-secondary">
              Sign Up
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieList
