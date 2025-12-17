import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Settings, LogOut, Users, Briefcase, FolderOpen, 
  Mail, GraduationCap, Wrench, Menu, X, Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

// Import des sections
import TrainersSection from '../components/admin/TrainersSection'
import ServicesSection from '../components/admin/ServicesSection'
import PortfolioSection from '../components/admin/PortfolioSection'
import MessagesSection from '../components/admin/MessagesSection'
import TrainingProgramsSection from '../components/admin/TrainingProgramsSection'
import SettingsSection from '../components/admin/SettingsSection'
import AdminsSection from '../components/admin/AdminsSection'

const Admin = () => {
  const { isAuthenticated, logout, isSuperAdmin, getUserRole } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('trainers')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const userRole = getUserRole()
  const isSuper = isSuperAdmin()

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour accéder à l\'administration')
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    navigate('/')
  }

  if (!isAuthenticated) {
    return null
  }

  // Définir les sections selon le rôle
  const allMenuItems = [
    { id: 'trainers', label: 'Formateurs', icon: Users, roles: ['super_admin', 'admin', 'editor'] },
    { id: 'services', label: 'Services', icon: Briefcase, roles: ['super_admin'] },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen, roles: ['super_admin'] },
    { id: 'messages', label: 'Messages', icon: Mail, roles: ['super_admin', 'admin', 'editor'] },
    { id: 'programs', label: 'Programmes', icon: GraduationCap, roles: ['super_admin', 'admin', 'editor'] },
    { id: 'settings', label: 'Paramètres', icon: Wrench, roles: ['super_admin'] },
    { id: 'admins', label: 'Gestion des Admins', icon: Shield, roles: ['super_admin'] },
  ]

  // Filtrer les sections selon le rôle de l'utilisateur
  const menuItems = allMenuItems.filter(item => {
    if (!userRole) return false
    return item.roles.includes(userRole)
  })

  // S'assurer que la section active est accessible
  useEffect(() => {
    if (!menuItems.find(item => item.id === activeSection)) {
      setActiveSection(menuItems[0]?.id || 'trainers')
    }
  }, [userRole])

  const renderSection = () => {
    switch (activeSection) {
      case 'trainers':
        return <TrainersSection />
      case 'services':
        return isSuper ? <ServicesSection /> : null
      case 'portfolio':
        return isSuper ? <PortfolioSection /> : null
      case 'messages':
        return <MessagesSection />
      case 'programs':
        return <TrainingProgramsSection />
      case 'settings':
        return isSuper ? <SettingsSection /> : null
      case 'admins':
        return isSuper ? <AdminsSection /> : null
      default:
        return <TrainersSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Settings className="text-primary-400" size={28} />
              <h1 className="text-xl font-bold">Administration</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {menuItems.find(item => item.id === activeSection)?.label || 'Admin'}
              </h2>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}

export default Admin
