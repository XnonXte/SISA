import React from 'react';

export default function Splash({ go }) {
  return (
    <div className="splash-bg" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100vh', padding: '0 20px' }}>
      {/* Fake Status bar completely removed */}

      {/* Hero illustration */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative', zIndex: 1 }}>
        {/* Animated icon group */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: '0px 16px 0px 16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-trash3-fill" style={{ fontSize: 32, color: '#fff' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 32, height: 2, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
            <div style={{ width: 24, height: 2, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
            <div style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
          </div>
          <div style={{ width: 72, height: 72, borderRadius: '0px 16px 0px 16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-cash-coin" style={{ fontSize: 32, color: '#fff' }} />
          </div>
        </div>

        {/* Logo & taglines */}
        <div style={{ letterSpacing: 6, fontSize: 40, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>SISA</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>Ubah Sampah Jadi Berkah</div>

        {/* Stats grid */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)', marginTop: 40, borderRadius: '0px 16px 0px 16px', overflow: 'hidden' }}>
          {[['1.7 Jt', 'Ton/Tahun'], ['80%+', 'Pilih Pickup'], ['94%', 'Akurasi AI']].map(([val, label], i) => (
            <div key={i} style={{ padding: '14px 20px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA area */}
      <div style={{ width: '100%', paddingBottom: 40, position: 'relative', zIndex: 1 }}>
        <button
          className="btn-primary"
          style={{ background: '#fff', color: '#1DB954', fontWeight: 800, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          onClick={() => go('register')}
        >
          Mulai Sekarang
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: 0.3 }}>
          DILINDUNGI ENKRIPSI END-TO-END
        </div>
      </div>
    </div>
  );
}