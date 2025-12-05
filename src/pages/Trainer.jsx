import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Code, BookOpen, Users, Award, CheckCircle, Rocket } from 'lucide-react'

const Trainer = () => {
  const [imageError, setImageError] = useState(false)
  const experiences = [
    {
      year: '2020 - Présent',
      title: 'Formateur Fullstack JavaScript',
      description: 'Formation de développeurs aux technologies modernes du web et du mobile dans l\'écosystème JavaScript.',
    },
    {
      year: '2018 - Présent',
      title: 'Développeur Fullstack JavaScript',
      description: 'Développement d\'applications web et mobile pour diverses entreprises et startups.',
    },
  ]

  const skills = [
    { name: 'React / React Native', level: 95 },
    { name: 'Node.js / Express', level: 90 },
    { name: 'JavaScript / TypeScript', level: 95 },
    { name: 'MongoDB / PostgreSQL', level: 85 },
    { name: 'Next.js / Vue.js', level: 88 },
    { name: 'Git / GitHub', level: 90 },
  ]

  const technologies = [
    'JavaScript ES6+',
    'TypeScript',
    'React',
    'React Native',
    'Next.js',
    'Node.js',
    'Express',
    'Vue.js',
    'Angular',
    'MongoDB',
    'PostgreSQL',
    'Firebase',
    'GraphQL',
    'REST APIs',
    'Git',
    'Docker',
    'AWS',
    'TailwindCSS',
  ]

  const trainingServices = [
    {
      icon: BookOpen,
      title: 'Formation JavaScript Fondamentaux',
      description: 'Maîtrisez les bases du JavaScript moderne : variables, fonctions, objets, arrays, async/await, etc.',
      duration: '4 semaines',
    },
    {
      icon: Code,
      title: 'Formation React & React Native',
      description: 'Apprenez à développer des applications web et mobile avec React et React Native.',
      duration: '8 semaines',
    },
    {
      icon: Rocket,
      title: 'Formation Fullstack JavaScript',
      description: 'Formation complète pour devenir développeur fullstack : frontend, backend, base de données.',
      duration: '12 semaines',
    },
    {
      icon: Users,
      title: 'Formation Node.js & Express',
      description: 'Créez des APIs RESTful et des applications backend performantes avec Node.js et Express.',
      duration: '6 semaines',
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Formateur Fullstack JavaScript
            </h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Thibaut Tbc Bujiriri - Partageons le savoir, construisons l'avenir
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="relative flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary-600 dark:border-primary-400 shadow-lg">
                    {!imageError ? (
                      <img 
                        src="/images/thibaut-profile.jpg" 
                        alt="Thibaut Tbc Bujiriri - Formateur & Développeur Fullstack JavaScript"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="bg-primary-100 dark:bg-primary-900 w-full h-full rounded-full flex items-center justify-center">
                        <Users className="text-primary-600 dark:text-primary-400" size={64} />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Thibaut Tbc Bujiriri
                  </h2>
                  <p className="text-xl text-primary-600 dark:text-primary-400 mb-4">
                    Formateur & Développeur Fullstack JavaScript
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Passionné par le développement web et mobile, je partage mon expertise et mon
                expérience à travers des formations complètes et pratiques. Mon objectif est de
                former la prochaine génération de développeurs JavaScript compétents et autonomes.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Avec plusieurs années d'expérience en développement fullstack et en formation,
                j'ai accompagné de nombreux étudiants dans leur parcours vers la maîtrise des
                technologies modernes. Ma pédagogie privilégie la pratique et la réalisation de
                projets concrets.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="section-title text-center mb-12">Expérience</h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 dark:bg-primary-900 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="text-primary-600 dark:text-primary-400" size={24} />
                    </div>
                    <div>
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">{exp.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-2">{exp.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="section-title text-center mb-12">Compétences Techniques</h2>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-primary-600 dark:bg-primary-500 h-3 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="section-title text-center mb-12">Technologies Maîtrisées</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md text-gray-700 dark:text-gray-300 font-medium hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Training Services */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-center mb-12">Prestations de Formation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {trainingServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="text-primary-600 dark:text-primary-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">{service.duration}</span>
                    <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              comment nous pouvons vous accompagner dans votre parcours de développement.
            </p>
            <Link to="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
              Contactez-nous
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Trainer
