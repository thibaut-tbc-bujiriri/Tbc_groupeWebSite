import { useState, useEffect } from 'react'
import { GraduationCap, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const TrainingProgramsSection = ({ apiBaseUrl }) => {
  const { isSuperAdmin } = useAuth()
  const [programs, setPrograms] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    trainer_id: '',
    title: '',
    description: '',
    duration: '',
    price: '',
    icon_name: '',
    display_order: 0,
  })

  useEffect(() => {
    fetchPrograms()
    fetchTrainers()
  }, [])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/training-programs`)
      const data = await response.json()
      if (data.success) {
        setPrograms(data.data || [])
      }
    } catch (error) {
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/trainers`)
      const data = await response.json()
      if (data.success) {
        setTrainers(data.data || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des formateurs')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetForm = () => {
    setFormData({
      trainer_id: '',
      title: '',
      description: '',
      duration: '',
      price: '',
      icon_name: '',
      display_order: 0,
    })
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
        ? `${apiBaseUrl}/api/training-programs/${editingId}`
        : `${apiBaseUrl}/api/training-programs`
      const method = editingId ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        trainer_id: formData.trainer_id || null,
        price: formData.price ? parseFloat(formData.price) : null,
        display_order: parseInt(formData.display_order) || 0,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData),
      })

      // Vérifier si la réponse est valide avant de parser JSON
      let data;
      const text = await response.text();
      try {
        if (text) {
          data = JSON.parse(text);
        } else {
          throw new Error('Réponse vide du serveur');
        }
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        console.error('Réponse du serveur:', text);
        toast.error('Erreur: Réponse invalide du serveur');
        return;
      }

      if (data.success) {
        toast.success(editingId ? 'Modifié!' : 'Ajouté!')
        resetForm()
        fetchPrograms()
      } else {
        console.error('Erreur de sauvegarde:', data);
        toast.error(data.message || 'Erreur')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur de connexion: ' + (error.message || 'Erreur inconnue'))
    }
  }

  const handleEdit = (program) => {
    setFormData({
      trainer_id: program.trainer_id || '',
      title: program.title || '',
      description: program.description || '',
      duration: program.duration || '',
      price: program.price || '',
      icon_name: program.icon_name || '',
      display_order: program.display_order || 0,
    })
    setEditingId(program.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce programme ?')) return

    try {
      const response = await fetch(`${apiBaseUrl}/api/training-programs/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Supprimé!')
        fetchPrograms()
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
            <span>Ajouter un Programme</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'} un Programme</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Formateur (optionnel)</label>
              <select
                name="trainer_id"
                value={formData.trainer_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Aucun formateur</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Durée</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: 4 semaines"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Prix</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Ordre</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Icône (nom Lucide)</label>
              <input
                type="text"
                name="icon_name"
                value={formData.icon_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Ex: BookOpen, Code"
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
      ) : programs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <GraduationCap className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun programme</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{program.description}</p>
                  {program.duration && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                      Durée: {program.duration}
                    </p>
                  )}
                  {program.price && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Prix: {parseFloat(program.price).toFixed(2)} $
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  {isSuperAdmin() && (
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default TrainingProgramsSection

