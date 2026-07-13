import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setPickupDraft, removeFromCart } from '../features/user/userSlice';
import BottomNav from '../components/BottomNav';

const MIN_PICKUP_WEIGHT_KG = 2;

// Helper formatters
function formatRupiah(value) {
  return `Rp${new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value)))}`;
}

document.title = "Keranjang Saya - SISA";

function formatWeight(value) {
  return `${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)} kg`;
}

function formatPoints(value) {
  return `${new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value)))} PT`;
}

export default function Keranjang() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();

  // Mengambil data isi keranjang dari Redux
  const cartItems = useSelector((state) => state.user.cartItems) || [];

  // State untuk melacak item mana saja yang dichecklist
  const [checkedItems, setCheckedItems] = useState({});

  // Otomatis centang semua item saat keranjang pertama kali dimuat
  useEffect(() => {
    const initialChecked = {};
    cartItems.forEach((item) => {
      initialChecked[item.id] = true;
    });
    setCheckedItems(initialChecked);
  }, [cartItems.length]);

  // Handler untuk mengubah status checklist per item
  const handleToggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Memfilter item mana saja yang saat ini sedang dicentang
  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => checkedItems[item.id]);
  }, [cartItems, checkedItems]);

  // Kalkulasi total otomatis HANYA untuk item yang dichecklist
  const totalWeightKg = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (Number(item.estimatedWeightKg) || 0), 0);
  }, [selectedItems]);

  const canRequest = selectedItems.length > 0 && totalWeightKg >= MIN_PICKUP_WEIGHT_KG;
  const progressPercentage = Math.min(100, (totalWeightKg / MIN_PICKUP_WEIGHT_KG) * 100);

  // Proses Request Pickup hanya untuk item terpilih (selectedItems)
  const handleRequestPickup = () => {
    if (!canRequest) return;
    dispatch(setPickupDraft({ source: 'cart', items: selectedItems }));
    dispatch(removeFromCart(selectedItems.map((item) => item.id)));
    go('formPickup');
  };

  // Fungsi Bulk Erase untuk menghapus semua item yang sedang dicentang sekaligus
  const handleBulkErase = () => {
    if (selectedItems.length > 0) {
      dispatch(removeFromCart(selectedItems.map((item) => item.id)));
    }
  };

  const handleRemoveSingle = (id) => {
    dispatch(removeFromCart([id]));
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative overflow-hidden text-ink font-sans">

      {/* TOP APP BAR KEMBALI BERSIH (HANYA BACK DAN JUDUL) */}
      <div className="top-app-bar shrink-0">
        <button className="back-btn" onClick={() => go('dashboard')} aria-label="Kembali">
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Keranjang Saya</h2>
      </div>

      {/* SCROLL CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-[100px] flex flex-col gap-4">

        {cartItems.length === 0 ? (
          /* TAMPILAN JIKA KERANJANG KOSONG */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 rounded-geo-xl bg-surface border border-line flex items-center justify-center mb-5">
              <i className="bi bi-basket2 text-4xl text-placeholder" />
            </div>
            <h3 className="text-base font-extrabold text-ink">Keranjang Kamu Masih Kosong</h3>
            <p className="text-[13px] text-placeholder mt-1.5 leading-relaxed">
              Mulai kumpulkan dan lakukan pemindaian botol PET atau kardus bekas pertamamu!
            </p>
            <button className="btn-primary mt-6 w-auto px-6 py-2.5" onClick={() => go('kamera')}>
              Scan Sekarang
            </button>
          </div>
        ) : (
          /* TAMPILAN JIKA KERANJANG TERISI */
          <>
            {/* PROGRESS PICKUP CARD (Menggunakan token rounded-geo-md agar senada) */}
            <section className="bg-white border border-line rounded-geo-md p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-extrabold text-ink">Progress Pickup ({selectedItems.length} Terpilih)</span>
                <span className="text-[13px] font-extrabold text-ink">
                  {formatWeight(totalWeightKg)} / {MIN_PICKUP_WEIGHT_KG} kg
                </span>
              </div>

              {/* Progress Bar Line */}
              <div className="w-full bg-[#E9ECEF] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Status Indicator text info */}
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold mt-0.5">
                {totalWeightKg >= MIN_PICKUP_WEIGHT_KG ? (
                  <>
                    <i className="bi bi-check-circle-fill text-[#137333]" />
                    <span className="text-[#137333]">Siap untuk Request Pickup</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-exclamation-circle-fill text-amber-600" />
                    <span className="text-amber-600">Minimum {MIN_PICKUP_WEIGHT_KG} kg item terpilih untuk request</span>
                  </>
                )}
              </div>
            </section>

            {/* LIST DAFTAR SAMPAH */}
            <section className="flex flex-col gap-2.5">

              {/* HEADER SUB-BAR DENGAN TOMBOL BULK ERASE DI SEBELAH KANAN TEKS */}
              <div className="flex items-center justify-between w-full">
                <h3 className="text-[12px] text-placeholder font-bold uppercase tracking-wide">
                  Daftar Sampah ({cartItems.length})
                </h3>
                <button
                  onClick={handleBulkErase}
                  disabled={selectedItems.length === 0}
                  className="text-[11px] font-extrabold text-accent hover:text-accent/80 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
                  aria-label="Hapus semua item terpilih"
                >
                  <i className="bi bi-trash text-[13px]" />
                  <span>Hapus Terpilih ({selectedItems.length})</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {cartItems.map((item) => {
                  const isChecked = !!checkedItems[item.id];

                  return (
                    /* CARD BOX ITEM - DISAMAKAN KE CORNER BUTTON (rounded-geo-md) */
                    <div
                      key={item.id}
                      className={`bg-white border rounded-geo-md p-4 flex gap-3 relative transition-all hover:shadow-sm
                        ${isChecked ? 'border-primary bg-primary-tint/10' : 'border-line'}`}
                    >
                      {/* KOMPONEN CHECKBOX */}
                      <div className="flex items-start pt-1 shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCheck(item.id)}
                          className="w-5 h-5 accent-primary cursor-pointer rounded"
                          id={`check-${item.id}`}
                        />
                      </div>

                      {/* Konten Utama Card */}
                      <div className="flex-1 flex flex-col gap-3">
                        {/* Header Item Row */}
                        <div className="flex justify-between items-start">
                          <label htmlFor={`check-${item.id}`} className="cursor-pointer">
                            <h4 className="text-[14px] font-extrabold text-ink">{item.name || item.category}</h4>
                            <p className="text-[11px] font-semibold text-placeholder mt-0.5">
                              {item.category?.toLowerCase() === 'plastic' ? 'Botol PET' : 'Karton'}
                            </p>
                          </label>
                          <button
                            onClick={() => handleRemoveSingle(item.id)}
                            className="text-accent hover:text-accent/80 p-1 transition-colors"
                            aria-label="Hapus item secara individu"
                          >
                            <i className="bi bi-trash text-base" />
                          </button>
                        </div>

                        {/* Badge Row */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-0.5 rounded-geo-xs text-[10px] font-extrabold
                            ${item.grade?.includes('A')
                              ? 'bg-[#E6FBF0] text-[#00A859]'
                              : 'bg-[#E6F0FA] text-[#0064FA]'}`}
                          >
                            {item.grade || 'Grade B'}
                          </span>
                          <span className="px-2 py-0.5 rounded-geo-xs text-[10px] font-semibold bg-[#F8F9FA] border border-line text-ink">
                            {item.weightRange === 'sedikit' && 'Sedikit (< 1 kg)'}
                            {item.weightRange === 'sedang' && 'Sedang (1 - 2 kg)'}
                            {item.weightRange === 'banyak' && 'Banyak (2 - 5 kg)'}
                            {item.weightRange === 'sangat_banyak' && 'Sangat Banyak (> 5 kg)'}
                            {!item.weightRange && 'Sedang (1 - 2 kg)'}
                          </span>
                        </div>

                        {/* Estimasi Grid Metric Specs */}
                        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-line/60 text-center">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-placeholder font-medium">Estimasi Berat</span>
                            <span className="text-[12px] font-extrabold text-ink mt-0.5">
                              {formatWeight(item.estimatedWeightKg || 0)}
                            </span>
                          </div>
                          <div className="flex flex-col border-x border-line/60">
                            <span className="text-[10px] text-placeholder font-medium">Estimasi Poin</span>
                            <span className="text-[12px] font-extrabold text-[#00A859] mt-0.5">
                              {formatPoints(item.estimatedPoints || 0)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-placeholder font-medium">Estimasi Harga</span>
                            <span className="text-[12px] font-extrabold text-ink mt-0.5">
                              {formatRupiah(item.estimatedPrice || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>

            {/* FOOTER CALLOUT INFO (Menggunakan token rounded-geo-md) */}
            <div className="flex items-start gap-2.5 p-3.5 bg-[#F4F6F8] border border-line rounded-geo-md">
              <i className="bi bi-info-circle text-[#0064FA] text-base shrink-0 mt-0.5" />
              <p className="text-[11px] text-placeholder font-medium leading-relaxed">
                Seluruh nilai di atas merupakan estimasi. Berat aktual akan diverifikasi oleh pengepul saat pickup.
              </p>
            </div>

            {/* TOMBOL REQUEST PICKUP: TENGAH, DIPERPANJANG FULL WIDTH */}
            <div className="mt-3 flex justify-center w-full">
              <button
                onClick={handleRequestPickup}
                disabled={!canRequest}
                className="btn-primary w-full py-3.5 text-[14px] font-extrabold disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all rounded-geo-md"
              >
                Request Pickup ({selectedItems.length} Item)
              </button>
            </div>
          </>
        )}

      </div>

      {/* BOTTOM NAVIGATION FIXED POSITION */}
      <div className="shrink-0">
        <BottomNav active="keranjang" />
      </div>
    </div>
  );
}