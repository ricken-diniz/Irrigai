import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/culturas')({
  component: CulturasPage,
})

function CulturasPage() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-8 pb-[100px] md:pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[24px] md:text-[28px] font-semibold text-[var(--irr-primary)]">Culturas</h1>
          <p className="text-[14px] text-[var(--irr-on-surface-variant)] mt-1">
            Visão geral de todos os seus plantios.
          </p>
        </div>
      </div>

      <div className="bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-8 text-center ambient-shadow-l1">
        <span className="material-symbols-outlined text-[48px] text-[var(--irr-on-surface-variant)] opacity-50 mb-4 block">
          grass
        </span>
        <h2 className="text-[18px] font-semibold text-[var(--irr-primary)] mb-2">
          Integração de Culturas em Breve
        </h2>
        <p className="text-[14px] text-[var(--irr-on-surface-variant)] max-w-md mx-auto">
          No momento o sistema não suporta a listagem agregada de todas as culturas através de múltiplas propriedades em uma única view. Isso será implementado em breve!
        </p>
      </div>
    </div>
  )
}
