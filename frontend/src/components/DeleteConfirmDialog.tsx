interface DeleteConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function DeleteConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-[var(--irr-surface-container-lowest)] rounded-xl shadow-lg w-full max-w-[400px] border border-[var(--irr-outline-variant)] overflow-hidden scale-in">
        {/* Header */}
        <div className="pt-6 px-6 pb-4 flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row sm:gap-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--irr-error-container)] sm:mx-0 sm:h-10 sm:w-10 mb-4 sm:mb-0">
            <span className="material-symbols-outlined icon-filled text-[var(--irr-on-error-container)] text-[24px]">
              warning
            </span>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0">
            <h3 className="text-[18px] font-bold leading-6 text-[var(--irr-on-surface)]">
              {title}
            </h3>
            <p className="mt-2 text-[14px] leading-5 text-[var(--irr-on-surface-variant)]">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[var(--irr-surface-container-low)] px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex w-full justify-center rounded-lg bg-transparent px-4 py-2 text-[16px] font-semibold text-[var(--irr-on-surface)] hover:bg-[var(--irr-surface-variant)] transition-colors sm:w-auto disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-[var(--irr-error)] px-4 py-2 text-[16px] font-semibold text-[var(--irr-on-error)] hover:opacity-90 transition-opacity sm:w-auto disabled:opacity-60 active:scale-[0.98]"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  )
}
