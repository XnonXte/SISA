import React from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  const { go } = useAppNavigation();
  const userData = useSelector((state) => state.user);
  const { name, points, milestone } = userData;
  const firstName = name ? name.split(' ')[0] : 'Kamu';
  const progress = Math.min((points / milestone) * 100, 100);
  const remaining = milestone - points;

  const cartItems = userData.cartItems || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.estimatedPoints, 0);

  const shortcuts = [
    { label: 'Scan Sampah', icon: 'bi-camera', action: 'kamera' },
    { label: 'Tukar Poin', icon: 'bi-arrow-left-right', action: 'tukarPoin' },
    { label: 'Riwayat', icon: 'bi-clock-history', action: 'riwayat' },
  ];

  const recentPickups = [
    { name: 'PET Bening', date: 'HARI INI, 10:30 WIB', pts: '+150', done: true },
    { name: 'Kardus Grade A', date: 'KEMARIN, 14:00 WIB', pts: '+100', done: true },
  ];

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      {/* Header */}
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
            {cartItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-extrabold
                                w-4 h-4 rounded-full flex items-center justify-center leading-none">
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
        {/* Poin card */}
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

        {/* Kartu ringkasan Keranjang */}
        {cartItems.length > 0 && (
          <div
            onClick={() => go('keranjang')}
            className="bg-accent-tint border border-accent rounded-geo-flip p-4 flex items-center gap-3.5 cursor-pointer mt-5"
          >
            <div className="w-11 h-11 rounded-[10px] bg-accent-tint2 flex items-center justify-center shrink-0">
              <i className="bi bi-basket2 text-accent text-xl" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-ink">{cartItems.length} Item di Keranjang</div>
              <div className="text-xs text-muted mt-0.5">Total ~{cartTotal} Poin menunggu pickup</div>
            </div>
            <i className="bi bi-chevron-right text-base text-placeholder" />
          </div>
        )}

        {/* Action Shortcuts */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {shortcuts.map((s) => (
            <div
              key={s.label}
              onClick={() => go(s.action)}
              className="bg-white border border-line rounded-geo-flip p-3.5 flex flex-col items-center cursor-pointer"
            >
              <i className={`bi ${s.icon} text-xl text-primary`} />
              <span className="text-[11px] font-bold text-ink mt-2 text-center">{s.label}</span>
            </div>
          ))}
        </div>

        {/* AI Banner Tip */}
        <div className="w-full bg-primary-tint border border-primary/20 rounded-[16px_0_16px_0] p-4 mt-6">
          <div className="text-[11px] font-extrabold text-primary tracking-wide">
            <i className="bi bi-cpu-fill mr-1.5" />PRODUKSI MUTU AI
          </div>
          <div className="text-[13px] text-ink mt-2 leading-relaxed font-medium">
            Kosongkan cairan & lepas sedotan dari botol PET sebelum pemindaian untuk hasil validasi optimal.
          </div>
        </div>

        {/* Recent log */}
        <div className="mt-8">
          <div className="flex justify-between items-baseline mb-4 border-b border-line pb-2">
            <span className="text-sm font-extrabold text-ink uppercase">Log Validasi Terakhir</span>
            <span className="text-[11px] font-bold text-primary cursor-pointer" onClick={() => go('riwayat')}>
              LIHAT SEMUA
            </span>
          </div>
          {recentPickups.map((p, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-dotted border-line">
              <div>
                <div className="text-sm font-bold text-ink">{p.name}</div>
                <div className="text-[11px] text-placeholder mt-0.5">{p.date}</div>
              </div>
              <div className="text-[15px] font-extrabold text-primary">{p.pts} PT</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}