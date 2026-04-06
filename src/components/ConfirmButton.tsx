'use client'

interface ConfirmButtonProps {
  action: () => Promise<void>
  confirmMessage: string
  className?: string
  children: React.ReactNode
}

export default function ConfirmButton({ action, confirmMessage, className, children }: ConfirmButtonProps) {
  function handleClick() {
    if (confirm(confirmMessage)) {
      action()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  )
}
