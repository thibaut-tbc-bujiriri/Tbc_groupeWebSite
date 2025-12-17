import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const TestSupabase = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const email = 'thibauttbcbujiriri@gmail.com'

  const testConnection = async () => {
    setLoading(true)
    const results = {}

    // Test 1: Vérifier la connexion Supabase
    try {
      results.supabaseUrl = supabase.supabaseUrl
      results.connected = true
    } catch (e) {
      results.connected = false
      results.connectionError = e.message
    }

    // Test 2: Lire la table users
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, is_active')
        .eq('email', email)
        .single()

      results.userQuery = { data, error: error?.message }
    } catch (e) {
      results.userQuery = { error: e.message }
    }

    // Test 3: Lire tous les users (pour voir si RLS bloque)
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('id, email', { count: 'exact' })
        .limit(5)

      results.allUsers = { 
        count: data?.length, 
        totalCount: count,
        error: error?.message,
        users: data?.map(u => u.email)
      }
    } catch (e) {
      results.allUsers = { error: e.message }
    }

    // Test 4: Vérifier si la fonction RPC existe
    try {
      const { data, error } = await supabase
        .rpc('verify_password', { 
          input_password: 'test', 
          stored_hash: 'test' 
        })

      results.rpcFunction = { 
        exists: !error || !error.message.includes('does not exist'),
        data,
        error: error?.message 
      }
    } catch (e) {
      results.rpcFunction = { exists: false, error: e.message }
    }

    // Test 5: Récupérer le hash du mot de passe
    try {
      const { data, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('email', email)
        .single()

      results.passwordHash = { 
        exists: !!data?.password_hash,
        hashPreview: data?.password_hash?.substring(0, 20) + '...',
        error: error?.message 
      }
    } catch (e) {
      results.passwordHash = { error: e.message }
    }

    setResult(results)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Test Connexion Supabase</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? 'Test en cours...' : 'Lancer le diagnostic'}
        </button>

        {result && (
          <div className="space-y-4">
            <div className={`p-4 rounded ${result.connected ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-bold">1. Connexion Supabase</h3>
              <p>{result.connected ? '✅ Connecté' : '❌ Non connecté'}</p>
              <p className="text-sm text-gray-600">URL: {result.supabaseUrl}</p>
            </div>

            <div className={`p-4 rounded ${result.userQuery?.data ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-bold">2. Recherche utilisateur ({email})</h3>
              {result.userQuery?.data ? (
                <div className="text-sm">
                  <p>✅ Utilisateur trouvé</p>
                  <p>ID: {result.userQuery.data.id}</p>
                  <p>Nom: {result.userQuery.data.full_name}</p>
                  <p>Rôle: {result.userQuery.data.role}</p>
                  <p>Actif: {result.userQuery.data.is_active ? 'Oui' : 'Non'}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ {result.userQuery?.error || 'Utilisateur non trouvé'}</p>
              )}
            </div>

            <div className={`p-4 rounded ${result.allUsers?.count > 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <h3 className="font-bold">3. Liste des utilisateurs (test RLS)</h3>
              {result.allUsers?.error ? (
                <p className="text-red-600">❌ {result.allUsers.error}</p>
              ) : (
                <div className="text-sm">
                  <p>Utilisateurs trouvés: {result.allUsers?.count || 0}</p>
                  {result.allUsers?.users?.map((email, i) => (
                    <p key={i}>• {email}</p>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-4 rounded ${result.rpcFunction?.exists ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <h3 className="font-bold">4. Fonction RPC verify_password</h3>
              {result.rpcFunction?.exists ? (
                <p>✅ Fonction disponible</p>
              ) : (
                <div>
                  <p className="text-yellow-600">⚠️ Fonction non disponible</p>
                  <p className="text-sm text-gray-600">{result.rpcFunction?.error}</p>
                </div>
              )}
            </div>

            <div className={`p-4 rounded ${result.passwordHash?.exists ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-bold">5. Hash du mot de passe</h3>
              {result.passwordHash?.exists ? (
                <div className="text-sm">
                  <p>✅ Hash trouvé</p>
                  <p className="font-mono">{result.passwordHash.hashPreview}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ {result.passwordHash?.error || 'Hash non trouvé'}</p>
              )}
            </div>

            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Résultat JSON complet</h3>
              <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestSupabase

