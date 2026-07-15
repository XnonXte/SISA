import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { addPoints, setPickupHistory } from '../features/user/userSlice';
import BottomNav from '../components/BottomNav';

const STATUS = {
  MENUNGGU_MITRA: { label: 'Menunggu Mitra', bg: 'bg-[#F5F5F5]', color: 'text-muted', border: 'border-[#BDBDBD]' },
  MENUNGGU_MITRA_TERSEDIA: { label: 'Menunggu Mitra Tersedia', bg: 'bg-accent-tint', color: 'text-accent', border: 'border-accent' },
  DIJADWALKAN: { label: 'Dijadwalkan', bg: 'bg-[#EEF0F7]', color: 'text-ink-soft', border: 'border-ink-soft' },
  DALAM_PROSES: { label: 'Dalam Proses', bg: 'bg-[#FFF4E5]', color: 'text-accent', border: 'border-accent' },
  SELESAI: { label: 'Selesai', bg: 'bg-primary-tint', color: 'text-primary', border: 'border-primary' },
  DIBATALKAN: { label: 'Dibatalkan', bg: 'bg-danger-tint', color: 'text-danger', border: 'border-danger' },
};

// PERBAIKAN: Logika yang jauh lebih ringkas karena kategori sudah pasti 'Cardboard' atau 'Plastic'
function getIcon(name) {
  if (!name) return 'bi-recycle';

  const lower = name.toLowerCase();
  if (lower === 'cardboard') return 'bi-box-seam'; // Ikon Kotak Kardus
  if (lower === 'plastic') return 'bi-recycle';    // Ikon Daur Ulang Plastik

  return 'bi-recycle'; // Fallback ikon jika ada kategori lain di masa depan
}

function formatRiwayatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const parts = dateStr.split(',');
    if (parts.length > 1) {
      const [d, m, y] = parts[0].trim().split('/');
      let time = parts[1].trim().replace(/\./g, ':');
      if (time.split(':').length === 3) time = time.split(':').slice(0, 2).join(':');

      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
      const monthStr = months[parseInt(m) - 1] || m;
      return `${d.padStart(2, '0')} ${monthStr} ${y} · ${time} WIB`;
    }
  }
  return dateStr;
}

function PointsLabel({ item }) {
  if (item.status === 'DIBATALKAN') return <span className="text-placeholder">+0 PT</span>;
  if (item.status === 'SELESAI') return <span className="text-primary">+{item.verifiedPoints || item.estimatedPoints || 100} PT</span>;
  return <span className="text-accent">~{item.estimatedPoints || 100} PT</span>;
}

function EmptyState({ go }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <img
        src="/assets/Asset%206.png"
        alt="Ilustrasi riwayat kosong"
        className="h-28 w-28 object-contain sm:h-36 sm:w-36"
      />
      <div className="text-base font-extrabold text-ink mt-4">Belum Ada Riwayat</div>
      <div className="text-[13px] text-placeholder mt-1.5 leading-relaxed">
        Riwayat pickup sampahmu akan muncul di sini setelah kamu melakukan permohonan penjemputan
      </div>
      {/* PERBAIKAN: Mengubah teks tombol dan route ke keranjang */}
      <button className="btn-primary mt-6 w-auto px-6" onClick={() => go('keranjang')}>
        Cek Keranjang
      </button>
    </div>
  );
}

export default function Riwayat() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const [expandedIdx, setExpandedIdx] = useState(null);

  const historyFromRedux = useSelector(s => s.user.pickupHistory);
  const items = historyFromRedux || JSON.parse(localStorage.getItem('pickupHistory') || '[]');

  // LOGIKA BACKGROUND PROGRESS TICKER
  useEffect(() => {
    const checkBackgroundTracking = () => {
      const currentHistory = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
      let hasChanged = false;

      const updatedHistory = currentHistory.map(item => {
        if (item.status === 'DALAM_PROSES') {
          const timePassed = Date.now() - (item.startTime || 0);
          if (timePassed >= 15000) {
            hasChanged = true;
            if (!item.pointsAdded) {
              dispatch(addPoints(item.estimatedPoints || 0));
            }
            return { ...item, status: 'SELESAI', pointsAdded: true };
          }
        }
        return item;
      });

      if (hasChanged) {
        localStorage.setItem('pickupHistory', JSON.stringify(updatedHistory));
        dispatch(setPickupHistory(updatedHistory));
      }
    };

    const intervalId = setInterval(checkBackgroundTracking, 1000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

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
            const st = STATUS[item.status] || STATUS.SELESAI;
            const isAdjusted = item.status === 'SELESAI' && item.verifiedPoints != null && item.verifiedPoints !== item.estimatedPoints;
            const isExpanded = expandedIdx === i;
            const isTrackingActive = item.status === 'DALAM_PROSES';

            const handleCardClick = () => {
              if (isTrackingActive) {
                localStorage.setItem('activeTrackingId', String(item.id));
                go('tracking');
              } else if (isAdjusted) {
                setExpandedIdx(isExpanded ? null : i);
              }
            };

            return (
              <div
                key={i}
                onClick={handleCardClick}
                className={`bg-white border transition-all duration-200 p-3.5 rounded-geo-flip cursor-pointer ${isTrackingActive ? 'border-accent/50 bg-accent-tint/10 shadow-sm animate-pulse-subtle' : 'border-line'
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-[10px] bg-surface border border-line flex items-center justify-center shrink-0">
                    <i className={`bi ${getIcon(item.name)} text-xl text-ink`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold text-ink truncate uppercase flex items-center gap-1.5">
                      {item.name || 'MATERIAL'}
                      {isTrackingActive && (
                        <span className="w-2 h-2 rounded-full bg-accent inline-block animate-ping" />
                      )}
                    </div>
                    <div className="text-[11px] text-muted mt-1 font-semibold">
                      {formatRiwayatDate(item.date)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="text-sm font-extrabold"><PointsLabel item={item} /></div>
                    <div className={`text-[10px] font-extrabold rounded-geo-xs px-2 py-1 ${st.bg} ${st.color} border ${st.border} uppercase tracking-wide whitespace-nowrap`}>
                      {st.label}
                    </div>
                  </div>
                </div>

                {isTrackingActive && (
                  <div className="mt-2.5 pt-2 border-t border-dashed border-accent/20 text-[11px] text-accent font-bold flex items-center justify-between">
                    <span><i className="bi bi-geo-alt-fill mr-1" /> Pelacakan kurir sedang aktif</span>
                    <span className="underline">Buka Detail →</span>
                  </div>
                )}

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