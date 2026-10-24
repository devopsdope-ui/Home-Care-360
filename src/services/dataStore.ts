import { storage } from './storage/localStorageService.ts'
import type {
  ServiceCategory,
  ServiceRequest,
  Offer,
  TechnicianRecord,
  CitizenRecord,
  SOSAlert,
  TransactionRecord,
  JobStatus,
  ChatMessage,
} from '../types'

export const INITIAL_SERVICES: ServiceCategory[] = [
  {
    code: 'SRV-01',
    name: 'Plumbing',
    desc: 'Leaks, fittings & pipes',
    icon: 'route',
    startingPrice: 399,
    avgEta: '15–25 min',
    popularTags: ['Pipe burst', 'Tap installation', 'Drain cleanup', 'Tank overflow'],
  },
  {
    code: 'SRV-02',
    name: 'Electrical',
    desc: 'Wiring, lights & power',
    icon: 'trend',
    startingPrice: 449,
    avgEta: '20–30 min',
    popularTags: ['Short circuit', 'Socket repair', 'MCB tripping', 'Fan fitting'],
  },
  {
    code: 'SRV-03',
    name: 'Cleaning',
    desc: 'Deep home cleaning',
    icon: 'home',
    startingPrice: 499,
    avgEta: '30–45 min',
    popularTags: ['Kitchen deep clean', 'Bathroom wash', 'Sofa shampoo', 'Full house'],
  },
  {
    code: 'SRV-04',
    name: 'Painting',
    desc: 'Interior & exterior',
    icon: 'camera',
    startingPrice: 699,
    avgEta: 'Same day',
    popularTags: ['Waterproofing', 'Wall touch-up', 'Single room', 'Texture paint'],
  },
  {
    code: 'SRV-05',
    name: 'Carpentry',
    desc: 'Furniture & fixtures',
    icon: 'tools',
    startingPrice: 450,
    avgEta: '25–40 min',
    popularTags: ['Door alignment', 'Lock change', 'Cabinet hinge', 'Wood polishing'],
  },
  {
    code: 'SRV-06',
    name: 'AC Repair',
    desc: 'Cooling & servicing',
    icon: 'settings',
    startingPrice: 599,
    avgEta: '30–50 min',
    popularTags: ['Gas refill', 'Filter wash', 'Cooling issue', 'Compressor check'],
  },
  {
    code: 'SRV-07',
    name: 'Pest Control',
    desc: 'Safe pest treatment',
    icon: 'shield',
    startingPrice: 499,
    avgEta: 'Scheduled',
    popularTags: ['Termite proofing', 'Cockroach gel', 'Bedbug heat', 'Ant control'],
  },
  {
    code: 'SRV-08',
    name: 'Appliance Repair',
    desc: 'Home appliance care',
    icon: 'briefcase',
    startingPrice: 499,
    avgEta: '20–35 min',
    popularTags: ['Washing machine', 'Refrigerator', 'Microwave', 'Water purifier'],
  },
]

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'HC-301',
    serviceCode: 'SRV-01',
    serviceName: 'Plumbing',
    description: 'Burst pipe under kitchen sink. Water leaking continuously.',
    address: 'Flat 302, Silver Oak Residency, Andheri West, Mumbai',
    priority: 'standard',
    scheduledTime: 'Immediate dispatch',
    citizenName: 'Rahul Sharma',
    citizenPhone: '+91 98201 55432',
    status: 'on_the_way',
    createdAt: '24 Oct 2026, 14:15',
    bookingSource: 'citizen_web',
    agreedPrice: 500,
    assignedTechId: 'TECH-01',
    assignedTechName: 'Ravi Verma',
    assignedTechPhone: '+91 98111 22334',
    assignedTechInitials: 'RV',
    assignedTechRating: '4.9',
    assignedTechJobs: 247,
    escrowStatus: 'escrow_locked',
    timelineStep: 1, // On the way
    beforePhotoTime: '14:32',
    paymentRef: 'HC360-241026-301',
    feeAmount: 25,
    gstAmount: 94.5,
    totalPaid: 619.5,
  },
  {
    id: 'HC-302',
    serviceCode: 'SRV-02',
    serviceName: 'Electrical',
    description: 'Main fuse board sparks when geyser turns on.',
    address: 'B-14, Lokhandwala Complex, Andheri West, Mumbai',
    priority: 'urgent',
    scheduledTime: 'Urgent SOS',
    citizenName: 'Anita Shah',
    citizenPhone: '+91 98210 44321',
    status: 'in_progress',
    createdAt: '24 Oct 2026, 13:40',
    bookingSource: 'citizen_web',
    agreedPrice: 850,
    assignedTechId: 'TECH-02',
    assignedTechName: 'Amit Kumar',
    assignedTechPhone: '+91 98222 33445',
    assignedTechInitials: 'AK',
    assignedTechRating: '4.7',
    assignedTechJobs: 182,
    escrowStatus: 'escrow_locked',
    timelineStep: 3, // In progress
    beforePhotoTime: '13:58',
    paymentRef: 'HC360-241026-302',
    feeAmount: 42.5,
    gstAmount: 160.65,
    totalPaid: 1053.15,
  },
  {
    id: 'HC-303',
    serviceCode: 'SRV-06',
    serviceName: 'AC Repair',
    description: 'Master bedroom split AC not cooling properly.',
    address: 'Flat 701, Sea Breeze Apartments, Bandra West, Mumbai',
    priority: 'standard',
    scheduledTime: 'Today, 3:00 PM',
    citizenName: 'Meera Desai',
    citizenPhone: '+91 98330 87654',
    status: 'arrived',
    createdAt: '24 Oct 2026, 12:20',
    bookingSource: 'citizen_web',
    agreedPrice: 900,
    assignedTechId: 'TECH-03',
    assignedTechName: 'Neha Joshi',
    assignedTechPhone: '+91 98333 44556',
    assignedTechInitials: 'NJ',
    assignedTechRating: '4.8',
    assignedTechJobs: 164,
    escrowStatus: 'escrow_locked',
    timelineStep: 2, // Arrived
    beforePhotoTime: '12:55',
    paymentRef: 'HC360-241026-303',
    feeAmount: 45,
    gstAmount: 170.1,
    totalPaid: 1115.1,
  },
  {
    id: 'HC-304',
    serviceCode: 'SRV-05',
    serviceName: 'Carpentry',
    description: 'Fixing sliding wardrobe door and bookrack support.',
    address: '4th Floor, Palm View, Juhu Tara Road, Mumbai',
    priority: 'standard',
    scheduledTime: 'Tomorrow, 11:00 AM',
    citizenName: 'Kabir Khan',
    citizenPhone: '+91 98199 12345',
    status: 'quoted',
    createdAt: '24 Oct 2026, 11:00',
    bookingSource: 'citizen_web',
    agreedPrice: 1200,
    assignedTechId: 'TECH-04',
    assignedTechName: 'Suresh Patil',
    assignedTechPhone: '+91 98444 55667',
    assignedTechInitials: 'SP',
    assignedTechRating: '4.5',
    assignedTechJobs: 98,
    escrowStatus: 'none',
    timelineStep: 0,
  },
]

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'OFFER-01',
    requestId: 'HC-301',
    name: 'Ravi Verma',
    initials: 'RV',
    rating: '4.9',
    jobs: 247,
    distance: '2.4 km',
    eta: '8 min',
    price: 650,
    deal: 'GREAT DEAL',
    pct: 58,
    tone: 'green',
    phone: '+91 98111 22334',
  },
  {
    id: 'OFFER-02',
    requestId: 'HC-301',
    name: 'Amit Kumar',
    initials: 'AK',
    rating: '4.7',
    jobs: 182,
    distance: '3.1 km',
    eta: '11 min',
    price: 720,
    deal: 'FAIR PRICE',
    pct: 70,
    tone: 'blue',
    phone: '+91 98222 33445',
  },
  {
    id: 'OFFER-03',
    requestId: 'HC-301',
    name: 'Suresh Patil',
    initials: 'SP',
    rating: '4.5',
    jobs: 98,
    distance: '4.2 km',
    eta: '15 min',
    price: 850,
    deal: 'ABOVE AVERAGE',
    pct: 88,
    tone: 'amber',
    phone: '+91 98444 55667',
  },
]

export const INITIAL_TECHNICIANS: TechnicianRecord[] = [
  {
    id: 'TECH-01',
    name: 'Ravi Verma',
    initials: 'RV',
    phone: '+91 98111 22334',
    passportId: 'PASSPORT-HC360-00004',
    services: ['Plumbing', 'Electrical'],
    trustScore: 99,
    rating: 4.9,
    jobsCompleted: 247,
    status: 'online',
    verificationStatus: 'verified',
    todayEarnings: 4250,
    careerEarnings: 284500,
    documents: [
      { name: 'Govt. Aadhaar Card', date: '20 Oct 2026', status: 'verified' },
      { name: 'Police Clearance Certificate', date: '21 Oct 2026', status: 'verified' },
      { name: 'Level 3 Trade Certificate', date: '22 Oct 2026', status: 'verified' },
      { name: 'Safety & Hygiene Assessment', date: '23 Oct 2026', status: 'verified' },
    ],
  },
  {
    id: 'TECH-02',
    name: 'Amit Kumar',
    initials: 'AK',
    phone: '+91 98222 33445',
    passportId: 'PASSPORT-HC360-00012',
    services: ['Electrical', 'Appliance Repair'],
    trustScore: 95,
    rating: 4.7,
    jobsCompleted: 182,
    status: 'busy',
    verificationStatus: 'verified',
    todayEarnings: 3100,
    careerEarnings: 198000,
    documents: [
      { name: 'Govt. Aadhaar Card', date: '15 Oct 2026', status: 'verified' },
      { name: 'Police Clearance Certificate', date: '16 Oct 2026', status: 'verified' },
      { name: 'ITI Electrician License', date: '17 Oct 2026', status: 'verified' },
      { name: 'Safety & Hygiene Assessment', date: '18 Oct 2026', status: 'verified' },
    ],
  },
  {
    id: 'TECH-03',
    name: 'Neha Joshi',
    initials: 'NJ',
    phone: '+91 98333 44556',
    passportId: 'PASSPORT-HC360-00028',
    services: ['AC Repair', 'Cleaning'],
    trustScore: 97,
    rating: 4.8,
    jobsCompleted: 164,
    status: 'busy',
    verificationStatus: 'verified',
    todayEarnings: 3800,
    careerEarnings: 215000,
    documents: [
      { name: 'Govt. Aadhaar Card', date: '12 Oct 2026', status: 'verified' },
      { name: 'Police Clearance Certificate', date: '13 Oct 2026', status: 'verified' },
      { name: 'HVAC Specialist Cert', date: '14 Oct 2026', status: 'verified' },
      { name: 'Safety & Hygiene Assessment', date: '15 Oct 2026', status: 'verified' },
    ],
  },
  {
    id: 'TECH-04',
    name: 'Suresh Patil',
    initials: 'SP',
    phone: '+91 98444 55667',
    passportId: 'PASSPORT-HC360-00039',
    services: ['Carpentry', 'Painting'],
    trustScore: 88,
    rating: 4.5,
    jobsCompleted: 98,
    status: 'online',
    verificationStatus: 'pending',
    todayEarnings: 1800,
    careerEarnings: 122000,
    documents: [
      { name: 'Govt. Aadhaar Card', date: '21 Oct 2026', status: 'verified' },
      { name: 'Police Clearance Certificate', date: '22 Oct 2026', status: 'pending' },
      { name: 'Carpentry Guild Certificate', date: '23 Oct 2026', status: 'pending' },
      { name: 'Safety & Hygiene Assessment', date: '24 Oct 2026', status: 'pending' },
    ],
  },
]

export const INITIAL_CITIZENS: CitizenRecord[] = [
  {
    id: 'CIT-01',
    name: 'Rahul Sharma',
    phone: '+91 98201 55432',
    address: 'Flat 302, Silver Oak Residency, Andheri West, Mumbai',
    registeredDate: '12 Aug 2026',
    activeJobsCount: 1,
    totalRequests: 8,
    totalSpent: 4850,
    isSeniorCitizen: true,
    emergencyContact: {
      name: 'Rohan Sharma (Son)',
      relationship: 'Son',
      phone: '+91 98209 99887',
    },
  },
  {
    id: 'CIT-02',
    name: 'Anita Shah',
    phone: '+91 98210 44321',
    address: 'B-14, Lokhandwala Complex, Andheri West, Mumbai',
    registeredDate: '04 Sep 2026',
    activeJobsCount: 1,
    totalRequests: 5,
    totalSpent: 3600,
    isSeniorCitizen: false,
    emergencyContact: {
      name: 'Prakash Shah',
      relationship: 'Spouse',
      phone: '+91 98210 55667',
    },
  },
  {
    id: 'CIT-03',
    name: 'Meera Desai',
    phone: '+91 98330 87654',
    address: 'Flat 701, Sea Breeze Apartments, Bandra West, Mumbai',
    registeredDate: '18 Jul 2026',
    activeJobsCount: 1,
    totalRequests: 12,
    totalSpent: 8900,
    isSeniorCitizen: false,
    emergencyContact: {
      name: 'Sunil Desai',
      relationship: 'Brother',
      phone: '+91 98330 11223',
    },
  },
  {
    id: 'CIT-04',
    name: 'Kabir Khan',
    phone: '+91 98199 12345',
    address: '4th Floor, Palm View, Juhu Tara Road, Mumbai',
    registeredDate: '01 Oct 2026',
    activeJobsCount: 1,
    totalRequests: 3,
    totalSpent: 2750,
    isSeniorCitizen: false,
    emergencyContact: {
      name: 'Farhan Khan',
      relationship: 'Father',
      phone: '+91 98199 66778',
    },
  },
]

export const INITIAL_SOS: SOSAlert[] = [
  {
    id: 'SOS-1042',
    jobId: 'HC-301',
    citizenName: 'Rahul Sharma',
    technicianName: 'Ravi Verma',
    location: 'Silver Oak Residency, Andheri West (19.1363° N, 72.8277° E)',
    triggeredAt: '14:32:08',
    status: 'active',
    severity: 'high',
    notes: 'Worker location beacon not updated for 12 minutes. Civic emergency desk alerted.',
  },
]

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TX-301',
    jobId: 'HC-301',
    service: 'Plumbing',
    citizen: 'Rahul Sharma',
    technician: 'Ravi Verma',
    status: 'Escrow Locked',
    amount: 500,
    date: '24 Oct 2026',
    platformFee: 25,
    gst: 94.5,
    netPayout: 475,
  },
  {
    id: 'TX-287',
    jobId: 'HC-287',
    service: 'AC Repair',
    citizen: 'Anita Shah',
    technician: 'Ravi Verma',
    status: 'Paid',
    amount: 900,
    date: '23 Oct 2026',
    platformFee: 45,
    gst: 162,
    netPayout: 855,
  },
  {
    id: 'TX-276',
    jobId: 'HC-276',
    service: 'Plumbing',
    citizen: 'Meera Desai',
    technician: 'Ravi Verma',
    status: 'Paid',
    amount: 650,
    date: '22 Oct 2026',
    platformFee: 32.5,
    gst: 117,
    netPayout: 617.5,
  },
  {
    id: 'TX-265',
    jobId: 'HC-265',
    service: 'Electrical',
    citizen: 'Kabir Khan',
    technician: 'Amit Kumar',
    status: 'Paid',
    amount: 1100,
    date: '20 Oct 2026',
    platformFee: 55,
    gst: 198,
    netPayout: 1045,
  },
]

// Data Access Layer
export const dataStore = {
  getRequests(): ServiceRequest[] {
    return storage.get<ServiceRequest[]>('requests', JSON.parse(JSON.stringify(INITIAL_REQUESTS)))
  },

  saveRequests(requests: ServiceRequest[]): void {
    storage.set('requests', requests)
  },

  getRequest(id: string): ServiceRequest | undefined {
    return this.getRequests().find(r => r.id === id)
  },


  createRequest(data: {
    serviceCode: string
    serviceName: string
    description: string
    address: string
    priority: 'standard' | 'urgent'
    citizenName?: string
    citizenPhone?: string
    scheduledTime?: string
    bookingSource?: 'citizen_web' | 'senior_call_to_book'
    agreedPrice?: number
  }): ServiceRequest {
    const requests = this.getRequests()
    const num = requests.length + 301
    const newId = `HC-${num}`

    const newReq: ServiceRequest = {
      id: newId,
      serviceCode: data.serviceCode,
      serviceName: data.serviceName,
      description: data.description,
      address: data.address,
      priority: data.priority,
      scheduledTime: data.scheduledTime || (data.priority === 'urgent' ? 'High Priority SOS' : 'Within 25 min'),
      citizenName: data.citizenName || 'Rahul Sharma',
      citizenPhone: data.citizenPhone || '+91 98201 55432',
      status: 'pending',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
      bookingSource: data.bookingSource || 'citizen_web',
      agreedPrice: data.agreedPrice || 550,
      escrowStatus: 'none',
      timelineStep: 0,
    }

    requests.unshift(newReq)
    this.saveRequests(requests)

    // Generate realistic nearby technician offers for this new request
    const existingOffers = this.getOffers()
    const matchingTechs = this.getTechnicians()
      .filter(
        t =>
          t.services.includes(data.serviceName) &&
          t.verificationStatus === 'verified' &&
          t.status !== 'offline'
      )
      .slice(0, 3)

    const distances = ['1.8 km', '2.9 km', '4.2 km']
    const etas = ['6 min', '10 min', '15 min']
    const priceOffsets = [0, 70, 150]
    const deals = ['GREAT DEAL', 'FAIR PRICE', 'ABOVE AVERAGE']
    const tones: ('green' | 'blue' | 'amber')[] = ['green', 'blue', 'amber']
    const pcts = [54, 68, 85]
    const basePrice = data.agreedPrice || newReq.agreedPrice || 500

    const newOffers: Offer[] = matchingTechs.map((tech, idx) => ({
      id: `OFFER-${newId}-${idx + 1}`,
      requestId: newId,
      name: tech.name,
      initials: tech.initials,
      rating: String(tech.rating),
      jobs: tech.jobsCompleted,
      distance: distances[idx] || '3.0 km',
      eta: etas[idx] || '12 min',
      price: basePrice + priceOffsets[idx],
      deal: deals[idx] || 'FAIR PRICE',
      pct: pcts[idx] || 65,
      tone: tones[idx] || 'blue',
      phone: tech.phone,
    }))

    if (newOffers.length > 0) {
      this.saveOffers([...newOffers, ...existingOffers])
    }
    return newReq
  },

  updateRequest(id: string, updates: Partial<ServiceRequest>): ServiceRequest | undefined {
    const requests = this.getRequests()
    const idx = requests.findIndex(r => r.id === id)
    if (idx === -1) return undefined

    requests[idx] = { ...requests[idx], ...updates }
    this.saveRequests(requests)
    return requests[idx]
  },

  getOffers(requestId?: string): Offer[] {
    const all = storage.get<Offer[]>('offers', INITIAL_OFFERS)
    if (requestId) {
      return all.filter(o => o.requestId === requestId)
    }
    return all
  },

  saveOffers(offers: Offer[]): void {
    storage.set('offers', offers)
  },

  saveTechnicianOffer(offer: Offer): Offer[] {
    const all = this.getOffers()
    const filtered = all.filter(
      o => !(o.requestId === offer.requestId && (o.phone === offer.phone || o.name === offer.name || o.id === offer.id))
    )
    const updated = [offer, ...filtered]
    this.saveOffers(updated)
    return updated
  },

  acceptOffer(requestId: string, offer: Offer): ServiceRequest | undefined {
    const tech =
      this.getTechnicians().find(t => t.name === offer.name) ||
      this.getTechnicians().find(t => t.phone === offer.phone)
    const current = this.getRequest(requestId)

    const req = this.updateRequest(requestId, {
      status: 'price_locked',
      agreedPrice: offer.price,
      assignedTechId: tech ? tech.id : current?.assignedTechId,
      assignedTechName: offer.name,
      assignedTechInitials: offer.initials,
      assignedTechRating: offer.rating,
      assignedTechJobs: offer.jobs,
      assignedTechPhone: offer.phone,
      escrowStatus: 'escrow_locked',
      timelineStep: 1, // Ready to dispatch
    })
    return req
  },

  dispatchJob(requestId: string): ServiceRequest | undefined {
    return this.updateRequest(requestId, {
      status: 'on_the_way',
      timelineStep: 1,
    })
  },

  reassignJob(requestId: string): ServiceRequest | undefined {
    const req = this.getRequest(requestId)
    if (!req) return undefined

    const techs = this.getTechnicians()
    const backupTech = techs.find(
      t =>
        t.verificationStatus === 'verified' &&
        t.status !== 'offline' &&
        (t.services.includes(req.serviceName) ||
          t.services.some(s => s.toLowerCase() === req.serviceName.toLowerCase()) ||
          t.services.includes(req.serviceCode)) &&
        t.id !== req.assignedTechId &&
        t.name !== req.assignedTechName
    )

    if (!backupTech) {
      return undefined
    }

    const updated = this.updateRequest(requestId, {
      assignedTechId: backupTech.id,
      assignedTechName: backupTech.name,
      assignedTechPhone: backupTech.phone,
      assignedTechInitials: backupTech.initials,
      assignedTechRating: String(backupTech.rating),
      assignedTechJobs: backupTech.jobsCompleted,
      status: 'on_the_way',
      timelineStep: 1,
    })

    this.resetTrackingProgress(requestId)
    return updated
  },

  advanceJobStep(requestId: string, nextStep: number): ServiceRequest | undefined {
    const statusMap: Record<number, JobStatus> = {
      1: 'on_the_way',
      2: 'arrived',
      3: 'in_progress',
      4: 'completed',
    }
    const updates: Partial<ServiceRequest> = {
      timelineStep: nextStep,
      status: statusMap[nextStep] || 'in_progress',
    }
    if (nextStep === 2 && !this.getRequest(requestId)?.beforePhotoTime) {
      updates.beforePhotoTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
    if (nextStep === 4) {
      updates.afterPhotoTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      updates.completionNotes = 'Completed full inspection, repair verified, and photographic proof logged.'
    }
    return this.updateRequest(requestId, updates)
  },

  confirmAndReleaseEscrow(requestId: string): { request: ServiceRequest; transaction: TransactionRecord } | undefined {
    const req = this.getRequest(requestId)
    if (!req) return undefined
    if (req.timelineStep !== 4 || req.escrowStatus !== 'escrow_locked') {
      return undefined
    }

    const fee = +(req.agreedPrice * 0.05).toFixed(2)
    const gst = +((req.agreedPrice + fee) * 0.18).toFixed(2)
    const total = +(req.agreedPrice + fee + gst).toFixed(2)
    const pRef = `HC360-${Date.now().toString().slice(-6)}`

    const updated = this.updateRequest(requestId, {
      status: 'completed',
      escrowStatus: 'released',
      feeAmount: fee,
      gstAmount: gst,
      totalPaid: total,
      paymentRef: pRef,
    })!

    // Add transaction to transactions ledger
    const transactions = this.getTransactions()
    const newTx: TransactionRecord = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      jobId: req.id,
      service: req.serviceName,
      citizen: req.citizenName,
      technician: req.assignedTechName || 'Ravi Verma',
      status: 'Paid',
      amount: req.agreedPrice,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      platformFee: fee,
      gst: gst,
      netPayout: req.agreedPrice - fee,
    }
    transactions.unshift(newTx)
    this.saveTransactions(transactions)

    // Increment technician's jobsCompleted and add netPayout to todayEarnings and careerEarnings
    const techs = this.getTechnicians()
    const techIdx = techs.findIndex(
      t =>
        (req.assignedTechId && t.id === req.assignedTechId) ||
        t.name === req.assignedTechName ||
        t.phone === req.assignedTechPhone
    )
    if (techIdx !== -1) {
      techs[techIdx].jobsCompleted = (techs[techIdx].jobsCompleted || 0) + 1
      techs[techIdx].todayEarnings = (techs[techIdx].todayEarnings || 0) + newTx.netPayout
      techs[techIdx].careerEarnings = (techs[techIdx].careerEarnings || 0) + newTx.netPayout
      this.saveTechnicians(techs)
      this.updateRequest(requestId, { assignedTechJobs: techs[techIdx].jobsCompleted })
    }

    return { request: updated, transaction: newTx }
  },

  submitReview(requestId: string, rating: number, reviewText: string): ServiceRequest | undefined {
    const req = this.getRequest(requestId)
    if (!req || req.escrowStatus !== 'released') {
      return undefined
    }

    const updated = this.updateRequest(requestId, {
      rating,
      reviewText,
    })

    const techs = this.getTechnicians()
    const techIdx = techs.findIndex(
      t =>
        (req.assignedTechId && t.id === req.assignedTechId) ||
        t.name === req.assignedTechName ||
        t.phone === req.assignedTechPhone
    )

    if (techIdx !== -1) {
      const tech = techs[techIdx]
      const count = tech.jobsCompleted || 1
      const prevRating = tech.rating ?? rating
      const newRating =
        count <= 1
          ? rating
          : Math.round(((prevRating * (count - 1) + rating) / count) * 10) / 10

      techs[techIdx].rating = newRating
      this.saveTechnicians(techs)

      if (updated) {
        updated.assignedTechRating = String(newRating)
        this.updateRequest(requestId, { assignedTechRating: String(newRating) })
      }
    }

    return updated
  },

  getTechnicians(): TechnicianRecord[] {
    return storage.get<TechnicianRecord[]>('technicians', INITIAL_TECHNICIANS)
  },

  saveTechnicians(techs: TechnicianRecord[]): void {
    storage.set('technicians', techs)
  },

  updateTechnicianVerification(id: string, status: 'verified' | 'rejected' | 'pending'): TechnicianRecord | undefined {
    const techs = this.getTechnicians()
    const idx = techs.findIndex(t => t.id === id)
    if (idx === -1) return undefined
    techs[idx].verificationStatus = status
    if (status === 'verified') {
      techs[idx].documents = techs[idx].documents.map(d => ({ ...d, status: 'verified' }))
    } else if (status === 'rejected') {
      techs[idx].documents = techs[idx].documents.map(d => ({ ...d, status: 'rejected' }))
    }
    this.saveTechnicians(techs)
    return techs[idx]
  },

  setTechnicianStatus(id: string, status: 'online' | 'offline' | 'busy'): TechnicianRecord | undefined {
    const techs = this.getTechnicians()
    const idx = techs.findIndex(t => t.id === id)
    if (idx === -1) return undefined
    techs[idx].status = status
    this.saveTechnicians(techs)
    return techs[idx]
  },

  getCitizens(): CitizenRecord[] {
    return storage.get<CitizenRecord[]>('citizens', INITIAL_CITIZENS)
  },

  saveCitizens(citizens: CitizenRecord[]): void {
    storage.set('citizens', citizens)
  },

  getSOSAlerts(): SOSAlert[] {
    return storage.get<SOSAlert[]>('sos_alerts', INITIAL_SOS)
  },

  saveSOSAlerts(alerts: SOSAlert[]): void {
    storage.set('sos_alerts', alerts)
  },

  resolveSOSAlert(id: string): SOSAlert | undefined {
    const alerts = this.getSOSAlerts()
    const idx = alerts.findIndex(a => a.id === id)
    if (idx === -1) return undefined
    alerts[idx].status = 'resolved'
    this.saveSOSAlerts(alerts)
    return alerts[idx]
  },

  createSOSAlert(jobId: string, citizenName: string, techName: string, location: string): SOSAlert {
    const alerts = this.getSOSAlerts()
    const newAlert: SOSAlert = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      jobId,
      citizenName,
      technicianName: techName,
      location,
      triggeredAt: new Date().toLocaleTimeString('en-GB'),
      status: 'active',
      severity: 'critical',
      notes: 'Emergency SOS beacon triggered directly from citizen dashboard.',
    }
    alerts.unshift(newAlert)
    this.saveSOSAlerts(alerts)
    return newAlert
  },

  getTransactions(): TransactionRecord[] {
    return storage.get<TransactionRecord[]>('transactions', INITIAL_TRANSACTIONS)
  },

  saveTransactions(txs: TransactionRecord[]): void {
    storage.set('transactions', txs)
  },

  // Feature 1: Chat and Counter Offer Persistence
  getChatMessages(requestId: string, workerId: string): ChatMessage[] {
    const key = `chat_${requestId}_${workerId}`
    return storage.get<ChatMessage[]>(key, [])
  },

  saveChatMessage(requestId: string, workerId: string, message: ChatMessage): ChatMessage[] {
    const key = `chat_${requestId}_${workerId}`
    const existing = this.getChatMessages(requestId, workerId)
    const updated = [...existing, message]
    storage.set(key, updated)
    return updated
  },

  getCounterOffer(
    requestId: string,
    workerId: string
  ): { amount: number; submitted: boolean; time?: string; count?: number; status?: 'accepted' | 'countered' | 'declined'; workerPrice?: number } | null {
    const key = `counter_${requestId}_${workerId}`
    return storage.get<{ amount: number; submitted: boolean; time?: string; count?: number; status?: 'accepted' | 'countered' | 'declined'; workerPrice?: number } | null>(key, null)
  },

  saveCounterOffer(
    requestId: string,
    workerId: string,
    state: { amount: number; submitted: boolean; time?: string; count?: number; status?: 'accepted' | 'countered' | 'declined'; workerPrice?: number }
  ): void {
    const key = `counter_${requestId}_${workerId}`
    storage.set(key, state)
  },

  // Feature 3: Evidence Photos Persistence
  saveEvidencePhoto(
    requestId: string,
    type: 'before' | 'after',
    photo: { url: string; name: string; time: string }
  ): ServiceRequest | undefined {
    const updates: Partial<ServiceRequest> =
      type === 'before'
        ? {
            beforePhotoUrl: photo.url,
            beforePhotoName: photo.name,
            beforePhotoTime: photo.time,
          }
        : {
            afterPhotoUrl: photo.url,
            afterPhotoName: photo.name,
            afterPhotoTime: photo.time,
          }
    return this.updateRequest(requestId, updates)
  },

  removeEvidencePhoto(requestId: string, type: 'before' | 'after'): ServiceRequest | undefined {
    const updates: Partial<ServiceRequest> =
      type === 'before'
        ? {
            beforePhotoUrl: undefined,
            beforePhotoName: undefined,
          }
        : {
            afterPhotoUrl: undefined,
            afterPhotoName: undefined,
          }
    return this.updateRequest(requestId, updates)
  },

  // Feature 4: Group Buying State Persistence
  generateGroupShareCode(jobId: string): string {
    let hash = 0
    for (let i = 0; i < jobId.length; i++) {
      hash = ((hash << 5) - hash + jobId.charCodeAt(i)) | 0
    }
    let code = ''
    let n = Math.abs(hash)
    for (let i = 0; i < 4; i++) {
      code += String.fromCharCode(65 + (n % 26))
      n = Math.floor(n / 26)
    }
    return `HC360-${code}`
  },

  getGroupBuyingState(
    jobId: string,
    basePrice?: number
  ): {
    shareCode: string
    neighbours: Array<{ flat: string; name: string; joined: boolean }>
    basePrice: number
  } {
    const resolvedBasePrice = basePrice ?? this.getRequest(jobId)?.agreedPrice ?? 650
    const expectedShareCode = this.generateGroupShareCode(jobId)
    const defaultState = {
      shareCode: expectedShareCode,
      neighbours: [
        { flat: 'Flat 302', name: 'Rahul Sharma', joined: true },
        { flat: 'Flat 105', name: 'Anita Shah', joined: false },
        { flat: 'Flat 408', name: 'Sanjay Kapoor', joined: false },
        { flat: 'Flat 201', name: 'Meera Desai', joined: false },
      ],
      basePrice: resolvedBasePrice,
    }
    const saved = storage.get<{
      shareCode: string
      neighbours: Array<{ flat: string; name: string; joined: boolean }>
      basePrice?: number
    } | null>(`group_${jobId}`, null)

    if (!saved) {
      storage.set(`group_${jobId}`, defaultState)
      return defaultState
    }

    let needsSave = false
    if (!saved.shareCode || saved.shareCode === 'HC360-7F92') {
      saved.shareCode = expectedShareCode
      needsSave = true
    }
    if (saved.basePrice === undefined) {
      saved.basePrice = resolvedBasePrice
      needsSave = true
    }
    if (needsSave) {
      storage.set(`group_${jobId}`, saved)
    }

    return saved as {
      shareCode: string
      neighbours: Array<{ flat: string; name: string; joined: boolean }>
      basePrice: number
    }
  },

  saveGroupBuyingState(
    jobId: string,
    state: { shareCode: string; neighbours: Array<{ flat: string; name: string; joined: boolean }>; basePrice?: number }
  ): void {
    storage.set(`group_${jobId}`, state)
  },

  // Feature 2: Tracking Progress Persistence
  getTrackingProgress(jobId: string): number {
    return storage.get<number>(`tracking_${jobId}`, 0)
  },

  saveTrackingProgress(jobId: string, progress: number): void {
    storage.set(`tracking_${jobId}`, progress)
  },

  resetTrackingProgress(jobId: string): void {
    storage.remove(`tracking_${jobId}`)
  },

  resetAllDemoData(): void {
    storage.clearAll()
    this.saveRequests(JSON.parse(JSON.stringify(INITIAL_REQUESTS)))
    this.saveOffers(JSON.parse(JSON.stringify(INITIAL_OFFERS)))
    this.saveTechnicians(JSON.parse(JSON.stringify(INITIAL_TECHNICIANS)))
    this.saveCitizens(JSON.parse(JSON.stringify(INITIAL_CITIZENS)))
    this.saveSOSAlerts(JSON.parse(JSON.stringify(INITIAL_SOS)))
    this.saveTransactions(JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)))
  },

  getPriceBand(serviceCode?: string): { low: number; high: number } {
    return getPriceBand(serviceCode)
  },

  getPriceVerdict(
    price: number,
    band: { low: number; high: number }
  ): { pct: number; label: string; tone: 'green' | 'blue' | 'amber'; deal: string } {
    return getPriceVerdict(price, band)
  },
}

export function getPriceBand(serviceCode?: string): { low: number; high: number } {
  const service = INITIAL_SERVICES.find(
    s => s.code === serviceCode || (serviceCode && s.name.toLowerCase() === serviceCode.toLowerCase())
  )
  const startingPrice = service?.startingPrice ?? 500
  return {
    low: Math.round(startingPrice * 0.8),
    high: Math.round(startingPrice * 2.2),
  }
}

export function getPriceVerdict(
  price: number,
  band: { low: number; high: number }
): { pct: number; label: string; tone: 'green' | 'blue' | 'amber'; deal: string } {
  const range = band.high - band.low
  const rawPct = range > 0 ? Math.round(((price - band.low) / range) * 100) : 50
  const pct = Math.max(0, Math.min(100, rawPct))

  let label = 'ABOVE AVERAGE'
  let tone: 'green' | 'blue' | 'amber' = 'amber'
  if (pct < 35) {
    label = 'GREAT DEAL'
    tone = 'green'
  } else if (pct < 70) {
    label = 'FAIR PRICE'
    tone = 'blue'
  }

  return { pct, label, tone, deal: label }
}

