import React, { useState } from 'react';
import { useAppNavigation } from '../app/useAppNavigation';

export default function FormPickup() {
  const { go } = useAppNavigation();
  const [schedule, setSchedule] = useState('sekarang');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);

  const slots = [
    { name: 'Shift Pagi', time: '08:00 – 12:00' },
    { name: 'Shift Sore', time: '13:00 – 17:00' },
    { name: 'H+1 Pagi', time: '08:00 – 12:00' },
  ];

  const handleScheduleChange = (val) => {
    setSchedule(val);
    if (val === 'jadwal') setSheetOpen(true);
  };

  const handleUseCurrentLocation = () => {
    // Dummy simulasi GPS untuk prototype — tidak ada integrasi API sungguhan
    setLocating(true);
    setTimeout(() => {
      setAddress('Jl. Merdeka No. 45, Klojen, Malang, Jawa Timur 65119');
      setLocating(false);
    }, 900);
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('hasilScan')}><i className="bi bi-arrow-left" /></button>
        <h2>Penjadwalan Logistik</h2>
      </div>

      <div className="scroll-content px-6 pt-6 pb-32">
        {/* Alamat Penjemputan */}
        <div className="mb-6">
          <div className="text-xs text-placeholder font-bold uppercase tracking-wide mb-2.5">
            Alamat Penjemputan
          </div>
          <textarea
            className="input-field h-[72px] pt-3.5 pb-3.5 resize-none leading-relaxed font-sans"
            placeholder="Masukkan alamat lengkap (jalan, RT/RW, kecamatan)..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className={`mt-2.5 w-full h-11 rounded-[10px] bg-white border border-primary text-primary
                        text-[13px] font-bold flex items-center justify-center gap-2
                        ${locating ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
          >
            {locating ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin" />
                Mendeteksi lokasi...
              </>
            ) : (
              <>
                <i className="bi bi-geo-alt-fill" />
                Gunakan Lokasi Saat Ini
              </>
            )}
          </button>
        </div>

        {/* Input Methods */}
        <div className="flex flex-col gap-3">
          <div
            onClick={() => handleScheduleChange('sekarang')}
            className={`p-4 bg-white rounded-xl cursor-pointer ${schedule === 'sekarang' ? 'border-2 border-primary' : 'border border-line'}`}
          >
            <div className="font-bold text-[15px]">
              <i className="bi bi-lightning-charge-fill text-primary mr-2" />Penjemputan Instan
            </div>
            <div className="text-xs text-muted mt-1">Mitra terdekat langsung datang ke lokasimu.</div>
          </div>
          <div
            onClick={() => handleScheduleChange('jadwal')}
            className={`p-4 bg-white rounded-xl cursor-pointer ${schedule === 'jadwal' ? 'border-2 border-primary' : 'border border-line'}`}
          >
            <div className="font-bold text-[15px]">
              <i className="bi bi-calendar-event text-accent mr-2" />
              Atur Shift Jadwal {schedule === 'jadwal' && `(${slots[selectedSlot].name})`}
            </div>
            <div className="text-xs text-muted mt-1">Pilih slot operasional logistik mingguan.</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-line">
        <button className="btn-primary" onClick={() => go('tracking')}>Konfirmasi Order</button>
      </div>

      {/* Sheet Modal */}
      {sheetOpen && (
        <div className="absolute inset-0 bg-black/40 z-[90]" onClick={() => setSheetOpen(false)} />
      )}
      <div
        className={`absolute left-0 w-full bg-white rounded-t-none p-6 border-t border-line z-[100]
                    transition-[bottom] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
        style={{ bottom: sheetOpen ? 0 : -400, borderRadius: '0px 32px 0px 0px' }}
      >
        <div className="text-sm font-extrabold text-ink mb-5 uppercase">Pilih Shift Operasional</div>
        <div className="flex flex-col gap-3">
          {slots.map((s, i) => (
            <div
              key={i}
              onClick={() => { setSelectedSlot(i); setSheetOpen(false); }}
              className={`h-[52px] rounded-geo-sm flex items-center px-4 justify-between cursor-pointer
                ${selectedSlot === i ? 'bg-accent-tint border border-accent' : 'bg-surface border border-line'}`}
            >
              <span className="text-sm font-bold">{s.name}</span>
              <span className="text-xs text-muted">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
