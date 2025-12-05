import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // API Backend pour enregistrer les messages dans la base de données
  const API_BASE_URL = 'http://localhost:8080/Tbc_Groupe/backend'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      // Vérifier le Content-Type de la réponse
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Réponse non-JSON reçue:', text.substring(0, 200))
        throw new Error('Le serveur a retourné une réponse invalide. Vérifiez la console pour plus de détails.')
      }

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Message envoyé avec succès ! Nous vous répondrons rapidement.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error.message) {
        toast.error(error.message)
      } else {
        toast.error('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'thibauttbcbujiriri@gmail.com',
      link: 'mailto:thibauttbcbujiriri@gmail.com',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+243 979 823 604',
      link: 'tel:+243979823604',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Office 2 – Kanisa La Mungu, Goma, Nord-Kivu, RDC',
      link: null,
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-nous</h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Nous sommes là pour répondre à toutes vos questions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Informations de contact</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                N'hésitez pas à nous contacter pour discuter de votre projet ou pour toute question.
                Nous répondrons dans les plus brefs délais.
              </p>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg flex-shrink-0">
                      <info.icon className="text-primary-600 dark:text-primary-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Décrivez votre projet ou votre question..."
                    />
                  </div>


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Pourquoi nous choisir ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  icon: CheckCircle,
                  title: 'Réponse rapide',
                  description: 'Nous répondons à toutes les demandes sous 24 heures',
                },
                {
                  icon: CheckCircle,
                  title: 'Expertise technique',
                  description: 'Plusieurs années d\'expérience en développement web et mobile',
                },
                {
                  icon: CheckCircle,
                  title: 'Accompagnement complet',
                  description: 'De la conception à la mise en production et maintenance',
                },
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <item.icon className="text-primary-600 dark:text-primary-400 mx-auto mb-3" size={32} />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
