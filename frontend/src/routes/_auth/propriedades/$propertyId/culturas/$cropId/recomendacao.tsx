import { createFileRoute, Link } from '@tanstack/react-router'
import { useCrop, useCropCalculation } from '#/hooks/useCrops'

export const Route = createFileRoute(
  '/_auth/propriedades/$propertyId/culturas/$cropId/recomendacao',
)({
  component: RecomendacaoPage,
})

function MetricCard({
  icon,
  label,
  value,
  unit,
  accent = false,
}: {
  icon: string
  label: string
  value: string | number | undefined
  unit?: string
  accent?: boolean
}) {
  return (
    <div
      className={[
        'rounded-xl border p-4 flex flex-col gap-2 card-shadow',
        accent
          ? 'bg-[var(--irr-primary-container)] border-[var(--irr-primary-container)] text-[var(--irr-on-primary-container)]'
          : 'bg-[var(--irr-surface-container-lowest)] border-[var(--irr-outline-variant)] text-[var(--irr-on-surface)]',
      ].join(' ')}
    >
      <div className={`flex items-center gap-2 ${accent ? 'opacity-80' : 'text-[var(--irr-on-surface-variant)]'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="text-[14px]">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[20px] font-medium">
          {value !== undefined ? value : '—'}
        </span>
        {unit && (
          <span className={`text-[14px] ${accent ? 'opacity-70' : 'text-[var(--irr-on-surface-variant)]'}`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

function RecomendacaoPage() {
  const { propertyId, cropId } = Route.useParams()
  const { data: crop } = useCrop(cropId)
  const { data: calc, isLoading, isError, error } = useCropCalculation(cropId)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        to="/propriedades/$propertyId/culturas/$cropId"
        params={{ propertyId, cropId }}
        className="inline-flex items-center gap-1 text-[var(--irr-on-surface-variant)] hover:text-[var(--irr-secondary)] transition-colors text-[14px] no-underline mb-4"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para {crop?.name ?? 'Cultura'}
      </Link>

      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-[var(--irr-primary)] md:text-[28px]">
          Recomendação de Irrigação
        </h1>
        <p className="text-[14px] text-[var(--irr-on-surface-variant)] mt-1">
          {crop?.name} · {crop?.crop_type}
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          <div className="h-48 bg-[var(--irr-primary-container)]/30 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-[var(--irr-surface-variant)] animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--irr-surface-container)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--irr-outline)] text-[32px]">
              cloud_off
            </span>
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[var(--irr-on-surface)]">
              Cálculo Não Disponível
            </h2>
            <p className="text-[14px] text-[var(--irr-on-surface-variant)] mt-1 max-w-sm mx-auto">
              Não foi possível gerar a recomendação de irrigação. Verifique se os dados de telemetria estão configurados.
            </p>
            <p className="text-[12px] text-[var(--irr-error)] mt-2 opacity-70">
              {(error as Error)?.message}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && calc && (
        <div className="flex flex-col gap-4">
          {/* Main recommendation card */}
          <div className="bg-[var(--irr-primary-container)] text-[var(--irr-on-primary-container)] rounded-2xl p-6 relative overflow-hidden card-shadow">
            <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined icon-filled text-[140px]">water_drop</span>
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-2">
                RECOMENDAÇÃO DE HOJE
              </p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-[36px] font-bold leading-none">
                  {calc.lamina_bruta_mm?.toFixed(1) ?? '—'}
                </span>
                <span className="text-[18px] mb-1 opacity-80">mm</span>
              </div>
              <p className="text-[14px] opacity-80">{calc.recommendation}</p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon="water"
              label="Lâmina Líquida"
              value={calc.lamina_liquida_mm?.toFixed(1)}
              unit="mm"
            />
            <MetricCard
              icon="thermostat"
              label="ETcrop"
              value={calc.etcrop_mm?.toFixed(2)}
              unit="mm/dia"
            />
            <MetricCard
              icon="timer"
              label="Tempo de Irrigação"
              value={calc.tempo_irrigacao_hours?.toFixed(1)}
              unit="horas"
            />
            <MetricCard
              icon="water_drop"
              label="Volume Total"
              value={
                calc.volume_total_liters != null
                  ? (calc.volume_total_liters / 1000).toFixed(1)
                  : undefined
              }
              unit="m³"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--irr-surface-container-lowest)] rounded-xl border border-[var(--irr-outline-variant)] text-[14px]">
            <div className="flex items-center gap-2 text-[var(--irr-on-surface-variant)]">
              <span className="material-symbols-outlined text-[18px]">update</span>
              <span>
                Calculado em {new Date(calc.calculated_at).toLocaleString('pt-BR')}
              </span>
            </div>
            <span
              className={[
                'text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-full',
                calc.status === 'latest'
                  ? 'bg-[var(--irr-secondary-container)] text-[var(--irr-on-secondary-container)]'
                  : 'bg-[var(--irr-surface-variant)] text-[var(--irr-on-surface-variant)]',
              ].join(' ')}
            >
              {calc.status === 'latest' ? 'Atual' : 'Histórico'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
