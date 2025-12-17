import { useState, useEffect } from 'react'
import { FolderOpen, ExternalLink, Github } from 'lucide-react'
import { portfolioApi } from '../lib/supabaseApi'

const Portfolio = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const result = await portfolioApi.getAll()
      
      if (result.success) {
        const data = result.data || []
        setProjects(data)
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notre Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez nos réalisations et projets accomplis
          </p>
        </div>

        {/* Filtres */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <FolderOpen className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600 dark:text-gray-400">Aucun projet pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                  {project.image_base64 || project.image_url ? (
                    <img
                      src={project.image_base64 || project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="text-white" size={64} />
                    </div>
                  )}
                  {project.is_featured && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                      ⭐ En vedette
                    </span>
                  )}
                  {project.category && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Liens */}
                  <div className="flex space-x-3">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink size={18} />
                        <span className="text-sm">Voir</span>
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Github size={18} />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Portfolio
