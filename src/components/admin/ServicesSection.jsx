import { useState, useEffect } from 'react'
import { Briefcase, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { servicesApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const ServicesSection = () => {
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
  })

  const [featuresInput, setFeaturesInput] = useState('')
  const [technologiesInput, setTechnologiesInput] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const result = await servicesApi.getAll()
      
      if (result.success) {
        setServices(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon_name: '',
      features: [],
      technologies: [],
    })
    setFeaturesInput('')
    setTechnologiesInput('')
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
      features: featuresInput ? featuresInput.split('\n').filter(f => f.trim()) : [],
      technologies: technologiesInput ? technologiesInput.split(',').map(t => t.trim()).filter(t => t) : [],
    }

    try {
      let result
      if (editingId) {
        result = await servicesApi.update(editingId, dataToSend)
      } else {
        result = await servicesApi.create(dataToSend)
      }

      if (result.success) {
        toast.success(editingId ? 'Modifié avec succès!' : 'Ajouté avec succès!')
        resetForm()
        fetchServices()
      } else {
        toast.error(result.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (service) => {
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon_name: service.icon_name || '',
      features: service.features || [],
      technologies: service.technologies || [],
    })
    setFeaturesInput(Array.isArray(service.features) ? service.features.join('\n') : '')
    setTechnologiesInput(Array.isArray(service.technologies) ? service.technologies.join(', ') : '')
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return

    try {
      const result = await servicesApi.delete(id)
      if (result.success) {
        toast.success('Supprimé!')
        fetchServices()
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
              <label className="block text-sm font-semibold mb-2">Icône (nom Lucide)</label>
              <input
                type="text"
                name="icon_name"
                value={formData.icon_name}
                onChange={handleChange}
                placeholder="ex: Code, Smartphone, Search"
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
              <label className="block text-sm font-semibold mb-2">Fonctionnalités (une par ligne)</label>
              <textarea
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={4}
                placeholder="Applications web responsives&#10;Intégration d'APIs&#10;Optimisation des performances"
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
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-primary-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
              {service.features && service.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Fonctionnalités:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {service.technologies && service.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
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
