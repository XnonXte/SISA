import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { addToCart, clearScanResult } from '../features/user/userSlice';
import { apiCalculateScanEstimate, calculateRangeEstimate, WEIGHT_RANGES } from '../services/api';

const WEIGHT_RANGE_LIST = Object.values(WEIGHT_RANGES);

function formatRupiah(value) {
  return `Rp${new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value)))}`;
}

function formatWeight(value) {
  return `${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)} kg`;
}

function formatPoints(value) {
  return `${new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value)))} PT`;
}

function WeightRangeCard({ range, selected, onSelect }) {
  const isSelected = selected === range.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(range.id)}
      className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-geo-sm border-2 transition-all duration-200 min-h-[96px]
        ${isSelected
          ? 'border-primary bg-primary-tint shadow-cta-primary/20'
          : 'border-line bg-white hover:border-primary/40'}`}
    >
      {isSelected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <i className="bi bi-check text-white text-[11px] font-bold" />
        </span>
      )}
      {range.minimumPickup && (
        <span className="absolute top-2 left-2 text-[9px] font-extrabold tracking-wide uppercase px-1.5 py-0.5 rounded-geo-xs bg-accent-tint2 text-accent border border-accent/30">
          Minimum Pickup
        </span>
      )}
      {range.icon && (
        <img src={range.icon} alt={range.label} className="w-10 h-10 mb-1" />
      )}
      <span className="text-[13px] font-extrabold text-ink">{range.label}</span>
      <span className="text-[11px] font-semibold text-placeholder">({range.range})</span>
    </button>
  );
}

function UnsupportedMaterialView({ onRescan }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="w-24 h-24 rounded-geo-xl bg-surface-card border border-line flex items-center justify-center mb-5">
        <i className="bi bi-question-lg text-4xl text-placeholder" />
      </div>
      <h3 className="text-lg font-extrabold text-ink">Material ini belum didukung oleh SISA.</h3>
      <p className="text-[13px] text-placeholder mt-2 leading-relaxed">
        Saat ini SISA hanya mendukung PET Bening dan Kardus. Silakan lakukan scan ulang.
      </p>
      <button className="btn-primary mt-6 w-auto px-8" onClick={onRescan}>
        <i className="bi bi-camera mr-2" />Scan Lagi
      </button>
    </div>
  );
}

function SuccessBottomSheet({ summary, onScanAgain, onViewCart }) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-t-[32px] px-6 pt-6 pb-8 animate-fade-up">
        <div className="w-10 h-1 rounded-full bg-line mx-auto mb-5" />
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-tint flex items-center justify-center mb-4">
            <i className="bi bi-check-circle-fill text-primary text-3xl" />
          </div>
          <h3 className="text-xl font-extrabold text-ink">Berhasil ditambahkan ke Keranjang</h3>
        </div>

        <div className="mt-5 border border-line rounded-geo-lg overflow-hidden">
          {[
            ['Material', summary.material],
            ['Grade', summary.grade],
            ['Perkiraan Berat', summary.weightRangeLabel],
            ['Estimasi Poin', formatPoints(summary.estimatedPoints)],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={`flex justify-between items-center px-4 py-3 text-[13px]
                ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <span className="text-muted font-semibold">{label}</span>
              <span className="font-extrabold text-ink">{value}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary mt-5" onClick={onScanAgain}>
          <i className="bi bi-camera mr-2" />Scan Lagi
        </button>
        <button className="btn-secondary mt-2.5" onClick={onViewCart}>
          <i className="bi bi-basket2 mr-2" />Lihat Keranjang
        </button>
      </div>
    </div>
  );
}

export default function HasilScan() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const scanResult = useSelector((state) => state.user.scanResult);

  const [weightRange, setWeightRange] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedSummary, setAddedSummary] = useState(null);

  useEffect(() => {
    if (!scanResult?.category || !weightRange) {
      setEstimate(null);
      return;
    }

    let cancelled = false;
    setEstimateLoading(true);

    apiCalculateScanEstimate({
      category: scanResult.category,
      grade: scanResult.grade,
      weightRange,
    }).then(({ data, error }) => {
      if (cancelled) return;
      setEstimateLoading(false);
      if (error || !data) {
        setEstimate(null);
        return;
      }
      setEstimate(data);
    });

    return () => { cancelled = true; };
  }, [scanResult?.category, scanResult?.grade, weightRange]);

  if (!scanResult) {
    go('kamera');
    return null;
  }

  const {
    imageBase64,
    category,
    material,
    subtype,
    confidence,
    grade,
    status,
    recycleCategory,
    icon,
    materialPrice,
  } = scanResult;

  const isUnsupported = status === 'rejected';
  const confidencePct = Math.round((confidence ?? 0) * 100);
  const isLowConfidence = confidencePct < 80;
  const selectedRange = weightRange ? WEIGHT_RANGES[weightRange] : null;
  const canAddToCart = !!weightRange && !!estimate && !estimateLoading && !isUnsupported;

  const handleBack = () => {
    dispatch(clearScanResult());
    go('dashboard');
  };

  const handleRescan = () => {
    dispatch(clearScanResult());
    go('kamera');
  };

  const handleAddToCart = () => {
    if (!canAddToCart || !estimate) return;

    const wasteItem = {
      name: material,
      category,
      grade,
      weightRange,
      icon: icon ?? 'bi-recycle',
      estimatedPoints: estimate.estimatedPoints,
      estimatedWeightKg: estimate.estimatedWeight,
      estimatedPrice: estimate.estimatedPrice,
      daysInCart: 0,
    };

    dispatch(addToCart(wasteItem));
    setAddedSummary({
      material,
      grade,
      weightRangeLabel: `${selectedRange.label} (${selectedRange.range})`,
      estimatedPoints: estimate.estimatedPoints,
    });
    setShowSuccess(true);
  };

  const handleSuccessScanAgain = () => {
    dispatch(clearScanResult());
    setShowSuccess(false);
    go('kamera');
  };

  const handleViewCart = () => {
    dispatch(clearScanResult());
    setShowSuccess(false);
    go('keranjang');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-surface relative">
      {/* Top App Bar */}
      <div className="top-app-bar">
        <button className="back-btn" onClick={handleBack} aria-label="Kembali">
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Hasil Scan</h2>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {isUnsupported ? (
          <UnsupportedMaterialView onRescan={handleRescan} />
        ) : (
          <>
            {/* Image Preview Card */}
            <div className="relative w-full aspect-[4/3] rounded-geo-lg overflow-hidden mt-2 bg-line">
              {imageBase64 ? (
                <img src={imageBase64} alt={material} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-card">
                  <i className="bi bi-image text-3xl text-placeholder" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-ink">AI {confidencePct}%</span>
              </div>
            </div>

            {/* Title & Badge */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-ink">{material}</h1>
                {grade && (
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-primary-tint text-primary rounded-full">
                    {grade}
                  </span>
                )}
              </div>
              {subtype && (
                <div className="flex items-center gap-1 text-[13px] text-placeholder mt-0.5 font-semibold">
                  <span>{subtype}</span>
                  <i className="bi bi-info-circle text-[11px]" />
                </div>
              )}
            </div>

            {/* Mini Specs Info Bar */}
            <div className="grid grid-cols-3 gap-2 mt-4 bg-white border border-line rounded-geo-md p-3 text-center">
              <div className="flex flex-col">
                <span className="text-[11px] text-placeholder font-semibold">Harga / kg</span>
                <span className="text-[13px] text-ink font-extrabold mt-0.5">
                  {formatRupiah(materialPrice || 0)}
                </span>
              </div>
              <div className="flex flex-col border-x border-line">
                <span className="text-[11px] text-placeholder font-semibold">Confidence</span>
                <span className="text-[13px] text-ink font-extrabold mt-0.5">{confidencePct}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-placeholder font-semibold">Kategori</span>
                <span className="text-[13px] text-ink font-extrabold mt-0.5 flex items-center justify-center gap-1">
                  <i className="bi bi-recycle text-primary text-[12px]" />
                  {recycleCategory || category}
                </span>
              </div>
            </div>

            {/* Weight Range Selector Section */}
            <div className="mt-5">
              <h3 className="text-[14px] font-extrabold text-ink">Perkiraan Jumlah Sampah Anda</h3>
              <p className="text-[12px] text-placeholder mt-0.5 leading-normal font-medium">
                Pilih perkiraan jumlah berat yang paling mendekati. Berat akhir akan diverifikasi oleh pengepul.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                {WEIGHT_RANGE_LIST.map((range) => (
                  <WeightRangeCard
                    key={range.id}
                    range={range}
                    selected={weightRange}
                    onSelect={setWeightRange}
                  />
                ))}
              </div>
            </div>

            {/* ================= ESTiMASi VALUE CONTAINER (STYLE MATCHED) ================= */}
            {estimate && !estimateLoading && (
              <div className="grid grid-cols-3 gap-2 bg-surface-card border border-line rounded-geo-md p-3 mt-4 text-center animate-fade-in">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-placeholder">Estimasi Berat</span>
                  <span className="text-[13px] font-extrabold text-ink">
                    {formatWeight(estimate.estimatedWeight)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 border-x border-line">
                  <span className="text-[11px] font-semibold text-placeholder">Estimasi Harga</span>
                  <span className="text-[13px] font-extrabold text-ink">
                    {formatRupiah(estimate.estimatedPrice)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-placeholder">Estimasi Poin</span>
                  <span className="text-[13px] font-extrabold text-ink">
                    {formatPoints(estimate.estimatedPoints)}
                  </span>
                </div>
              </div>
            )}

            {/* ================= TIPS AI SECTION (CONDITIONAL GRADE B ONLY) ================= */}
            {grade?.toString().toLowerCase().includes('b') && (
              <div className="flex items-start gap-2.5 p-3 bg-primary-tint border border-primary/20 rounded-geo-md mt-4">
                <i className="bi bi-lightbulb-fill text-primary text-base mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wide">Tips AI</span>
                  <p className="text-[12px] text-ink font-medium leading-normal">
                    Lepaskan tutup dan label botol agar peluang mendapatkan Grade A lebih tinggi.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                className="btn-primary w-full"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                <i className="bi bi-basket2 mr-2" />Tambah ke Keranjang
              </button>
              <button className="btn-secondary w-full" onClick={handleRescan}>
                <i className="bi bi-camera mr-2" />Scan Lagi
              </button>
            </div>
          </>
        )}
      </div>

      {/* Success Bottom Sheet Portal */}
      {showSuccess && addedSummary && (
        <SuccessBottomSheet
          summary={addedSummary}
          onScanAgain={handleSuccessScanAgain}
          onViewCart={handleViewCart}
        />
      )}
    </div>
  );
}