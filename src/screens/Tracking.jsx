import React from 'react';

export default function Tracking({ go, userData }) {
  const steps = [
    { label: 'Dikonfirmasi', icon: '✓', state: 'done' },
    { label: 'Dijemput', icon: '🛵', state: 'active' },
    { label: 'Ditimbang', icon: '⚖️', state: 'pending' },
    { label: 'Poin Masuk', icon: '💰', state: 'pending' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#F7F9F7' }}>
      <div className="status-bar" style={{ background: '#fff' }}><span>9:41</span><span>●●●</span></div>
      <div style={{ width: '100%', height: 56, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1DB954' }}>Pickup Dikonfirmasi ✓</h2>
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        {/* Mitra illustration */}
        <div style={{ width: '100%', height: 200, marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div className="mitra-anim" style={{ fontSize: 72 }}>🛵</div>
            <div style={{ position: 'absolute', bottom: 20, left: -30, display: 'flex', gap: 6 }}>
              <div className="dot-1" style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB954' }} />
              <div className="dot-2" style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB954' }} />
              <div className="dot-3" style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB954' }} />
            </div>
            <div className="ping-anim" style={{ position: 'absolute', top: 10, right: -5, width: 24, height: 24, borderRadius: '50%', background: '#1DB954', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📍</div>
          </div>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', textAlign: 'center', marginTop: 24, lineHeight: 1.3 }}>
          Mitra pengepul sedang<br />menuju lokasi
        </div>
        <div style={{ fontSize: 14, color: '#9E9E9E', textAlign: 'center', marginTop: 8 }}>
          Estimasi tiba: 15–20 menit
        </div>

        {/* Poin pending badge */}
        <div style={{ background: '#FFF8E1', borderRadius: 20, padding: '8px 20px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>⏳</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F5A623' }}>+{userData.pickupPoints} Poin akan masuk setelah selesai</span>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 24 }}>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step.state === 'done' ? '#1DB954' : step.state === 'active' ? '#FFF8E1' : '#EEE',
                  border: step.state === 'active' ? '2px solid #F5A623' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: step.state === 'done' ? 14 : 12,
                  color: step.state === 'done' ? '#fff' : '#9E9E9E',
                }}>
                  {step.state === 'done' ? '✓' : step.icon}
                </div>
                <div style={{ fontSize: 10, color: '#9E9E9E', textAlign: 'center' }}>{step.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i === 0 ? '#1DB954' : '#E0E0E0', marginBottom: 20 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Info box */}
        <div style={{ width: '100%', background: '#E8F5E9', borderRadius: 12, padding: '12px 14px', marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <i className="bi bi-lightbulb-fill" style={{ color: '#1DB954', fontSize: 18, flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: '#2E7D32', lineHeight: 1.5 }}>
            Siapkan sampah di depan pintu. Mitra akan langsung mengambil tanpa perlu masuk ke dalam rumah.
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: '#1DB954', textAlign: 'center', marginTop: 20, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('riwayat')}>
          Lihat Riwayat
        </div>
      </div>

      <div className="home-indicator" />
    </div>
  );
}
