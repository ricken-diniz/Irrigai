import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '#/lib/auth'

export default function AppBar() {
  const { signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { label: 'Propriedades', to: '/propriedades' },
    { label: 'Culturas', to: '/culturas' },
    { label: 'Perfil', to: '/perfil' },
  ]

  return (
    <header className="bg-[var(--irr-surface)] border-b border-[var(--irr-outline-variant)] sticky top-0 z-40 w-full">
      <div className="flex justify-between items-center w-full px-4 h-16 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/propriedades" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-[var(--irr-primary)] icon-filled text-[24px]">
            water_drop
          </span>
          <span className="font-bold text-[18px] leading-6 text-[var(--irr-primary)]">Irrigaí</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'text-[14px] font-medium transition-colors no-underline pb-1',
                location.pathname.startsWith(item.to)
                  ? 'text-[var(--irr-secondary)] border-b-2 border-[var(--irr-secondary)]'
                  : 'text-[var(--irr-on-surface-variant)] hover:text-[var(--irr-secondary)]',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--irr-surface-container-low)] transition-colors text-[var(--irr-on-surface-variant)]"
            aria-label="Notificações"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <button
            type="button"
            onClick={signOut}
            className="hidden md:flex items-center gap-1 text-[13px] text-[var(--irr-on-surface-variant)] hover:text-[var(--irr-error)] transition-colors px-2 py-1 rounded"
            title="Sair"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
