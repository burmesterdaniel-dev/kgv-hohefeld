import Link from 'next/link'

interface AdminSidebarLinksProps {
  openRequests?: number
  pendingPhotos?: number
  onClick?: () => void
}

export default function AdminSidebarLinks({ openRequests = 0, pendingPhotos = 0, onClick }: AdminSidebarLinksProps) {
  return (
    <nav className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto custom-scrollbar">
      <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-4 pb-2">Übersicht</p>
      <Link href="/admin" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">📊</span>
        Dashboard
      </Link>

      <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-5 pb-2">Inhalte</p>
      <Link href="/admin/events" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">📅</span>
        Events
      </Link>
      <Link href="/admin/fotos" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">🖼️</span>
        Bilder
        {pendingPhotos > 0 && <span className="ml-auto bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{pendingPhotos}</span>}
      </Link>
      <Link href="/admin/mitglieder" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">👥</span>
        Vorstand
      </Link>
      <Link href="/admin/gaerten" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">🌱</span>
        Gärten
      </Link>

      <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-5 pb-2">Kommunikation</p>
      <Link href="/admin/kontakte" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">💬</span>
        Anfragen
        {openRequests > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{openRequests}</span>}
      </Link>
      <Link href="/admin/gaestebuch" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">📝</span>
        Gästebuch
      </Link>

      <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.15em] px-4 pt-5 pb-2">System</p>
      <Link href="/admin/users" onClick={onClick} className="group px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-[15px]">
        <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors text-sm">🔐</span>
        Admins
      </Link>
    </nav>
  )
}
