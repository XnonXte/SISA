import React from 'react';
import BottomNav from '../components/BottomNav';

export default function Dashboard({ go, userData }) {
  const { name, points, milestone } = userData;
  const firstName = name ? name.split(' ')[0] : 'Kamu';
  const progress = Math.min((points / milestone) * 100, 100);
  const remaining = milestone - points;

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
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#FAFAFA', position: 'relative' }}>
      <div className="status-bar"><span>9:41</span><span>●●●</span></div>

      {/* Header */}
      <div style={{ width: '100%', padding: '12px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', background: '#fff', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', letterSpacing: 1, textTransform: 'uppercase' }}>Selamat datang</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', marginTop: 2 }}>Hai, {firstName}! 👋</div>
        </div>
        <div style={{ background: '#FFFCF7', color: '#F5A623', fontSize: 14, fontWeight: 800, border: '1px solid #F5A623', borderRadius: '0px 12px 0px 12px', padding: '6px 14px' }}>
          {points} PT
        </div>
      </div>

      <div className="scroll-content" style={{ padding: '24px 24px 100px' }}>
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

        {/* Shortcuts */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          {shortcuts.map(s => (
            <div key={s.label} onClick={() => go(s.action)} style={{ flex: 1, background: '#fff', borderRadius: '0px 12px 0px 12px', padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #E0E0E0', cursor: 'pointer', gap: 6, transition: 'background 0.2s' }}>
              <i className={`bi ${s.icon}`} style={{ fontSize: 24, color: '#1A1A1A' }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: '#707070', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI Instruction card */}
        <div style={{ background: '#fff', borderRadius: '0px 16px 0px 16px', padding: 16, marginTop: 24, border: '1px solid #1DB954', borderLeft: '4px solid #1DB954' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1DB954', textTransform: 'uppercase', letterSpacing: 0.5 }}>Instruksi Mutu AI</div>
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
                <div style={{ fontSize: 11, color: '#9E9E9E', marginTop: 4, fontWeight: 600 }}>{p.date}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F5A623' }}>{p.pts}</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" go={go} />
    </div>
  );
}
