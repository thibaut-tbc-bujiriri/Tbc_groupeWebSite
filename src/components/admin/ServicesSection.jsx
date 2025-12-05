import { useState, useEffect } from 'react'
import { Briefcase, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const ServicesSection = ({ apiBaseUrl }) => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: '',
    features: [],
    technologies: [],
    display_order: 0,
  })
  const [newFeature, setNewFeature] = useState('')
  const [newTech, setNewTech] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const url = `${apiBaseUrl}/api/services`
      console.log('🔍 Fetching services from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ Services data received:', data)
      
      if (data.success) {
        setServices(data.data || [])
        console.log(`✅ ${data.data?.length || 0} services chargés`)
      } else {
        console.error('❌ API returned success=false:', data)
        toast.error(data.message || 'Erreur lors du chargement des services')
      }
    } catch (error) {
      console.error('❌ Error fetching services:', error)
      console.error('URL tentée:', `${apiBaseUrl}/api/services`)
      toast.error(`Erreur: ${error.message}. Vérifiez la console pour plus de détails.`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addTechnology = () => {
    if (newTech.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }))
      setNewTech('')
    }
  }

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon_name: '',
      features: [],
      technologies: [],
      display_order: 0,
    })
    setNewFeature('')
    setNewTech('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Veuillez remplir le titre et la description')
      return
    }

    try {
      const url = editingId 
        ? `${apiBaseUrl}/api/services/${editingId}`
        : `${apiBaseUrl}/api/services`
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingId ? 'Modifié!' : 'Ajouté!')
        resetForm()
        fetchServices()
      } else {
        toast.error(data.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  const handleEdit = (service) => {
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon_name: service.icon_name || '',
      features: Array.isArray(service.features) ? service.features : [],
      technologies: Array.isArray(service.technologies) ? service.technologies : [],
      display_order: service.display_order || 0,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return

    try {
      const response = await fetch(`${apiBaseUrl}/api/services/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Supprimé!')
        fetchServices()
      }
    } catch (error) {
      toast.error('Erreur')
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
            <span>Ajouter un Service</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'} un Service</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
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
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Icône (nom Lucide)</label>
              <input
                type="text"
                name="icon_name"
                value={formData.icon_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Code, Smartphone"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Caractéristiques</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Ajouter une caractéristique"
                />
                <button onClick={addFeature} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span key={index} className="bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full flex items-center space-x-2">
                    <span>{feature}</span>
                    <button onClick={() => removeFeature(index)} className="text-red-600">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Technologies</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Ajouter une technologie"
                />
                <button onClick={addTechnology} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full flex items-center space-x-2">
                    <span>{tech}</span>
                    <button onClick={() => removeTechnology(index)} className="text-red-600">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Ordre d'affichage</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={resetForm} className="px-4 py-2 border rounded-lg">Annuler</button>
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
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Briefcase className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun service</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {Array.isArray(service.features) && service.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Caractéristiques:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, i) => (
                      <span key={i} className="bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(service.technologies) && service.technologies.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, i) => (
                      <span key={i} className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesSection

