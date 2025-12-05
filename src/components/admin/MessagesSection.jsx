import { useState, useEffect } from 'react'
import { Mail, Eye, EyeOff, CheckCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

const MessagesSection = ({ apiBaseUrl }) => {
  const { isSuperAdmin } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      let url = `${apiBaseUrl}/api/contact`
      if (filter === 'unread') {
        url += '?is_read=0'
      } else if (filter === 'read') {
        url += '?is_read=1'
      }
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setMessages(data.data || [])
      }
    } catch (error) {
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', id }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Marqué comme lu')
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null)
        }
      }
    } catch (error) {
      toast.error('Erreur')
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.')) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour la session
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Message supprimé avec succès')
        fetchMessages()
        // Si le message supprimé était sélectionné, désélectionner
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      } else {
        toast.error(data.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      console.error('Error deleting message:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              filter === 'unread'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Mail size={18} />
            <span>Non lus ({unreadCount})</span>
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'read'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Lus ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Mail className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600 dark:text-gray-400">Aucun message</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'ring-2 ring-primary-600'
                    : 'hover:shadow-xl'
                } ${!message.is_read ? 'border-l-4 border-primary-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{message.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!message.is_read && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                  </div>
                </div>
                {message.subject && (
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{message.subject}</p>
                )}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{message.message}</p>
                {!message.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkAsRead(message.id)
                    }}
                    className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <CheckCircle size={14} />
                    <span>Marquer comme lu</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Détails du message sélectionné */}
          {selectedMessage && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
                <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMessage.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-gray-600 dark:text-gray-400">{selectedMessage.phone}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!selectedMessage.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <CheckCircle size={18} />
                      <span>Marquer comme lu</span>
                    </button>
                  )}
                  {isSuperAdmin() && (
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={18} />
                      <span>Supprimer</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-500">{formatDate(selectedMessage.created_at)}</p>
              </div>

              {selectedMessage.subject && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Sujet
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {selectedMessage.is_read && selectedMessage.read_at && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Lu le {formatDate(selectedMessage.read_at)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MessagesSection

