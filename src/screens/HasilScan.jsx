import React from 'react';

export default function HasilScan({ go, userData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA' }}>
      {/* Fake Status bar completely removed */}
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('kamera')}><i className="bi bi-arrow-left" /></button>
        <h2>Validasi AI</h2>
      </div>

      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16, overflowY: 'auto' }}>
        {/* Photo preview */}
        <div style={{
          width: '100%', height: 220,
          borderRadius: '0px 24px 0px 24px',
          background: 'linear-gradient(rgba(10,10,10,0.2), rgba(10,10,10,0.6)), url("https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600") center/cover',
          position: 'relative', overflow: 'hidden', border: '1px solid #E0E0E0', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#1A1A1A', color: '#F5A623', fontSize: 11, fontWeight: 800, letterSpacing: 0.5, padding: '6px 12px', borderRadius: '0px 8px 0px 8px' }}>
            AKURASI 94%
          </div>
        </div>

        {/* Detected badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, background: '#E8F5E9', padding: '8px 16px', borderRadius: 20 }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#1DB954', fontSize: 16 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2E7D32' }}>VALIDASI BERHASIL</span>
        </div>

        <div style={{ fontSize: 48, fontWeight: 800, color: '#F5A623', marginTop: 16, letterSpacing: -1 }}>
          +{userData.pickupPoints || 150} POIN
        </div>
        <div style={{ fontSize: 13, color: '#9E9E9E', marginTop: 4 }}>
          ≈ Rp {((userData.pickupPoints || 150) * 10).toLocaleString('id-ID')}
        </div>

        {/* Detail card */}
        <div style={{ width: '100%', borderTop: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0', padding: '16px 0', marginTop: 32 }}>
          {[
            ['Material Dasar', 'Plastik PET (Bening)'],
            ['Grade Mutu', 'Grade A — Bebas Kontaminasi'],
            ['Instruksi', 'Siapkan botol di depan pintu saat pickup.'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ fontSize: 13, color: '#707070', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', textAlign: 'right', maxWidth: '60%' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 24, background: '#fff', borderTop: '1px solid #E0E0E0' }}>
        <button className="btn-primary" onClick={() => go('formPickup')}>Jadwalkan Pickup</button>
      </div>
    </div>
  );
}