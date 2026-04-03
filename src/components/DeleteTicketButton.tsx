'use client'

interface DeleteTicketButtonProps {
  contactId: number | string
  deleteAction: (formData: FormData) => Promise<void>
}

export default function DeleteTicketButton({ contactId, deleteAction }: DeleteTicketButtonProps) {
  function handleClick() {
    if (confirm('Möchten Sie dieses Ticket wirklich endgültig löschen?\n\nAlle Nachrichten werden unwiderruflich gelöscht.')) {
      const formData = new FormData()
      formData.set('contact_id', String(contactId))
      deleteAction(formData)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-red-100">
      <button
        type="button"
        onClick={handleClick}
        className="text-red-500 text-sm hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        🗑 Gesamtes Ticket löschen
      </button>
    </div>
  )
}
