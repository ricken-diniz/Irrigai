import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useCreateProperty } from '#/hooks/useProperties'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

export const Route = createFileRoute('/_auth/propriedades/nova')({
  component: NovaPropriedadePage,
})

function NovaPropriedadePage() {
  const navigate = useNavigate()
  const createProperty = useCreateProperty()

  const [form, setForm] = useState({ name: '', state: '', municipality: '' })
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createProperty.mutateAsync(form)
      navigate({ to: '/propriedades' })
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao salvar propriedade.')
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* TopBar */}
      <header className="bg-[var(--irr-surface)] border-b border-[var(--irr-outline-variant)] flex justify-between items-center w-full px-4 h-16 sticky top-16 z-10">
        <div className="flex items-center gap-2">
          <Link
            to="/propriedades"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--irr-surface-container-low)] transition-colors text-[var(--irr-on-surface-variant)] no-underline"
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-[18px] font-bold text-[var(--irr-primary)]">Criar Propriedade</h1>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-[24px] font-semibold text-[var(--irr-on-surface)] md:text-[28px]">
            Nova Propriedade
          </h2>
          <p className="text-[14px] text-[var(--irr-on-surface-variant)] mt-1">
            Insira os dados da sua propriedade para configurar o sistema de irrigação inteligente.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[var(--irr-surface-container-lowest)] rounded-2xl border border-[var(--irr-outline-variant)] shadow-[0_4px_12px_rgba(27,67,50,0.05)] p-4 md:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-[var(--irr-on-surface)]" htmlFor="name">
                Nome da Propriedade
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Fazenda Boa Esperança"
                required
                minLength={1}
                maxLength={120}
                className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface-container-lowest)] px-3 text-[16px] text-[var(--irr-on-surface)] placeholder:text-[var(--irr-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--irr-mint)] focus:border-transparent transition-colors"
              />
            </div>

            {/* Estado + Município */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface)]" htmlFor="state">
                  Estado
                </label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="select-arrow w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface-container-lowest)] px-3 text-[16px] text-[var(--irr-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--irr-mint)] focus:border-transparent transition-colors"
                >
                  <option value="" disabled>Selecione um estado</option>
                  {ESTADOS_BR.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-semibold text-[var(--irr-on-surface)]" htmlFor="municipality">
                  Município
                </label>
                <input
                  id="municipality"
                  name="municipality"
                  type="text"
                  value={form.municipality}
                  onChange={handleChange}
                  placeholder="Ex: Ribeirão Preto"
                  required
                  className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface-container-lowest)] px-3 text-[16px] text-[var(--irr-on-surface)] placeholder:text-[var(--irr-outline)] focus:outline-none focus:ring-2 focus:ring-[var(--irr-mint)] focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Map hint */}
            <div className="mt-2 rounded-xl overflow-hidden border border-[var(--irr-outline-variant)] relative h-28 flex items-center justify-center bg-[var(--irr-surface-container)]">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#717973 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
                <span className="material-symbols-outlined text-[var(--irr-outline)] text-[24px] mb-1">satellite_alt</span>
                <p className="text-[14px] text-[var(--irr-on-surface-variant)] max-w-[200px]">
                  A localização exata será configurada na próxima etapa.
                </p>
              </div>
            </div>

            <hr className="border-t border-[var(--irr-outline-variant)] my-2" />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--irr-error-container)] text-[var(--irr-on-error-container)] text-[14px]">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={createProperty.isPending}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-[var(--irr-mint)] text-white text-[18px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {createProperty.isPending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Salvar Propriedade
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
