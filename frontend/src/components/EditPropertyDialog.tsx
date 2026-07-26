import { useState, useEffect } from 'react'

interface EditPropertyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (newName: string) => void
  initialName: string
  loading?: boolean
}

export default function EditPropertyDialog({
  isOpen,
  onClose,
  onSave,
  initialName,
  loading = false,
}: EditPropertyDialogProps) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    if (isOpen) {
      setName(initialName)
    }
  }, [isOpen, initialName])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />
      
      <div className="relative bg-[var(--irr-surface-container-lowest)] rounded-xl shadow-lg w-full max-w-[400px] flex flex-col border border-[var(--irr-outline-variant)] overflow-hidden">
        <div className="p-6">
          <h3 className="text-[18px] font-bold text-[var(--irr-on-surface)] mb-4">
            Editar Propriedade
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[var(--irr-on-surface-variant)]" htmlFor="propName">
              Nome da Propriedade
            </label>
            <input
              id="propName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-lg border border-[var(--irr-outline-variant)] bg-[var(--irr-surface)] px-4 focus:outline-none focus:border-[var(--irr-secondary)] focus:ring-1 focus:ring-[var(--irr-secondary)]"
              placeholder="Nome da propriedade"
            />
          </div>
        </div>

        <div className="bg-[var(--irr-surface-container-low)] px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-[16px] font-medium text-[var(--irr-on-surface)] hover:bg-[var(--irr-surface-variant)] rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(name)}
            disabled={loading || !name.trim()}
            className="px-4 py-2 text-[16px] font-medium bg-[var(--irr-secondary)] text-[var(--irr-on-secondary)] hover:bg-[var(--irr-secondary)]/90 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
