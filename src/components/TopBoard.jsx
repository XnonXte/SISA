import React from 'react';

function formatPointValue(value) {
  return new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value || 0)));
}

export default function TopBoard({
  avatarSrc,
  name,
  firstName,
  points = 0,
  onProfile,
  onPoints,
}) {
  return (
    <header className="shrink-0 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onProfile}
            className="relative h-12 w-12 overflow-hidden rounded-full border border-line bg-white shadow-sm shrink-0"
            aria-label="Buka profil"
          >
            <img src={avatarSrc} alt={name || 'Avatar pengguna'} className="h-full w-full object-cover" />
          </button>
          <div className="min-w-0 pr-2">
            <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-placeholder sm:text-[11px]">Selamat datang kembali,</div>
            <div className="max-w-[180px] whitespace-nowrap text-[14px] font-extrabold leading-none text-ink sm:max-w-none sm:text-[22px] sm:leading-none">
              Hai, {firstName || 'Customer'}! <span className="text-primary">👋</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onPoints}
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
  );
}