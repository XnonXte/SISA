import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { addToCart, setPickupDraft, clearScanResult } from '../features/user/userSlice';

export default function HasilScan() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const scanResult = useSelector((state) => state.user.scanResult);
  const [showToast, setShowToast] = useState(false);

  if (!scanResult) {
    go('kamera');
    return null;
  }

  const {
    imageBase64,
    category,
    estimatedPoints,
    confidence,
    grade,
    status,
    anomalies,
    instruction,
  } = scanResult;

  const isRejected = status === 'rejected';
  const confidencePct = Math.round((confidence ?? 0) * 100);
  const icon = category?.toLowerCase().includes('kardus') ? 'bi-box-seam' : 'bi-recycle';

  // JEMBATAN KONTEKS: Tambahkan properti 'name' di sini agar sinkron dengan sistem Riwayat & Dashboard
  const wasteItem = {
    name: category, // Menyimpan "Cardboard" atau "Plastic" ke dalam properti name
    category,
    icon,
    estimatedPoints,
    daysInCart: 0,
  };

  const handleAddToCart = () => {
    dispatch(addToCart(wasteItem));
    dispatch(clearScanResult());
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      go('kamera');
    }, 1400);
  };

  const handleDirectPickup = () => {
    dispatch(setPickupDraft({ source: 'direct', items: [wasteItem] }));
    dispatch(clearScanResult());
    go('formPickup'); // Jika dialihkan ke formPickup dulu, pastikan form tersebut meneruskan array items ini ke Tracking.jsx
  };

  const handleRescan = () => {
    dispatch(clearScanResult());
    go('kamera');
  };

  return (
    // PERBAIKAN 1: Mengubah h-screen menjadi h-[100dvh] agar menyesuaikan tinggi layar HP yang sebenarnya
    <div className="flex flex-col h-[100dvh] bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={handleRescan}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Validasi AI</h2>
      </div>

      <div className="flex-1 px-6 flex flex-col items-center mt-4 overflow-y-auto pb-4">
        {/* Captured image preview */}
        <div
          className="w-full h-[220px] rounded-geo-xl relative overflow-hidden border border-line shrink-0 bg-cover bg-center bg-[#111]"
          style={imageBase64 ? { backgroundImage: `url(${imageBase64})` } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
          <div className="absolute top-4 right-4 bg-ink text-accent text-[11px] font-extrabold tracking-wide px-3 py-1.5 rounded-geo-xs">
            AKURASI {confidencePct}%
          </div>
        </div>

        {/* Validation status badge */}
        {isRejected ? (
          <div className="flex items-center gap-2 mt-5 bg-danger-tint px-4 py-2 rounded-full">
            <i className="bi bi-x-circle-fill text-danger text-base" />
            <span className="text-[13px] font-bold text-danger">MUTU DITOLAK</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-5 bg-primary-tint px-4 py-2 rounded-full">
            <i className="bi bi-check-circle-fill text-primary text-base" />
            <span className="text-[13px] font-bold text-[#2E7D32]">VALIDASI BERHASIL</span>
          </div>
        )}

        {/* Points display */}
        <div className="flex items-center gap-1.5 mt-5">
          <i className={`bi bi-hourglass-split text-[13px] ${isRejected ? 'text-placeholder' : 'text-accent'}`} />
          <span className={`text-xs font-extrabold tracking-wide uppercase ${isRejected ? 'text-placeholder' : 'text-accent'}`}>
            {isRejected ? 'Poin Tidak Diberikan' : 'Estimasi Poin'}
          </span>
        </div>

        <div className={`text-[40px] font-extrabold mt-2 tracking-tight ${isRejected ? 'text-placeholder' : 'text-ink'}`}>
          {isRejected ? '+0' : `~${estimatedPoints}`}{' '}
          <span className="text-lg font-bold text-placeholder">Poin</span>
        </div>

        {!isRejected && (
          <div className="text-xs text-placeholder mt-1.5 text-center max-w-[300px] leading-relaxed">
            ≈ Rp {(estimatedPoints * 10).toLocaleString('id-ID')} — menunggu verifikasi final saat Mitra melakukan pickup fisik
          </div>
        )}

        {/* Detail rows */}
        <div className="w-full border-t border-b border-line py-4 mt-7">
          {[
            ['Material Dasar', category],
            ['Grade Mutu', grade],
            ...(anomalies?.length
              ? [['Anomali Terdeteksi', anomalies.join(', ')]]
              : []),
            ['Instruksi', instruction],
          ].filter(([, v]) => v).map(([label, val]) => (
            <div key={label} className="flex justify-between items-start py-2">
              <span className="text-[13px] text-muted font-semibold shrink-0 mr-4">{label}</span>
              <span className={`text-[13px] font-bold text-right max-w-[60%]
                ${label === 'Anomali Terdeteksi' ? 'text-danger' : 'text-ink'}`}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {/* PERBAIKAN 2: Mengubah pb-6 menjadi pb-24 agar area tombol tidak tenggelam di balik Bottom Nav Bar */}
      <div className="px-6 pt-4 pb-6 bg-white border-t border-line flex flex-col gap-2.5">
        {isRejected ? (
          <button className="btn-primary" onClick={handleRescan}>
            <i className="bi bi-camera mr-2" />Pindai Ulang
          </button>
        ) : (
          <>
            <button className="btn-primary" onClick={handleDirectPickup}>
              Request Pickup Langsung
            </button>
            <button className="btn-secondary" onClick={handleAddToCart}>
              <i className="bi bi-basket2 mr-2" />Tambah ke Keranjang
            </button>
          </>
        )}
      </div>

      {showToast && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-ink text-white text-[13px] font-semibold
                        px-5 py-3 rounded-[10px] flex items-center gap-2 shadow-lg whitespace-nowrap z-[100]">
          <i className="bi bi-check-circle-fill text-primary" />
          Item ditambahkan ke Keranjang
        </div>
      )}
    </div>
  );
}