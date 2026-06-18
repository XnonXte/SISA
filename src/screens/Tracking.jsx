import React from 'react';

export default function Tracking({ go, userData }) {
  const steps = [
    { label: 'Dikonfirmasi', icon: <i className="bi bi-check-lg" />, state: 'done' },
    { label: 'Dijemput', icon: <i className="bi bi-truck" />, state: 'active' },
    { label: 'Ditimbang', icon: <i className="bi bi-speedometer" />, state: 'pending' },
    { label: 'Poin Masuk', icon: <i className="bi bi-cash-coin" />, state: 'pending' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F7F9F7' }}>
      {/* Fake Status bar completely removed */}
      <div style={{ width: '100%', height: 56, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1DB954' }}>Pickup Dikonfirmasi <i className="bi bi-check-circle-fill" /></h2>
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        {/* Mitra illustration */}
        <div style={{ width: '100%', height: 200, marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div className="mitra-anim">
              <i className="bi bi-truck" style={{ fontSize: 64, color: '#1DB954' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: -30, display: 'flex', gap: 6 }}>
              <div className="dot-1" style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB954' }} />
              <div className="dot-2" style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB954' }} />
              <div className="dot-3" style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB954' }} />
            </div>
            <div className="ping-anim" style={{ position: 'absolute', top: 10, right: -5, width: 32, height: 32, borderRadius: '50%', background: '#1DB954', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-geo-alt-fill" style={{ color: '#fff', fontSize: 14 }} />
            </div>
          </div>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', textAlign: 'center', marginTop: 24, lineHeight: 1.3 }}>
          Mitra pengepul sedang<br />menuju lokasi
        </div>
        <div style={{ fontSize: 14, color: '#9E9E9E', textAlign: 'center', marginTop: 8 }}>
          Estimasi tiba: 15–20 menit
        </div>

        {/* Progress Tracker Horizontal */}
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginTop: 40, padding: '0 8px' }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 64 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: step.state === 'done' ? '#1DB954' : step.state === 'active' ? '#FFF8E1' : '#F5F5F5',
                  border: step.state === 'active' ? '1px solid #F5A623' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                  color: step.state === 'done' ? '#fff' : '#9E9E9E',
                }}>
                  {step.icon}
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
      </div>

      <div style={{ padding: 20, background: '#fff', borderTop: '1px solid #E0E0E0' }}>
        <button className="btn-primary" onClick={() => go('dashboard')}>Selesai</button>
      </div>
    </div>
  );
}