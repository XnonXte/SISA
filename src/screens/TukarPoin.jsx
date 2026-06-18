import React from 'react';
import BottomNav from '../components/BottomNav';

const methods = [
  { id: 'gopay', label: 'GoPay', logo: 'GP', color: '#00AED6' },
  { id: 'ovo', label: 'OVO', logo: 'OVO', color: '#4C3494' },
  { id: 'dana', label: 'Dana', logo: 'D', color: '#118EEA' },
  { id: 'pln', label: 'Token Listrik', logo: 'PLN', color: '#F5A623' },
];

export default function TukarPoin({ go, userData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#FAFAFA', position: 'relative' }}>
      <div className="status-bar"><span>9:41</span><span>●●●</span></div>
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Tukar Poin</h2>
      </div>

      <div className="scroll-content" style={{ padding: '24px 24px 100px' }}>
        {/* Saldo card */}
        <div className="poin-card">
          <div style={{ fontSize: 12, color: '#707070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Saldo Poin Tersedia</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#F5A623', marginTop: 4, lineHeight: 1, letterSpacing: -1 }}>{userData.points}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#9E9E9E', marginTop: 8 }}>VALUASI: IDR {(userData.points * 10).toLocaleString('id-ID')}</div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 32, marginBottom: 12 }}>Rute Pencairan</div>

        {methods.map(m => (
          <div
            key={m.id}
            onClick={() => go('konfirmasi')}
            style={{ height: 72, background: '#fff', borderRadius: '0px 16px 0px 16px', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, cursor: 'pointer', marginBottom: 12, transition: 'all 0.2s' }}
          >
            <div style={{ width: 48, height: 48, border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: m.color, background: '#FAFAFA', flexShrink: 0, letterSpacing: 0.5 }}>
              {m.logo}
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase' }}>{m.label}</div>
            <i className="bi bi-arrow-right" style={{ fontSize: 18, color: '#1A1A1A', fontWeight: 800 }} />
          </div>
        ))}

        {/* Info minimum */}
        <div style={{ background: '#fff', borderRadius: '0px 12px 0px 12px', padding: 16, marginTop: 8, border: '1px solid #1DB954', borderLeft: '4px solid #1DB954', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#1DB954', textTransform: 'uppercase', letterSpacing: 0.5 }}>Parameter Transaksi</div>
          <div style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 600, lineHeight: 1.4 }}>
            Batas penarikan minimum: 1.500 Poin (Rp 15.000).<br />
            Biaya gateway sebesar 150 Poin dipotong dari total saldo.
          </div>
        </div>
      </div>

      <BottomNav active="tukar" go={go} />
    </div>
  );
}
