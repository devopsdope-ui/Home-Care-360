import { AdminOperations } from './AdminOperations'
import { AdminJobs } from './AdminJobs'
import { AdminCitizens } from './AdminCitizens'
import { AdminTechnicians } from './AdminTechnicians'
import { AdminVerification } from './AdminVerification'
import { SOSMonitor } from './SOSMonitor'
import { AdminTransactions } from './AdminTransactions'
import { AdminSettings } from './AdminSettings'

export function AdminApp({
  view,
  setView,
}: {
  view: string
  setView: (v: string) => void
}) {
  if (view === 'jobs') return <AdminJobs setView={setView} />
  if (view === 'citizens') return <AdminCitizens />
  if (view === 'technicians') return <AdminTechnicians setView={setView} />
  if (view === 'verification') return <AdminVerification />
  if (view === 'sos') return <SOSMonitor />
  if (view === 'transactions') return <AdminTransactions />
  if (view === 'settings') return <AdminSettings />
  return <AdminOperations setView={setView} />
}
