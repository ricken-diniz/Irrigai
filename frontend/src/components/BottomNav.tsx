import { Link, useLocation } from '@tanstack/react-router'

const tabs = [
  { label: 'Propriedades', icon: 'grid_view', to: '/propriedades' },
  { label: 'Culturas', icon: 'grass', to: '/culturas' },
  { label: 'Perfil', icon: 'person', to: '/perfil' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-2 bg-[var(--irr-surface-container-lowest)] border-t border-[var(--irr-outline-variant)] shadow-[0_-4px_16px_rgba(27,67,50,0.08)] rounded-t-xl">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.to)
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex flex-col items-center justify-center no-underline active:scale-90 transition-all"
          >
            <div
              className={[
                'flex flex-col items-center justify-center rounded-full px-4 py-1 mb-1 transition-colors',
                isActive
                  ? 'bg-[var(--irr-secondary-container)] text-[var(--irr-on-secondary-container)]'
                  : 'text-[var(--irr-on-surface-variant)] hover:text-[var(--irr-secondary)]',
              ].join(' ')}
            >
              <span className={`material-symbols-outlined ${isActive ? 'icon-filled' : ''}`}>
                {tab.icon}
              </span>
            </div>
            <span
              className={[
                'text-[11px] leading-4 font-bold tracking-widest uppercase',
                isActive
                  ? 'text-[var(--irr-on-surface)]'
                  : 'text-[var(--irr-on-surface-variant)]',
              ].join(' ')}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
