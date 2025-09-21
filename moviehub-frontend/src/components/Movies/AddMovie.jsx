import { useState } from 'react'
import { moviesAPI } from '../../utils/api'
import toast from 'react-hot-toast'

const AddMovie = ({ onMovieAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await moviesAPI.create(formData)
      onMovieAdded(response.data.movie)
      setFormData({ title: '', description: '' })
      toast.success('Movie added successfully!')
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add movie'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Movie</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Movie Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us why this movie is worth watching..."
            rows={4}
            className="input-field resize-none"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Adding...' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMovie
