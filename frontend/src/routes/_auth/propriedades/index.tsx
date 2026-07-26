import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useProperties, useDeleteProperty } from '#/hooks/useProperties'
import type { Property } from '#/lib/api'
import DeleteConfirmDialog from '#/components/DeleteConfirmDialog'

export const Route = createFileRoute('/_auth/propriedades/')({
  component: PropriedadesPage,
})

function PropertyCard({ property, onDelete }: { property: Property; onDelete: (p: Property) => void }) {
  return (
    <Link
      to="/propriedades/$propertyId"
      params={{ propertyId: property.id }}
      className="no-underline"
    >
      <div className="bg-[var(--irr-surface-container-lowest)] rounded-2xl border border-[var(--irr-surface-variant)] p-4 card-shadow flex flex-col hover:border-[var(--irr-secondary)] transition-colors cursor-pointer group relative overflow-hidden">
        {/* Left accent bar */}
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--irr-mint)]" />

        <div className="flex justify-between items-start mb-4 pl-1">
          <div>
            <h2 className="text-[18px] font-semibold text-[var(--irr-on-surface)] group-hover:text-[var(--irr-primary)] transition-colors">
              {property.name}
            </h2>
            <div className="flex items-center gap-1 mt-1 text-[var(--irr-on-surface-variant)]">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span className="text-[14px]">
                {property.municipality}, {property.state}
              </span>
            </div>
          </div>
          <div className="bg-[#E6F4EA] text-[#1B724F] px-2 py-1 rounded-full flex items-center gap-1 border border-[#BDE4C8] flex-shrink-0">
            <span className="material-symbols-outlined icon-filled text-[14px]">water_drop</span>
            <span className="text-[11px] font-bold uppercase tracking-widest">Ativa</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--irr-surface-variant)] flex justify-between items-center pl-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--irr-on-surface-variant)] mb-1">
              Localização
            </p>
            <p className="text-[20px] font-medium text-[var(--irr-primary)]">
              {property.municipality}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border border-[var(--irr-outline-variant)] flex items-center justify-center group-hover:bg-[var(--irr-secondary-container)] group-hover:border-[var(--irr-secondary-container)] group-hover:text-[var(--irr-on-secondary-container)] transition-all text-[var(--irr-on-surface-variant)]">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--irr-surface-container-lowest)] rounded-2xl border border-[var(--irr-surface-variant)] p-4 animate-pulse">
      <div className="h-5 bg-[var(--irr-surface-variant)] rounded w-3/4 mb-2" />
      <div className="h-4 bg-[var(--irr-surface-variant)] rounded w-1/2 mb-4" />
      <div className="h-px bg-[var(--irr-surface-variant)] mb-4" />
      <div className="flex justify-between">
        <div className="h-6 bg-[var(--irr-surface-variant)] rounded w-1/3" />
        <div className="w-10 h-10 rounded-full bg-[var(--irr-surface-variant)]" />
      </div>
    </div>
  )
}

function PropriedadesPage() {
  const navigate = useNavigate()
  const { data: properties, isLoading, error } = useProperties()
  const deleteProperty = useDeleteProperty()
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteProperty.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[24px] font-semibold leading-8 md:text-[28px] md:leading-9 text-[var(--irr-primary)]">
            Minhas Propriedades
          </h1>
          <p className="text-[14px] text-[var(--irr-on-surface-variant)] mt-1">
            Gerencie suas fazendas e sistemas de irrigação.
          </p>
        </div>
        {/* Desktop button */}
        <button
          type="button"
          onClick={() => navigate({ to: '/propriedades/nova' })}
          className="hidden md:flex items-center gap-2 bg-[var(--irr-mint)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all text-[18px] font-semibold h-11"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nova Propriedade
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--irr-error-container)] text-[var(--irr-on-error-container)] mb-6">
          <span className="material-symbols-outlined">error</span>
          <p className="text-[14px]">Erro ao carregar propriedades. Verifique sua conexão.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : properties?.map((p) => (
              <PropertyCard key={p.id} property={p} onDelete={setDeleteTarget} />
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && !error && properties?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--irr-on-surface-variant)]">
          <div className="w-16 h-16 rounded-full bg-[var(--irr-surface-container)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">landscape</span>
          </div>
          <p className="text-[16px] text-center">Nenhuma propriedade cadastrada ainda.</p>
          <button
            type="button"
            onClick={() => navigate({ to: '/propriedades/nova' })}
            className="flex items-center gap-2 bg-[var(--irr-mint)] text-white px-4 py-2 rounded-lg hover:opacity-90 text-[16px] font-semibold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Adicionar Propriedade
          </button>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        type="button"
        onClick={() => navigate({ to: '/propriedades/nova' })}
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-[var(--irr-mint)] text-white rounded-2xl shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40"
        aria-label="Nova Propriedade"
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </button>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title="Excluir Propriedade?"
        description="Esta ação não pode ser desfeita. Isso excluirá permanentemente a fazenda e todos os dados de irrigação associados."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteProperty.isPending}
      />
    </div>
  )
}
