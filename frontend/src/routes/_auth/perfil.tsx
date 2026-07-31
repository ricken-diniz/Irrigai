import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '#/lib/auth'

export const Route = createFileRoute('/_auth/perfil')({
  component: PerfilPage,
})

function PerfilPage() {
  const { signOut } = useAuth()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-[24px] font-semibold text-[var(--irr-primary)] md:text-[28px]">
          Perfil
        </h1>
        <p className="text-[14px] text-[var(--irr-on-surface-variant)]">
          Configurações da sua conta (Em desenvolvimento)
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--irr-on-surface-variant)] bg-[var(--irr-surface-container-lowest)] rounded-2xl border border-[var(--irr-surface-variant)]">
        <span className="material-symbols-outlined text-[48px] opacity-50">person</span>
        <p className="text-[16px] text-center">A tela de perfil estará disponível em breve.</p>
        
        <button
          type="button"
          onClick={signOut}
          className="mt-6 flex items-center gap-2 border border-[var(--irr-error)] text-[var(--irr-error)] bg-transparent rounded-full px-6 py-2 text-[16px] font-semibold hover:bg-[var(--irr-error-container)]/50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sair da Conta
        </button>
      </div>
    </div>
  )
}
