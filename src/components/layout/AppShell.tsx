import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { SearchModal } from '../common/SearchModal'
import { SeniorCallToBookModal } from '../../features/senior-booking/SeniorCallToBookModal'
import { useApp } from '../../context/AppContext'

export function AppShell({ children }: { children: ReactNode }) {
  const { searchModalOpen, setSearchModalOpen, role, view } = useApp()

  return (
    <div className="app-shell">
      <div
        key={`${role}-${view}`}
        className="fx-top-bar"
        aria-hidden="true"
      />
      <Sidebar />
      <div className="workspace">
        <Topbar />
        <main>{children}</main>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      <SeniorCallToBookModal />
    </div>
  )
}
