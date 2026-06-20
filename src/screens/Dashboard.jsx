import React from 'react';
import BottomNav from '../components/BottomNav';

export default function Dashboard({ go, userData }) {
  const { name, points, milestone } = userData;
  const firstName = name ? name.split(' ')[0] : 'Kamu';
  const progress = Math.min((points / milestone) * 100, 100);
  const remaining = milestone - points;

  const cartItems = userData.cartItems || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.estimatedPoints, 0);

  const shortcuts = [
    { label: 'Scan Sampah', icon: 'bi-qr-code-scan', action: 'kamera' },
    { label: 'Tukar Poin', icon: 'bi-arrow-left-right', action: 'tukarPoin' },
    { label: 'Riwayat', icon: 'bi-clock-history', action: 'riwayat' },
  ];

  const recentPickups = [
    { name: 'PET Bening', date: 'HARI INI, 10:30 WIB', pts: '+150', done: true },
    { name: 'Kardus Grade A', date: 'KEMARIN, 14:00 WIB', pts: '+100', done: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      {/* Fake Status bar completely removed */}

      {/* Header */}
      <div style={{ width: '100%', padding: '12px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', background: '#fff', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', letterSpacing: 1, textTransform: 'uppercase' }}>Selamat datang</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', marginTop: 2 }}>Hai, {firstName}! <i className="bi bi-hand-index-thumb" style={{ color: '#F5A623' }} /></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Ikon Keranjang + badge jumlah item — akses cepat ke Screen Keranjang */}
          <div onClick={() => go('keranjang')} style={{ position: 'relative', cursor: 'pointer', padding: 4 }}>
            <i className="bi bi-basket2" style={{ fontSize: 22, color: '#1A1A1A' }} />
            {cartItems.length > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2, background: '#F5A623', color: '#fff',
                fontSize: 10, fontWeight: 800, width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              }}>
                {cartItems.length}
              </span>
            )}
          </div>

          <div style={{ background: '#FFFCF7', color: '#F5A623', fontSize: 14, fontWeight: 800, border: '1px solid #F5A623', borderRadius: '0px 12px 0px 12px', padding: '6px 14px' }}>
            {points} PT
          </div>
        </div>
      </div>

      <div className="scroll-content" style={{ flex: 1, padding: '24px 24px 100px', overflowY: 'auto' }}>
        {/* Poin card */}
        <div className="poin-card">
          <div style={{ fontSize: 12, color: '#707070', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Akumulasi Saldo</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#1A1A1A', marginTop: 4, lineHeight: 1, letterSpacing: -1 }}>{points}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#9E9E9E', marginTop: 8 }}>VALUASI: IDR {(points * 10).toLocaleString('id-ID')}</div>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#707070', marginBottom: 8 }}>
              <span>AMBANG BONUS MULTIPLIER 2×</span>
              <span>-{remaining} PT</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Kartu ringkasan Keranjang — hanya tampil kalau ada item tertunda */}
        {cartItems.length > 0 && (
          <div
            onClick={() => go('keranjang')}
            style={{
              background: '#FFFCF7', border: '1px solid #F5A623', borderRadius: '0px 16px 0px 16px',
              padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', marginTop: 20,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FFF8E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="bi bi-basket2" style={{ fontSize: 22, color: '#F5A623' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A' }}>
                {cartItems.length} Item di Keranjang
              </div>
              <div style={{ fontSize: 12, color: '#707070', marginTop: 2 }}>
                Total ~{cartTotal} Poin menunggu pickup
              </div>
            </div>
            <i className="bi bi-chevron-right" style={{ fontSize: 16, color: '#9E9E9E' }} />
          </div>
        )}

        {/* Action Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
          {shortcuts.map(s => (
            <div key={s.label} onClick={() => go(s.action)} style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '0px 16px 0px 16px', padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
              <i className={`bi ${s.icon}`} style={{ fontSize: 20, color: '#1DB954' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1A1A', marginTop: 8, textAlign: 'center' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* AI Banner Tip */}
        <div style={{ width: '100%', background: '#E8F5E9', border: '1px solid rgba(29,185,84,0.2)', borderRadius: '16px 0 16px 0', padding: 16, marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#1DB954', letterSpacing: 0.5 }}><i className="bi bi-cpu-fill" style={{ marginRight: 6 }} />PRODUKSI MUTU AI</div>
          <div style={{ fontSize: 13, color: '#1A1A1A', marginTop: 8, lineHeight: 1.4, fontWeight: 500 }}>
            Kosongkan cairan & lepas sedotan dari botol PET sebelum pemindaian untuk hasil validasi optimal.
          </div>
        </div>

        {/* Recent log */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, borderBottom: '1px solid #E0E0E0', paddingBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', textTransform: 'uppercase' }}>Log Validasi Terakhir</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1DB954', cursor: 'pointer' }} onClick={() => go('riwayat')}>LIHAT SEMUA</span>
          </div>
          {recentPickups.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px dotted #E0E0E0' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9E9E9E', marginTop: 2 }}>{p.date}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1DB954' }}>{p.pts} PT</div>
            </div>
          ))}
        </div>
      </div>

     <BottomNav active="home" go={go} cartCount={cartItems.length} />
    </div>
  );
}