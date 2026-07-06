import { useState } from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router'
import { useRADSEAAuth } from '../../contexts/RADSEAAuth'

const navItems = [
  { label: 'Dashboard', to: '/radsea/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect height="7" width="7" x="3" y="3" rx="1"/><rect height="7" width="7" x="14" y="3" rx="1"/><rect height="7" width="7" x="14" y="14" rx="1"/><rect height="7" width="7" x="3" y="14" rx="1"/></svg> },
  { label: 'Prospects', to: '/radsea/prospects', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Agents', to: '/radsea/agents', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
  { label: 'Analytics', to: '/radsea/analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  { label: 'Audit', to: '/radsea/audit', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> },
]

export default function RADSEALayout() {
  const { authenticated, logout } = useRADSEAAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!authenticated) return <Navigate to="/radsea" replace />

  const handleLogout = () => {
    logout()
    navigate('/radsea')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="h-screen w-full flex items-center justify-center p-0 sm:p-4 lg:p-8 text-gray-800 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"/>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 sm:hidden flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <img src="/Logo.webp" alt="CYPOX" className="h-6 w-auto" />
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-semibold">RADSEA</span>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden bg-black/30 backdrop-blur-sm" onClick={closeSidebar}/>
      )}

      <div className="glass-container w-full max-w-[1400px] h-full max-h-[900px] rounded-none sm:rounded-[40px] flex overflow-hidden shadow-2xl relative pt-14 sm:pt-0">

        {/* Sidebar */}
        <aside className={`
          glass-sidebar w-[260px] lg:w-[280px] h-full flex flex-col pt-10 pb-8 px-5 rounded-l-[40px] z-50 shrink-0
          fixed sm:static inset-y-0 left-0 transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}>
          {/* Logo + RADSEA */}
          <div className="flex flex-col items-center px-3 mb-10">
            <img src="/Logo.webp" alt="CYPOX" className="h-8 w-auto mb-1" />
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-semibold">RADSEA</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'nav-item-active'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mt-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Déconnexion
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full flex flex-col p-4 sm:p-8 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
