import React from 'react';
import { useAppNavigation } from '../app/useAppNavigation';

export default function Tracking() {
  const { go } = useAppNavigation();

  const steps = [
    { label: 'Dikonfirmasi', icon: 'bi-check-lg', state: 'done' },
    { label: 'Dijemput', icon: 'bi-truck', state: 'active' },
    { label: 'Ditimbang', icon: 'bi-speedometer', state: 'pending' },
    { label: 'Poin Masuk', icon: 'bi-cash-coin', state: 'pending' },
  ];

  const dotClass = {
    done: 'bg-primary text-white',
    active: 'bg-accent-tint2 border border-accent text-[12px]',
    pending: 'bg-[#F5F5F5] text-placeholder text-[12px]',
  };

  return (
    <div className="flex flex-col h-screen bg-surface-alt">
      <div className="w-full h-14 bg-white flex items-center justify-center border-b border-[#F0F0F0] shrink-0">
        <h2 className="text-lg font-bold text-primary">
          Pickup Dikonfirmasi <i className="bi bi-check-circle-fill" />
        </h2>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center overflow-y-auto">
        {/* Mitra illustration */}
        <div className="w-full h-[200px] mt-8 flex items-center justify-center shrink-0">
          <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-primary-tint to-[#F1F8E9] flex items-center justify-center relative">
            <div className="animate-drive">
              <i className="bi bi-truck text-primary" style={{ fontSize: 64 }} />
            </div>
            <div className="absolute bottom-5 -left-7 flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-dot-fade [animation-delay:0s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-dot-fade [animation-delay:0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-dot-fade [animation-delay:0.6s]" />
            </div>
            <div className="absolute top-2.5 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-ping-brand">
              <i className="bi bi-geo-alt-fill text-white text-sm" />
            </div>
          </div>
        </div>

        <div className="text-xl font-bold text-ink text-center mt-6 leading-snug">
          Mitra pengepul sedang<br />menuju lokasi
        </div>
        <div className="text-sm text-placeholder text-center mt-2">
          Estimasi tiba: 15–20 menit
        </div>

        {/* Progress Tracker Horizontal */}
        <div className="flex w-full items-center mt-10 px-2">
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1.5 w-16">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${dotClass[step.state]}`}>
                  <i className={`bi ${step.icon}`} />
                </div>
                <div className="text-[10px] text-placeholder text-center">{step.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mb-5 ${i === 0 ? 'bg-primary' : 'bg-line'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Info box */}
        <div className="w-full bg-primary-tint rounded-xl p-3.5 mt-5 flex items-start gap-2.5">
          <i className="bi bi-lightbulb-fill text-primary text-lg shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#2E7D32] leading-relaxed">
            Siapkan sampah di depan pintu. Mitra akan langsung mengambil tanpa perlu masuk ke dalam rumah.
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-line">
        <button className="btn-primary" onClick={() => go('dashboard')}>Selesai</button>
      </div>
    </div>
  );
}
