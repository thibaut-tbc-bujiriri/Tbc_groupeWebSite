import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Hook personnalisé pour utiliser le contexte d'authentification
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider d'authentification
function AuthProvider({ children }) {
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

  const [loading, setLoading] = useState(true)

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminToken')
    localStorage.setItem('adminMode', 'false')
  }, [])

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      const userData = localStorage.getItem('adminUser')
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          // Vérifier que l'utilisateur existe toujours dans Supabase
          const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, role, is_active')
            .eq('id', parsedUser.id)
            .eq('is_active', true)
            .single()

          if (data && !error) {
            setUser(data)
            setIsAuthenticated(true)
          } else {
            handleLogout()
          }
        } catch {
          handleLogout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [handleLogout])

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

  const login = useCallback(async (email, password) => {
    try {
      console.log('🔐 Tentative de connexion Supabase...')
      
      // Récupérer l'utilisateur par email
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, email, password_hash, full_name, role, is_active')
        .eq('email', email)
        .single()

      if (fetchError || !userData) {
        console.error('❌ Utilisateur non trouvé:', fetchError)
        return { success: false, message: 'Email ou mot de passe incorrect' }
      }

      if (!userData.is_active) {
        return { success: false, message: 'Compte désactivé' }
      }

      // Vérifier le mot de passe via fonction RPC
      let passwordValid = false
      
      // Essayer d'abord la fonction RPC verify_password
      const { data: verifyResult, error: verifyError } = await supabase
        .rpc('verify_password', { 
          input_password: password, 
          stored_hash: userData.password_hash 
        })

      console.log('🔑 Résultat RPC:', { verifyResult, verifyError })

      if (!verifyError && verifyResult === true) {
        passwordValid = true
        console.log('✅ Mot de passe vérifié via RPC')
      } else if (verifyError) {
        // Fonction RPC non disponible - fallback temporaire
        console.warn('⚠️ Fonction RPC non disponible:', verifyError.message)
        
        // TEMPORAIRE: Accepter si le hash existe (pour développement uniquement)
        // EN PRODUCTION: Vous DEVEZ créer la fonction RPC verify_password!
        if (userData.password_hash && userData.password_hash.length > 0) {
          console.warn('⚠️ Mode développement: connexion autorisée sans vérification bcrypt')
          passwordValid = true
        }
      }

      if (!passwordValid) {
        console.error('❌ Mot de passe invalide')
        return { success: false, message: 'Email ou mot de passe incorrect' }
      }

      // Mettre à jour la dernière connexion
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id)

      // Générer un token simple
      const token = btoa(JSON.stringify({ 
        userId: userData.id, 
        timestamp: Date.now() 
      }))

      // Mettre à jour l'état
      const userInfo = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role
      }

      setIsAuthenticated(true)
      setUser(userInfo)
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminUser', JSON.stringify(userInfo))
      localStorage.setItem('adminToken', token)

      console.log('✅ Connexion réussie!')
      return { success: true, message: 'Connexion réussie!', user: userInfo }

    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      return { 
        success: false, 
        message: `Erreur de connexion: ${error.message}` 
      }
    }
  }, [])

  // Vérifier si l'utilisateur est super_admin
  const isSuperAdmin = useCallback(() => {
    return user?.role === 'super_admin'
  }, [user])

  // Vérifier si l'utilisateur est admin (ou super_admin)
  const isAdmin = useCallback(() => {
    return user?.role === 'admin' || user?.role === 'super_admin'
  }, [user])

  // Obtenir le rôle de l'utilisateur
  const getUserRole = useCallback(() => {
    return user?.role || null
  }, [user])

  const value = {
    isAuthenticated, 
    user,
    login, 
    logout: handleLogout,
    isSuperAdmin,
    isAdmin,
    getUserRole
  }

  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
