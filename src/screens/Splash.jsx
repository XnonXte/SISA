import React from 'react';
import { useAppNavigation } from '../app/useAppNavigation';

export default function Splash() {
  const { go } = useAppNavigation();

  return (
    <div className="flex-1 flex flex-col items-center justify-between h-screen px-5 bg-white">
      {/* Hero illustration */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10">
        <img src="/logo-mark-sisa.svg" alt="SISA" className="w-24 h-24 object-contain" />
        <img src="/logo-text-sisa.svg" alt="SISA" className="w-40 h-auto object-contain mt-1" />
        <div className="text-base font-medium text-ink/70 mt-2 text-center">
          Infrastruktur Validasi Mutu Rantai Pasok.
        </div>
      </div>

      {/* CTA area */}
      <div className="w-full pb-10 relative z-10">
        <button
          className="w-full h-[52px] bg-primary text-white font-extrabold uppercase tracking-wide
                     border-none rounded-geo-lg shadow-cta-primary"
          onClick={() => go('register')}
        >
          Mulai Sekarang
        </button>
        <button
          className="w-full h-[52px] bg-white text-ink font-extrabold uppercase tracking-wide
                     border-2 border-line rounded-geo-lg mt-3"
          onClick={() => go('escrow')}
        >
          Pelajari Sistem Escrow
        </button>
        <div className="text-center mt-4 text-[11px] text-ink/50 font-medium tracking-wide">
          Platform agregator berbekal teknologi Computer Vision. Kami memfasilitasi konversi
          material kardus dan PET bening menjadi aset likuid secara presisi, tanpa perantara fisik.
        </div>
      </div>
    </div>
  );
}
