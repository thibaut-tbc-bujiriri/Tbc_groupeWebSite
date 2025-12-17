import { useState, useEffect } from 'react'
import { Users, Mail, Phone, Award, BookOpen, Code } from 'lucide-react'
import { trainersApi } from '../lib/supabaseApi'

const Trainers = () => {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState(null)

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const result = await trainersApi.getAll()
      
      if (result.success) {
        setTrainers(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching trainers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des formateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Formateurs</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez notre équipe d'experts passionnés, dédiés à votre réussite
          </p>
        </div>

        {trainers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Users className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600 dark:text-gray-400">Aucun formateur pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setSelectedTrainer(trainer)}
              >
                <div className="relative h-64 bg-gradient-to-br from-primary-400 to-primary-600">
                  {trainer.image_base64 || trainer.image_url ? (
                    <img
                      src={trainer.image_base64 || trainer.image_url}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="text-white" size={80} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold mb-3">
                    {trainer.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {trainer.bio}
                  </p>
                  
                  {(trainer.email || trainer.phone) && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      {trainer.email && (
                        <a
                          href={`mailto:${trainer.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
                        >
                          <Mail size={16} />
                          <span>{trainer.email}</span>
                        </a>
                      )}
                      {trainer.phone && (
                        <a
                          href={`tel:${trainer.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
                        >
                          <Phone size={16} />
                          <span>{trainer.phone}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal détail formateur */}
        {selectedTrainer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTrainer(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 bg-gradient-to-br from-primary-400 to-primary-600">
                {selectedTrainer.image_base64 || selectedTrainer.image_url ? (
                  <img
                    src={selectedTrainer.image_base64 || selectedTrainer.image_url}
                    alt={selectedTrainer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="text-white" size={100} />
                  </div>
                )}
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">{selectedTrainer.name}</h2>
                <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg mb-4">
                  {selectedTrainer.title}
                </p>
                
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap">
                    {selectedTrainer.bio_extended || selectedTrainer.bio}
                  </p>
                </div>

                {/* Expériences */}
                {selectedTrainer.trainer_experiences && selectedTrainer.trainer_experiences.length > 0 && (
                  <div className="mb-6">
                    <h3 className="flex items-center space-x-2 font-semibold mb-3">
                      <Award size={20} className="text-primary-600" />
                      <span>Expériences</span>
                    </h3>
                    <ul className="space-y-2">
                      {selectedTrainer.trainer_experiences.map((exp, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300">
                          • {exp.title} - {exp.company}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Compétences */}
                {selectedTrainer.trainer_skills && selectedTrainer.trainer_skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="flex items-center space-x-2 font-semibold mb-3">
                      <BookOpen size={20} className="text-primary-600" />
                      <span>Compétences</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.trainer_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {selectedTrainer.trainer_technologies && selectedTrainer.trainer_technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="flex items-center space-x-2 font-semibold mb-3">
                      <Code size={20} className="text-primary-600" />
                      <span>Technologies</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.trainer_technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                {(selectedTrainer.email || selectedTrainer.phone) && (
                  <div className="pt-4 border-t flex flex-wrap gap-4">
                    {selectedTrainer.email && (
                      <a
                        href={`mailto:${selectedTrainer.email}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <Mail size={18} />
                        <span>Contacter</span>
                      </a>
                    )}
                    {selectedTrainer.phone && (
                      <a
                        href={`tel:${selectedTrainer.phone}`}
                        className="flex items-center space-x-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                      >
                        <Phone size={18} />
                        <span>{selectedTrainer.phone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Trainers
