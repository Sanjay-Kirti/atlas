import { useState, useEffect } from 'react'
import { moviesAPI } from '../utils/api'
import { FiTrendingUp, FiTrash2, FiUsers, FiFilm } from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [topMovies, setTopMovies] = useState([])
  const [allMovies, setAllMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('leaderboard')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [topResponse, allResponse] = await Promise.all([
        moviesAPI.getTop(),
        moviesAPI.getAll()
      ])
      
      setTopMovies(topResponse.data.topMovies)
      setAllMovies(allResponse.data.movies)
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return
    }

    try {
      await moviesAPI.delete(movieId)
      setAllMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId))
      setTopMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId))
      toast.success('Movie deleted successfully')
    } catch (error) {
      toast.error('Failed to delete movie')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const stats = {
    totalMovies: allMovies.length,
    totalVotes: allMovies.reduce((sum, movie) => sum + (movie.upvotes || 0) + (movie.downvotes || 0), 0),
    totalComments: allMovies.reduce((sum, movie) => sum + (movie.comment_count || 0), 0),
    avgScore: allMovies.length > 0 ? (allMovies.reduce((sum, movie) => sum + (movie.score || 0), 0) / allMovies.length).toFixed(1) : 0
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage movies and view platform statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <FiFilm className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalMovies}</div>
          <div className="text-sm text-gray-600">Total Movies</div>
        </div>
        
        <div className="card text-center">
          <FiTrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalVotes}</div>
          <div className="text-sm text-gray-600">Total Votes</div>
        </div>
        
        <div className="card text-center">
          <FiUsers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalComments}</div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
        
        <div className="card text-center">
          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 font-bold">★</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgScore}</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leaderboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Top Movies Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage All Movies
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'leaderboard' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Top 10 Movies</h2>
          
          {topMovies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No movies found</p>
          ) : (
            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={movie.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{movie.title}</h3>
                      <p className="text-sm text-gray-600">
                        Added by {movie.added_by_name} • {formatDate(movie.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-green-600">↑{movie.upvotes || 0}</div>
                      <div className="text-gray-500">Upvotes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-red-600">↓{movie.downvotes || 0}</div>
                      <div className="text-gray-500">Downvotes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary-600">{movie.score || 0}</div>
                      <div className="text-gray-500">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-600">{movie.comment_count || 0}</div>
                      <div className="text-gray-500">Comments</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Manage All Movies</h2>
          
          {allMovies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No movies found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Movie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{movie.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {movie.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {movie.added_by_name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-medium ${
                          (movie.score || 0) > 0 ? 'text-green-600' : 
                          (movie.score || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {movie.score || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {movie.comment_count || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(movie.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete movie"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
