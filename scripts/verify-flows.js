// Automated End-to-End Verification Script for HomeCare 360 Core Prototype Flows
import assert from 'node:assert'

// Simulated localStorage in Node environment
const storageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = val.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] || null,
  }
})()

globalThis.localStorage = storageMock

async function runTests() {
  console.log('🧪 Starting HomeCare 360 End-to-End Test Suite...\n')

  // Dynamically import the compiled or source data store
  const { dataStore } = await import('../src/services/dataStore.ts')

  // TEST 1: Initial Seeds
  console.log('Test 1: Verify Initial Demo Records')
  const requests = dataStore.getRequests()
  assert.strictEqual(requests.length >= 4, true, 'Initial requests should have at least 4 seeded records')
  assert.strictEqual(requests[0].id, 'HC-301', 'HC-301 must exist as primary demo job')
  assert.strictEqual(requests[0].assignedTechName, 'Ravi Verma', 'HC-301 assigned to Ravi Verma')
  console.log('  ✓ Initial seeded requests verified (HC-301, Ravi Verma, etc.)')

  // TEST 2: Flow 1 - Citizen Requests a Service
  console.log('\nTest 2: Flow 1 — Citizen requests a service')
  const newReq = dataStore.createRequest({
    serviceCode: 'SRV-02',
    serviceName: 'Electrical',
    description: 'Circuit breaker trips when refrigerator starts.',
    address: 'Flat 402, Sea Green Apartments, Bandra West',
    priority: 'urgent',
    citizenName: 'Rahul Sharma',
    citizenPhone: '+91 98201 55432',
    agreedPrice: 449,
    bookingSource: 'citizen_web'
  })
  assert.ok(newReq.id.startsWith('HC-'), 'New request must have unique HC- prefix ID')
  assert.strictEqual(newReq.status, 'pending', 'New request initial status must be pending')
  assert.strictEqual(newReq.priority, 'urgent', 'Priority must match urgent')

  const matchingOffers = dataStore.getOffers(newReq.id)
  assert.strictEqual(matchingOffers.length >= 2, true, 'At least 2 nearby technician quotes generated')
  console.log(`  ✓ Flow 1 verified: Created request ${newReq.id} with status 'pending' and ${matchingOffers.length} technician offers.`)

  // TEST 3: Flow 2 - Technician Processes a Request
  console.log('\nTest 3: Flow 2 — Technician processes request and binds price lock')
  const selectedOffer = matchingOffers[0]
  const lockedReq = dataStore.acceptOffer(newReq.id, selectedOffer)
  assert.strictEqual(lockedReq.status, 'price_locked', 'Status must be price_locked after offer acceptance')
  assert.strictEqual(lockedReq.escrowStatus, 'escrow_locked', 'Escrow status must be escrow_locked')
  assert.strictEqual(lockedReq.assignedTechName, selectedOffer.name, 'Technician must be assigned')

  // Technician Dispatches and advances job through valid steps
  const dispatched = dataStore.dispatchJob(newReq.id)
  assert.strictEqual(dispatched.status, 'on_the_way', 'Status should be on_the_way')
  assert.strictEqual(dispatched.timelineStep, 1, 'Timeline step should be 1')

  const arrived = dataStore.advanceJobStep(newReq.id, 2)
  assert.strictEqual(arrived.status, 'arrived', 'Status should be arrived')
  assert.strictEqual(arrived.timelineStep, 2, 'Timeline step should be 2')

  const inProgress = dataStore.advanceJobStep(newReq.id, 3)
  assert.strictEqual(inProgress.status, 'in_progress', 'Status should be in_progress')
  assert.strictEqual(inProgress.timelineStep, 3, 'Timeline step should be 3')

  const completedJob = dataStore.advanceJobStep(newReq.id, 4)
  assert.strictEqual(completedJob.status, 'completed', 'Status should be completed')
  assert.strictEqual(completedJob.timelineStep, 4, 'Timeline step should be 4')
  assert.ok(completedJob.afterPhotoTime, 'Completion timestamp should be logged')
  console.log(`  ✓ Flow 2 verified: Job ${newReq.id} successfully processed through on_the_way -> arrived -> in_progress -> completed.`)

  // TEST 4: Flow 3 - Job Completion & Escrow Release
  console.log('\nTest 4: Flow 3 — Job completion, escrow release & tax receipt generation')
  const completionResult = dataStore.confirmAndReleaseEscrow(newReq.id)
  assert.ok(completionResult, 'Completion result must be returned')
  assert.strictEqual(completionResult.request.escrowStatus, 'released', 'Escrow status must be released')
  assert.ok(completionResult.request.totalPaid > completionResult.request.agreedPrice, 'Total paid must include fees and GST')
  assert.strictEqual(completionResult.transaction.status, 'Paid', 'Transaction status must be Paid')
  assert.strictEqual(completionResult.transaction.jobId, newReq.id, 'Transaction must reference the job ID')
  console.log(`  ✓ Flow 3 verified: Escrow released, receipt ${completionResult.request.paymentRef} generated, total ₹${completionResult.request.totalPaid}.`)

  // TEST 5: Flow 4 - Administrator Operations & Verification
  console.log('\nTest 4: Flow 4 — Administrator verification & SOS incident resolution')
  const techId = 'TECH-04' // Suresh Patil (pending)
  const approvedTech = dataStore.updateTechnicianVerification(techId, 'verified')
  assert.strictEqual(approvedTech.verificationStatus, 'verified', 'Technician must be verified')
  assert.strictEqual(approvedTech.documents.every(d => d.status === 'verified'), true, 'All documents must be verified')

  const rejectedTech = dataStore.updateTechnicianVerification(techId, 'rejected')
  assert.strictEqual(rejectedTech.verificationStatus, 'rejected', 'Technician must be rejected')

  // SOS alert handling
  const newSOS = dataStore.createSOSAlert('HC-301', 'Rahul Sharma', 'Ravi Verma', 'Andheri West')
  assert.strictEqual(newSOS.status, 'active', 'SOS alert must be active upon creation')

  const resolvedSOS = dataStore.resolveSOSAlert(newSOS.id)
  assert.strictEqual(resolvedSOS.status, 'resolved', 'SOS alert must be resolved by administrator')
  console.log('  ✓ Flow 4 verified: Administrator verification approval/rejection and SOS incident resolution confirmed.')

  // TEST 6: Flow 5 - Senior Citizen Dedicated Call-to-Book
  console.log('\nTest 6: Flow 5 — Senior Citizen Call-to-Book assisted booking')
  const seniorReq = dataStore.createRequest({
    serviceCode: 'SRV-01',
    serviceName: 'Plumbing',
    description: 'Assisted voice request: Leaking pipe under bathroom sink.',
    address: 'Flat 302, Silver Oak Residency, Andheri West',
    priority: 'standard',
    citizenName: 'Rahul Sharma',
    citizenPhone: '+91 98201 55432',
    bookingSource: 'senior_call_to_book',
    agreedPrice: 399
  })
  assert.strictEqual(seniorReq.bookingSource, 'senior_call_to_book', 'Booking source must record senior_call_to_book')
  assert.strictEqual(seniorReq.status, 'pending', 'Senior booking must start in pending status')
  console.log(`  ✓ Flow 5 verified: Senior Call-to-Book created booking ${seniorReq.id} with source 'senior_call_to_book'.`)

  // TEST 7: Flow 6 - Counter Offer & Worker Chat Separation
  console.log('\nTest 7: Flow 6 — Counter offer submission & clean chat persistence')
  const jobId = 'HC-301'
  const worker1 = 'TECH-01'
  const worker2 = 'TECH-02'

  // Initially empty chat
  const initialChat = dataStore.getChatMessages(jobId, worker1)
  assert.strictEqual(initialChat.length, 0, 'Chat should start with 0 preview messages')

  // Save counter offer
  dataStore.saveCounterOffer(jobId, worker1, { amount: 520, submitted: true, time: '14:20' })
  const savedCounter = dataStore.getCounterOffer(jobId, worker1)
  assert.strictEqual(savedCounter?.amount, 520, 'Counter offer amount should be 520')
  assert.strictEqual(savedCounter?.submitted, true, 'Counter offer should be marked submitted')

  // Send message
  dataStore.saveChatMessage(jobId, worker1, {
    id: 'm1',
    sender: 'citizen',
    text: 'Can you arrive with extra 1/2-inch copper fittings?',
    time: '14:22'
  })
  const updatedChat1 = dataStore.getChatMessages(jobId, worker1)
  assert.strictEqual(updatedChat1.length, 1, 'Worker 1 chat should have 1 message')
  assert.strictEqual(updatedChat1[0].text, 'Can you arrive with extra 1/2-inch copper fittings?')

  // Ensure worker 2 chat remains isolated and clean
  const updatedChat2 = dataStore.getChatMessages(jobId, worker2)
  assert.strictEqual(updatedChat2.length, 0, 'Worker 2 chat should remain completely isolated and empty')
  console.log('  ✓ Flow 6 verified: Counter offer saved and worker chats strictly separated.')

  // TEST 8: Flow 7 - Evidence Vault Before & After Photo Persistence
  console.log('\nTest 8: Flow 7 — Evidence Vault Before & After photo uploads')
  const dummyBefore = 'data:image/jpeg;base64,dummyBeforeData'
  const dummyAfter = 'data:image/jpeg;base64,dummyAfterData'

  dataStore.saveEvidencePhoto(jobId, 'before', {
    url: dummyBefore,
    name: 'pipe_leak_before.jpg',
    time: '14:35'
  })
  let jobWithEvidence = dataStore.getRequest(jobId)
  assert.strictEqual(jobWithEvidence?.beforePhotoUrl, dummyBefore, 'Before photo URL must be persisted')
  assert.strictEqual(jobWithEvidence?.beforePhotoName, 'pipe_leak_before.jpg', 'Before photo name must match')

  dataStore.saveEvidencePhoto(jobId, 'after', {
    url: dummyAfter,
    name: 'pipe_leak_after.jpg',
    time: '15:10'
  })
  jobWithEvidence = dataStore.getRequest(jobId)
  assert.strictEqual(jobWithEvidence?.afterPhotoUrl, dummyAfter, 'After photo URL must be persisted')
  assert.strictEqual(jobWithEvidence?.afterPhotoName, 'pipe_leak_after.jpg', 'After photo name must match')

  // Remove photo check
  dataStore.removeEvidencePhoto(jobId, 'before')
  jobWithEvidence = dataStore.getRequest(jobId)
  assert.strictEqual(jobWithEvidence?.beforePhotoUrl, undefined, 'Before photo should be removed')
  assert.strictEqual(jobWithEvidence?.afterPhotoUrl, dummyAfter, 'After photo should remain intact')
  console.log('  ✓ Flow 7 verified: Before & After evidence photos successfully uploaded, stored, and updated.')

  // TEST 9: Flow 8 - Group Buying Top Code Placement & State Persistence
  console.log('\nTest 9: Flow 8 — Group Buying share code & neighbour join state')
  const groupState = dataStore.getGroupBuyingState(jobId)
  assert.strictEqual(groupState.shareCode, 'HC360-7F92', 'Share code should be HC360-7F92')
  assert.strictEqual(groupState.neighbours.length, 4, 'Should have 4 neighbour entries')
  const initialJoined = groupState.neighbours.filter(n => n.joined).length
  assert.strictEqual(initialJoined, 2, 'Initially 2 homes joined')

  // Simulate neighbour joining with code
  const newNeighbours = groupState.neighbours.map(n => n.flat === 'Flat 408' ? { ...n, joined: true } : n)
  dataStore.saveGroupBuyingState(jobId, { shareCode: groupState.shareCode, neighbours: newNeighbours })
  const updatedGroup = dataStore.getGroupBuyingState(jobId)
  assert.strictEqual(updatedGroup.neighbours.filter(n => n.joined).length, 3, 'Now 3 homes joined')
  console.log('  ✓ Flow 8 verified: Group buying share code and dynamic neighbour tier join state confirmed.')

  // TEST 10: Flow 9 - Worker Route Tracking Progress & Arrival Persistence
  console.log('\nTest 10: Flow 9 — Worker route tracking progress persistence & arrival')
  dataStore.saveTrackingProgress(jobId, 0.45)
  const savedProgress = dataStore.getTrackingProgress(jobId)
  assert.strictEqual(savedProgress, 0.45, 'Tracking progress should be 0.45 (45%)')

  // Reaching destination
  dataStore.saveTrackingProgress(jobId, 1.0)
  assert.strictEqual(dataStore.getTrackingProgress(jobId), 1.0, 'Tracking progress should reach 1.0 (100%)')
  dataStore.resetTrackingProgress(jobId)
  assert.strictEqual(dataStore.getTrackingProgress(jobId), 0, 'Tracking progress should reset to 0')
  console.log('  ✓ Flow 9 verified: Worker route tracking progress persistence and reset verified.')

  // TEST 11: Reset Demo Data
  console.log('\nTest 11: Reset Demo Data functionality')
  dataStore.resetAllDemoData()
  const resetRequests = dataStore.getRequests()
  assert.strictEqual(resetRequests.length, 4, 'Requests count should return to 4 baseline records')
  assert.strictEqual(resetRequests[0].id, 'HC-301', 'First record should be HC-301')
  console.log('  ✓ Test 11 verified: Reset demo data successfully restores factory seeds.')

  console.log('\n🎉 ALL 11 TEST SUITES PASSED! PROTOTYPE LOGIC VERIFIED END-TO-END.')
}

runTests().catch(err => {
  console.error('\n❌ Test failure:', err)
  process.exit(1)
})
