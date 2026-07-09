import React from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

const MIN_PICKUP_WEIGHT_KG = 2;

function formatName(name) {
  if (!name) return 'Material belum diketahui';

  return name
    .toLowerCase()
    .split(' ')
    .map((word) => (word === 'pet' ? 'PET' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

function formatDateTime(value) {
  if (!value) return '';

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsed);
  }

  return String(value).replace(/\./g, ':');
}

function formatPointValue(value) {
  return new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value)));
}

function formatWeight(value) {
  return `${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.max(0, value))} kg`;
}

function estimateItemWeightKg(item) {
  const fromItem = Number(item?.estimatedWeightKg);
  if (Number.isFinite(fromItem) && fromItem > 0) return fromItem;

  const label = `${item?.name ?? ''} ${item?.category ?? ''}`.toLowerCase();
  if (label.includes('cardboard') || label.includes('kardus')) return 0.9;
  if (label.includes('plastic') || label.includes('plastik')) return 0.7;
  if (label.includes('glass') || label.includes('kaca')) return 1.1;
  if (label.includes('metal') || label.includes('logam')) return 1.2;

  const fallback = Number(((Number(item?.estimatedPoints) || 100) / 125).toFixed(1));
  return Math.max(0.5, fallback);
}

function getAvatarSrc(userName, profilePhoto) {
  if (profilePhoto) return profilePhoto;

  const seed = encodeURIComponent(userName || 'SISA Customer');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=1db954&textColor=ffffff&radius=50`;
}

function getHistoryStatus(item) {
  if (!item) return 'SELESAI';
  if (item.status === 'DALAM_PROSES') return 'DALAM PROSES';
  if (item.status === 'DIJADWALKAN') return 'DIJADWALKAN';
  if (item.status === 'DIBATALKAN') return 'DIBATALKAN';
  return 'SELESAI';
}

export default function Dashboard() {
  const { go } = useAppNavigation();
  const { name, profilePhoto, points, milestone, cartItems, pickupHistory } = useSelector((state) => state.user);

  const firstName = name?.split(' ')[0] ?? 'Customer';
  const progress = milestone > 0 ? Math.min((points / milestone) * 100, 100) : 0;
  const remaining = Math.max(milestone - points, 0);
  const totalValueIdr = points * 10;
  const cartTotalPoints = (cartItems ?? []).reduce((sum, item) => sum + (item.estimatedPoints || 0), 0);
  const cartTotalWeight = (cartItems ?? []).reduce((sum, item) => sum + estimateItemWeightKg(item), 0);
  const canRequestPickup = cartTotalWeight >= MIN_PICKUP_WEIGHT_KG;

  const historyItems = pickupHistory?.length ? pickupHistory : JSON.parse(localStorage.getItem('pickupHistory') || '[]');
  const recentLogs = historyItems.slice(0, 4);
  const activePickup = historyItems.find((item) => item?.status === 'DALAM_PROSES' || item?.status === 'DIJADWALKAN') || null;
  const pendingPoints = historyItems
    .filter((item) => item?.status === 'DALAM_PROSES' || item?.status === 'DIJADWALKAN')
    .reduce((sum, item) => sum + (item.estimatedPoints || 0), 0);
  const notificationCount = (activePickup || pendingPoints > 0 || cartItems.length > 0) ? 1 : 0;

  const quickActions = [
    { label: 'Scan Sampah', icon: 'bi-camera', action: 'kamera', description: 'Pindai & simpan' },
    { label: 'Tukar Poin', icon: 'bi-arrow-left-right', action: 'tukarPoin', description: 'Redeem hadiah' },
    { label: 'Riwayat', icon: 'bi-clock-history', action: 'riwayat', description: 'Lihat histori' },
  ];

  const educationCards = [
    { title: 'Cara mempersiapkan sampah plastik', icon: 'bi-droplet-half', accent: 'from-primary/15 to-primary/5' },
    { title: 'Kenali jenis-jenis sampah kertas', icon: 'bi-box-seam', accent: 'from-accent/20 to-accent/5' },
    { title: 'Sampah logam juga bisa bernilai!', icon: 'bi-nut', accent: 'from-[#D7E8F8] to-[#EEF5FF]' },
    { title: 'Dampak positif daur ulang', icon: 'bi-recycle', accent: 'from-[#DDF5E5] to-[#F4FBF5]' },
  ];

  const avatarSrc = getAvatarSrc(name, profilePhoto);

  const requestPickup = () => go('keranjang');

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[radial-gradient(circle_at_top_left,_rgba(29,185,84,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,166,35,0.10),_transparent_26%),linear-gradient(180deg,_#FBFCFB_0%,_#F7FAF7_100%)] relative overflow-hidden">
      <header className="shrink-0 border-b border-line/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => go('profil')}
              className="relative h-12 w-12 overflow-hidden rounded-full border border-line bg-white shadow-sm shrink-0"
              aria-label="Buka profil"
            >
              <img src={avatarSrc} alt={name || 'Avatar pengguna'} className="h-full w-full object-cover" />
            </button>
            <div className="min-w-0 pr-2">
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-placeholder sm:text-[11px]">Selamat datang kembali,</div>
              <div className="max-w-[180px] whitespace-nowrap text-[14px] font-extrabold leading-none text-ink sm:max-w-none sm:text-[22px] sm:leading-none">
                Hai, {firstName}! <span className="text-primary">👋</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-transform active:scale-95"
              aria-label="Notifikasi"
            >
              <i className="bi bi-bell text-xl" />
              {notificationCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />}
            </button>
            <button
              type="button"
              onClick={() => go('tukarPoin')}
              className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint px-3.5 py-2 text-sm font-extrabold text-primary shadow-sm transition-transform active:scale-95"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                <i className="bi bi-coin" />
              </span>
              <span>{formatPointValue(points)} PT</span>
            </button>
          </div>
        </div>
      </header>

      <div className="scroll-content">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 pb-[112px] sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] lg:items-start">
            <section className="space-y-4">
              <div className="relative overflow-hidden rounded-geo-2xl border border-line bg-[#FFF8DF] p-4 pl-5 shadow-card sm:p-6 sm:pl-6">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-accent" />
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="w-full min-w-0 sm:max-w-[72%]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink sm:text-[11px]">Akumulasi Saldo</div>
                    <div className="mt-1.5 flex flex-wrap items-end gap-1.5 sm:mt-2 sm:gap-2">
                      <div className="text-[34px] font-extrabold leading-none tracking-tight text-ink sm:text-[54px]">
                        {formatPointValue(points)}
                      </div>
                      <div className="pb-0.5 text-base font-bold text-primary sm:pb-1 sm:text-xl">PT</div>
                    </div>
                    <div className="mt-1 text-[12px] font-medium text-muted sm:text-sm">
                      Setara dengan IDR {formatPointValue(totalValueIdr)}
                    </div>

                    <div className="mt-3 sm:mt-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-muted sm:text-[11px]">
                        <span>Ambang bonus multiplier 2x</span>
                        <span>{formatPointValue(remaining)} PT lagi</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-[#7FD99A] to-primary transition-[width] duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
                    <button
                      type="button"
                      onClick={() => go('profil')}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-extrabold text-ink shadow-sm transition-transform active:scale-95 whitespace-nowrap sm:text-[11px]"
                    >
                      Detail Saldo &gt;
                    </button>
                    <div className="hidden h-24 w-24 items-center justify-center sm:flex sm:h-28 sm:w-28">
                      <svg viewBox="0 0 200 200" className="h-full w-full">
                        <defs>
                          <radialGradient id="balanceEarthGrad" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#BAE6FD" />
                            <stop offset="40%" stopColor="#38BDF8" />
                            <stop offset="85%" stopColor="#0284C7" />
                            <stop offset="100%" stopColor="#0369A1" />
                          </radialGradient>
                        </defs>
                        <circle cx="100" cy="100" r="72" fill="url(#balanceEarthGrad)" filter="drop-shadow(0px 6px 12px rgba(0,0,0,0.15))" />
                        <path d="M55 70 Q70 50 90 65 T145 60 T150 95 Q125 115 105 100 T55 70 Z" fill="#4ADE80" opacity="0.95" />
                        <path d="M50 120 Q75 105 90 125 T135 135 T120 160 Q75 165 50 140 Z" fill="#22C55E" />
                        <rect x="72" y="44" width="4" height="10" fill="#78350F" rx="1" />
                        <circle cx="74" cy="40" r="9" fill="#15803D" />
                        <rect x="122" y="54" width="4" height="12" fill="#78350F" rx="1" />
                        <circle cx="124" cy="48" r="11" fill="#166534" />
                        <rect x="92" y="112" width="3.5" height="10" fill="#78350F" rx="1" />
                        <ellipse cx="94" cy="106" rx="8" ry="9" fill="#16A34A" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-geo-xl border border-primary/20 bg-white shadow-card">
                <div className="flex items-start gap-3 bg-[linear-gradient(90deg,_rgba(29,185,84,0.10),_rgba(29,185,84,0.03))] p-3.5 sm:p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-sm shrink-0">
                    <i className="bi bi-lightbulb-fill text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink sm:text-[11px]">AI Tips</div>
                    <div className="mt-1.5 text-[13px] font-medium leading-relaxed text-ink sm:mt-2 sm:text-[15px]">
                      Kosongkan isi botol dan lepaskan tutup botol PET, agar AI dapat mengenali material dengan lebih akurat.
                    </div>
                  </div>
                  <div className="hidden sm:block text-primary/25">
                    <i className="bi bi-stars text-3xl" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => go(action.action)}
                    className="group flex items-center gap-3 rounded-geo-lg border border-line bg-white p-3 text-left shadow-card transition-transform hover:-translate-y-0.5 active:scale-[0.99] sm:flex-col sm:items-start sm:p-3.5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <i className={`bi ${action.icon} text-xl`} />
                    </span>
                    <div className="min-w-0 sm:w-full">
                      <span className="block text-[12px] font-extrabold text-ink sm:text-sm sm:truncate">{action.label}</span>
                      <span className="mt-0.5 hidden text-[11px] font-medium text-placeholder sm:block sm:truncate">{action.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="rounded-geo-xl border border-line bg-white p-3.5 shadow-card sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink sm:text-[11px]">Aktivitas Terakhir</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => go('riwayat')}
                      className="text-[11px] font-extrabold uppercase tracking-wide text-primary"
                    >
                      Lihat semua <i className="bi bi-chevron-right" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                    {recentLogs.length === 0 ? (
                      <div className="rounded-geo-sm border border-dashed border-line bg-surface px-4 py-5 text-center sm:py-6">
                        <div className="text-[15px] font-extrabold text-ink sm:text-base">Belum ada aktivitas</div>
                        <div className="mt-1 text-[12px] text-placeholder sm:text-[13px]">Semua riwayat scan, pickup, dan penukaran akan muncul di sini.</div>
                      </div>
                    ) : (
                      recentLogs.map((item) => {
                        const displayPoints = item.status === 'DIBATALKAN' ? 0 : (item.verifiedPoints || item.estimatedPoints || 0);
                        return (
                          <div
                            key={item.id || `${item.name}-${item.date}`}
                            className="flex items-center justify-between gap-4 rounded-geo-sm border border-line bg-surface px-4 py-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-extrabold text-ink">{formatName(item.name)}</div>
                              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-placeholder">
                                {formatDateTime(item.date)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-extrabold text-primary">+{formatPointValue(displayPoints)} PT</div>
                              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-muted">
                                {getHistoryStatus(item)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="overflow-hidden rounded-geo-xl border border-line bg-[linear-gradient(135deg,_#0E7C3A_0%,_#2EA44F_42%,_#6AD17E_100%)] p-4 text-white shadow-card sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-[68%]">
                      <div className="mt-1 text-[16px] font-extrabold leading-tight sm:mt-0 sm:text-[22px]">
                        Setiap sampah yang kamu pilah, bumi jadi lebih baik.
                      </div>
                      <button
                        type="button"
                        className="mt-4 rounded-full bg-white px-3.5 py-2 text-[12px] font-extrabold text-primary shadow-sm"
                      >
                        Pelajari lebih lanjut <i className="bi bi-arrow-right" />
                      </button>
                    </div>
                    <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="h-full w-full">
                        <defs>
                          <radialGradient id="earthGrad" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#A3E6FD" />
                            <stop offset="25%" stopColor="#38BDF8" />
                            <stop offset="75%" stopColor="#0284C7" />
                            <stop offset="100%" stopColor="#0369A1" />
                          </radialGradient>
                        </defs>
                        <circle cx="100" cy="100" r="75" fill="url(#earthGrad)" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.2))" />
                        <path d="M60 65 Q75 50 95 60 T140 55 T155 85 Q130 110 110 95 T60 65 Z" fill="#4ADE80" opacity="0.9" />
                        <path d="M45 110 Q70 100 85 120 T130 130 T120 160 Q70 165 45 135 Z" fill="#22C55E" opacity="0.85" />
                        <path d="M115 40 Q130 25 150 35 T160 60 Z" fill="#4ADE80" opacity="0.75" />
                        <path d="M25 90 C 20 40, 180 40, 175 90" fill="none" stroke="#65A30D" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
                        <path d="M35 125 L47 115 L53 128 Z" fill="#A3E635" transform="rotate(25 35 125)" />
                        <path d="M165 75 L177 65 L183 78 Z" fill="#A3E635" transform="rotate(-15 165 75)" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-geo-xl border border-line bg-white p-4 shadow-card sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink sm:text-[11px]">Keranjang Saya</div>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <i className="bi bi-basket2 text-xl" />
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="mt-5 rounded-geo-sm border border-dashed border-line bg-surface px-4 py-6 text-center">
                    <div className="text-base font-extrabold text-ink">Keranjang masih kosong</div>
                    <div className="mt-1 text-[13px] text-placeholder">Yuk, mulai scan sampah pertamamu.</div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-geo-sm bg-surface px-3 py-2.5 sm:py-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-placeholder sm:text-[11px]">Item</div>
                        <div className="mt-1 text-[16px] font-extrabold text-ink sm:text-lg">{cartItems.length}</div>
                      </div>
                      <div className="rounded-geo-sm bg-surface px-3 py-2.5 sm:py-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-placeholder sm:text-[11px]">Berat Est.</div>
                        <div className="mt-1 text-[16px] font-extrabold text-ink sm:text-lg">{formatWeight(cartTotalWeight)}</div>
                      </div>
                    </div>

                    <div className="rounded-geo-sm border border-line bg-primary-tint px-3 py-2.5 sm:py-3">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-primary sm:text-[11px]">Total estimasi poin</div>
                      <div className="mt-1 text-[20px] font-extrabold text-ink sm:text-2xl">~{formatPointValue(cartTotalPoints)} PT</div>
                    </div>

                    <button
                      type="button"
                      onClick={requestPickup}
                      disabled={!canRequestPickup}
                      className={`btn-primary ${!canRequestPickup ? 'bg-line text-placeholder shadow-none hover:translate-y-0 active:scale-100' : ''}`}
                    >
                      {canRequestPickup ? 'Request Pickup' : `Minimal ${MIN_PICKUP_WEIGHT_KG} kg untuk Request Pickup`}
                    </button>

                    {!canRequestPickup && (
                      <div className="text-[12px] font-semibold text-placeholder">
                        Request pickup akan aktif setelah total estimasi berat di keranjang mencapai minimal {MIN_PICKUP_WEIGHT_KG} kg.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {activePickup && (
                <div className="rounded-geo-xl border border-primary/20 bg-white p-4 shadow-card sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink sm:text-[11px]">Pickup Aktif</div>
                      <div className="mt-1 text-[12px] font-medium text-muted sm:text-sm">Pickup yang sedang berjalan atau menunggu jadwal.</div>
                    </div>
                    <span className="rounded-full border border-accent/20 bg-accent-tint px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-accent">
                      {getHistoryStatus(activePickup)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-geo-sm bg-primary-tint px-4 py-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shrink-0">
                      <i className="bi bi-truck text-lg" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-extrabold text-ink">{formatName(activePickup.name)}</div>
                      <div className="mt-1 text-[11px] font-semibold text-[#2E7D32]">
                        {formatDateTime(activePickup.date)} · ~{formatPointValue(activePickup.estimatedPoints || 0)} PT
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-geo-sm border border-line bg-surface px-3 py-3 text-[13px] font-semibold text-muted">
                    Poin pending: <span className="text-ink">~{formatPointValue(pendingPoints)} PT</span>
                    <span className="block text-[11px] font-medium text-placeholder">Estimasi ini belum bisa ditukarkan sampai verifikasi selesai.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (activePickup?.id) localStorage.setItem('activeTrackingId', String(activePickup.id));
                      go('tracking');
                    }}
                    className="btn-primary mt-4"
                  >
                    Lihat Tracking
                  </button>
                </div>
              )}

              <div className="rounded-geo-xl border border-line bg-white p-4 shadow-card sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink">Edukasi</div>
                  </div>
                  <button type="button" className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
                    Lihat semua <i className="bi bi-chevron-right" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {educationCards.map((card) => (
                    <button
                      key={card.title}
                      type="button"
                      className={`group rounded-geo-sm border border-line bg-gradient-to-br ${card.accent} p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.99]`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm">
                        <i className={`bi ${card.icon} text-xl`} />
                      </div>
                      <div className="mt-3 text-[13px] font-extrabold leading-snug text-ink sm:text-[14px]">{card.title}</div>
                      <div className="mt-2 text-[11px] font-bold text-primary">Baca artikel</div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}