import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

// Dummy data — variasi mencakup keenam status + 1 contoh item yang disesuaikan
const items = [
  { name: 'PET Bening', date: '02 JUN 2026 · 10:30 WIB', status: 'SELESAI', icon: 'bi-recycle', estimatedPoints: 150, verifiedPoints: 150 },
  { name: 'Kardus Grade A', date: '02 JUN 2026 · 09:15 WIB', status: 'DALAM_PROSES', icon: 'bi-box-seam', estimatedPoints: 100, verifiedPoints: null },
  { name: 'PET Bening (Kontaminasi)', date: '01 JUN 2026 · 14:00 WIB', status: 'DIBATALKAN', icon: 'bi-recycle', estimatedPoints: 80, verifiedPoints: null },
  { name: 'Kardus Bergelombang', date: '28 MEI 2026 · 11:45 WIB', status: 'SELESAI', icon: 'bi-box-seam', estimatedPoints: 120, verifiedPoints: 95 },
  { name: 'Botol Kaca', date: '27 MEI 2026 · 16:00 WIB', status: 'DIJADWALKAN', icon: 'bi-cup-straw', estimatedPoints: 60, verifiedPoints: null },
  { name: 'Galon Plastik', date: '26 MEI 2026 · 13:20 WIB', status: 'MENUNGGU_MITRA', icon: 'bi-droplet', estimatedPoints: 90, verifiedPoints: null },
  { name: 'Koran Bekas', date: '25 MEI 2026 · 08:10 WIB', status: 'MENUNGGU_MITRA_TERSEDIA', icon: 'bi-newspaper', estimatedPoints: 40, verifiedPoints: null },
];

const STATUS = {
  MENUNGGU_MITRA: { label: 'Menunggu Mitra', bg: '#F5F5F5', color: '#707070', border: '#BDBDBD' },
  MENUNGGU_MITRA_TERSEDIA: { label: 'Menunggu Mitra Tersedia', bg: '#FFFCF7', color: '#F5A623', border: '#F5A623' },
  DIJADWALKAN: { label: 'Dijadwalkan', bg: '#EEF0F7', color: '#1A1A2E', border: '#1A1A2E' },
  DALAM_PROSES: { label: 'Dalam Proses', bg: '#FFF4E5', color: '#F5A623', border: '#F5A623' },
  SELESAI: { label: 'Selesai', bg: '#E8F5E9', color: '#1DB954', border: '#1DB954' },
  DIBATALKAN: { label: 'Dibatalkan', bg: '#FFEBEE', color: '#D32F2F', border: '#D32F2F' },
};

function PointsLabel({ item }) {
  if (item.status === 'DIBATALKAN') {
    return <span style={{ color: '#9E9E9E' }}>+0 PT</span>;
  }
  if (item.status === 'SELESAI') {
    return <span style={{ color: '#1DB954' }}>+{item.verifiedPoints} PT</span>;
  }
  // Belum final — tampilkan sebagai estimasi, konsisten dengan HasilScan.jsx
  return <span style={{ color: '#F5A623' }}>~{item.estimatedPoints} PT</span>;
}

function EmptyState({ go }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' }}>
      <i className="bi bi-inbox" style={{ fontSize: 56, color: '#BDBDBD' }} />
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', marginTop: 16 }}>Belum Ada Riwayat</div>
      <div style={{ fontSize: 13, color: '#9E9E9E', marginTop: 6, lineHeight: 1.5 }}>
        Riwayat pickup sampahmu akan muncul di sini setelah kamu melakukan scan pertama.
      </div>
      <button className="btn-primary" style={{ marginTop: 24, width: 'auto', padding: '0 24px' }} onClick={() => go('kamera')}>
        Mulai Scan Sekarang
      </button>
    </div>
  );
}

export default function Riwayat({ go }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      {/* Fake Status bar completely removed */}
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Log Operasional</h2>
      </div>

      {items.length === 0 ? (
        <EmptyState go={go} />
      ) : (
        <div className="scroll-content" style={{ flex: 1, padding: '24px 24px 100px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {items.map((item, i) => {
            const st = STATUS[item.status];
            const isAdjusted = item.status === 'SELESAI' && item.verifiedPoints != null && item.verifiedPoints !== item.estimatedPoints;
            const isExpanded = expandedIdx === i;

            return (
              <div
                key={i}
                onClick={isAdjusted ? () => setExpandedIdx(isExpanded ? null : i) : undefined}
                style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '0px 16px 0px 16px', padding: 14, cursor: isAdjusted ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FAFAFA', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bi ${item.icon}`} style={{ fontSize: 22, color: '#1A1A1A' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#707070', marginTop: 4, fontWeight: 600 }}>{item.date}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}><PointsLabel item={item} /></div>
                    <div style={{ fontSize: 10, fontWeight: 800, borderRadius: '0px 8px 0px 8px', padding: '4px 8px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                      {st.label}
                    </div>
                    {isAdjusted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        <i className="bi bi-info-circle-fill" />
                        Disesuaikan
                        <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                      </div>
                    )}
                  </div>
                </div>

                {isAdjusted && isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #E0E0E0', fontSize: 12, color: '#707070', lineHeight: 1.6 }}>
                    <div>Estimasi AI saat scan: <strong style={{ color: '#1A1A1A' }}>{item.estimatedPoints} Poin</strong></div>
                    <div>Terverifikasi Mitra saat pickup: <strong style={{ color: '#1A1A1A' }}>{item.verifiedPoints} Poin</strong></div>
                    <div style={{ marginTop: 4, color: '#9E9E9E' }}>Penyesuaian terjadi karena kondisi fisik material berbeda dari estimasi awal.</div>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ textAlign: 'center', color: '#9E9E9E', fontSize: 12, fontWeight: 500, marginTop: 12, letterSpacing: 0.5 }}>
            MENAMPILKAN RIWAYAT 30 HARI TERAKHIR
          </div>
        </div>
      )}

      <BottomNav active="riwayat" go={go} />
    </div>
  );
}