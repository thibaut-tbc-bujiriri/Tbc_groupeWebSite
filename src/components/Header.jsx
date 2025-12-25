import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'
import { Settings, LogIn } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    // Vérifier la position initiale au chargement
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/about', label: 'À propos' },
    { path: '/services', label: 'Services' },
    { path: '/trainers', label: 'Formateurs' },
    { path: '/programs', label: 'Programmes' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {!logoError ? (
              <div className={`h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white dark:bg-gray-800 shadow-lg ring-2 ring-primary-600/20 dark:ring-primary-400/20 p-2' 
                  : 'bg-white/30 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] ring-2 ring-white/50 p-2'
              }`}>
                <img 
                  src="/images/logo-tbc-groupe.ico" 
                  alt="Tbc Groupe Logo"
                  className="h-full w-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <span className={`font-bold text-xl transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-white font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
              }`}>
                Tbc Groupe
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? isScrolled
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] border-b-2 border-white shadow-[0_2px_0_rgba(255,255,255,0.5)]'
                    : isScrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-yellow-200 dark:hover:text-primary-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className={`font-medium transition-colors duration-300 flex items-center space-x-1 ${
                  location.pathname === '/admin'
                    ? isScrolled
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] border-b-2 border-white shadow-[0_2px_0_rgba(255,255,255,0.5)]'
                    : isScrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-yellow-200 dark:hover:text-primary-400'
                }`}
              >
                <Settings size={18} />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`font-medium transition-colors duration-300 flex items-center space-x-1 ${
                  location.pathname === '/login'
                    ? isScrolled
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] border-b-2 border-white shadow-[0_2px_0_rgba(255,255,255,0.5)]'
                    : isScrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-yellow-200 dark:hover:text-primary-400'
                }`}
              >
                <LogIn size={18} />
                <span>Se connecter</span>
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
              }`}
              aria-label="Toggle menu"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition-colors duration-300 ${
                      location.pathname === link.path
                        ? isScrolled
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : isScrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-yellow-200 dark:hover:text-primary-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition-colors duration-300 flex items-center space-x-2 ${
                      location.pathname === '/admin'
                        ? isScrolled
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                      : isScrolled 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                        : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-yellow-200 dark:hover:text-primary-400'
                    }`}
                  >
                    <Settings size={18} />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition-colors duration-300 flex items-center space-x-2 ${
                      location.pathname === '/login'
                        ? isScrolled
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                      : isScrolled 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                        : 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-yellow-200 dark:hover:text-primary-400'
                    }`}
                  >
                    <LogIn size={18} />
                    <span>Se connecter</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header
