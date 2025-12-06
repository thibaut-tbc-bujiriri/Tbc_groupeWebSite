import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, Code, Smartphone, Globe, FolderOpen } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8080/Tbc_Groupe/backend'

const Portfolio = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Transformer les données pour correspondre au format attendu
        const formattedProjects = (data.data || []).map(project => ({
          id: project.id,
          title: project.title,
          category: project.category || 'Web',
          description: project.description,
          technologies: Array.isArray(project.technologies) 
            ? project.technologies 
            : (project.technologies ? JSON.parse(project.technologies) : []),
          image: project.image_base64 || project.image_url || '',
          image_base64: project.image_base64 || null,
          image_url: project.image_url || null,
          project_url: project.project_url || null,
          github_url: project.github_url || null,
          is_featured: project.is_featured || false,
          // Déterminer l'icône en fonction de la catégorie
          icon: project.category === 'Mobile' ? Smartphone : 
                project.category === 'Web' ? Globe : Code,
        }))
        setProjects(formattedProjects)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (projectId) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }))
  }

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Mobile':
        return Smartphone
      case 'Web':
        return Globe
      default:
        return Code
    }
  }

  // Fonction pour normaliser les URLs et s'assurer qu'elles utilisent HTTPS
  const normalizeUrl = (url) => {
    if (!url) return null
    
    // Si l'URL commence déjà par http:// ou https://, la retourner telle quelle
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Si c'est localhost, ne pas l'utiliser
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return null
      }
      return url
    }
    
    // Si l'URL ne commence pas par http:// ou https://, ajouter https://
    // Mais ne pas ajouter https:// si c'est localhost
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return null
    }
    
    // Ajouter https:// si l'URL ne commence pas par un protocole
    return `https://${url.replace(/^\/\//, '')}`
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Portfolio</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Découvrez nos réalisations et projets de développement
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Voici une sélection de nos projets récents. Chaque projet est développé avec les
              dernières technologies et les meilleures pratiques de l'industrie.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Chargement des projets...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Aucun projet pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const ProjectIcon = getIconForCategory(project.category)
                const projectUrl = normalizeUrl(project.project_url)
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 ${
                      projectUrl ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => {
                      if (projectUrl) {
                        window.open(projectUrl, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                      {project.image && !imageErrors[project.id] ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(project.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ProjectIcon className="text-white" size={64} />
                        </div>
                      )}
                      {project.is_featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Mis en avant
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 dark:bg-gray-800/90 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-semibold">
                          {project.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-primary-600/0 hover:bg-primary-600/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                          {normalizeUrl(project.project_url) && (
                            <a
                              href={normalizeUrl(project.project_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Voir le projet"
                              onClick={(e) => {
                                // S'assurer que le lien s'ouvre dans un nouvel onglet
                                e.stopPropagation()
                              }}
                            >
                              <ExternalLink size={20} />
                            </a>
                          )}
                          {normalizeUrl(project.github_url) && (
                            <a
                              href={normalizeUrl(project.github_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Voir sur GitHub"
                              onClick={(e) => {
                                // S'assurer que le lien s'ouvre dans un nouvel onglet
                                e.stopPropagation()
                              }}
                            >
                              <Github size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <ProjectIcon className="text-primary-600 dark:text-primary-400" size={20} />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Plus de projets à venir
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Nous travaillons constamment sur de nouveaux projets passionnants. Restez connecté
              pour découvrir nos dernières réalisations.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Vous avez un projet en tête ?{' '}
              <Link to="/contact" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Contactez-nous
              </Link>{' '}
              pour discuter de vos besoins.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio
