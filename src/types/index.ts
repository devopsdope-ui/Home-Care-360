import type { ReactNode } from 'react'

export type Role = 'citizen' | 'technician' | 'admin'

export type CitizenView =
  | 'overview'
  | 'request'
  | 'offers'
  | 'technician'
  | 'negotiate'
  | 'locked'
  | 'group'
  | 'job'
  | 'evidence'
  | 'complete'
  | 'receipt'
  | 'review'

export type TechnicianView =
  | 'overview'
  | 'request'
  | 'job'
  | 'earnings'
  | 'passport'
  | 'verification'
  | 'profile'

export type AdminView =
  | 'operations'
  | 'jobs'
  | 'citizens'
  | 'technicians'
  | 'verification'
  | 'sos'
  | 'transactions'
  | 'settings'

export type IconName =
  | 'grid'
  | 'search'
  | 'briefcase'
  | 'users'
  | 'wallet'
  | 'user'
  | 'bell'
  | 'chevron'
  | 'shield'
  | 'pin'
  | 'clock'
  | 'star'
  | 'check'
  | 'arrow'
  | 'route'
  | 'camera'
  | 'alert'
  | 'tools'
  | 'home'
  | 'document'
  | 'trend'
  | 'settings'
  | 'phone'
  | 'close'
  | 'filter'
  | 'refresh'
  | 'download'
  | 'plus'
  | 'trash'
  | 'eye'

export interface ServiceCategory {
  code: string
  name: string
  desc: string
  icon: IconName
  startingPrice: number
  avgEta: string
  popularTags: string[]
}

export type JobStatus =
  | 'pending'
  | 'quoted'
  | 'price_locked'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type EscrowStatus = 'none' | 'escrow_locked' | 'released' | 'refunded'

export interface ServiceRequest {
  id: string
  serviceCode: string
  serviceName: string
  description: string
  address: string
  priority: 'standard' | 'urgent'
  scheduledTime: string
  citizenName: string
  citizenPhone: string
  status: JobStatus
  createdAt: string
  bookingSource: 'citizen_web' | 'senior_call_to_book'
  agreedPrice: number
  assignedTechId?: string
  assignedTechName?: string
  assignedTechPhone?: string
  assignedTechInitials?: string
  assignedTechRating?: string
  assignedTechJobs?: number
  escrowStatus: EscrowStatus
  timelineStep: number // 0: Created/Pending, 1: On the way, 2: Arrived, 3: In progress, 4: Completed
  beforePhotoTime?: string
  afterPhotoTime?: string
  beforePhotoUrl?: string
  afterPhotoUrl?: string
  beforePhotoName?: string
  afterPhotoName?: string
  completionNotes?: string
  rating?: number
  reviewText?: string
  paymentRef?: string
  gstAmount?: number
  feeAmount?: number
  totalPaid?: number
}

export interface ChatMessage {
  id: string
  sender: 'citizen' | 'tech' | 'system'
  text: string
  time: string
  accepted?: boolean
  system?: boolean
}

export interface Offer {
  id: string
  requestId: string
  name: string
  initials: string
  rating: string
  jobs: number
  distance: string
  eta: string
  price: number
  deal: string
  pct: number
  tone: 'green' | 'blue' | 'amber'
  phone: string
}

export interface VerificationDocument {
  name: string
  date: string
  status: 'verified' | 'pending' | 'rejected'
}

export interface TechnicianRecord {
  id: string
  name: string
  initials: string
  phone: string
  passportId: string
  services: string[]
  trustScore: number
  rating: number
  jobsCompleted: number
  status: 'online' | 'offline' | 'busy'
  verificationStatus: 'verified' | 'pending' | 'rejected'
  todayEarnings: number
  careerEarnings: number
  documents: VerificationDocument[]
}

export interface CitizenRecord {
  id: string
  name: string
  phone: string
  address: string
  registeredDate: string
  activeJobsCount: number
  totalRequests: number
  totalSpent: number
  isSeniorCitizen: boolean
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

export interface SOSAlert {
  id: string
  jobId: string
  citizenName: string
  technicianName: string
  location: string
  triggeredAt: string
  status: 'active' | 'resolved'
  severity: 'high' | 'critical'
  notes?: string
}

export interface TransactionRecord {
  id: string
  jobId: string
  service: string
  citizen: string
  technician: string
  status: 'Paid' | 'Processing' | 'Escrow Locked' | 'Refunded'
  amount: number
  date: string
  platformFee: number
  gst: number
  netPayout: number
}
