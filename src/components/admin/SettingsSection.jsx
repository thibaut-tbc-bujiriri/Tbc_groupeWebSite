import { useState, useEffect } from 'react'
import { Wrench, Save, Plus, Trash2, Edit2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const SettingsSection = ({ apiBaseUrl }) => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [formData, setFormData] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'text',
    description: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/settings`)
      const data = await response.json()
      if (data.success) {
        setSettings(data.data || {})
      }
    } catch (error) {
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetForm = () => {
    setFormData({
      setting_key: '',
      setting_value: '',
      setting_type: 'text',
      description: '',
    })
    setEditingKey(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formData.setting_key || !formData.setting_value) {
      toast.error('Veuillez remplir la clé et la valeur')
      return
    }

    try {
      const url = editingKey
        ? `${apiBaseUrl}/api/settings/${editingKey}`
        : `${apiBaseUrl}/api/settings`
      const method = editingKey ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingKey ? 'Modifié!' : 'Ajouté!')
        resetForm()
        fetchSettings()
      } else {
        toast.error(data.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  const handleEdit = (key) => {
    const setting = settings[key]
    if (setting) {
      setFormData({
        setting_key: setting.setting_key,
        setting_value: setting.setting_value || '',
        setting_type: setting.setting_type || 'text',
        description: setting.description || '',
      })
      setEditingKey(key)
      setShowForm(true)
    }
  }

  const handleQuickEdit = async (key, newValue) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_value: newValue }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Modifié!')
        fetchSettings()
      }
    } catch (error) {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (key) => {
    if (!window.confirm(`Supprimer le paramètre "${key}" ?`)) return

    try {
      const response = await fetch(`${apiBaseUrl}/api/settings/${key}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Supprimé!')
        fetchSettings()
      }
    } catch (error) {
      toast.error('Erreur')
    }
  }

  const settingsArray = Object.values(settings).sort((a, b) => 
    a.setting_key.localeCompare(b.setting_key)
  )

  return (
    <div>
      {!showForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus size={20} />
            <span>Ajouter un Paramètre</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingKey ? 'Modifier' : 'Ajouter'} un Paramètre</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Clé *</label>
              <input
                type="text"
                name="setting_key"
                value={formData.setting_key}
                onChange={handleChange}
                disabled={!!editingKey}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
                required
              />
              {editingKey && (
                <p className="text-xs text-gray-500 mt-1">La clé ne peut pas être modifiée</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Type</label>
              <select
                name="setting_type"
                value={formData.setting_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="text">Texte</option>
                <option value="email">Email</option>
                <option value="textarea">Texte long</option>
                <option value="number">Nombre</option>
                <option value="boolean">Booléen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Valeur *</label>
              {formData.setting_type === 'textarea' ? (
                <textarea
                  name="setting_value"
                  value={formData.setting_value}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              ) : (
                <input
                  type={formData.setting_type === 'number' ? 'number' : 'text'}
                  name="setting_value"
                  value={formData.setting_value}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Description du paramètre"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={resetForm} className="px-4 py-2 border rounded-lg">Annuler</button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{editingKey ? 'Modifier' : 'Ajouter'}</span>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : settingsArray.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Wrench className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun paramètre</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Clé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Valeur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {settingsArray.map((setting) => (
                <tr key={setting.setting_key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {setting.setting_key}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {setting.setting_type || 'text'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {setting.setting_value ? (setting.setting_value.length > 100 
                        ? setting.setting_value.substring(0, 100) + '...' 
                        : setting.setting_value) 
                        : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {setting.description || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(setting.setting_key)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(setting.setting_key)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default SettingsSection

