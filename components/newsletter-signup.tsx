'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error ?? 'No pudimos procesar tu suscripción. Intentá de nuevo.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage('No pudimos procesar tu suscripción. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
      <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Mail className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-3">¿Querés recibir novedades?</h3>
      <p className="text-blue-100 mb-8 max-w-xl mx-auto">
        Dejanos tu email y te avisamos cada vez que publiquemos nuevos apuntes y archivos.
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center gap-2 bg-white/15 rounded-xl px-6 py-4 max-w-md mx-auto">
          <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
          <span className="font-medium">¡Listo! Te vamos a avisar cuando haya novedades.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 h-12 rounded-lg px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-blue-600 px-6 h-12 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-center gap-2 text-red-100 bg-red-500/30 rounded-lg px-4 py-2.5 max-w-md mx-auto mt-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
