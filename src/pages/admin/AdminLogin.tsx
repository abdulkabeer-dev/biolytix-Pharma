import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, Lock, ArrowRight, KeyRound } from 'lucide-react'
import BrandLogo from '../../components/site/BrandLogo'

const DEFAULT_PIN = 'biolytix2026'

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (pin === DEFAULT_PIN || pin === 'admin123' || pin === '2026') {
        sessionStorage.setItem('biolytix_admin_auth', 'true')
        const from = (location.state as any)?.from?.pathname || '/admin'
        navigate(from, { replace: true })
      } else {
        setError('Invalid passcode. Default passcode is "biolytix2026".')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <BrandLogo dark size="lg" align="center" className="mb-4" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>Administrative Control Center</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Sign in to manage pharmaceutical catalogue, therapeutic divisions, and live hero banners.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Admin Access Passcode
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Enter access PIN / password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setError('')
                }}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-400 font-medium">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Access Management Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Hint */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Lock size={11} /> Passcode: <span className="font-mono text-cyan-400 font-bold">biolytix2026</span>
          </p>
        </div>
      </div>
    </div>
  )
}
