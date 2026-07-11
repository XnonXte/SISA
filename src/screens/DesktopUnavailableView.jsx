import React from 'react';
import TopBoard from '../components/TopBoard';

const DUMMY_QR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" shape-rendering="crispEdges">
  <rect width="128" height="128" rx="14" fill="#ffffff"/>
  <rect x="8" y="8" width="36" height="36" rx="6" fill="#111111"/>
  <rect x="16" y="16" width="20" height="20" rx="3" fill="#ffffff"/>
  <rect x="20" y="20" width="12" height="12" rx="2" fill="#111111"/>
  <rect x="84" y="8" width="36" height="36" rx="6" fill="#111111"/>
  <rect x="92" y="16" width="20" height="20" rx="3" fill="#ffffff"/>
  <rect x="96" y="20" width="12" height="12" rx="2" fill="#111111"/>
  <rect x="8" y="84" width="36" height="36" rx="6" fill="#111111"/>
  <rect x="16" y="92" width="20" height="20" rx="3" fill="#ffffff"/>
  <rect x="20" y="96" width="12" height="12" rx="2" fill="#111111"/>
  <rect x="56" y="14" width="8" height="8" fill="#111111"/>
  <rect x="56" y="30" width="8" height="8" fill="#111111"/>
  <rect x="72" y="22" width="8" height="8" fill="#111111"/>
  <rect x="56" y="54" width="8" height="8" fill="#111111"/>
  <rect x="72" y="54" width="8" height="8" fill="#111111"/>
  <rect x="88" y="54" width="8" height="8" fill="#111111"/>
  <rect x="56" y="70" width="8" height="8" fill="#111111"/>
  <rect x="72" y="70" width="8" height="8" fill="#111111"/>
  <rect x="88" y="70" width="8" height="8" fill="#111111"/>
  <rect x="56" y="86" width="8" height="8" fill="#111111"/>
  <rect x="72" y="86" width="8" height="8" fill="#111111"/>
  <rect x="88" y="86" width="8" height="8" fill="#111111"/>
  <rect x="56" y="102" width="8" height="8" fill="#111111"/>
  <rect x="72" y="102" width="8" height="8" fill="#111111"/>
  <rect x="88" y="102" width="8" height="8" fill="#111111"/>
</svg>`;

const DUMMY_QR_DATA_URI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(DUMMY_QR_SVG)}`;

export default function DesktopUnavailableView({
  avatarSrc,
  name,
  firstName,
  points,
  notificationCount,
  onProfile,
  onNotifications,
  onPoints,
  onBack,
}) {
  return (
    <div
      dir="ltr"
      className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#F6F8F5] text-slate-900"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(49, 163, 84, 0.08), transparent 34%), radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 28%), linear-gradient(180deg, #FBFCFA 0%, #F2F5F1 100%)',
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-36 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <TopBoard
        avatarSrc={avatarSrc}
        name={name}
        firstName={firstName}
        points={points}
        notificationCount={notificationCount}
        onProfile={onProfile}
        onNotifications={onNotifications}
        onPoints={onPoints}
      />

      <main dir="ltr" className="scroll-content w-full px-0">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-6 pb-8 lg:px-8 lg:py-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">AI Scanner</h1>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <i className="bi bi-info-circle text-[11px]" />
              </span>
              Panduan Scan
            </button>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="px-5 py-8 lg:px-8 lg:py-10">
              <div className="mx-auto flex max-w-[820px] flex-col items-center">
                <div className="relative flex h-[220px] w-full items-center justify-center lg:h-[250px]">
                  <svg
                    viewBox="0 0 320 220"
                    className="h-full w-full max-w-[340px] drop-shadow-[0_18px_30px_rgba(15,23,42,0.08)]"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="monitorScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#EEF2F7" />
                      </linearGradient>
                      <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF7A7A" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>

                    <ellipse cx="160" cy="174" rx="74" ry="10" fill="rgba(148,163,184,0.16)" />
                    <rect x="77" y="48" width="166" height="108" rx="18" fill="#ffffff" stroke="#CBD5E1" strokeWidth="4" />
                    <rect x="89" y="60" width="142" height="84" rx="12" fill="url(#monitorScreenGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
                    <rect x="147" y="156" width="26" height="12" rx="4" fill="#CBD5E1" />
                    <rect x="126" y="168" width="68" height="8" rx="4" fill="#94A3B8" />

                    <circle cx="229" cy="140" r="19" fill="#FFFFFF" stroke="url(#slashGrad)" strokeWidth="4" />
                    <path d="M221 148 237 132" stroke="url(#slashGrad)" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                  <div className="pointer-events-none absolute left-1/2 top-[46%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500 shadow-inner">
                    <i className="bi bi-camera-fill text-[30px]" />
                  </div>
                </div>

                <h2 className="max-w-[760px] text-center text-[22px] font-extrabold leading-tight text-slate-900 lg:text-[24px]">
                  Fitur AI Scanner hanya dapat digunakan di perangkat mobile.
                </h2>
                <p className="mt-3 max-w-[720px] text-center text-[15px] leading-7 text-slate-500">
                  Fitur pemindaian sampah menggunakan kamera tidak tersedia pada desktop. Silakan gunakan aplikasi SISA di smartphone Anda untuk memindai sampah.
                </p>
              </div>

              <div className="mx-auto mt-8 grid max-w-[920px] gap-4 rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-5 lg:grid-cols-3">
                {[
                  {
                    icon: 'bi-camera-fill',
                    title: 'Akses kamera perangkat',
                    text: 'AI Scanner membutuhkan kamera untuk memindai sampah secara akurat.',
                  },
                  {
                    icon: 'bi-upc-scan',
                    title: 'Hasil lebih optimal',
                    text: 'Pencahayaan dan sudut pengambilan di mobile lebih memudahkan AI.',
                  },
                  {
                    icon: 'nature',
                    title: 'Pengalaman terbaik',
                    text: 'Kami menghadirkan pengalaman terbaik untuk kamu di aplikasi mobile.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-[18px] bg-white/75 p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      {item.title === 'Pengalaman terbaik' ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" aria-hidden="true">
                          <path
                            d="M18.5 4.5c-4.7.2-8.2 2.1-10.4 5.7-1.6 2.6-2.2 5.4-1.9 8.4.1.7.6 1.2 1.2 1.3 2.9.3 5.8-.3 8.4-1.9 3.6-2.2 5.5-5.7 5.7-10.4 0-.8-.6-1.4-1.4-1.4h-1.6Zm-8.7 12.3c1.7-2.8 4.2-4.9 7.4-6.4-2.1 2.5-4.4 4.7-7 6.5l-.4-.1Zm-3.1-1.6c2.1-4.7 5.9-7.8 11.4-9-4.8 2.5-8.4 5.9-10.9 10.2-.3-.4-.4-.8-.5-1.2Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <i className={`bi ${item.icon} text-[20px]`} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-6 max-w-[920px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-emerald-700">Unduh aplikasi SISA sekarang</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Pindai, pilah, dan tukar sampah jadi poin di mana saja!</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a href="/play_store.png" className="inline-flex" aria-label="Google Play">
                        <img src="/play_store.png" alt="Google Play badge" className="h-14 w-auto select-none" />
                      </a>
                      <a href="/app_store.png" className="inline-flex" aria-label="App Store">
                        <img src="/app_store.png" alt="App Store badge" className="h-14 w-auto select-none" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 lg:justify-end">
                    <div className="max-w-[170px] text-sm font-semibold leading-6 text-slate-600 lg:text-right">
                      Scan QR untuk mengunduh aplikasi
                    </div>
                    <div className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm">
                      <img src={DUMMY_QR_DATA_URI} alt="QR code dummy" className="h-28 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-8 py-3 text-sm font-bold text-emerald-600 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <i className="bi bi-arrow-left" />
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}