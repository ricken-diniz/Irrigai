import { useState, useEffect } from 'react'
import { CROP_TYPES, IRRIGATION_SYSTEMS } from '#/lib/constants'

export interface EditCropData {
  name: string
  crop_type: string
  irrigation_system_type: string
  irrigation_turn: string
  planting_date: string
  area_planted_hectares: string
}

interface EditCropDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EditCropData) => void
  initialData: EditCropData
  loading?: boolean
}

export default function EditCropDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false,
}: EditCropDialogProps) {
  const [form, setForm] = useState<EditCropData>(initialData)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (isOpen) {
      setForm(initialData)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  // Group irrigation systems by category for optgroup
  const irrigationByCategory = IRRIGATION_SYSTEMS.reduce<Record<string, typeof IRRIGATION_SYSTEMS>>((acc, sys) => {
    if (!acc[sys.category]) acc[sys.category] = []
    acc[sys.category].push(sys)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />
      
      <div className="relative bg-[var(--irr-surface-container-lowest)] rounded-xl shadow-lg w-full max-w-[500px] flex flex-col border border-[var(--irr-outline-variant)] overflow-hidden max-h-[90vh]">
        <div className="p-6 overflow-y-auto">
          <h3 className="text-[18px] font-bold text-[var(--irr-on-surface)] mb-4">
            Editar Cultura
          </h3>
          
          <form id="editCropForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="edit_name">
                Nome
              </label>
              <input
                id="edit_name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tipo de Cultura */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="edit_crop_type">
                  Tipo de Cultura
                </label>
                <select
                  id="edit_crop_type"
                  name="crop_type"
                  value={form.crop_type}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)] appearance-none"
                >
                  <option value="" disabled>Selecione...</option>
                  {CROP_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Sistema de Irrigação */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="edit_irrigation_system_type">
                  Sistema de Irrigação
                </label>
                <select
                  id="edit_irrigation_system_type"
                  name="irrigation_system_type"
                  value={form.irrigation_system_type}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)] appearance-none"
                >
                  <option value="" disabled>Selecione...</option>
                  {Object.entries(irrigationByCategory).map(([category, systems]) => (
                    <optgroup key={category} label={category}>
                      {systems.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Turno de Irrigação */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="edit_irrigation_turn">
                  Turno de Irrigação (dias)
                </label>
                <input
                  id="edit_irrigation_turn"
                  name="irrigation_turn"
                  type="number"
                  value={form.irrigation_turn}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                  className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)]"
                />
              </div>

              {/* Data de Plantio */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="edit_planting_date">
                  Data de Plantio
                </label>
                <input
                  id="edit_planting_date"
                  name="planting_date"
                  type="date"
                  value={form.planting_date}
                  onChange={handleChange}
                  required
                  max={today}
                  className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)]"
                />
              </div>

              {/* Área Ocupada */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="edit_area_planted_hectares">
                  Área Ocupada (ha)
                </label>
                <input
                  id="edit_area_planted_hectares"
                  name="area_planted_hectares"
                  type="number"
                  value={form.area_planted_hectares}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)]"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="bg-[var(--irr-surface-container-low)] px-6 py-4 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-[16px] font-medium text-[var(--irr-on-surface)] hover:bg-[var(--irr-surface-variant)] rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="editCropForm"
            disabled={loading}
            className="px-4 py-2 text-[16px] font-medium bg-[var(--irr-secondary)] text-[var(--irr-on-secondary)] hover:bg-[var(--irr-secondary)]/90 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
