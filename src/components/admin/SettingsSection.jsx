import { useState, useEffect } from 'react'
import { Settings, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { settingsApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const SettingsSection = () => {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState(null)

  const [formData, setFormData] = useState({
    setting_key: '',
    setting_value: '',
    description: '',
    is_public: false,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const result = await settingsApi.getAll()
      
      if (result.success) {
        setSettings(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const resetForm = () => {
    setFormData({
      setting_key: '',
      setting_value: '',
      description: '',
      is_public: false,
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
      const result = await settingsApi.upsert(formData)

      if (result.success) {
        toast.success(editingKey ? 'Modifié avec succès!' : 'Ajouté avec succès!')
        resetForm()
        fetchSettings()
      } else {
        toast.error(result.message || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (setting) => {
    setFormData({
      setting_key: setting.setting_key || '',
      setting_value: setting.setting_value || '',
      description: setting.description || '',
      is_public: setting.is_public || false,
    })
    setEditingKey(setting.setting_key)
    setShowForm(true)
  }

  const handleDelete = async (key) => {
    if (!window.confirm('Supprimer ce paramètre ?')) return

    try {
      const result = await settingsApi.delete(key)
      if (result.success) {
        toast.success('Supprimé!')
        fetchSettings()
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleQuickEdit = async (key, newValue) => {
    try {
      const setting = settings.find(s => s.setting_key === key)
      if (!setting) return

      const result = await settingsApi.upsert({
        ...setting,
        setting_value: newValue
      })

      if (result.success) {
        toast.success('Mis à jour!')
        fetchSettings()
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Clé *</label>
              <input
                type="text"
                name="setting_key"
                value={formData.setting_key}
                onChange={handleChange}
                disabled={!!editingKey}
                placeholder="ex: site_name, contact_email"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Valeur *</label>
              <input
                type="text"
                name="setting_value"
                value={formData.setting_value}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Description de ce paramètre"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm font-semibold">Paramètre public (visible côté client)</span>
              </label>
            </div>
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
              <span>{editingKey ? 'Modifier' : 'Ajouter'}</span>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : settings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Settings className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun paramètre</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Public
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {settings.map((setting) => (
                <tr key={setting.setting_key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {setting.setting_key}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={setting.setting_value}
                      onBlur={(e) => {
                        if (e.target.value !== setting.setting_value) {
                          handleQuickEdit(setting.setting_key, e.target.value)
                        }
                      }}
                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {setting.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {setting.is_public ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Oui
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(setting)}
                      className="text-blue-600 hover:text-blue-800 p-1 mr-2"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(setting.setting_key)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
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
