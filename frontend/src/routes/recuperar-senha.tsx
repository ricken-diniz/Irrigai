import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '#/lib/auth'

export const Route = createFileRoute('/recuperar-senha')({
  component: RecuperarSenhaPage,
})

function RecuperarSenhaPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError('Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.')
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--irr-background)] flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md bg-[var(--irr-surface-container-lowest)] rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(27,67,50,0.05)] border border-[var(--irr-outline-variant)] flex flex-col gap-6 relative overflow-hidden fade-slide-in">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--irr-primary-container)] to-[var(--irr-secondary)]" />

        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--irr-surface-container-low)] mx-auto mt-2">
          <span className="material-symbols-outlined icon-filled text-[var(--irr-primary)] text-[32px]">
            lock_reset
          </span>
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-[24px] font-semibold leading-8 text-[var(--irr-primary)] md:text-[28px]">
            Recuperar Senha
          </h1>
          <p className="text-[16px] text-[var(--irr-on-surface-variant)]">
            Insira seu e-mail para receber o link de redefinição.
          </p>
        </div>

        {/* Form or success */}
        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-[var(--irr-on-surface)]" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--irr-outline)] text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] focus:border-[var(--irr-mint)] focus:ring-1 focus:ring-[var(--irr-mint)] focus:outline-none transition-colors text-[16px] text-[var(--irr-on-surface)] placeholder:text-[var(--irr-outline-variant)]"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--irr-error-container)] text-[var(--irr-on-error-container)] text-[14px]">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[var(--irr-mint)] hover:opacity-90 text-white text-[18px] font-semibold transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>
                  <span>Enviar Link</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 fade-slide-in">
            <div className="w-12 h-12 rounded-full bg-[var(--irr-secondary-container)] flex items-center justify-center text-[var(--irr-on-secondary-container)]">
              <span className="material-symbols-outlined icon-filled text-[24px]">check</span>
            </div>
            <p className="text-[16px] text-center text-[var(--irr-on-surface)]">
              Link enviado com sucesso! Verifique sua caixa de entrada.
            </p>
          </div>
        )}

        {/* Back to login */}
        <div className="text-center pt-4 border-t border-[var(--irr-surface-variant)]">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-[14px] text-[var(--irr-primary)] hover:opacity-70 transition-opacity font-medium no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Voltar para o login
          </Link>
        </div>
      </main>
    </div>
  )
}
