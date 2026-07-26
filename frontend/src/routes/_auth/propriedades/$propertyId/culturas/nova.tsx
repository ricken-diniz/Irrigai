import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCreateCrop } from '#/hooks/useCrops'

const CROP_TYPES = [
  { value: 'milho', label: 'Milho' },
  { value: 'soja', label: 'Soja' },
  { value: 'algodao', label: 'Algodão' },
  { value: 'feijao', label: 'Feijão' },
  { value: 'cafe', label: 'Café' },
  { value: 'arroz', label: 'Arroz' },
  { value: 'trigo', label: 'Trigo' },
  { value: 'outro', label: 'Outro' },
]

const IRRIGATION_SYSTEMS = [
  { value: 'gotejamento', label: 'Gotejamento' },
  { value: 'aspersao', label: 'Aspersão' },
  { value: 'microaspersao', label: 'Microaspersão' },
  { value: 'pivo_central', label: 'Pivô Central' },
  { value: 'sulcos', label: 'Sulcos' },
  { value: 'inundacao', label: 'Inundação' },
]

export const Route = createFileRoute('/_auth/propriedades/$propertyId/culturas/nova')({
  component: NovaCulturaPage,
})

function NovaCulturaPage() {
  const { propertyId } = Route.useParams()
  const navigate = useNavigate()
  const createCrop = useCreateCrop()

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    name: '',
    crop_type: '',
    irrigation_system_type: '',
    planting_date: today,
    area_planted_hectares: '',
  })
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createCrop.mutateAsync({
        property_id: propertyId,
        name: form.name,
        crop_type: form.crop_type,
        irrigation_system_type: form.irrigation_system_type,
        planting_date: new Date(form.planting_date).toISOString(),
        area_planted_hectares: form.area_planted_hectares
          ? parseFloat(form.area_planted_hectares)
          : null,
      })
      navigate({ to: '/propriedades/$propertyId', params: { propertyId } })
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao cadastrar cultura.')
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile header */}
      <header className="bg-[var(--irr-surface)] flex justify-between items-center w-full px-4 h-16 border-b border-[var(--irr-outline-variant)] md:hidden sticky top-16 z-10">
        <Link
          to="/propriedades/$propertyId"
          params={{ propertyId }}
          className="text-[var(--irr-primary)] no-underline active:scale-95 transition-transform"
          aria-label="Voltar"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-[18px] font-bold text-[var(--irr-primary)]">Irrigaí</h1>
        <div className="w-6" />
      </header>

      {/* Desktop header */}
      <header className="hidden md:flex bg-[var(--irr-surface)] justify-between items-center w-full px-4 h-16 border-b border-[var(--irr-outline-variant)] sticky top-16 z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/propriedades/$propertyId"
            params={{ propertyId }}
            className="text-[var(--irr-on-surface-variant)] hover:text-[var(--irr-primary)] transition-colors no-underline"
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-[24px] font-semibold text-[var(--irr-primary-container)]">Nova Cultura</h2>
            <p className="text-[14px] text-[var(--irr-on-surface-variant)]">
              Cadastre os detalhes do plantio para monitoramento.
            </p>
          </div>
        </div>
      </header>

      <div className="flex justify-center px-4 py-6 md:py-10">
        <div className="w-full max-w-[600px] flex flex-col gap-6">
          <div className="md:hidden mb-2">
            <h2 className="text-[24px] font-semibold text-[var(--irr-primary-container)]">Nova Cultura</h2>
            <p className="text-[14px] text-[var(--irr-on-surface-variant)] mt-1">
              Cadastre os detalhes do plantio para monitoramento.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-4 md:p-6 flex flex-col gap-6"
          >
            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] text-[var(--irr-on-surface-variant)] font-semibold" htmlFor="name">
                Nome ou Identificação
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Milho Safrinha Lote A"
                required
                minLength={3}
                maxLength={100}
                className="w-full bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg px-4 py-3 text-[16px] text-[var(--irr-on-surface)] transition-all placeholder:text-[var(--irr-outline)] focus:border-[var(--irr-mint)] focus:ring-1 focus:ring-[var(--irr-mint)] focus:outline-none"
              />
              <p className="text-[12px] text-[var(--irr-outline)]">Um nome único para identificar este talhão.</p>
            </div>

            {/* Tipo de Cultura */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] text-[var(--irr-on-surface-variant)] font-semibold" htmlFor="crop_type">
                Variedade da Cultura
              </label>
              <div className="relative">
                <select
                  id="crop_type"
                  name="crop_type"
                  value={form.crop_type}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg px-4 py-3 text-[16px] text-[var(--irr-on-surface)] transition-all appearance-none focus:border-[var(--irr-mint)] focus:ring-1 focus:ring-[var(--irr-mint)] focus:outline-none"
                >
                  <option value="" disabled>Selecione uma variedade...</option>
                  {CROP_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[var(--irr-on-surface-variant)]">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* Sistema de Irrigação */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] text-[var(--irr-on-surface-variant)] font-semibold" htmlFor="irrigation_system_type">
                Sistema de Irrigação
              </label>
              <div className="relative">
                <select
                  id="irrigation_system_type"
                  name="irrigation_system_type"
                  value={form.irrigation_system_type}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg px-4 py-3 text-[16px] text-[var(--irr-on-surface)] transition-all appearance-none focus:border-[var(--irr-mint)] focus:ring-1 focus:ring-[var(--irr-mint)] focus:outline-none"
                >
                  <option value="" disabled>Selecione o sistema...</option>
                  {IRRIGATION_SYSTEMS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[var(--irr-on-surface-variant)]">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* Data + Área */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-[var(--irr-on-surface-variant)] font-semibold" htmlFor="planting_date">
                  Data de Plantio
                </label>
                <input
                  id="planting_date"
                  name="planting_date"
                  type="date"
                  value={form.planting_date}
                  onChange={handleChange}
                  required
                  max={today}
                  className="w-full bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg pl-4 pr-10 py-3 text-[16px] text-[var(--irr-on-surface)] transition-all focus:border-[var(--irr-mint)] focus:ring-1 focus:ring-[var(--irr-mint)] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-[var(--irr-on-surface-variant)] font-semibold" htmlFor="area_planted_hectares">
                  Área Ocupada
                </label>
                <div className="relative flex items-center">
                  <input
                    id="area_planted_hectares"
                    name="area_planted_hectares"
                    type="number"
                    value={form.area_planted_hectares}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-[var(--irr-surface-container-lowest)] border border-[var(--irr-outline-variant)] rounded-lg pl-4 pr-12 py-3 text-right text-[20px] font-medium text-[var(--irr-on-surface)] transition-all focus:border-[var(--irr-mint)] focus:ring-1 focus:ring-[var(--irr-mint)] focus:outline-none"
                  />
                  <div className="absolute right-0 pr-3 flex items-center pointer-events-none bg-[var(--irr-surface-container-low)] h-[calc(100%-2px)] rounded-r-lg border-l border-[var(--irr-outline-variant)] px-2">
                    <span className="text-[16px] text-[var(--irr-on-surface-variant)] font-medium">ha</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t border-[var(--irr-outline-variant)]" />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--irr-error-container)] text-[var(--irr-on-error-container)] text-[14px]">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createCrop.isPending}
                className="w-full md:w-auto bg-[var(--irr-mint)] hover:opacity-90 text-white text-[18px] font-semibold py-3 px-6 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {createCrop.isPending ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <>
                    <span className="material-symbols-outlined icon-filled text-[20px]">add_circle</span>
                    Cadastrar Cultura
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
