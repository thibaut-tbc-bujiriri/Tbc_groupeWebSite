import { motion } from 'framer-motion'
import { Code, Smartphone, Search, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Services = () => {
  const services = [
    {
      icon: Code,
      title: 'Développement d\'Applications Web',
      description: 'Nous créons des applications web modernes, performantes et évolutives qui répondent aux besoins spécifiques de votre entreprise.',
      features: [
        'Applications web responsive et cross-browser',
        'Architecture moderne avec React, Vue.js ou Angular',
        'API RESTful et GraphQL',
        'Intégration de bases de données',
        'Applications Single Page (SPA)',
        'Optimisation des performances',
        'Tests unitaires et d\'intégration',
        'Déploiement et maintenance',
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Next.js', 'TypeScript'],
    },
    {
      icon: Smartphone,
      title: 'Développement Mobile',
      description: 'Des applications mobiles natives et cross-platform pour iOS et Android qui offrent une expérience utilisateur exceptionnelle.',
      features: [
        'Applications natives iOS et Android',
        'Applications cross-platform avec React Native',
        'Interface utilisateur intuitive et moderne',
        'Intégration avec les APIs mobiles',
        'Optimisation des performances',
        'Publication sur les stores',
        'Maintenance et mises à jour',
        'Support technique',
      ],
      technologies: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Expo', 'Firebase'],
    },
    {
      icon: Search,
      title: 'Référencement SEO',
      description: 'Améliorez votre visibilité en ligne et augmentez votre trafic organique grâce à nos stratégies SEO sur mesure.',
      features: [
        'Audit SEO complet de votre site',
        'Optimisation on-page et off-page',
        'Recherche de mots-clés stratégiques',
        'Optimisation du contenu',
        'Stratégie de link building',
        'Suivi et rapports d\'analyse',
        'Optimisation technique (Core Web Vitals)',
        'Stratégie de contenu SEO-friendly',
      ],
      technologies: ['Google Analytics', 'Google Search Console', 'Ahrefs', 'SEMrush'],
    },
    {
      icon: GraduationCap,
      title: 'Formations en Développement Web et Mobile',
      description: 'Formations complètes et pratiques pour maîtriser le développement web et mobile en environnement JavaScript.',
      features: [
        'Formations adaptées à tous les niveaux',
        'Programmes pratiques avec projets réels',
        'Support et suivi personnalisé',
        'Certification en fin de formation',
        'Formations en présentiel et à distance',
        'Ressources et documentation complètes',
        'Communauté d\'apprenants',
        'Accès à un réseau professionnel',
      ],
      technologies: ['JavaScript', 'React', 'Node.js', 'React Native', 'TypeScript', 'MongoDB'],
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Services</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Des solutions complètes pour tous vos besoins numériques
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="flex-shrink-0">
                  <div className="bg-primary-100 dark:bg-primary-900 w-32 h-32 rounded-2xl flex items-center justify-center">
                    <service.icon className="text-primary-600 dark:text-primary-400" size={64} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {service.title}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-3">
                        <CheckCircle className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
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

      {/* JavaScript Expertise */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Code className="mx-auto mb-6" size={64} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Spécialisation en Environnement JavaScript
            </h2>
            <p className="text-xl mb-8 text-primary-100 leading-relaxed">
              Chez Tbc Groupe, nous sommes spécialisés dans l'écosystème JavaScript. Notre expertise
              couvre tous les aspects du développement moderne : du frontend avec React, Vue.js et
              Angular, au backend avec Node.js et Express, en passant par le mobile avec React Native.
              Nous maîtrisons également TypeScript, les outils de build modernes, et les meilleures
              pratiques de développement JavaScript.
            </p>
            <Link to="/trainers" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center">
              Découvrir notre expertise
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <Link to="/contact" className="btn-primary">
              Obtenir un devis gratuit
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services
