'use client'

import { useEffect, useState } from 'react'

export default function AdminTestPage() {
  const [setupStatus, setSetupStatus] = useState<{ hasAdmin: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const response = await fetch('/api/admin/setup')
      const data = await response.json()
      setSetupStatus(data)
    } catch (error) {
      console.error('Error:', error)
      setSetupStatus({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Admin API</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Setup Status:</h2>
        <pre>{JSON.stringify(setupStatus, null, 2)}</pre>
      </div>
      
      <div className="mt-4">
        <a 
          href="/admin/setup" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ir a Setup
        </a>
        <a 
          href="/admin/login" 
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Ir a Login
        </a>
      </div>
    </div>
  )
}