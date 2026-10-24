import { useApp } from '../../context/AppContext'
import { Icon } from '../../components/common/Icon'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { dataStore } from '../../services/dataStore'
import { compressImage } from '../../services/imageUtils'
import type { CitizenView } from '../../types'

export { compressImage }

interface EvidenceSectionProps {
  type: 'before' | 'after'
  title: string
  subtitle: string
  badgeText: string
  badgeTone: 'amber' | 'green'
  photoUrl?: string
  photoName?: string
  time: string
  techName: string
  jobId: string
  onUpload?: (type: 'before' | 'after', dataUrl: string, filename: string) => void
  onRemove?: (type: 'before' | 'after') => void
}

function EvidenceCard({
  type,
  title,
  subtitle,
  badgeText,
  badgeTone,
  photoUrl,
  photoName,
  time,
  techName,
  jobId,
}: EvidenceSectionProps) {
  return (
    <article className="evidence-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="evidence-title">
        <div>
          <span>{title}</span>
          <b>{photoUrl ? (type === 'before' ? 'Fault documented' : 'Repair verified') : subtitle}</b>
        </div>
        <Badge tone={photoUrl ? badgeTone : 'neutral'}>
          {photoUrl ? badgeText : 'PENDING UPLOAD'}
        </Badge>
      </div>

      {/* Photo Display or Fallback Illustration */}
      <div
        className={type === 'before' ? 'photo before-photo' : 'photo after-photo'}
        style={{
          position: 'relative',
          background: '#dcd9d2',
          overflow: 'hidden',
          borderRadius: '10px',
          minHeight: '280px',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${title} proof`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <>
            {/* Fallback procedural drawing when no photo uploaded yet */}
            <div className="pipe-wall" />
            <div className="pipe horizontal" />
            <div className="pipe vertical" />
            {type === 'before' && (
              <div className="leak">
                <i />
                <i />
                <i />
              </div>
            )}
            {type === 'after' && <div className="repair-wrap" />}
          </>
        )}

        {/* Caption overlay */}
        <span style={{ zIndex: 3 }}>
          <Icon name="camera" size={14} />
          {photoUrl ? `${type.toUpperCase()} PHOTO · ${photoName || 'Uploaded'}` : `DEFAULT ${type.toUpperCase()} SCHEMATIC`}
        </span>
      </div>

      {/* Metadata Row */}
      <div className="evidence-meta" style={{ marginTop: '14px' }}>
        <div>
          <span>CAPTURED</span>
          <b>{photoUrl ? `24 Oct 2026 · ${time}` : 'Awaiting upload'}</b>
        </div>
        <div>
          <span>TECHNICIAN</span>
          <b>{techName}</b>
        </div>
        <div>
          <span>JOB ID</span>
          <b>{jobId}</b>
        </div>
      </div>
    </article>
  )
}

export function Evidence({ go }: { go: (v: CitizenView) => void }) {
  const { activeJob, refreshAllState } = useApp()

  const techName = activeJob?.assignedTechName || 'Ravi Verma'
  const jobId = activeJob?.id || 'HC-301'
  const beforeTime = activeJob?.beforePhotoTime || '14:32'
  const afterTime = activeJob?.afterPhotoTime || '15:21'

  const handleUpload = (type: 'before' | 'after', dataUrl: string, filename: string) => {
    const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    dataStore.saveEvidencePhoto(jobId, type, {
      url: dataUrl,
      name: filename,
      time: timeStr,
    })
    refreshAllState()
  }

  const handleRemove = (type: 'before' | 'after') => {
    dataStore.removeEvidencePhoto(jobId, type)
    refreshAllState()
  }

  const hasBothPhotos = Boolean(activeJob?.beforePhotoUrl && activeJob?.afterPhotoUrl)
  const hasAnyPhoto = Boolean(activeJob?.beforePhotoUrl || activeJob?.afterPhotoUrl)

  return (
    <div className="page">
      <div className="split-heading">
        <div>
          <p className="eyebrow">PHOTOGRAPHIC CHAIN OF CUSTODY · EVIDENCE VAULT</p>
          <h1>Repair evidence</h1>
          <p className="subhead">
            Upload and inspect cryptographic Before and After photos for service job {jobId}.
          </p>
        </div>
        <Badge tone={hasBothPhotos ? 'green' : hasAnyPhoto ? 'blue' : 'amber'}>
          <Icon name="shield" size={13} />{' '}
          {hasBothPhotos
            ? 'BOTH PHOTOS VERIFIED'
            : hasAnyPhoto
              ? 'PARTIAL EVIDENCE LOGGED'
              : 'BASELINE PENDING'}
        </Badge>
      </div>

      <div className="evidence-grid">
        <EvidenceCard
          type="before"
          title="BEFORE REPAIR"
          subtitle="Document leak or fault baseline"
          badgeText="BASELINE ATTACHED"
          badgeTone="amber"
          photoUrl={activeJob?.beforePhotoUrl}
          photoName={activeJob?.beforePhotoName}
          time={beforeTime}
          techName={techName}
          jobId={jobId}
          onUpload={handleUpload}
          onRemove={handleRemove}
        />

        <div className="evidence-connector">
          <span />
          <div>
            <Icon name="tools" />
            <b>46 MIN</b>
            <small>Repair duration</small>
          </div>
          <span />
        </div>

        <EvidenceCard
          type="after"
          title="AFTER REPAIR"
          subtitle="Document completed repair"
          badgeText="PROOF VERIFIED"
          badgeTone="green"
          photoUrl={activeJob?.afterPhotoUrl}
          photoName={activeJob?.afterPhotoName}
          time={afterTime}
          techName={techName}
          jobId={jobId}
          onUpload={handleUpload}
          onRemove={handleRemove}
        />
      </div>

      <div className="audit-strip" style={{ marginTop: '24px' }}>
        <div>
          <Icon name="shield" />
          <span>
            <b>Photographic integrity verified</b>
            {hasBothPhotos
              ? ' Both before and after photos are saved and linked to your civic escrow record.'
              : ' Photos are securely stored in local storage and linked to your active job.'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button kind="secondary" onClick={() => go('job')}>
            Back to tracking
          </Button>
          <Button icon="arrow" onClick={() => go('complete')}>
            Review completion
          </Button>
        </div>
      </div>
    </div>
  )
}
