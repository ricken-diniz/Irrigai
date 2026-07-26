import { useState } from 'react'
import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) throw redirect({ to: '/propriedades' })
  },
  component: LoginPage,
})

function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('E-mail ou senha incorretos. Tente novamente.')
    } else {
      navigate({ to: '/propriedades' })
    }
  }

  return (
    <div className="min-h-screen bg-[var(--irr-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-slide-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--irr-primary-container)] rounded-full flex items-center justify-center mb-3 shadow-md">
            <span className="material-symbols-outlined icon-filled text-white text-[32px]">
              water_drop
            </span>
          </div>
          <h1 className="text-[36px] font-bold leading-[44px] tracking-tight text-[var(--irr-primary)]">
            Irrigaí
          </h1>
          <p className="text-[16px] text-[var(--irr-on-surface-variant)] text-center mt-2">
            Bem-vindo de volta ao seu painel de controle agrícola.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--irr-secondary)]" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[18px] font-semibold text-[var(--irr-on-surface)]" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[var(--irr-outline-variant)] text-[20px]">mail</span>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-[16px] bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--irr-secondary)] focus:border-transparent transition-shadow text-[var(--irr-on-surface)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[18px] font-semibold text-[var(--irr-on-surface)]" htmlFor="password">
                  Senha
                </label>
                <Link
                  to="/recuperar-senha"
                  className="text-[14px] text-[var(--irr-secondary)] hover:text-[var(--irr-primary)] transition-colors no-underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[var(--irr-outline-variant)] text-[20px]">lock</span>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 text-[16px] bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--irr-secondary)] focus:border-transparent transition-shadow text-[var(--irr-on-surface)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--irr-outline-variant)] hover:text-[var(--irr-on-surface)] transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--irr-error-container)] text-[var(--irr-on-error-container)] text-[14px]">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--irr-secondary)] text-white text-[18px] font-semibold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--irr-secondary)] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>
                  Entrar
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--irr-surface-variant)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[var(--irr-outline)] text-[14px]">ou</span>
            </div>
          </div>

          {/* Create account */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-[var(--irr-on-surface-variant)]">
              Novo na plataforma?{' '}
              <span className="text-[18px] font-semibold text-[var(--irr-secondary)] ml-1 cursor-not-allowed opacity-60">
                Criar nova conta
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[12px] uppercase tracking-widest font-bold text-[var(--irr-outline)]">
            © 2024 Irrigaí Tech
          </p>
        </div>
      </div>
    </div>
  )
}
