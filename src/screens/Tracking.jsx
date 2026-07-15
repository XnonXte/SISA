import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { addPoints, setPickupHistory, clearPickupDraft } from '../features/user/userSlice';

export default function Tracking() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();

  const draft = useSelector(s => s.user.pickupDraft);
  const historyFromRedux = useSelector(s => s.user.pickupHistory);
  const history = historyFromRedux?.length
    ? historyFromRedux
    : JSON.parse(localStorage.getItem('pickupHistory') || '[]');

  // State trigger untuk re-render hitungan waktu setiap detik
  const [tick, setTick] = useState(0);

  // State untuk data simulasi palsu (selalu fresh menggunakan Date.now() saat komponen di-mount)
  const [fakeItem, setFakeItem] = useState(() => ({
    id: 'fake-simulation',
    status: 'DALAM_PROSES',
    name: 'Sampah Rumah Tangga (Simulasi)',
    estimatedPoints: 150,
    verifiedPoints: 150,
    date: new Date().toLocaleString('id-ID'),
    startTime: Date.now(),
    pointsAdded: false,
    count: 1
  }));

  // 1. LOGIKA SAAT CHECKOUT BARU
  useEffect(() => {
    if (draft && draft.items && draft.items.length > 0) {
      const newRecords = draft.items.map((item, idx) => ({
        id: Date.now() + idx,
        status: 'DALAM_PROSES',
        name: item.name,
        estimatedPoints: item.estimatedPoints,
        verifiedPoints: item.estimatedPoints,
        date: new Date().toLocaleString('id-ID'),
        startTime: Date.now(),
        pointsAdded: false,
        count: 1
      }));

      const next = [...newRecords, ...history];
      localStorage.setItem('pickupHistory', JSON.stringify(next));
      dispatch(setPickupHistory(next));

      localStorage.setItem('activeTrackingId', String(newRecords[0].id));
      dispatch(clearPickupDraft());
    }
  }, [draft, history, dispatch]);

  // PERBAIKAN: Hanya gunakan realItem jika ID pelacakan aktif benar-benar ditemukan & valid
  const activeId = localStorage.getItem('activeTrackingId');
  const realItem = history.find(item => String(item.id) === String(activeId));
  const currentItem = realItem || fakeItem;

  // 2. HITUNG PROGRESS BERDASARKAN TIMESTAMP
  const elapsed = currentItem && currentItem.status === 'DALAM_PROSES'
    ? Date.now() - (currentItem.startTime || 0)
    : currentItem && currentItem.status === 'SELESAI' ? 15000 : 0;

  const progressPercent = Math.min((elapsed / 15000) * 100, 100);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // 3. LOGIKA SELESAI OTOMATIS (15 DETIK)
  useEffect(() => {
    if (currentItem && currentItem.status === 'DALAM_PROSES' && elapsed >= 15000) {
      // Jika yang selesai adalah item simulasi
      if (currentItem.id === 'fake-simulation') {
        if (!currentItem.pointsAdded) {
          dispatch(addPoints(currentItem.estimatedPoints || 0));
          setFakeItem(prev => ({ ...prev, status: 'SELESAI', pointsAdded: true }));
        }
        return;
      }

      // Jika yang selesai adalah item asli dari checkout
      const currentHistory = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
      const nextHistory = currentHistory.map(item => {
        if (String(item.id) === String(currentItem.id)) {
          if (!item.pointsAdded) {
            dispatch(addPoints(item.estimatedPoints || 0));
          }
          return { ...item, status: 'SELESAI', pointsAdded: true };
        }
        return item;
      });

      localStorage.setItem('pickupHistory', JSON.stringify(nextHistory));
      dispatch(setPickupHistory(nextHistory));
      
      // PERBAIKAN: Hapus ID aktif agar kunjungan berikutnya kembali memicu simulasi baru
      localStorage.removeItem('activeTrackingId');
    }
  }, [elapsed, currentItem, dispatch]);

  // 4. PENENTUAN TAHAPAN DAN KONFIGURASI KONTEN UTAMA
  let activeStepIndex = 0;
  let currentHeaderTitle = "Pickup Dikonfirmasi";
  let currentSubTitle = "Mitra pengepul sedang menuju lokasi";

  if (progressPercent >= 100) {
    activeStepIndex = 4;
    currentHeaderTitle = "Pickup Selesai";
    currentSubTitle = "Poin berhasil ditambahkan ke akun Anda!";
  } else if (progressPercent >= 75) {
    activeStepIndex = 3;
    currentHeaderTitle = "Poin Masuk";
    currentSubTitle = "Menghitung akumulasi saldo akhir...";
  } else if (progressPercent >= 50) {
    activeStepIndex = 2;
    currentHeaderTitle = "Sampah Ditimbang";
    currentSubTitle = "Mitra sedang memverifikasi berat & kondisi";
  } else if (progressPercent >= 25) {
    activeStepIndex = 1;
    currentHeaderTitle = "Sampah Dijemput";
    currentSubTitle = "Mitra sedang mengambil sampah Anda";
  }

  const illustrationMap = {
    0: { icon: 'bi-clipboard-check-fill', animation: 'animate-pulse' },
    1: { icon: 'bi-truck', animation: 'animate-drive' },
    2: { icon: 'bi-speedometer', animation: 'animate-pulse' },
    3: { icon: 'bi-cash-coin', animation: 'animate-bounce' },
    4: { icon: 'bi-check-circle-fill', animation: 'scale-110' },
  };

  const currentIllustration = illustrationMap[activeStepIndex];

  const steps = [
    { label: 'Dikonfirmasi', icon: 'bi-check-lg' },
    { label: 'Dijemput', icon: 'bi-truck' },
    { label: 'Ditimbang', icon: 'bi-speedometer' },
    { label: 'Poin Masuk', icon: 'bi-cash-coin' },
  ].map((step, idx) => {
    let state = 'pending';
    if (idx < activeStepIndex) state = 'done';
    else if (idx === activeStepIndex) state = 'active';
    return { ...step, state };
  });

  const dotClass = {
    done: 'bg-primary text-white',
    active: 'bg-accent-tint2 border border-accent text-[12px] text-accent font-bold',
    pending: 'bg-[#F5F5F5] text-placeholder text-[12px]',
  };

  return (
    <div className="flex flex-col h-screen bg-surface-alt">
      {/* Top App Bar */}
      <div className="w-full h-14 bg-white flex items-center justify-between px-4 border-b border-[#F0F0F0] shrink-0">
        <button className="text-xl text-ink p-1" onClick={() => go('dashboard')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2 className="text-lg font-bold text-primary flex-1 text-center pr-8">
          {currentHeaderTitle} {progressPercent >= 100 && <i className="bi bi-check-circle-fill" />}
        </h2>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center overflow-y-auto">
        {/* Mitra Illustration Box */}
        <div className="w-full h-[200px] mt-8 flex items-center justify-center shrink-0">
          <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-primary-tint to-[#F1F8E9] flex items-center justify-center relative shadow-sm">
            
            <div className={`transition-all duration-500 ${currentIllustration.animation}`}>
              <i className={`bi ${currentIllustration.icon} text-primary`} style={{ fontSize: 64 }} />
            </div>

            {activeStepIndex === 1 && (
              <>
                <div className="absolute bottom-5 -left-7 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-dot-fade [animation-delay:0s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-dot-fade [animation-delay:0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-dot-fade [animation-delay:0.6s]" />
                </div>
                <div className="absolute top-2.5 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-ping-brand">
                  <i className="bi bi-geo-alt-fill text-white text-sm" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="text-xl font-bold text-ink text-center mt-6 leading-snug h-14 flex items-center justify-center">
          {currentSubTitle}
        </div>
        <div className="text-sm text-placeholder text-center mt-2 font-medium">
          {progressPercent >= 100 ? 'Proses Selesai' : `Waktu Berjalan: ${Math.floor(progressPercent)}%`}
        </div>

        {/* Progress Tracker */}
        <div className="flex w-full items-center mt-10 px-2">
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1.5 w-16">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${dotClass[step.state]}`}>
                  <i className={`bi ${step.icon}`} />
                </div>
                <div className="text-[10px] text-placeholder text-center font-medium">{step.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mb-5 transition-all duration-300 ${step.state === 'done' ? 'bg-primary' : 'bg-line'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Info Box Tips */}
        <div className="w-full bg-primary-tint rounded-xl p-3.5 mt-6 flex items-start gap-2.5">
          <i className="bi bi-lightbulb-fill text-primary text-lg shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#2E7D32] leading-relaxed">
            Siapkan sampah di depan pintu. Mitra akan langsung mengambil tanpa perlu masuk ke dalam rumah.
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-line">
        <button className="btn-primary" onClick={() => go('dashboard')}>Kembali ke Dashboard</button>
      </div>
    </div>
  );
}