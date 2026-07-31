import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCrop, useDeleteCrop, useUpdateCrop } from '#/hooks/useCrops'
import DeleteConfirmDialog from '#/components/DeleteConfirmDialog'
import EditCropDialog, { type EditCropData } from '#/components/EditCropDialog'

export const Route = createFileRoute('/_auth/propriedades/$propertyId/culturas/$cropId/')({
  component: CropDetailPage,
})

function CropDetailPage() {
  const { propertyId, cropId } = Route.useParams()
  const navigate = useNavigate()
  const { data: crop, isLoading } = useCrop(cropId)
  const deleteCrop = useDeleteCrop()
  const updateCrop = useUpdateCrop(cropId)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  async function handleDelete() {
    await deleteCrop.mutateAsync({ id: cropId, propertyId })
    navigate({ to: '/propriedades/$propertyId', params: { propertyId } })
  }

  async function handleEdit(data: EditCropData) {
    await updateCrop.mutateAsync({
      name: data.name,
      crop_type: data.crop_type,
      irrigation_system_type: data.irrigation_system_type,
      planting_date: new Date(data.planting_date).toISOString(),
      area_planted_hectares: data.area_planted_hectares ? parseFloat(data.area_planted_hectares) : null,
    })
    setShowEdit(false)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[var(--irr-surface-variant)] rounded w-1/3" />
          <div className="h-8 bg-[var(--irr-surface-variant)] rounded w-1/2" />
          <div className="h-48 bg-[var(--irr-surface-variant)] rounded-xl" />
        </div>
      </div>
    )
  }

  if (!crop) return null

  const daysSincePlanting = Math.floor(
    (Date.now() - new Date(crop.planting_date).getTime()) / (1000 * 60 * 60 * 24),
  )
  const growthPercent = Math.min(Math.round((daysSincePlanting / 120) * 100), 100)
  const plantingDateFormatted = new Date(crop.planting_date).toLocaleDateString('pt-BR')

  const STAGE_LABELS: Record<number, string> = {
    0: 'Germinação',
    20: 'Crescimento Vegetativo',
    40: 'Desenvolvimento',
    60: 'Floração',
    80: 'Frutificação',
    95: 'Maturação',
  }
  const stageLabel = Object.entries(STAGE_LABELS)
    .filter(([pct]) => Number(pct) <= growthPercent)
    .at(-1)?.[1] ?? 'Germinação'

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="px-4 pt-6 pb-2">
        <Link
          to="/propriedades/$propertyId"
          params={{ propertyId }}
          className="inline-flex items-center gap-1 text-[var(--irr-on-surface-variant)] hover:text-[var(--irr-secondary)] transition-colors text-[14px] no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Voltar para Propriedade
        </Link>
        <h1 className="text-[24px] font-semibold leading-8 text-[var(--irr-on-surface)] mt-2">
          {crop.name}
        </h1>
        <p className="text-[14px] text-[var(--irr-on-surface-variant)]">
          Monitoramento de cultura e requerimentos hídricos.
        </p>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Growth stage */}
        <div className="bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-4 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-[18px] font-semibold text-[var(--irr-on-surface)]">
                Estágio de Crescimento
              </h2>
              <p className="text-[14px] text-[var(--irr-on-surface-variant)]">{stageLabel}</p>
            </div>
            <span className="text-[20px] font-medium text-[var(--irr-secondary)]">{growthPercent}%</span>
          </div>
          <div className="h-2 w-full bg-[var(--irr-surface-variant)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--irr-secondary)] rounded-full transition-all"
              style={{ width: `${growthPercent}%` }}
            />
          </div>
        </div>

        {/* Calculation CTA */}
        <div className="bg-[var(--irr-primary-container)] text-[var(--irr-on-primary-container)] rounded-xl p-4 flex flex-col relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined icon-filled text-[120px]">water_drop</span>
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined icon-filled text-[24px]">calculate</span>
              <h2 className="text-[18px] font-semibold">Cálculo de Irrigação</h2>
            </div>
            <p className="text-[14px] opacity-90 max-w-[85%]">
              Gere recomendações precisas de lâmina de água baseadas nos dados de telemetria atuais.
            </p>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: '/propriedades/$propertyId/culturas/$cropId/recomendacao',
                  params: { propertyId, cropId },
                })
              }
              className="bg-[var(--irr-secondary)] text-white py-2 px-4 rounded-lg text-[18px] font-semibold flex items-center justify-center gap-2 mt-2 active:scale-95 transition-transform w-full md:w-auto md:self-start"
            >
              GERAR RECOMENDAÇÃO
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[var(--irr-on-surface-variant)]">
              <span className="material-symbols-outlined text-[20px]">grass</span>
              <span className="text-[14px]">Tipo</span>
            </div>
            <span className="text-[16px] font-medium text-[var(--irr-on-surface)] capitalize">
              {crop.crop_type}
            </span>
          </div>
          <div className="bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[var(--irr-on-surface-variant)]">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span className="text-[14px]">Data de Plantio</span>
            </div>
            <span className="text-[16px] font-medium text-[var(--irr-on-surface)]">
              {plantingDateFormatted}
            </span>
          </div>
          <div className="col-span-2 bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-4 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[var(--irr-on-surface-variant)]">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
                <span className="text-[14px]">Sistema de Irrigação</span>
              </div>
              <span className="text-[16px] font-medium text-[var(--irr-on-surface)] capitalize">
                {crop.irrigation_system_type}
              </span>
            </div>
          </div>
          {crop.area_planted_hectares != null && (
            <div className="col-span-2 bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] p-4 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[var(--irr-on-surface-variant)]">
                  <span className="material-symbols-outlined text-[20px]">straighten</span>
                  <span className="text-[14px]">Área Plantada</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-medium text-[var(--irr-on-surface)]">
                    {crop.area_planted_hectares}
                  </span>
                  <span className="text-[14px] text-[var(--irr-on-surface-variant)]">hectares</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-[var(--irr-outline-variant)] flex gap-2">
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="flex-1 border border-[var(--irr-outline-variant)] text-[var(--irr-on-surface)] bg-[var(--irr-surface)] rounded-full px-4 py-3 text-[18px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--irr-surface-container-low)] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Editar
          </button>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="flex-1 border border-[var(--irr-error)] text-[var(--irr-error)] bg-transparent rounded-full px-4 py-3 text-[18px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--irr-error-container)]/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Excluir
          </button>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDelete}
        title="Excluir Cultura?"
        description={`Esta ação não pode ser desfeita. A cultura "${crop.name}" e todos os dados de irrigação associados serão excluídos permanentemente.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleteCrop.isPending}
      />

      <EditCropDialog
        isOpen={showEdit}
        initialData={{
          name: crop.name,
          crop_type: crop.crop_type,
          irrigation_system_type: crop.irrigation_system_type,
          planting_date: crop.planting_date.split('T')[0],
          area_planted_hectares: crop.area_planted_hectares ? String(crop.area_planted_hectares) : '',
        }}
        onClose={() => setShowEdit(false)}
        onSave={handleEdit}
        loading={updateCrop.isPending}
      />
    </div>
  )
}
