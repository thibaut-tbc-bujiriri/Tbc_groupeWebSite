import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const API_BASE_URL = 'http://localhost:8080/Tbc_Groupe/backend'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('adminAuth')
      return auth === 'true'
    }
    return false
  })

  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adminUser')
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminAuth', isAuthenticated.toString())
      if (user) {
        localStorage.setItem('adminUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('adminUser')
      }
    }
  }, [isAuthenticated, user])

  const login = async (email, password) => {
    try {
      console.log('🔐 Tentative de connexion...')
      const url = `${API_BASE_URL}/api/auth`
      console.log('📡 URL:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les sessions PHP
        body: JSON.stringify({
          action: 'login',
          email: email,
          password: password,
        }),
      })

      console.log('📥 Status:', response.status, response.statusText)

      // Vérifier le Content-Type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Réponse non-JSON:', text.substring(0, 200))
        return { 
          success: false, 
          message: 'Le serveur a retourné une réponse invalide. Vérifiez que l\'API backend fonctionne.' 
        }
      }

      const data = await response.json()
      console.log('📦 Données reçues:', data)

      if (response.ok && data.success) {
        // Vérifier que data.data et data.data.user existent
        if (data.data && data.data.user) {
        setIsAuthenticated(true)
        setUser(data.data.user)
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminUser', JSON.stringify(data.data.user))
        if (data.data.token) {
          localStorage.setItem('adminToken', data.data.token)
        }
        return { success: true, message: 'Connexion réussie!', user: data.data.user }
        } else {
          console.error('❌ Structure de réponse invalide:', data)
          return { 
            success: false, 
            message: 'Erreur: Structure de réponse invalide du serveur' 
          }
        }
      } else {
        return { success: false, message: data.message || 'Email ou mot de passe incorrect' }
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      console.error('Type:', error.name)
      console.error('Message:', error.message)
      return { 
        success: false, 
        message: `Erreur de connexion: ${error.message}. Vérifiez que l'API backend est accessible sur ${API_BASE_URL}` 
      }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminToken')
    localStorage.setItem('adminMode', 'false') // Désactiver aussi le mode admin
  }

  // Vérifier si l'utilisateur est super_admin
  const isSuperAdmin = () => {
    return user?.role === 'super_admin'
  }

  // Vérifier si l'utilisateur est admin (ou super_admin)
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'super_admin'
  }

  // Obtenir le rôle de l'utilisateur
  const getUserRole = () => {
    return user?.role || null
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      login, 
      logout,
      isSuperAdmin,
      isAdmin,
      getUserRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

