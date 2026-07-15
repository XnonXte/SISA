// components/AlamatPickupPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setProfile } from '../features/user/userSlice';
import BottomNav from '../components/BottomNav';

export default function AlamatPickupPage() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  // Menggunakan pickupAddress sebagai penyimpanan alamat penjemputan utama
  const [address, setAddress] = useState(userData.pickupAddress || '');
  const [locating, setLocating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur deteksi lokasi GPS.');
      return;
    }

    setLocating(true);
    setSavedSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'id' } }
          );
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`Koordinat: ${latitude}, ${longitude}`);
          }
        } catch {
          setAddress(`Koordinat: ${latitude}, ${longitude}`);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert('Gagal mendeteksi lokasi. Pastikan izin akses lokasi Anda telah diaktifkan.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSave = () => {
    dispatch(setProfile({ pickupAddress: address }));
    setSavedSuccess(true);
    setTimeout(() => {
      go('profil');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative overflow-hidden">
      <div className="top-app-bar shrink-0">
        <button className="back-btn" onClick={() => go('profil')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Alamat Penjemputan</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[100px]">
        {savedSuccess && (
          <div className="mb-4 p-3.5 bg-green-50 text-primary text-xs font-bold rounded-geo-flip border border-green-200">
            <i className="bi bi-check-circle-fill mr-2" /> Alamat utama berhasil disimpan!
          </div>
        )}

        <div className="bg-white border border-line rounded-geo-flip p-4 mb-6">
          <label className="block text-xs font-bold text-placeholder uppercase tracking-wide mb-3 px-0.5">
            Detail Lokasi Penjemputan Anda
          </label>
          
          <textarea
            className="w-full h-24 p-3 border border-line rounded-xl text-xs leading-relaxed font-semibold text-ink resize-none focus:outline-none focus:border-primary"
            placeholder="Masukkan nama jalan, blok rumah, nomor unit, RT/RW, dan instruksi khusus..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className={`mt-3 w-full h-11 rounded-xl bg-white border border-[#0F8A5F] text-[#0F8A5F]
                        text-xs font-bold flex items-center justify-center gap-2
                        ${locating ? 'opacity-65' : 'active:bg-surface'}`}
          >
            {locating ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin" />
                Mencari Lokasi GPS...
              </>
            ) : (
              <>
                <i className="bi bi-geo-alt-fill" />
                Gunakan Lokasi Saat Ini
              </>
            )}
          </button>
        </div>

        <button 
          onClick={handleSave} 
          disabled={!address.trim()}
          className="w-full bg-[#0F8A5F] hover:bg-[#0c6e4b] text-white py-3.5 rounded-geo-flip font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
        >
          Simpan Alamat Utama
        </button>
      </div>

      <div className="shrink-0">
        <BottomNav active="profil" />
      </div>
    </div>
  );
}