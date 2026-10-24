import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export function AdminTransactions() {
  const { transactions } = useApp()
  const [downloadMsg, setDownloadMsg] = useState(false)

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.reduce((sum, t) => sum + t.platformFee, 0)
  const totalGst = transactions.reduce((sum, t) => sum + t.gst, 0)

  const handleExport = () => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 2500)
  }

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">ESCROW & CLEARING HOUSE</p>
          <h1>Financial Audit Ledger</h1>
          <p className="subhead">
            Immutable log of service fees, statutory GST remittances, and verified technician disbursements.
          </p>
        </div>
        <Button kind="secondary" icon="download" onClick={handleExport}>
          {downloadMsg ? 'Exporting Audit CSV...' : 'Export Audit CSV'}
        </Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="wallet" />
          </div>
          <span>GROSS CLEARED VOLUME</span>
          <strong>₹{totalVolume.toLocaleString('en-IN')}</strong>
          <small>Escrow cleared</small>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="trend" />
          </div>
          <span>INFRASTRUCTURE FEES (5%)</span>
          <strong>₹{totalFees.toFixed(0)}</strong>
          <small>Municipal platform fund</small>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="document" />
          </div>
          <span>TOTAL STATUTORY GST (18%)</span>
          <strong>₹{totalGst.toFixed(0)}</strong>
          <small>Remitted to GSTN</small>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="shield" />
          </div>
          <span>SETTLEMENT RATIO</span>
          <strong>100%</strong>
          <small>Zero dispute defaults</small>
        </div>
      </div>

      <section className="table-card">
        <div className="section-title">
          <h2>All Municipal Service Transactions</h2>
          <span className="muted">{transactions.length} verified ledger records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tx Reference</th>
              <th>Linked Job</th>
              <th>Service Category</th>
              <th>Citizen (Payer)</th>
              <th>Technician (Beneficiary)</th>
              <th>Gross Amount</th>
              <th>Platform Fee (5%)</th>
              <th>GST (18%)</th>
              <th>Net Payout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>
                  <b>{t.id}</b>
                  <span style={{ display: 'block', fontSize: '8px', color: 'var(--muted)' }}>{t.date}</span>
                </td>
                <td>
                  <b>{t.jobId}</b>
                </td>
                <td>{t.service}</td>
                <td>{t.citizen}</td>
                <td>{t.technician}</td>
                <td>₹{t.amount.toFixed(2)}</td>
                <td>₹{t.platformFee.toFixed(2)}</td>
                <td>₹{t.gst.toFixed(2)}</td>
                <td>
                  <b>₹{t.netPayout.toFixed(2)}</b>
                </td>
                <td>
                  <Badge tone={t.status === 'Paid' ? 'green' : 'amber'}>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
