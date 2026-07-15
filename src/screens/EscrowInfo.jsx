// components/EscrowInfo.jsx
import React from 'react';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

export default function EscrowInfo() {
  const { go } = useAppNavigation();

  return (
    <div className="flex flex-col h-screen bg-surface relative overflow-hidden">
      <div className="top-app-bar shrink-0">
        <button className="back-btn" onClick={() => go('profil')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Keamanan Rekening</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[100px] text-sm text-ink font-semibold">
        <div className="bg-white border border-line rounded-geo-flip p-5 mb-5">
          <div className="flex items-center gap-3 mb-3 text-[#0F8A5F]">
            <i className="bi bi-shield-lock-fill text-2xl" />
            <h3 className="text-base font-extrabold text-ink">Sistem Perlindungan Escrow</h3>
          </div>
          <p className="text-muted text-xs leading-relaxed font-medium">
            Sistem Escrow di SISA bertindak sebagai penjamin pihak ketiga yang mengunci nilai poin dari order sampah daur ulang Anda selama proses penjemputan logistik berjalan demi menghindari segala jenis manipulasi nilai.
          </p>
        </div>

        <div className="bg-white border border-line rounded-geo-flip p-5 mb-5">
          <h4 className="font-extrabold mb-3 text-sm">Alur Pengamanan Sistem:</h4>
          <ul className="flex flex-col gap-3.5 text-xs text-muted font-medium">
            <li className="flex gap-2">
              <span className="text-[#0F8A5F] font-bold">1.</span>
              <span><strong className="text-ink">Pencatatan Awal:</strong> Nilai estimasi poin langsung diproteksi sistem sesaat setelah Anda memesan kurir pickup.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0F8A5F] font-bold">2.</span>
              <span><strong className="text-ink">Verifikasi Berat Fisik:</strong> Kurir memverifikasi kecocokan jenis & berat sampah di lokasi Anda secara transparan.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#0F8A5F] font-bold">3.</span>
              <span><strong className="text-ink">Pencairan Instan:</strong> Dana poin dilepas penuh dari rekening escrow ke saldo utama dompet digital Anda secara *real-time* setelah konfirmasi selesai.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#F8FAF9] border border-line rounded-geo-flip p-4 text-center text-xs text-muted font-bold">
          <i className="bi bi-check-circle-fill text-[#0F8A5F] text-lg block mb-1" />
          Seluruh penukaran sampah daur ulang Anda dijamin 100% aman dan akurat.
        </div>
      </div>

      <div className="shrink-0">
        <BottomNav active="profil" />
      </div>
    </div>
  );
}