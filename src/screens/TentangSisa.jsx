import React from 'react';
import { useAppNavigation } from '../app/useAppNavigation';

const ABOUT_TEXT = `SISA merupakan platform digital berbasis Artificial Intelligence (AI) yang menghubungkan rumah tangga sebagai penghasil sampah, pengepul sebagai mitra pengumpulan, dan industri daur ulang sebagai pembeli material secara langsung dalam satu ekosistem. Platform ini memungkinkan customer melakukan identifikasi jenis dan kualitas sampah menggunakan AI Scanner, memperoleh estimasi nilai ekonomis sampah, melakukan permintaan pickup, serta memperoleh poin sebagai insentif setelah proses verifikasi oleh pengepul selesai.`;

export default function TentangSisa() {
  const { go } = useAppNavigation();

  return (
    <div className="flex flex-col h-screen bg-surface">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('profil')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Tentang SISA</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-8">
        <div className="flex justify-start mb-6">
          <img
            src="/assets/Asset 11.png"
            alt="Ilustrasi tentang SISA"
            className="w-full max-w-[300px] object-contain"
          />
        </div>
        <div className="bg-white border border-line rounded-geo-flip p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-lg bg-primary-tint flex items-center justify-center shrink-0">
              <i className="bi bi-info-circle text-xl text-primary" />
            </div>
            <div>
              <div className="text-base font-extrabold text-ink">SISA</div>
              <div className="text-xs text-muted mt-0.5">Informasi platform</div>
            </div>
          </div>

          <p className="text-sm text-ink leading-7 whitespace-pre-line text-justify">
            {ABOUT_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}