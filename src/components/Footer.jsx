import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const [logoError, setLogoError] = useState(false)
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              {!logoError ? (
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/20 backdrop-blur-md p-3 shadow-xl flex items-center justify-center ring-2 ring-white/40 overflow-hidden mb-4">
                  <img 
                    src="/images/logo-tbc-groupe.ico" 
                    alt="Tbc Groupe Logo"
                    className="h-full w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <h3 className="text-white text-xl font-bold mb-2">Tbc Groupe</h3>
              )}
            </div>
            <p className="mb-4">
              Expert en développement web et mobile, référencement SEO et formations 
              en environnement JavaScript.
            </p>
            <p className="text-sm">
              Basé à Goma, Nord-Kivu<br />
              République Démocratique du Congo
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary-400 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-white text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:thibauttbcbujiriri@gmail.com"
                  className="hover:text-primary-400 transition-colors flex items-center space-x-2"
                >
                  <span>✉</span>
                  <span>thibauttbcbujiriri@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+243979823604"
                  className="hover:text-primary-400 transition-colors flex items-center space-x-2"
                >
                  <span>📞</span>
                  <span>+243 979 823 604</span>
                </a>
              </li>
              <li className="text-sm mt-4">
                <span>📍</span>
                <span className="ml-2">
                  Office 2 – Kanisa La Mungu<br />
                  Goma, Nord-Kivu
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm">
            © {currentYear} Tbc Groupe. Tous droits réservés. | Propulsé par{' '}
            <span className="text-primary-400">React + Vite</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
