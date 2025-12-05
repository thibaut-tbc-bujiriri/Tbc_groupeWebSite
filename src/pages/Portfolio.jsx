import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, Code, Smartphone, Globe } from 'lucide-react'

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'Application E-Commerce',
      category: 'Web',
      description: 'Plateforme e-commerce complète avec gestion de panier, paiement et administration.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=E-Commerce+App',
      icon: Globe,
    },
    {
      id: 2,
      title: 'Application Mobile de Livraison',
      category: 'Mobile',
      description: 'Application mobile cross-platform pour la gestion de livraisons et suivi en temps réel.',
      technologies: ['React Native', 'Firebase', 'Redux'],
      image: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Delivery+App',
      icon: Smartphone,
    },
    {
      id: 3,
      title: 'Plateforme de Formation en Ligne',
      category: 'Web',
      description: 'Système de gestion de cours en ligne avec vidéos, quiz et suivi de progression.',
      technologies: ['Next.js', 'PostgreSQL', 'AWS'],
      image: 'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Learning+Platform',
      icon: Code,
    },
    {
      id: 4,
      title: 'Application de Gestion Financière',
      category: 'Web',
      description: 'Outil de gestion financière personnelle avec tableaux de bord et rapports détaillés.',
      technologies: ['Vue.js', 'Node.js', 'Chart.js'],
      image: 'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Finance+App',
      icon: Globe,
    },
    {
      id: 5,
      title: 'Application de Réservation',
      category: 'Mobile',
      description: 'Application mobile pour la réservation de services avec calendrier et notifications.',
      technologies: ['React Native', 'GraphQL', 'Apollo'],
      image: 'https://via.placeholder.com/600x400/ef4444/ffffff?text=Booking+App',
      icon: Smartphone,
    },
    {
      id: 6,
      title: 'Site Vitrine Corporate',
      category: 'Web',
      description: 'Site web moderne et responsive pour une entreprise avec blog intégré.',
      technologies: ['React', 'Contentful', 'TailwindCSS'],
      image: 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Corporate+Site',
      icon: Globe,
    },
  ]

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-primary-600/0 hover:bg-primary-600/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                      <button className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <ExternalLink size={20} />
                      </button>
                      <button className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Github size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <project.icon className="text-primary-600 dark:text-primary-400" size={20} />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
