import { useState, useEffect } from 'react'
import { Mail, Trash2, Eye, Check, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { contactApi } from '../../lib/supabaseApi'
import toast from 'react-hot-toast'

const MessagesSection = () => {
  const { user, isSuperAdmin } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      let isRead = null
      if (filter === 'unread') isRead = false
      if (filter === 'read') isRead = true
      
      const result = await contactApi.getAll(isRead)
      
      if (result.success) {
        setMessages(result.data || [])
      } else {
        toast.error(result.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const result = await contactApi.markAsRead(id, user?.id)
      if (result.success) {
        toast.success('Marqué comme lu')
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read: true })
        }
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return

    try {
      const result = await contactApi.delete(id)
      if (result.success) {
        toast.success('Supprimé!')
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const formatDate = (dateString) => {
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
      {/* Filtres */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg ${filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Non lus
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg ${filter === 'read' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Lus
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des messages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-bold">Messages ({messages.length})</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500">Aucun message</p>
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedMessage?.id === message.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } ${!message.is_read ? 'border-l-4 border-primary-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${!message.is_read ? 'text-primary-600' : ''}`}>
                        {message.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{message.email}</p>
                      {message.subject && (
                        <p className="text-sm font-medium mt-1 truncate">{message.subject}</p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                      {!message.is_read && (
                        <span className="mt-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détail du message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold">Détail du message</h3>
                <div className="flex space-x-2">
                  {!selectedMessage.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded"
                      title="Marquer comme lu"
                    >
                      <Check size={20} />
                    </button>
                  )}
                  {isSuperAdmin() && (
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                      title="Supprimer"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="text-sm text-gray-500">De:</label>
                  <p className="font-semibold">{selectedMessage.name}</p>
                  <p className="text-primary-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-gray-600">{selectedMessage.phone}</p>
                  )}
                </div>
                {selectedMessage.subject && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-500">Sujet:</label>
                    <p className="font-semibold">{selectedMessage.subject}</p>
                  </div>
                )}
                <div className="mb-4">
                  <label className="text-sm text-gray-500">Date:</label>
                  <p>{formatDate(selectedMessage.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Message:</label>
                  <p className="mt-2 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                {selectedMessage.is_read && selectedMessage.read_at && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                    Lu le {formatDate(selectedMessage.read_at)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Eye className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500">Sélectionnez un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesSection
