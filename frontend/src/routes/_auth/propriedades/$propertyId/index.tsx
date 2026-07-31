import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useProperty } from '#/hooks/useProperties'
import { useCrops, useDeleteCrop } from '#/hooks/useCrops'
import DeleteConfirmDialog from '#/components/DeleteConfirmDialog'
import EditPropertyDialog from '#/components/EditPropertyDialog'
import { useDeleteProperty, useUpdateProperty } from '#/hooks/useProperties'
import type { Crop } from '#/lib/api'

export const Route = createFileRoute('/_auth/propriedades/$propertyId/')({
  component: PropertyDetailPage,
})

function CropProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
        <span className="text-[var(--irr-on-surface-variant)]">Ciclo de Irrigação</span>
        <span className="text-[var(--irr-secondary)]">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-[var(--irr-surface-variant)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--irr-secondary)] rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function CropCard({ crop, propertyId }: { crop: Crop; propertyId: string }) {
  const daysSincePlanting = Math.floor(
    (Date.now() - new Date(crop.planting_date).getTime()) / (1000 * 60 * 60 * 24),
  )
  const estimatedCyclePercent = Math.min(Math.round((daysSincePlanting / 120) * 100), 100)

  return (
    <Link
      to="/propriedades/$propertyId/culturas/$cropId"
      params={{ propertyId, cropId: crop.id }}
      className="no-underline"
    >
      <div className="bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-4 flex flex-col gap-2 ambient-shadow-l1 hover:border-[var(--irr-secondary)] transition-colors cursor-pointer group">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--irr-primary-fixed)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[var(--irr-on-primary-fixed-variant)] text-[18px]">
                grass
              </span>
            </div>
            <div>
              <span className="text-[18px] font-semibold text-[var(--irr-primary)] group-hover:text-[var(--irr-secondary)] transition-colors">
                {crop.name}
              </span>
              <p className="text-[14px] text-[var(--irr-on-surface-variant)]">{crop.crop_type}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[var(--irr-outline-variant)] group-hover:text-[var(--irr-secondary)] transition-colors">
            chevron_right
          </span>
        </div>
        <CropProgressBar percent={estimatedCyclePercent} />
      </div>
    </Link>
  )
}

function PropertyDetailPage() {
  const { propertyId } = Route.useParams()
  const navigate = useNavigate()
  const { data: property, isLoading: loadingProp } = useProperty(propertyId)
  const { data: crops, isLoading: loadingCrops } = useCrops(propertyId)
  const deleteProperty = useDeleteProperty()
  const updateProperty = useUpdateProperty(propertyId)
  const deleteCrop = useDeleteCrop()
  const [showDeleteProp, setShowDeleteProp] = useState(false)
  const [showEditProp, setShowEditProp] = useState(false)

  async function handleDeleteProperty() {
    await deleteProperty.mutateAsync(propertyId)
    navigate({ to: '/propriedades' })
  }

  async function handleEditProperty(newName: string) {
    await updateProperty.mutateAsync({ name: newName })
    setShowEditProp(false)
  }

  if (loadingProp) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[var(--irr-surface-variant)] rounded w-1/4" />
          <div className="h-8 bg-[var(--irr-surface-variant)] rounded w-1/2" />
          <div className="h-64 bg-[var(--irr-surface-variant)] rounded-xl" />
        </div>
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb header */}
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--irr-on-surface-variant)]">
          Detalhes da Propriedade
        </p>
        <h1 className="text-[24px] font-semibold text-[var(--irr-primary)] md:text-[28px]">
          {property.name}
        </h1>
        <div className="flex items-center gap-1 text-[var(--irr-on-surface-variant)]">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="text-[14px]">
            {property.municipality}, {property.state}
          </span>
        </div>
      </div>

      {/* Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left col — Map */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Map placeholder */}
          <div className="w-full h-64 md:h-80 rounded-xl bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] overflow-hidden relative ambient-shadow-l1">
            <div className="w-full h-full bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] flex items-center justify-center">
              <div className="text-center text-[var(--irr-on-surface-variant)]">
                <span className="material-symbols-outlined text-[48px] opacity-40">map</span>
                <p className="text-[14px] opacity-60 mt-2">Mapa da Propriedade</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-[var(--irr-outline-variant)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--irr-secondary)] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--irr-primary)]">
                Sensores Ativos
              </span>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full border border-[var(--irr-outline-variant)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[var(--irr-primary)] text-[20px]">layers</span>
            </div>
          </div>
        </div>

        {/* Right col — Crops + Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Culturas */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[var(--irr-primary)]">Culturas</h2>
              <Link
                to="/propriedades/$propertyId/culturas/nova"
                params={{ propertyId }}
                className="text-[11px] font-bold uppercase tracking-widest text-[var(--irr-secondary)] hover:bg-[var(--irr-secondary-container)]/50 px-2 py-1 rounded transition-colors no-underline"
              >
                + Nova Cultura
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {loadingCrops ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[var(--irr-surface-variant)] rounded-xl animate-pulse" />
                ))
              ) : crops?.length === 0 ? (
                <div className="text-center py-8 text-[var(--irr-on-surface-variant)]">
                  <span className="material-symbols-outlined text-[32px]">grass</span>
                  <p className="text-[14px] mt-2">Nenhuma cultura cadastrada</p>
                </div>
              ) : (
                crops?.map((crop) => (
                  <CropCard key={crop.id} crop={crop} propertyId={propertyId} />
                ))
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--irr-outline-variant)] flex gap-2">
            <button
              type="button"
              className="flex-1 border border-[var(--irr-primary-container)] text-[var(--irr-primary-container)] bg-transparent rounded-full px-4 py-3 text-[18px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--irr-surface-container-low)] transition-colors"
              onClick={() => navigate({ to: '/propriedades/$propertyId/culturas/nova', params: { propertyId } })}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Cultura
            </button>
            <button
              type="button"
              onClick={() => setShowEditProp(true)}
              className="flex-1 border border-[var(--irr-outline-variant)] text-[var(--irr-on-surface)] bg-[var(--irr-surface)] rounded-full px-4 py-3 text-[18px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--irr-surface-container-low)] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Editar
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteProp(true)}
              className="flex-1 border border-[var(--irr-error)] text-[var(--irr-error)] bg-transparent rounded-full px-4 py-3 text-[18px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--irr-error-container)]/50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              Excluir
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteProp}
        title="Excluir Propriedade?"
        description="Esta ação não pode ser desfeita. Isso excluirá permanentemente a fazenda e todos os dados de irrigação associados."
        onConfirm={handleDeleteProperty}
        onCancel={() => setShowDeleteProp(false)}
        loading={deleteProperty.isPending}
      />

      <EditPropertyDialog
        isOpen={showEditProp}
        initialName={property.name}
        onClose={() => setShowEditProp(false)}
        onSave={handleEditProperty}
        loading={updateProperty.isPending}
      />
    </div>
  )
}
