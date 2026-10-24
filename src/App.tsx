import type { ReactNode } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { CitizenDashboard } from './features/citizen/CitizenDashboard'
import { RequestScreen } from './features/citizen/RequestScreen'
import { OffersScreen } from './features/citizen/OffersScreen'
import { TechnicianDetails } from './features/citizen/TechnicianDetails'
import { Negotiation } from './features/citizen/Negotiation'
import { Locked } from './features/citizen/Locked'
import { GroupBuying } from './features/citizen/GroupBuying'
import { ActiveJob } from './features/citizen/ActiveJob'
import { Evidence } from './features/citizen/Evidence'
import { Completion } from './features/citizen/Completion'
import { Receipt } from './features/citizen/Receipt'
import { CitizenProfile } from './features/citizen/CitizenProfile'
import { TechnicianApp } from './features/technician/TechnicianApp'
import { AdminApp } from './features/admin/AdminApp'
import type { CitizenView } from './types'

function AppContent() {
  const { role, view, setView } = useApp()

  const citizenGo = (v: CitizenView) => setView(v)

  let content: ReactNode

  if (role === 'citizen') {
    const views: Record<CitizenView, ReactNode> = {
      overview: <CitizenDashboard go={citizenGo} />,
      request: <RequestScreen go={citizenGo} />,
      offers: <OffersScreen go={citizenGo} />,
      technician: <TechnicianDetails go={citizenGo} />,
      negotiate: <Negotiation go={citizenGo} />,
      locked: <Locked go={citizenGo} />,
      group: <GroupBuying go={citizenGo} />,
      job: <ActiveJob go={citizenGo} />,
      evidence: <Evidence go={citizenGo} />,
      complete: <Completion go={citizenGo} />,
      receipt: <Receipt go={citizenGo} />,
      review: <CitizenProfile go={citizenGo} />,
    }
    content = views[view as CitizenView] || views.overview
  } else if (role === 'technician') {
    content = <TechnicianApp view={view} setView={setView} />
  } else {
    content = <AdminApp view={view} setView={setView} />
  }

  return <AppShell>{content}</AppShell>
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
