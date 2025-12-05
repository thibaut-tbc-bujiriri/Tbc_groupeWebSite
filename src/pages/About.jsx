import { motion } from 'framer-motion'
import { useState } from 'react'
import { Target, Eye, Users, Award } from 'lucide-react'

const About = () => {
  const [imageError, setImageError] = useState(false)
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de Tbc Groupe</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Votre partenaire de confiance pour la transformation numérique
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="section-title text-left">Notre Histoire</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Tbc Groupe est une entreprise de développement web et mobile basée à Goma, dans la
                province du Nord-Kivu, en République Démocratique du Congo. Fondée par Thibaut Tbc
                Bujiriri, un formateur et développeur Fullstack JavaScript passionné, notre entreprise
                se spécialise dans la création de solutions numériques innovantes et performantes.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Depuis notre création, nous nous sommes engagés à fournir des services de haute qualité
                qui répondent aux besoins spécifiques de nos clients. Notre approche combine expertise
                technique, créativité et compréhension approfondie des enjeux du marché numérique
                congolais et international.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <Eye className="text-primary-600 dark:text-primary-400 mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Notre Vision</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Devenir le leader régional en développement web et mobile, en contribuant à la
                transformation numérique de l'Afrique centrale. Nous aspirons à être reconnus pour
                notre excellence technique, notre innovation et notre engagement envers la formation
                de la prochaine génération de développeurs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <Target className="text-primary-600 dark:text-primary-400 mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Notre Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Fournir des solutions numériques de qualité supérieure qui permettent à nos clients
                d'atteindre leurs objectifs commerciaux. Nous nous engageons à offrir des services
                personnalisés, à utiliser les technologies les plus récentes et à maintenir des
                standards d'excellence dans tout ce que nous faisons.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="section-title text-center mb-12">CEO & FOUNDER</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
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
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Thibaut Tbc Bujiriri
                  </h3>
                  <p className="text-xl text-primary-600 dark:text-primary-400 mb-4">
                    Formateur & Développeur Fullstack JavaScript
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Thibaut Tbc Bujiriri est un développeur fullstack passionné par l'écosystème
                    JavaScript. Avec une solide expertise en développement web et mobile, il combine
                    ses compétences techniques avec une passion pour l'enseignement et la transmission
                    de connaissances.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    En tant que formateur, il a formé de nombreux développeurs aux technologies
                    modernes du web, contribuant ainsi au développement du secteur numérique en
                    République Démocratique du Congo. Sa vision est de démocratiser l'accès aux
                    compétences en développement et de créer un écosystème tech florissant dans la
                    région.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Son approche pédagogique privilégie la pratique et la réalisation de projets
                    concrets, permettant à ses étudiants d'acquérir une expérience pratique précieuse
                    tout en développant leur portfolio professionnel.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Les principes qui guident notre travail au quotidien
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description: 'Nous visons l\'excellence dans chaque projet, en respectant les meilleures pratiques et standards de l\'industrie.',
              },
              {
                icon: Users,
                title: 'Innovation',
                description: 'Nous restons à la pointe de la technologie pour offrir des solutions modernes et innovantes à nos clients.',
              },
              {
                icon: Target,
                title: 'Engagement',
                description: 'Nous nous engageons pleinement envers nos clients et leurs projets, en garantissant des résultats de qualité.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center"
              >
                <value.icon className="mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-primary-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
