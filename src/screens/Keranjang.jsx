import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setPickupDraft, removeFromCart } from '../features/user/userSlice';
import BottomNav from '../components/BottomNav';

const MIN_PICKUP_WEIGHT_KG = 2;

// PENENTU IKON DINAMIS: Memastikan Cardboard & Plastic selalu mendapatkan ikon yang benar
function getIcon(name) {
  if (!name) return 'bi-recycle';

  const lower = name.toLowerCase();
  if (lower === 'cardboard') return 'bi-box-seam'; // Ikon Kotak Kardus
  if (lower === 'plastic') return 'bi-recycle';    // Ikon Daur Ulang Plastik

  return 'bi-recycle';
}

function getEstimatedWeightKg(item) {
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

export default function Keranjang() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.user.cartItems) || [];

  const [checked, setChecked] = useState(() => {
    const init = {};
    cartItems.forEach((item) => { init[item.id] = true; });
    return init;
  });

  const toggleItem = (id) => {
    if (cartItems.length === 1) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = useMemo(
    () => cartItems.filter((item) => checked[item.id]),
    [cartItems, checked]
  );
  const totalPoints = selectedItems.reduce((sum, item) => sum + item.estimatedPoints, 0);
  const totalWeightKg = selectedItems.reduce((sum, item) => sum + getEstimatedWeightKg(item), 0);
  const canRequest = selectedItems.length > 0 && totalWeightKg >= MIN_PICKUP_WEIGHT_KG;

  const handleRequestPickup = () => {
    const selectedIds = selectedItems.map((item) => item.id);
    dispatch(setPickupDraft({ source: 'cart', items: selectedItems }));
    dispatch(removeFromCart(selectedIds));
    go('formPickup');
  };

  const formatUsia = (daysAgo) => {
    if (daysAgo === 0) return 'Disimpan hari ini';
    if (daysAgo === 1) return 'Disimpan 1 hari lalu';
    return `Disimpan ${daysAgo} hari lalu`;
  };

  const isUrgent = (daysAgo) => daysAgo >= 11;

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Keranjang Sampah</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <img
            src="/assets/Asset%2010.png"
            alt="Ilustrasi keranjang kosong"
            className="h-28 w-28 object-contain sm:h-36 sm:w-36"
          />
          <div className="text-base font-extrabold text-ink mt-4">Keranjang Kamu Masih Kosong</div>
          <div className="text-[13px] text-placeholder mt-1.5 leading-relaxed">
            Mulai scan sampah pertamamu!
          </div>
          <button className="btn-primary mt-6 w-auto px-6" onClick={() => go('kamera')}>
            Scan Sekarang
          </button>
        </div>
      ) : (
        <>
          <div className="scroll-content px-6 pt-5 pb-[172px] flex flex-col gap-3">
            {cartItems.map((item) => {
              const isChecked = !!checked[item.id];
              const locked = cartItems.length === 1;
              const urgent = isUrgent(item.daysInCart);

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3.5 p-3.5 bg-white rounded-geo-flip
                    ${isChecked ? 'border-[1.5px] border-primary' : 'border border-line'}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                    disabled={locked}
                    className="w-5 h-5 shrink-0 accent-primary"
                    style={{ cursor: locked ? 'default' : 'pointer' }}
                  />
                  {/* UPDATE: Menggunakan fungsi getIcon() agar ikon langsung berubah mengikuti kategori nama item */}
                  <div className="w-11 h-11 rounded-[10px] bg-surface border border-line flex items-center justify-center shrink-0">
                    <i className={`bi ${getIcon(item.name || item.category)} text-xl text-ink`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold text-ink truncate">
                      {item.name || item.category}
                    </div>
                    <div className={`text-[11px] mt-1 font-semibold ${urgent ? 'text-accent' : 'text-placeholder'}`}>
                      {formatUsia(item.daysInCart)}
                      {urgent && ' · segera ajukan pickup'}
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-accent shrink-0">
                    +{item.estimatedPoints} Poin
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-[72px] left-0 w-full px-6 pt-4 pb-6 bg-white border-t border-line">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-[13px] text-muted font-semibold">
                Total estimasi ({selectedItems.length} item dipilih)
              </span>
              <span className="text-xl font-extrabold text-ink">~{totalPoints} Poin</span>
            </div>
            <div className="mb-4 flex items-center justify-between rounded-geo-sm border border-line bg-surface px-3 py-2 text-xs font-semibold text-muted">
              <span>Estimasi berat</span>
              <span className="text-ink">{totalWeightKg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg</span>
            </div>
            {!canRequest && (
              <div className="mb-3 text-[12px] font-semibold text-placeholder">
                Request Pickup aktif setelah total estimasi mencapai minimal {MIN_PICKUP_WEIGHT_KG} kg.
              </div>
            )}
            <button className="btn-primary" onClick={handleRequestPickup} disabled={!canRequest}>
              Request Pickup untuk Item Terpilih
            </button>
          </div>
        </>
      )}

      <BottomNav active="keranjang" />
    </div>
  );
}