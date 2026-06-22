import React, { useState } from 'react';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

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
  MENUNGGU_MITRA: { label: 'Menunggu Mitra', bg: 'bg-[#F5F5F5]', color: 'text-muted', border: 'border-[#BDBDBD]' },
  MENUNGGU_MITRA_TERSEDIA: { label: 'Menunggu Mitra Tersedia', bg: 'bg-accent-tint', color: 'text-accent', border: 'border-accent' },
  DIJADWALKAN: { label: 'Dijadwalkan', bg: 'bg-[#EEF0F7]', color: 'text-ink-soft', border: 'border-ink-soft' },
  DALAM_PROSES: { label: 'Dalam Proses', bg: 'bg-[#FFF4E5]', color: 'text-accent', border: 'border-accent' },
  SELESAI: { label: 'Selesai', bg: 'bg-primary-tint', color: 'text-primary', border: 'border-primary' },
  DIBATALKAN: { label: 'Dibatalkan', bg: 'bg-danger-tint', color: 'text-danger', border: 'border-danger' },
};

function PointsLabel({ item }) {
  if (item.status === 'DIBATALKAN') {
    return <span className="text-placeholder">+0 PT</span>;
  }
  if (item.status === 'SELESAI') {
    return <span className="text-primary">+{item.verifiedPoints} PT</span>;
  }
  return <span className="text-accent">~{item.estimatedPoints} PT</span>;
}

function EmptyState({ go }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <i className="bi bi-inbox text-[56px] text-[#BDBDBD]" />
      <div className="text-base font-extrabold text-ink mt-4">Belum Ada Riwayat</div>
      <div className="text-[13px] text-placeholder mt-1.5 leading-relaxed">
        Riwayat pickup sampahmu akan muncul di sini setelah kamu melakukan scan pertama.
      </div>
      <button className="btn-primary mt-6 w-auto px-6" onClick={() => go('kamera')}>
        Mulai Scan Sekarang
      </button>
    </div>
  );
}

export default function Riwayat() {
  const { go } = useAppNavigation();
  const [expandedIdx, setExpandedIdx] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Log Operasional</h2>
      </div>

      {items.length === 0 ? (
        <EmptyState go={go} />
      ) : (
        <div className="scroll-content px-6 pt-6 pb-[100px] flex flex-col gap-3">
          {items.map((item, i) => {
            const st = STATUS[item.status];
            const isAdjusted = item.status === 'SELESAI' && item.verifiedPoints != null && item.verifiedPoints !== item.estimatedPoints;
            const isExpanded = expandedIdx === i;

            return (
              <div
                key={i}
                onClick={isAdjusted ? () => setExpandedIdx(isExpanded ? null : i) : undefined}
                className={`bg-white border border-line rounded-geo-flip p-3.5 ${isAdjusted ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-[10px] bg-surface border border-line flex items-center justify-center shrink-0">
                    <i className={`bi ${item.icon} text-xl text-ink`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold text-ink truncate uppercase">{item.name}</div>
                    <div className="text-[11px] text-muted mt-1 font-semibold">{item.date}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="text-sm font-extrabold"><PointsLabel item={item} /></div>
                    <div className={`text-[10px] font-extrabold rounded-geo-xs px-2 py-1 ${st.bg} ${st.color} border ${st.border} uppercase tracking-wide whitespace-nowrap`}>
                      {st.label}
                    </div>
                    {isAdjusted && (
                      <div className="flex items-center gap-1 text-[9px] font-extrabold text-accent uppercase tracking-wide">
                        <i className="bi bi-info-circle-fill" />
                        Disesuaikan
                        <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                      </div>
                    )}
                  </div>
                </div>

                {isAdjusted && isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dashed border-line text-xs text-muted leading-relaxed">
                    <div>Estimasi AI saat scan: <strong className="text-ink">{item.estimatedPoints} Poin</strong></div>
                    <div>Terverifikasi Mitra saat pickup: <strong className="text-ink">{item.verifiedPoints} Poin</strong></div>
                    <div className="mt-1 text-placeholder">Penyesuaian terjadi karena kondisi fisik material berbeda dari estimasi awal.</div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="text-center text-placeholder text-xs font-medium mt-3 tracking-wide">
            MENAMPILKAN RIWAYAT 30 HARI TERAKHIR
          </div>
        </div>
      )}

      <BottomNav active="riwayat" />
    </div>
  );
}
