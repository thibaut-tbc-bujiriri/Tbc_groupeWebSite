import { useState, useEffect } from 'react'
import { Users, Plus, Trash2, Edit2, Save, X, Shield, ShieldCheck, UserX } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminsSection = ({ apiBaseUrl }) => {
  const { isSuperAdmin } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'editor',
  })

  useEffect(() => {
    if (isSuperAdmin()) {
      fetchAdmins()
    }
  }, [isSuperAdmin])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/admins`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setAdmins(data.data || [])
      } else {
        toast.error(data.message || 'Erreur lors du chargement des admins')
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Erreur lors du chargement des admins')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingId
        ? `${apiBaseUrl}/api/admins/${editingId}`
        : `${apiBaseUrl}/api/admins`

      const method = editingId ? 'PUT' : 'POST'
      
      // Préparer le body en fonction du mode (édition ou création)
      let body = {}
      
      if (editingId) {
        // Mode édition : inclure seulement les champs modifiés
        body = {
          full_name: formData.full_name,
          role: formData.role,
        }
        
        // Ajouter le mot de passe seulement s'il n'est pas vide
        if (formData.password && formData.password.trim() !== '') {
          body.password = formData.password
        }
      } else {
        // Mode création : tous les champs sont requis
        body = {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
        }
      }

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      // Vérifier si la réponse est valide avant de parser JSON
      let data;
      const text = await response.text();
      try {
        if (text) {
          data = JSON.parse(text);
        } else {
          throw new Error('Réponse vide du serveur');
        }
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        console.error('Réponse du serveur:', text);
        toast.error('Erreur: Réponse invalide du serveur');
        return;
      }

      if (response.ok && data.success) {
        toast.success(editingId ? 'Admin mis à jour avec succès' : 'Admin créé avec succès')
        setShowForm(false)
        setEditingId(null)
        setFormData({ email: '', password: '', full_name: '', role: 'editor' })
        fetchAdmins()
      } else {
        console.error('Erreur de sauvegarde:', data);
        toast.error(data.message || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving admin:', error)
      toast.error('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'))
    }
  }

  const handleEdit = (admin) => {
    setEditingId(admin.id)
    setFormData({
      email: admin.email,
      password: '',
      full_name: admin.full_name,
      role: admin.role,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver cet admin ?')) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/admins/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Admin désactivé avec succès')
        fetchAdmins()
      } else {
        toast.error(data.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          Super Admin
        </span>
      ),
      admin: (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Admin
        </span>
      ),
      editor: (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          Éditeur
        </span>
      ),
    }
    return badges[role] || badges.editor
  }

  const getRoleIcon = (role) => {
    if (role === 'super_admin') return <ShieldCheck size={16} />
    if (role === 'admin') return <Shield size={16} />
    return <Users size={16} />
  }

  if (!isSuperAdmin()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Accès refusé. Seuls les super administrateurs peuvent gérer les admins.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Administrateurs</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ email: '', password: '', full_name: '', role: 'editor' })
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>{showForm ? 'Annuler' : 'Ajouter un Admin'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Modifier l\'Admin' : 'Nouvel Admin'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!editingId}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {editingId ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingId}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rôle *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={editingId && admins.find(a => a.id === editingId)?.role === 'super_admin'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="editor">Éditeur (Formateurs, Messages, Programmes)</option>
                <option value="admin">Admin (Formateurs, Messages, Programmes)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ email: '', password: '', full_name: '', role: 'editor' })
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{editingId ? 'Enregistrer' : 'Créer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucun admin trouvé
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.full_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(admin.role)}
                      {getRoleBadge(admin.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.is_active ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Actif
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {admin.last_login
                      ? new Date(admin.last_login).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        disabled={admin.role === 'super_admin'}
                      >
                        <Edit2 size={18} />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          disabled={admin.id === admin.currentUserId}
                        >
                          <UserX size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminsSection



