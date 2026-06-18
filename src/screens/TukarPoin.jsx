import React from 'react';
import BottomNav from '../components/BottomNav';

const methods = [
  { id: 'gopay', label: 'GoPay', logoPath: '/gopay.png' },
  { id: 'ovo', label: 'OVO', logoPath: '/ovo.png' },
  { id: 'dana', label: 'Dana', logoPath: '/dana.png' },
  { id: 'pln', label: 'Token Listrik', logoPath: '/pln.png' },
];

export default function TukarPoin({ go, userData }) {
  const points = userData?.points || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA', position: 'relative' }}>
      {/* Fake status bar sudah dihapus total dari sini */}
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Tukar Poin</h2>
      </div>

      <div className="scroll-content" style={{ padding: '24px 24px 100px' }}>
        <div className="poin-card" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: '#707070', fontWeight: 700, textTransform: 'uppercase' }}>Saldo Tersedia</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', marginTop: 4 }}>{points} PT</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9E9E9E', marginTop: 4 }}>ESTIMASI NILAI: IDR {(points * 10).toLocaleString('id-ID')}</div>
        </div>

        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 700, textTransform: 'uppercase', marginBottom: 14, letterSpacing: 0.5 }}>
          Pilih Metode Penarikan
        </div>

        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => go('konfirmasi')}
            style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '0px 16px 0px 16px', height: 68, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', marginBottom: 12 }}
          >
            <div style={{ width: 52, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={m.logoPath} alt={m.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase' }}>{m.label}</div>
            <i className="bi bi-chevron-right" style={{ fontSize: 16, color: '#9E9E9E' }} />
          </div>
        ))}

        <div style={{ background: '#fff', borderRadius: '0px 12px 0px 12px', padding: 16, marginTop: 8, border: '1px solid #1DB954', borderLeft: '4px solid #1DB954', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#1DB954', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-info-circle-fill" /> KETENTUAN KHUSUS
          </div>
          <div style={{ fontSize: 12, color: '#707070', lineHeight: 1.5 }}>
            Minimum batas penukaran instan adalah <span style={{ fontWeight: 700, color: '#1A1A1A' }}>200 Poin</span> per transaksi pencairan.
          </div>
        </div>
      </div>

      <BottomNav active="riwayat" go={go} />
    </div>
  );
}