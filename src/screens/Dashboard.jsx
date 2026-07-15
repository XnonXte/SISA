import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setPickupHistory } from '../features/user/userSlice';
import BottomNav from '../components/BottomNav';
import TopBoard from '../components/TopBoard';

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
  const { name, profilePhoto, points, cartItems, pickupHistory } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const localHistory = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
    if (!Array.isArray(localHistory) || localHistory.length === 0) return;

    const reduxHistory = Array.isArray(pickupHistory) ? pickupHistory : [];
    const isDifferent =
      reduxHistory.length !== localHistory.length ||
      JSON.stringify(reduxHistory) !== JSON.stringify(localHistory);

    if (isDifferent) {
      dispatch(setPickupHistory(localHistory));
    }
  }, [dispatch, pickupHistory]);

  const firstName = name?.split(' ')[0] ?? 'Customer';
  const totalValueIdr = points * 10;
  const cartTotalPoints = (cartItems ?? []).reduce((sum, item) => sum + (item.estimatedPoints || 0), 0);
  const cartTotalWeight = (cartItems ?? []).reduce((sum, item) => sum + estimateItemWeightKg(item), 0);
  const canRequestPickup = cartTotalWeight >= MIN_PICKUP_WEIGHT_KG;

  const historyItems = pickupHistory?.length ? pickupHistory : JSON.parse(localStorage.getItem('pickupHistory') || '[]');
  const recentLogs = historyItems.slice(0, 4);
  const activePickup = historyItems.find((item) => item?.status === 'DALAM_PROSES' || item?.status === 'DIJADWALKAN') || null;
  const pendingPoints = historyItems
    .filter((item) => item?.status === 'DALAM_PROSES' || item?.status === 'DIJADWALKAN')
    .reduce((sum, item) => sum + Math.max(0, Number(item?.estimatedPoints ?? 0)), 0);

  const quickActions = [
    { label: 'Scan Sampah', icon: 'bi-camera', action: 'kamera', description: 'Pindai & simpan' },
    { label: 'Tukar Poin', icon: 'bi-arrow-left-right', action: 'tukarPoin', description: 'Redeem hadiah' },
    { label: 'Riwayat', icon: 'bi-clock-history', action: 'riwayat', description: 'Lihat histori' },
  ];

  const educationCards = [
    {
      title: 'Cara mempersiapkan sampah plastik',
      icon: 'bi-droplet-half',
      accent: 'from-primary/15 to-primary/5',
      href: 'https://arahenvironmental.com/bagaimana-cara-daur-ulang-plastik/',
    },
    {
      title: 'Kenali jenis-jenis sampah kertas',
      icon: 'bi-box-seam',
      accent: 'from-accent/20 to-accent/5',
      href: 'https://kumparan.com/kumparanbisnis/kenali-jenis-sampah-kertas-yang-bisa-disulap-jadi-karya-seni-26t8yPJ7Cjn',
    },
    {
      title: 'Sampah logam juga bisa bernilai!',
      icon: 'bi-nut',
      accent: 'from-[#D7E8F8] to-[#EEF5FF]',
      href: 'https://dynatech-int.com/en/mengenal-proses-daur-ulang-logam-dan-hasil-akhirnya/',
    },
    {
      title: 'Dampak positif daur ulang',
      icon: 'bi-recycle',
      accent: 'from-[#DDF5E5] to-[#F4FBF5]',
      href: 'https://waste4change.com/blog/manfaat-daur-ulang-plastik-dalam-kehidupan-sehari-hari/',
    },
  ];

  const avatarSrc = getAvatarSrc(name, profilePhoto);

  const requestPickup = () => go('keranjang');

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[radial-gradient(circle_at_top_left,_rgba(29,185,84,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,166,35,0.10),_transparent_26%),linear-gradient(180deg,_#FBFCFB_0%,_#F7FAF7_100%)] relative overflow-hidden">
      <TopBoard
        avatarSrc={avatarSrc}
        name={name}
        firstName={firstName}
        points={points}
        onProfile={() => go('profil')}
        onPoints={() => go('tukarPoin')}
      />

      <div className="scroll-content">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 pb-[112px] sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] lg:items-start">
            <section className="space-y-4">
              {/* KARTU AKUMULASI SALDO */}
              <div className="relative overflow-hidden rounded-geo-2xl border border-line bg-[#FFF8DF] p-4 pl-5 shadow-card sm:p-6 sm:pl-6">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-accent" />
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4">
                  {/* Bagian Kiri: Info Saldo & Tombol Detail yang Diperbesar */}
                  <div className="min-w-0 flex-1">
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

                    <button
                      type="button"
                      onClick={() => go('profil')}
                      className="mt-4 rounded-full border border-line bg-white px-5 py-2 text-xs font-extrabold text-ink shadow-sm transition-transform active:scale-95 whitespace-nowrap sm:px-6 sm:py-2.5 sm:text-sm"
                    >
                      Detail Saldo &gt;
                    </button>
                  </div>

                  {/* Bagian Kanan: Ilustrasi 2D */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center sm:h-32 sm:w-32">
                    <img
                      src="/assets/Asset%205.png"
                      alt="Ilustrasi akumulasi saldo"
                      className="h-full w-full object-contain"
                    />
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
                        const displayPoints = item.status === 'DIBATALKAN'
                          ? 0
                          : Math.max(0, Number(item?.verifiedPoints ?? item?.estimatedPoints ?? 0));
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
                  <div className="flex items-end justify-between gap-4">
                    <div className="max-w-[68%] pb-1 sm:pb-2">
                      <div className="mt-1 text-[13px] font-extrabold leading-snug sm:mt-0 sm:text-[18px]">
                        Setiap sampah yang kamu pilah, bumi jadi lebih baik.
                      </div>
                      <a
                        href="https://madanitec.com/article/detail/manfaat-memilah-sampah"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center rounded-full bg-white px-3.5 py-2 text-[11px] font-extrabold text-primary shadow-sm sm:mt-4 sm:text-[12px]"
                      >
                        Pelajari lebih lanjut <i className="bi bi-arrow-right" />
                      </a>
                    </div>
                    <div className="relative flex h-28 w-28 shrink-0 items-end justify-end sm:h-36 sm:w-36">
                      <img
                        src="/assets/Asset%204.png"
                        alt="Ilustrasi bumi dan sampah terpilah"
                        className="h-full w-full object-contain object-right-bottom translate-y-2 sm:translate-y-3"
                      />
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
                    <a
                      key={card.title}
                      href={card.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group rounded-geo-sm border border-line bg-gradient-to-br ${card.accent} p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.99]`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm">
                        <i className={`bi ${card.icon} text-xl`} />
                      </div>
                      <div className="mt-3 text-[13px] font-extrabold leading-snug text-ink sm:text-[14px]">{card.title}</div>
                      <div className="mt-2 text-[11px] font-bold text-primary">Baca artikel</div>
                    </a>
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