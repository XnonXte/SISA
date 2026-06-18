import React from 'react';
import BottomNav from '../components/BottomNav';

const methods = [
  { id: 'gopay', label: 'GoPay', icon: 'bi-wallet2', color: '#00AED6' },
  { id: 'ovo', label: 'OVO', icon: 'bi-qr-code-scan', color: '#4C3494' },
  { id: 'dana', label: 'Dana', icon: 'bi-credit-card-2-front-fill', color: '#118EEA' },
  { id: 'pln', label: 'Token Listrik', icon: 'bi-lightning-charge-fill', color: '#F5A623' },
];

export default function TukarPoin({ go, userData }) {
  const points = userData?.points || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      {/* Fake Status bar completely removed */}

      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Tukar Poin</h2>
      </div>

      <div className="scroll-content" style={{ flex: 1, padding: '24px 24px 100px', overflowY: 'auto' }}>
        {/* Saldo card */}
        <div className="poin-card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#707070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Saldo Tersedia</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', marginTop: 4, letterSpacing: -0.5 }}>{points} PT</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9E9E9E', marginTop: 4 }}>ESTIMASI NILAI: IDR {(points * 10).toLocaleString('id-ID')}</div>
        </div>

        {/* Section title */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
          Metode Penarikan Dana
        </div>

        {/* Methods loop */}
        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => go('konfirmasi')}
            style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '0px 16px 0px 16px', height: 72, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', marginBottom: 12, transition: 'all 0.2s' }}
          >
            <div style={{ width: 44, height: 44, border: '1px solid #E0E0E0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', flexShrink: 0 }}>
              <i className={`bi ${m.icon}`} style={{ fontSize: 20, color: m.color }} />
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase' }}>{m.label}</div>
            <i className="bi bi-chevron-right" style={{ fontSize: 16, color: '#9E9E9E', fontWeight: 700 }} />
          </div>
        ))}

        {/* Info minimum */}
        <div style={{ background: '#fff', borderRadius: '0px 12px 0px 12px', padding: 16, marginTop: 16, border: '1px solid #1DB954', borderLeft: '4px solid #1DB954', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#1DB954', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-info-circle-fill" /> KETENTUAN KHUSUS
          </div>
          <div style={{ fontSize: 12, color: '#707070', lineHeight: 1.5, fontWeight: 500 }}>
            Minimum batas penukaran instan adalah <span style={{ fontWeight: 700, color: '#1A1A1A' }}>200 Poin</span> (Setara dengan IDR 2.000) per transaksi pencairan.
          </div>
        </div>
      </div>

      <BottomNav active="tukar" go={go} />
    </div>
  );
}