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
    if (!navigator.geolocation) {
      alert('Browser atau perangkat Anda tidak mendukung fitur deteksi lokasi GPS.');
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'id',
              },
            }
          );

          const data = await response.json();

          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`Koordinat GPS: ${latitude}, ${longitude}`);
          }
        } catch (error) {
          console.error('Gagal mengambil detail nama alamat:', error);
          setAddress(`Koordinat GPS: ${latitude}, ${longitude}`);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error('Error saat mendeteksi GPS:', error);
        setLocating(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Izin akses lokasi ditolak. Harap izinkan GPS pada browser Anda.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Informasi lokasi tidak tersedia. Coba nyalakan GPS perangkat Anda.');
            break;
          case error.TIMEOUT:
            alert('Waktu deteksi lokasi habis. Silakan coba lagi.');
            break;
          default:
            alert('Gagal mendeteksi lokasi saat ini.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('keranjang')}><i className="bi bi-arrow-left" /></button>
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
                Mendeteksi lokasi GPS riil...
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

      {/* FOOTER: Menyimpan data ke riwayat dan navigasi langsung diserahkan ke tracking tanpa pemicu interval di sini */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-line">
        <button
          className="btn-primary"
          onClick={() => {
            const history = JSON.parse(localStorage.getItem('pickupHistory') || '[]');

            // Generate ID unik untuk referensi pelacakan di Tracking.jsx
            const currentId = Date.now();

            history.unshift({
              id: currentId,
              name: schedule === 'sekarang' ? 'Penjemputan Instan' : `Jadwal (${slots[selectedSlot].name})`,
              date: new Date().toLocaleString('id-ID'),
              status: schedule === 'sekarang' ? 'DALAM_PROSES' : 'DIJADWALKAN',
              estimatedPoints: (JSON.parse(localStorage.getItem('lastScan') || '{}').estimatedPoints || 0),
              grade: (JSON.parse(localStorage.getItem('lastScan') || '{}').grade || '-'),
              material: (JSON.parse(localStorage.getItem('lastScan') || '{}').category || '-'),
              address
            });

            localStorage.setItem('pickupHistory', JSON.stringify(history));
            localStorage.setItem('activeTrackingId', String(currentId));

            go('tracking');
          }}
        >
          Konfirmasi Order
        </button>
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