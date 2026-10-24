import { TechnicianOverview } from './TechnicianOverview'
import { TechnicianRequests } from './TechnicianRequests'
import { TechnicianJob } from './TechnicianJob'
import { Earnings } from './Earnings'
import { Passport } from './Passport'
import { TechProfile } from './TechProfile'

export function TechnicianApp({
  view,
  setView,
}: {
  view: string
  setView: (v: string) => void
}) {
  if (view === 'earnings') return <Earnings />
  if (view === 'passport' || view === 'verification') return <Passport />
  if (view === 'job') return <TechnicianJob />
  if (view === 'request') return <TechnicianRequests setView={setView} />
  if (view === 'profile') return <TechProfile />
  return <TechnicianOverview setView={setView} />
}
