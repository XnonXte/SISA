import React, { useState } from 'react';

const REDEEM_PTS = 250;
const REDEEM_DEST = 'GoPay';

export default function Konfirmasi({ go, userData }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const remaining = userData.points - REDEEM_PTS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#F7F9F7', position: 'relative' }}>
      <div className="status-bar" style={{ background: '#fff' }}><span>9:41</span><span>●●●</span></div>
      <div style={{ width: '100%', height: 56, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #F0F0F0', flexShrink: 0, position: 'relative' }}>
        <div onClick={() => go('tukarPoin')} style={{ width: 36, height: 36, borderRadius: 10, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>
          ←
        </div>
        <h2 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>
          Konfirmasi Penukaran
        </h2>
      </div>

      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
        {/* Summary card */}
        <div style={{ background: '#FFF8E1', borderRadius: 20, padding: 20, marginTop: 24, boxShadow: '0 2px 12px rgba(245,166,35,0.1)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            💳 Ringkasan Penukaran
          </div>
          {[
            ['Poin Ditukar', `${REDEEM_PTS} Poin`, '#F5A623'],
            ['Nilai Rupiah', `Rp ${(REDEEM_PTS * 10).toLocaleString('id-ID')}`, '#1A1A1A'],
            ['Tujuan', `💚 ${REDEEM_DEST}`, '#1DB954'],
            ['Nomor Akun', '0812-3456-7890', '#1A1A1A'],
          ].map(([label, val, col], i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i > 0 ? '0.5px solid #E0E0E0' : 'none' }}>
              <span style={{ fontSize: 13, color: '#9E9E9E' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: col }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Sisa poin */}
        <div style={{ background: '#E8F5E9', borderRadius: 16, padding: 16, marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⭐</span>
          <div>
            <div style={{ fontSize: 14, color: '#1DB954', fontWeight: 600 }}>Sisa poin setelah penukaran</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1DB954' }}>{remaining} Poin</div>
          </div>
        </div>

        {/* Guarantee */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '12px 14px', background: '#fff', borderRadius: 12, border: '1px solid #F0F0F0' }}>
          <i className="bi bi-shield-fill-check" style={{ fontSize: 18, color: '#1DB954' }} />
          <div style={{ fontSize: 12, color: '#9E9E9E', lineHeight: 1.4 }}>
            Dana akan masuk ke akunmu dalam 1×24 jam kerja. Proses aman & terjamin.
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <button className="btn-primary" onClick={() => setShowSuccess(true)}>Tukar Sekarang</button>
        <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => go('tukarPoin')}>Batal</button>
      </div>
      <div className="home-indicator" />

      {/* Success overlay */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="success-modal" style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', width: 320, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A' }}>Penukaran Berhasil!</div>
            <div style={{ fontSize: 14, color: '#9E9E9E', marginTop: 8 }}>
              Rp {(REDEEM_PTS * 10).toLocaleString('id-ID')} sedang dalam proses ke {REDEEM_DEST} kamu. Cek dalam 1×24 jam.
            </div>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => { setShowSuccess(false); go('dashboard'); }}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
