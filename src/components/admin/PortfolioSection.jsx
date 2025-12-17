import { useState, useEffect } from 'react'
import { FolderOpen, Plus, Trash2, Edit2, Save, X, Upload, Image, ExternalLink, Github } from 'lucide-react'
import { portfolioApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const PortfolioSection = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_base64: '',
    technologies: [],
    project_url: '',
    github_url: '',
    category: '',
    is_featured: false,
  })

  const [technologiesInput, setTechnologiesInput] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const result = await portfolioApi.getAll()
      
      if (result.success) {
        setProjects(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image est trop grande (max 5MB)')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_base64: reader.result }))
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_base64: '',
      technologies: [],
      project_url: '',
      github_url: '',
      category: '',
      is_featured: false,
    })
    setTechnologiesInput('')
    setImagePreview(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Veuillez remplir au moins le titre et la description')
      return
    }

    const dataToSend = {
      ...formData,
      technologies: technologiesInput ? technologiesInput.split(',').map(t => t.trim()).filter(t => t) : [],
    }

    try {
      let result
      if (editingId) {
        result = await portfolioApi.update(editingId, dataToSend)
      } else {
        result = await portfolioApi.create(dataToSend)
      }

      if (result.success) {
        toast.success(editingId ? 'Modifié avec succès!' : 'Ajouté avec succès!')
        resetForm()
        fetchProjects()
      } else {
        toast.error(result.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      description: project.description || '',
      image_base64: project.image_base64 || '',
      technologies: project.technologies || [],
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      category: project.category || '',
      is_featured: project.is_featured || false,
    })
    setTechnologiesInput(Array.isArray(project.technologies) ? project.technologies.join(', ') : '')
    setImagePreview(project.image_base64 || project.image_url || null)
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return

    try {
      const result = await portfolioApi.delete(id)
      if (result.success) {
        toast.success('Supprimé!')
        fetchProjects()
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  return (
    <div>
      {!showForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus size={20} />
            <span>Ajouter un Projet</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'} un Projet</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Catégorie</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="ex: Web, Mobile, Design"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Image</label>
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded" />
                  <div>
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                      <Upload size={18} className="mr-2" />
                      Changer
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <button
                      onClick={() => {
                        setImagePreview(null)
                        setFormData(prev => ({ ...prev, image_base64: '' }))
                      }}
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-gray-50">
                  <Image className="w-8 h-8 mb-2 text-gray-400" />
                  <span className="text-sm">Cliquez pour uploader</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">URL du projet</label>
              <input
                type="url"
                name="project_url"
                value={formData.project_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">URL GitHub</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Technologies (séparées par des virgules)</label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                placeholder="React, Node.js, TypeScript"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm font-semibold">Projet mis en avant</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={resetForm} className="px-4 py-2 border rounded-lg">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{editingId ? 'Modifier' : 'Ajouter'}</span>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <FolderOpen className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun projet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-primary-400 to-primary-600">
                {project.image_base64 || project.image_url ? (
                  <img
                    src={project.image_base64 || project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="text-white" size={48} />
                  </div>
                )}
                {project.is_featured && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                    En vedette
                  </span>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                {project.category && (
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs mb-2">
                    {project.category}
                  </span>
                )}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}
                <div className="flex space-x-2">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PortfolioSection
