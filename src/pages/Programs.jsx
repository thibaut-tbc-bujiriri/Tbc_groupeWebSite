import { useState, useEffect } from 'react'
import { GraduationCap, Clock, Users, Euro, User, ChevronRight, X } from 'lucide-react'
import { trainingProgramsApi } from '../lib/supabaseApi'
import { motion } from 'framer-motion'

const Programs = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState(null)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const result = await trainingProgramsApi.getAll()
      
      if (result.success) {
        setPrograms(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
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
      debutant: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermediaire: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      avance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des programmes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <GraduationCap className="mx-auto mb-6" size={64} />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Programmes de Formation</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Des formations complètes et pratiques pour développer vos compétences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {programs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <GraduationCap className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-600 dark:text-gray-400">Aucun programme disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedProgram(program)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {program.title}
                        </h3>
                        {program.level && (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(program.level)}`}>
                            {getLevelLabel(program.level)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      {program.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                        <div className="flex items-center space-x-1">
                          <Euro size={16} />
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            {program.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {program.trainers && (program.trainers.name || program.trainers.title) && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <User size={16} />
                        <span>{program.trainers.name || program.trainers.title}</span>
                      </div>
                    )}

                    {program.topics && Array.isArray(program.topics) && program.topics.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Sujets abordés:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {program.topics.slice(0, 3).map((topic, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                          {program.topics.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              +{program.topics.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center space-x-2 transition-colors">
                      <span>En savoir plus</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal détail programme */}
      {selectedProgram && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProgram(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{selectedProgram.title}</h2>
                  {selectedProgram.level && (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedProgram.level === 'debutant' ? 'bg-green-500' :
                      selectedProgram.level === 'intermediaire' ? 'bg-blue-500' :
                      selectedProgram.level === 'avance' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      {getLevelLabel(selectedProgram.level)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {selectedProgram.duration && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="text-primary-600 dark:text-primary-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProgram.duration}</p>
                    </div>
                  </div>
                )}
                {selectedProgram.max_participants && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="text-primary-600 dark:text-primary-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Participants max</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProgram.max_participants}</p>
                    </div>
                  </div>
                )}
                {selectedProgram.price && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Euro className="text-primary-600 dark:text-primary-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Prix</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProgram.price}€</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedProgram.trainers && (selectedProgram.trainers.name || selectedProgram.trainers.title) && (
                <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="text-primary-600 dark:text-primary-400" size={20} />
                    <span className="font-semibold text-gray-900 dark:text-white">Formateur</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedProgram.trainers.name || selectedProgram.trainers.title}
                  </p>
                </div>
              )}

              {selectedProgram.topics && Array.isArray(selectedProgram.topics) && selectedProgram.topics.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center space-x-2 font-semibold mb-3 text-gray-900 dark:text-white">
                    <GraduationCap className="text-primary-600 dark:text-primary-400" size={20} />
                    <span>Sujets abordés</span>
                  </h3>
                  <ul className="space-y-2">
                    {selectedProgram.topics.map((topic, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                        <ChevronRight className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" size={16} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-center font-semibold transition-colors"
                >
                  S'inscrire à ce programme
                </a>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Programs

