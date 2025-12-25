import { useState, useEffect } from 'react'
import { GraduationCap, Plus, Trash2, Edit2, Save, X, Clock, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { trainingProgramsApi, trainersApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const TrainingProgramsSection = () => {
  const { isSuperAdmin } = useAuth()
  const [programs, setPrograms] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'debutant',
    trainer_id: '',
    price: '',
    max_participants: '',
    topics: [],
  })

  const [topicsInput, setTopicsInput] = useState('')

  useEffect(() => {
    fetchPrograms()
    fetchTrainers()
  }, [])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const result = await trainingProgramsApi.getAll()
      
      if (result.success) {
        setPrograms(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrainers = async () => {
    try {
      const result = await trainersApi.getAll()
      if (result.success) {
        setTrainers(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching trainers:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      level: 'debutant',
      trainer_id: '',
      price: '',
      max_participants: '',
      topics: [],
    })
    setTopicsInput('')
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
      trainer_id: formData.trainer_id || null,
      price: formData.price ? parseFloat(formData.price) : null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      topics: topicsInput ? topicsInput.split('\n').filter(t => t.trim()) : [],
    }

    try {
      let result
      if (editingId) {
        result = await trainingProgramsApi.update(editingId, dataToSend)
      } else {
        result = await trainingProgramsApi.create(dataToSend)
      }

      if (result.success) {
        toast.success(editingId ? 'Modifié avec succès!' : 'Ajouté avec succès!')
        resetForm()
        fetchPrograms()
      } else {
        toast.error(result.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (program) => {
    setFormData({
      title: program.title || '',
      description: program.description || '',
      duration: program.duration || '',
      level: program.level || 'debutant',
      trainer_id: program.trainer_id || '',
      price: program.price || '',
      max_participants: program.max_participants || '',
      topics: program.topics || [],
    })
    setTopicsInput(Array.isArray(program.topics) ? program.topics.join('\n') : '')
    setEditingId(program.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce programme ?')) return

    try {
      const result = await trainingProgramsApi.delete(id)
      if (result.success) {
        toast.success('Supprimé!')
        fetchPrograms()
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const getLevelLabel = (level) => {
    const levels = {
      debutant: 'Débutant',
      intermediaire: 'Intermédiaire',
      avance: 'Avancé',
      expert: 'Expert'
    }
    return levels[level] || level
  }

  const getLevelColor = (level) => {
    const colors = {
      debutant: 'bg-green-100 text-green-800',
      intermediaire: 'bg-blue-100 text-blue-800',
      avance: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
            <div>
              <label className="block text-sm font-semibold mb-2">Durée</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="ex: 3 jours, 40 heures"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Niveau</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Formateur</label>
              <select
                name="trainer_id"
                value={formData.trainer_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Sélectionner un formateur</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Prix ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Participants max</label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Sujets abordés (un par ligne)</label>
              <textarea
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                rows={4}
                placeholder="Introduction aux bases&#10;Concepts avancés&#10;Projet pratique"
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
                  <h3 className="text-xl font-bold">{program.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${getLevelColor(program.level)}`}>
                    {getLevelLabel(program.level)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit2 size={18} />
                  </button>
                  {isSuperAdmin() && (
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{program.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {program.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{program.duration}</span>
                  </div>
                )}
                {program.max_participants && (
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>Max {program.max_participants}</span>
                  </div>
                )}
                {program.price && (
                  <span className="font-semibold text-primary-600">${program.price}</span>
                )}
              </div>

              {program.trainers && (
                <div className="text-sm text-gray-500 mb-4">
                  Formateur: <span className="font-medium">{program.trainers.name}</span>
                </div>
              )}

              {program.topics && program.topics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Sujets:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {program.topics.slice(0, 4).map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                    {program.topics.length > 4 && (
                      <li className="text-primary-600">+{program.topics.length - 4} autres</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrainingProgramsSection
