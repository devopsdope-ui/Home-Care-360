import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/common/StatCard'
import { Badge } from '../../components/common/Badge'

export function Earnings() {
  const { transactions, requests } = useApp()
  const [selectedMonth] = useState('October 2026')

  const chartData = [
    { label: 'Oct 01-03', val: 35, amt: '₹14,200' },
    { label: 'Oct 04-06', val: 52, amt: '₹22,100' },
    { label: 'Oct 07-09', val: 44, amt: '₹18,500' },
    { label: 'Oct 10-12', val: 68, amt: '₹28,900' },
    { label: 'Oct 13-15', val: 60, amt: '₹25,400' },
    { label: 'Oct 16-18', val: 80, amt: '₹34,000' },
    { label: 'Oct 19-21', val: 72, amt: '₹30,600' },
    { label: 'Oct 22-24', val: 91, amt: '₹38,700' },
    { label: 'Oct 25-27', val: 68, amt: '₹28,900' },
    { label: 'Oct 28-30', val: 76, amt: '₹32,300' },
    { label: 'Oct 31', val: 88, amt: '₹37,400' },
    { label: 'Projected', val: 95, amt: '₹62,400' },
  ]

  const activeCount = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length

  return (
    <div className="page">
      <div>
        <p className="eyebrow">FINANCIAL OVERVIEW</p>
        <h1>Earnings & Payouts</h1>
        <p className="subhead">Transparent payouts from completed and escrow-cleared work.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="CAREER EARNINGS" value="₹2,84,500" note="Verified municipal payout" icon="wallet" />
        <StatCard label="TODAY" value="₹4,250" note="+18% vs last week" icon="trend" />
        <StatCard label="THIS MONTH" value="₹62,400" note="98.4% on-time" icon="document" />
        <StatCard label="ACTIVE JOBS" value={activeCount.toString()} note="In escrow" icon="briefcase" />
      </div>

      <div className="chart-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">{selectedMonth.toUpperCase()}</p>
            <h2>Bi-weekly payout velocity</h2>
          </div>
          <b>₹62,400</b>
        </div>
        <div className="chart">
          {chartData.map((d, i) => (
            <i
              key={i}
              style={{ height: `${d.val}%` }}
              title={`${d.label}: ${d.amt}`}
            />
          ))}
        </div>
      </div>

      <section className="table-card">
        <div className="section-title">
          <h2>Recent technician settlements</h2>
          <span className="muted">Direct deposit to bank account ending in **4821</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Service</th>
              <th>Citizen</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Net Payout</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(r => (
              <tr key={r.id}>
                <td>
                  <b>{r.jobId}</b>
                  <span style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>{r.date}</span>
                </td>
                <td>{r.service}</td>
                <td>{r.citizen}</td>
                <td>
                  <Badge tone={r.status === 'Paid' ? 'green' : 'amber'}>{r.status}</Badge>
                </td>
                <td>₹{r.amount}</td>
                <td>
                  <b>₹{r.netPayout}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
