import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Users, Mail, Phone, BookOpen, Plus, Trash2, X, Save, LogOut, Upload, Image } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:8080/Tbc_Groupe/backend'

const Trainers = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [imageErrors, setImageErrors] = useState({})

  // Formulaire pour ajouter un formateur
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    title: '',
    bio: '',
    bio_extended: '',
    image_base64: '',
    email: '',
    phone: '',
  })
  const [imagePreview, setImagePreview] = useState(null)

  // Charger les formateurs depuis l'API
  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/trainers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Transformer les données pour correspondre au format attendu
        const formattedTrainers = (data.data || []).map(trainer => ({
          id: trainer.id,
          name: trainer.name,
          title: trainer.title,
          bio: trainer.bio,
          bioExtended: trainer.bio_extended || '',
          image: trainer.image_base64 || trainer.image_url || '',
          image_base64: trainer.image_base64 || null,
          image_url: trainer.image_url || null,
          email: trainer.email || '',
          phone: trainer.phone || '',
          experiences: trainer.experiences || [],
          skills: trainer.skills || [],
          technologies: trainer.technologies || [],
        }))
        setTrainers(formattedTrainers)
      } else {
        toast.error(data.message || 'Erreur lors du chargement des formateurs')
        setTrainers([])
      }
    } catch (error) {
      console.error('Error fetching trainers:', error)
      toast.error('Erreur lors du chargement des formateurs')
      setTrainers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainers()
    // Vérifier si l'utilisateur est authentifié et en mode admin
    if (isAuthenticated) {
      const adminMode = localStorage.getItem('adminMode') === 'true'
      setIsAdminMode(adminMode)
    } else {
      setIsAdminMode(false)
      localStorage.setItem('adminMode', 'false')
    }
  }, [isAuthenticated])

  const handleAddTrainer = async () => {
    if (!newTrainer.name || !newTrainer.title || !newTrainer.bio) {
      toast.error('Veuillez remplir au moins le nom, le titre et la bio')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/trainers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newTrainer.name,
          title: newTrainer.title,
          bio: newTrainer.bio,
          bio_extended: newTrainer.bio_extended || '',
          image_base64: newTrainer.image_base64 || null,
          email: newTrainer.email || null,
          phone: newTrainer.phone || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Formateur ajouté avec succès!')
        setNewTrainer({
          name: '',
          title: '',
          bio: '',
          bio_extended: '',
          image_base64: '',
          email: '',
          phone: '',
        })
        setImagePreview(null)
        handleCloseForm()
        fetchTrainers() // Recharger les formateurs depuis l'API
      } else {
        toast.error(data.message || 'Erreur lors de l\'ajout du formateur')
      }
    } catch (error) {
      console.error('Error adding trainer:', error)
      toast.error('Erreur lors de l\'ajout du formateur')
    }
  }

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce formateur ?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/trainers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Formateur supprimé!')
        fetchTrainers() // Recharger les formateurs depuis l'API
      } else {
        toast.error(data.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting trainer:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const toggleAdminMode = () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour accéder au mode admin')
      navigate('/login')
      return
    }
    
    const newMode = !isAdminMode
    setIsAdminMode(newMode)
    localStorage.setItem('adminMode', newMode.toString())
    toast.success(newMode ? 'Mode admin activé' : 'Mode admin désactivé')
  }

  const handleLogout = () => {
    logout()
    setIsAdminMode(false)
    setShowAddForm(false)
    toast.success('Déconnexion réussie')
    navigate('/trainers')
  }

  const handleImageError = (trainerId) => {
    setImageErrors(prev => ({ ...prev, [trainerId]: true }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image')
        return
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image est trop grande. Taille maximale : 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setNewTrainer({ ...newTrainer, image_base64: base64String })
        setImagePreview(base64String)
        toast.success('Image chargée avec succès')
      }
      reader.onerror = () => {
        toast.error('Erreur lors du chargement de l\'image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setNewTrainer({ ...newTrainer, image_base64: '' })
    setImagePreview(null)
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setNewTrainer({
      name: '',
      title: '',
      bio: '',
      bio_extended: '',
      image_base64: '',
      email: '',
      phone: '',
    })
    setImagePreview(null)
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Formateurs</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Des experts passionnés pour vous accompagner dans votre apprentissage
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admin Toggle */}
      <section className="py-4 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center space-x-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-semibold transition-colors bg-primary-600 text-white hover:bg-primary-700"
              >
                Se connecter
              </Link>
            ) : (
              <>
                <button
                  onClick={toggleAdminMode}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isAdminMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  {isAdminMode ? 'Désactiver Admin' : 'Mode Admin'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Add Trainer Form */}
      {isAdminMode && showAddForm && (
        <section className="py-8 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ajouter un Formateur</h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={newTrainer.name}
                    onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Nom du formateur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Titre / Poste *
                  </label>
                  <input
                    type="text"
                    value={newTrainer.title}
                    onChange={(e) => setNewTrainer({ ...newTrainer, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: Formateur Fullstack JavaScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bio courte *
                  </label>
                  <textarea
                    value={newTrainer.bio}
                    onChange={(e) => setNewTrainer({ ...newTrainer, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Description courte du formateur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bio complète
                  </label>
                  <textarea
                    value={newTrainer.bio_extended}
                    onChange={(e) => setNewTrainer({ ...newTrainer, bio_extended: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Description détaillée (optionnel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Photo du formateur
                  </label>
                      {imagePreview || newTrainer.image_base64 ? (
                    <div>
                      <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 mb-2">
                        <img
                          src={imagePreview || newTrainer.image_base64}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Supprimer l'image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Cliquez sur "Changer l'image" pour remplacer
                      </p>
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <Upload size={18} className="mr-2" />
                        <span>Changer l'image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF jusqu'à 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newTrainer.email}
                      onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={newTrainer.phone}
                      onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCloseForm}
                    type="button"
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddTrainer}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Trainers Grid */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {isAdminMode && !showAddForm && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Ajouter un Formateur</span>
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Chargement des formateurs...
              </p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Aucun formateur pour le moment.
              </p>
              {isAdminMode && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary mt-4 inline-flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Ajouter le premier formateur</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    {/* Image du formateur */}
                    <div className="h-64 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                      {(trainer.image || trainer.image_base64) && !imageErrors[trainer.id] ? (
                        <img
                          src={trainer.image_base64 || trainer.image}
                          alt={trainer.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(trainer.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="text-white" size={80} />
                        </div>
                      )}
                    </div>

                    {/* Actions Admin */}
                    {isAdminMode && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => handleDeleteTrainer(trainer.id)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {trainer.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold mb-4">
                      {trainer.title}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {trainer.bio}
                    </p>

                    {(trainer.email || trainer.phone) && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {trainers.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <BookOpen className="mx-auto mb-6" size={64} />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à commencer votre formation ?
              </h2>
              <p className="text-xl mb-8 text-primary-100">
                Contactez-nous pour en savoir plus sur nos programmes de formation et découvrez
                comment nos formateurs peuvent vous accompagner dans votre parcours de développement.
              </p>
              <a
                href="/contact"
                className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 inline-block"
              >
                Contactez-nous
              </a>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Trainers

