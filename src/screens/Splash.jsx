import React from 'react';

export default function Splash({ go }) {
  return (
    <div className="splash-bg" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100vh', padding: '0 20px', background: '#FFFFFF' }}>
      {/* Fake Status bar completely removed */}

      {/* Hero illustration */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
        {/* Logo & taglines */}
        <img src="/logo-mark-sisa.svg" alt="SISA" style={{ width: 96, height: 96, objectFit: 'contain' }} />
        <img src="/logo-text-sisa.svg" alt="SISA" style={{ width: 160, height: 'auto', objectFit: 'contain', marginTop: 4 }} />
        <div style={{ fontSize: 16, fontWeight: 500, color: 'rgba(26,26,26,0.7)', marginTop: 8, textAlign: 'center' }}>Infrastruktur Validasi Mutu Rantai Pasok.</div>
      </div>

      {/* CTA area */}
      <div style={{ width: '100%', paddingBottom: 40, position: 'relative', zIndex: 1 }}>
        <button
          className="btn-primary"
          style={{ width: '100%', background: '#1DB954', color: '#fff', fontWeight: 800, border: 'none', borderRadius: '0px 24px 0px 24px', boxShadow: '0 4px 20px rgba(29,185,84,0.25)', textTransform: 'uppercase', letterSpacing: 0.5 }}
          onClick={() => go('register')}
        >
          Mulai Sekarang
        </button>
        <button
          className="btn-secondary"
          style={{ width: '100%', background: '#fff', color: '#1A1A1A', fontWeight: 800, border: '2px solid #E0E0E0', borderRadius: '0px 24px 0px 24px', marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}
          onClick={() => go('escrow')}
        >
          Pelajari Sistem Escrow
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(26,26,26,0.5)', fontWeight: 500, letterSpacing: 0.3 }}>
          Platform agregator berbekal teknologi Computer Vision. Kami memfasilitasi konversi material kardus dan PET bening menjadi aset likuid secara presisi, tanpa perantara fisik.
        </div>
      </div>
    </div>
  );
}