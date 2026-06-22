import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { addToCart, setPickupDraft } from '../features/user/userSlice';

export default function HasilScan() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const estimatedPoints = userData.estimatedPoints ?? 150;
  const [showToast, setShowToast] = useState(false);

  const wasteItem = {
    id: `item_${Date.now()}`,
    category: userData.scannedCategory || 'Plastik PET (Bening)',
    icon: userData.scannedCategory?.includes('Kardus') ? 'bi-box-seam' : 'bi-recycle',
    estimatedPoints,
    daysInCart: 0,
  };

  const handleAddToCart = () => {
    dispatch(addToCart(wasteItem));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      go('kamera');
    }, 1400);
  };

  const handleDirectPickup = () => {
    dispatch(setPickupDraft({ source: 'direct', items: [wasteItem] }));
    go('formPickup');
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('kamera')}><i className="bi bi-arrow-left" /></button>
        <h2>Validasi AI</h2>
      </div>

      <div className="flex-1 px-6 flex flex-col items-center mt-4 overflow-y-auto">
        <div
          className="w-full h-[220px] rounded-geo-xl relative overflow-hidden border border-line shrink-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(10,10,10,0.2), rgba(10,10,10,0.6)), url("https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600")',
          }}
        >
          <div className="absolute top-4 right-4 bg-ink text-accent text-[11px] font-extrabold tracking-wide px-3 py-1.5 rounded-geo-xs">
            AKURASI 94%
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 bg-primary-tint px-4 py-2 rounded-full">
          <i className="bi bi-check-circle-fill text-primary text-base" />
          <span className="text-[13px] font-bold text-[#2E7D32]">VALIDASI BERHASIL</span>
        </div>

        <div className="flex items-center gap-1.5 mt-5">
          <i className="bi bi-hourglass-split text-[13px] text-accent" />
          <span className="text-xs font-extrabold text-accent tracking-wide uppercase">
            Estimasi Poin
          </span>
        </div>

        <div className="text-[40px] font-extrabold text-ink mt-2 tracking-tight">
          ~{estimatedPoints} <span className="text-lg font-bold text-placeholder">Poin</span>
        </div>

        <div className="text-xs text-placeholder mt-1.5 text-center max-w-[300px] leading-relaxed">
          ≈ Rp {(estimatedPoints * 10).toLocaleString('id-ID')} — menunggu verifikasi final saat Mitra melakukan pickup fisik
        </div>

        <div className="w-full border-t border-b border-line py-4 mt-7">
          {[
            ['Material Dasar', wasteItem.category],
            ['Grade Mutu', 'Grade A — Bebas Kontaminasi'],
            ['Instruksi', 'Siapkan botol di depan pintu saat pickup.'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-start py-2">
              <span className="text-[13px] text-muted font-semibold">{label}</span>
              <span className="text-[13px] font-bold text-ink text-right max-w-[60%]">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-4 pb-6 bg-white border-t border-line flex flex-col gap-2.5">
        <button className="btn-primary" onClick={handleDirectPickup}>Request Pickup Langsung</button>
        <button className="btn-secondary" onClick={handleAddToCart}>
          <i className="bi bi-basket2 mr-2" />Tambah ke Keranjang
        </button>
      </div>

      {showToast && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-ink-soft text-white text-[13px] font-semibold
                         px-5 py-3 rounded-[10px] flex items-center gap-2 shadow-lg whitespace-nowrap z-[100]">
          <i className="bi bi-check-circle-fill text-primary" />
          Item ditambahkan ke Keranjang
        </div>
      )}
    </div>
  );
}
