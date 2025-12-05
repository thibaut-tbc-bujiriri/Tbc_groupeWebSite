import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Smartphone, Search, GraduationCap, Zap } from 'lucide-react'

const Home = () => {
  const services = [
    {
      icon: Code,
      title: 'Développement Web',
      description: 'Applications web modernes et performantes avec React, Node.js et les dernières technologies JavaScript.',
    },
    {
      icon: Smartphone,
      title: 'Développement Mobile',
      description: 'Applications mobiles cross-platform et natives pour iOS et Android.',
    },
    {
      icon: Search,
      title: 'Référencement SEO',
      description: 'Optimisation pour les moteurs de recherche et amélioration de votre visibilité en ligne.',
    },
    {
      icon: GraduationCap,
      title: 'Formations',
      description: 'Formations complètes en développement web et mobile, spécialisées en environnement JavaScript.',
    },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transformez vos idées en{' '}
              <span className="text-yellow-300">réalisations numériques</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Expert en développement web et mobile, référencement SEO et formations JavaScript.
              <br />
              Votre partenaire de confiance pour le succès numérique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Contactez-nous
                <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link to="/services" className="btn-secondary bg-transparent border-white dark:border-gray-300 text-white dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50">
                Nos services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="section-title">Bienvenue chez Tbc Groupe</h2>
            <p className="section-subtitle">
              Nous sommes une entreprise spécialisée dans le développement d'applications web et mobile,
              le référencement SEO et les formations en développement. Basés à Goma, en République
              Démocratique du Congo, nous combinons expertise technique et innovation pour créer des
              solutions numériques sur mesure qui propulsent votre entreprise vers le succès.
            </p>
            <Link to="/about" className="btn-primary inline-block">
              En savoir plus
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Nos Services</h2>
            <p className="section-subtitle">
              Des solutions complètes pour tous vos besoins numériques
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="text-primary-600 dark:text-primary-400" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              Voir tous les services
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Zap className="mx-auto mb-6" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Spécialisation en Environnement JavaScript
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Notre expertise couvre l'écosystème JavaScript dans toute sa diversité : React, Node.js,
              Express, Next.js, Vue.js, Angular et bien plus encore. Nous maîtrisons les frameworks
              les plus récents et les meilleures pratiques du développement moderne.
            </p>
            <Link to="/trainers" className="btn-secondary bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              Découvrir notre expertise
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900 dark:bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl mb-8 text-gray-300 dark:text-gray-400">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment
              nous pouvons vous aider à atteindre vos objectifs numériques.
            </p>
            <Link to="/contact" className="btn-primary bg-primary-600 hover:bg-primary-700">
              Obtenir un devis gratuit
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
