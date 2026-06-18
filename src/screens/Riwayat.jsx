import React from 'react';
import BottomNav from '../components/BottomNav';

const items = [
  { name: 'PET Bening', date: '02 JUN 2026 · 10:30 WIB', pts: '+150 PT', status: 'TUNTAS', icon: 'bi-recycle' },
  { name: 'Kardus Grade A', date: '02 JUN 2026 · 09:15 WIB', pts: '+100 PT', status: 'TERTUNDA', icon: 'bi-box-seam' },
  { name: 'PET Bening (Kontaminasi)', date: '01 JUN 2026 · 14:00 WIB', pts: '+0 PT', status: 'DITOLAK', icon: 'bi-recycle' },
  { name: 'Kardus Bergelombang', date: '28 MEI 2026 · 11:45 WIB', pts: '+120 PT', status: 'TUNTAS', icon: 'bi-box-seam' },
];

const statusStyle = {
  TUNTAS: { bg: '#E8F5E9', color: '#1DB954', border: '#1DB954' },
  TERTUNDA: { bg: '#FFFCF7', color: '#F5A623', border: '#F5A623' },
  DITOLAK: { bg: '#FFEBEE', color: '#D32F2F', border: '#D32F2F' },
};

export default function Riwayat({ go }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#FAFAFA', position: 'relative' }}>
      <div className="status-bar"><span>9:41</span><span>●●●</span></div>
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Log Operasional</h2>
      </div>

      <div className="scroll-content" style={{ padding: '24px 24px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, i) => {
          const st = statusStyle[item.status];
          const ptColor = item.status === 'DITOLAK' ? '#9E9E9E' : '#F5A623';
          return (
            <div key={i} style={{ background: '#fff', borderRadius: '0px 16px 0px 16px', padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: '1px solid #E0E0E0', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, background: '#FAFAFA', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`bi ${item.icon}`} style={{ fontSize: 22, color: '#1A1A1A', strokeWidth: '1.5' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#707070', marginTop: 4, fontWeight: 600 }}>{item.date}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: ptColor }}>{item.pts}</div>
                <div style={{ fontSize: 10, fontWeight: 800, borderRadius: '0px 8px 0px 8px', padding: '4px 8px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {item.status}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ textAlign: 'center', padding: 16, fontSize: 11, fontWeight: 800, color: '#1DB954', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
          MUAT DATA SEBELUMNYA
        </div>
      </div>

      <BottomNav active="riwayat" go={go} />
    </div>
  );
}
