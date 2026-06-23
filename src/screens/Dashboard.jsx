import React from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

// Fungsi untuk memformat nama jadi Title Case (kecuali PET)
function formatName(name) {
  if (!name) return 'Material Belum Diketahui';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word === 'pet' ? 'PET' : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Fungsi untuk mengubah tanggal "23/6/2026, 14.37.41" menjadi "HARI INI, 14:37 WIB"
function formatDashboardDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const parts = dateStr.split(',');
    if (parts.length > 1) {
      const [d, m, y] = parts[0].trim().split('/');
      let time = parts[1].trim().replace(/\./g, ':');
      if (time.split(':').length === 3) time = time.split(':').slice(0, 2).join(':'); // Ambil jam & menit

      // Deteksi hari ini (Konteks waktu saat ini: 23 Juni 2026)
      if (d === '23' && m === '6' && y === '2026') return `HARI INI, ${time} WIB`;
      if (d === '22' && m === '6' && y === '2026') return `KEMARIN, ${time} WIB`;

      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}, ${time} WIB`;
    }
  }
  return dateStr;
}

export default function Dashboard() {
  const { go } = useAppNavigation();
  const { name, points, milestone, cartItems } = useSelector((state) => state.user);

  const firstName = name?.split(' ')[0] ?? '';
  const progress = milestone > 0 ? Math.min((points / milestone) * 100, 100) : 0;
  const remaining = Math.max(milestone - points, 0);
  const cartTotal = (cartItems ?? []).reduce((sum, item) => sum + item.estimatedPoints, 0);

  // Ambil hingga 5 data teratas
  const historyItems = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
  const recentLogs = historyItems.slice(0, 5);

  const shortcuts = [
    { label: 'Scan Sampah', icon: 'bi-camera', action: 'kamera' },
    { label: 'Tukar Poin', icon: 'bi-arrow-left-right', action: 'tukarPoin' },
    { label: 'Riwayat', icon: 'bi-clock-history', action: 'riwayat' },
  ];

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="w-full px-6 py-3 flex items-end justify-between border-b border-line bg-white shrink-0">
        <div>
          <div className="text-[11px] font-bold text-placeholder tracking-wide uppercase">Selamat datang</div>
          <div className="text-lg font-extrabold text-ink mt-0.5">
            Hai, {firstName}! <i className="bi bi-hand-index-thumb text-accent" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div onClick={() => go('keranjang')} className="relative cursor-pointer p-1">
            <i className="bi bi-basket2 text-[22px] text-ink" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {cartItems.length}
              </span>
            )}
          </div>
          <div className="bg-accent-tint text-accent text-sm font-extrabold border border-accent rounded-geo-sm px-3.5 py-1.5">
            {points} PT
          </div>
        </div>
      </div>

      <div className="scroll-content px-6 pt-6 pb-[100px]">
        <div className="poin-card">
          <div className="text-xs text-muted font-bold tracking-wide uppercase">Akumulasi Saldo</div>
          <div className="text-[48px] font-extrabold text-ink mt-1 leading-none tracking-tight">{points}</div>
          <div className="text-sm font-semibold text-placeholder mt-2">
            VALUASI: IDR {(points * 10).toLocaleString('id-ID')}
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-[11px] font-bold text-muted mb-2">
              <span>AMBANG BONUS MULTIPLIER 2×</span>
              <span>-{remaining} PT</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {shortcuts.map((s) => (
            <div key={s.label} onClick={() => go(s.action)} className="bg-white border border-line rounded-geo-flip p-3.5 flex flex-col items-center cursor-pointer">
              <i className={`bi ${s.icon} text-xl text-primary`} />
              <span className="text-[11px] font-bold text-ink mt-2 text-center">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="w-full bg-primary-tint border border-primary/20 rounded-[16px_0_16px_0] p-4 mt-6">
          <div className="text-[11px] font-extrabold text-primary tracking-wide">
            <i className="bi bi-cpu-fill mr-1.5" />PRODUKSI MUTU AI
          </div>
          <div className="text-[13px] text-ink mt-2 leading-relaxed font-medium">
            Kosongkan cairan & lepas sedotan dari botol PET sebelum pemindaian untuk hasil validasi optimal.
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-baseline mb-3 border-b border-line pb-2">
            <span className="text-sm font-extrabold text-ink uppercase tracking-wide">Log Validasi Terakhir</span>
            <span className="text-[11px] font-bold text-primary cursor-pointer uppercase tracking-wide" onClick={() => go('riwayat')}>
              LIHAT SEMUA
            </span>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-xs text-placeholder text-center py-6">
              Belum ada riwayat. Mulai scan sampah pertamamu!
            </div>
          ) : (
            <div className="flex flex-col">
              {recentLogs.map((item, index) => {
                const displayPoints = item.status === 'DIBATALKAN' ? 0 : (item.verifiedPoints || item.estimatedPoints || 100);
                return (
                  <div key={index} className="flex items-center justify-between py-3.5 border-b border-dashed border-line last:border-0">
                    <div>
                      <div className="text-[15px] font-bold text-ink">{formatName(item.name)}</div>
                      <div className="text-[11px] text-placeholder font-bold mt-1 uppercase tracking-wider">
                        {formatDashboardDate(item.date)}
                      </div>
                    </div>
                    <div className="text-[15px] font-extrabold text-primary">
                      +{displayPoints} PT
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}