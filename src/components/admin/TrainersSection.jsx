import { useState, useEffect } from 'react'
import { Users, Plus, Trash2, Edit2, Save, X, Upload, Image, Mail, Phone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { trainersApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const TrainersSection = () => {
  const { isSuperAdmin } = useAuth()
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    bio_extended: '',
    email: '',
    phone: '',
    image_base64: '',
  })

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching trainers from Supabase...')
      
      const result = await trainersApi.getAll()
      console.log('✅ Trainers data received:', result)
      
      if (result.success) {
        setTrainers(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('❌ Error fetching trainers:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
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
      name: '',
      title: '',
      bio: '',
      bio_extended: '',
      email: '',
      phone: '',
      image_base64: '',
    })
    setImagePreview(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.title || !formData.bio) {
      toast.error('Veuillez remplir au moins le nom, titre et bio')
      return
    }

    try {
      let result
      if (editingId) {
        result = await trainersApi.update(editingId, formData)
      } else {
        result = await trainersApi.create(formData)
      }

      if (result.success) {
        toast.success(editingId ? 'Modifié avec succès!' : 'Ajouté avec succès!')
        resetForm()
        fetchTrainers()
      } else {
        toast.error(result.message || 'Erreur')
      }
    } catch (error) {
      console.error('Erreur de sauvegarde:', error)
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (trainer) => {
    setFormData({
      name: trainer.name || '',
      title: trainer.title || '',
      bio: trainer.bio || '',
      bio_extended: trainer.bio_extended || '',
      email: trainer.email || '',
      phone: trainer.phone || '',
      image_base64: trainer.image_base64 || '',
    })
    setImagePreview(trainer.image_base64 || trainer.image_url || null)
    setEditingId(trainer.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce formateur ?')) return

    try {
      const result = await trainersApi.delete(id)
      if (result.success) {
        toast.success('Supprimé!')
        fetchTrainers()
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
            <span>Ajouter un Formateur</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'} un Formateur</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Bio courte *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Bio complète</label>
              <textarea
                name="bio_extended"
                value={formData.bio_extended}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Photo</label>
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded" />
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
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg hover:bg-gray-50">
                  <Image className="w-12 h-12 mb-2 text-gray-400" />
                  <span className="text-sm">Cliquez pour uploader</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
      ) : trainers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Users className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun formateur</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                {trainer.image_base64 || trainer.image_url ? (
                  <img
                    src={trainer.image_base64 || trainer.image_url}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="text-white" size={64} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(trainer)}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  {isSuperAdmin() && (
                    <button
                      onClick={() => handleDelete(trainer.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">{trainer.title}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{trainer.bio}</p>
                {(trainer.email || trainer.phone) && (
                  <div className="space-y-2 pt-4 border-t">
                    {trainer.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail size={16} />
                        <span>{trainer.email}</span>
                      </div>
                    )}
                    {trainer.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone size={16} />
                        <span>{trainer.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrainersSection
