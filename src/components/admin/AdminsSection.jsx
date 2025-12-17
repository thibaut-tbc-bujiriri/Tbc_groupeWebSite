import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2, Edit2, Save, X, UserCheck, UserX } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { adminsApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const AdminsSection = () => {
  const { user: currentUser, isSuperAdmin } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'editor',
    password: '',
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const result = await adminsApi.getAll()
      
      if (result.success) {
        setAdmins(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role: 'editor',
      password: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formData.email || !formData.full_name) {
      toast.error('Veuillez remplir l\'email et le nom complet')
      return
    }

    if (!editingId && !formData.password) {
      toast.error('Veuillez fournir un mot de passe')
      return
    }

    try {
      let result
      if (editingId) {
        const { password, ...updateData } = formData
        result = await adminsApi.update(editingId, updateData)
      } else {
        // Note: Le hash du mot de passe devrait être fait via une fonction RPC
        result = await adminsApi.create({
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          // Le mot de passe sera hashé côté serveur via trigger ou RPC
          password_hash: formData.password // Temporaire - devrait être hashé!
        })
      }

      if (result.success) {
        toast.success(editingId ? 'Modifié avec succès!' : 'Ajouté avec succès!')
        resetForm()
        fetchAdmins()
      } else {
        toast.error(result.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (admin) => {
    setFormData({
      email: admin.email || '',
      full_name: admin.full_name || '',
      role: admin.role || 'editor',
      password: '',
    })
    setEditingId(admin.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      toast.error('Vous ne pouvez pas vous désactiver vous-même')
      return
    }
    if (!window.confirm('Désactiver cet administrateur ?')) return

    try {
      const result = await adminsApi.delete(id)
      if (result.success) {
        toast.success('Désactivé!')
        fetchAdmins()
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const getRoleLabel = (role) => {
    const roles = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      editor: 'Éditeur'
    }
    return roles[role] || role
  }

  const getRoleColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      {!showForm && isSuperAdmin() && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus size={20} />
            <span>Ajouter un Administrateur</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'} un Administrateur</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Nom complet *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Rôle</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="editor">Éditeur</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            {!editingId && (
              <div>
                <label className="block text-sm font-semibold mb-2">Mot de passe *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={resetForm} className="px-4 py-2 border rounded-lg">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{editingId ? 'Modifier' : 'Ajouter'}</span>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Shield className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun administrateur</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {admin.full_name?.charAt(0)?.toUpperCase() || admin.email?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{admin.full_name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                      {admin.id === currentUser?.id && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Vous
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(admin.role)}`}>
                      {getRoleLabel(admin.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {admin.is_active ? (
                      <span className="flex items-center text-green-600">
                        <UserCheck size={16} className="mr-1" />
                        Actif
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <UserX size={16} className="mr-1" />
                        Désactivé
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(admin.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {isSuperAdmin() && admin.id !== currentUser?.id && (
                      <>
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-800 p-1 mr-2"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminsSection
