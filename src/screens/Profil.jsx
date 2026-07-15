// components/Profil.jsx
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { logout, setProfile } from '../features/user/userSlice';
import { apiLogout } from '../services/api';
import BottomNav from '../components/BottomNav';

const maskAccount = (acc) => {
  if (!acc) return null;
  const digits = acc.replace(/\s/g, '');
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 4)}••••${digits.slice(-3)}`;
};

export default function Profil() {
  const { reset, go } = useAppNavigation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const userData = useSelector((state) => state.user);
  const { 
    name, 
    phone, 
    profilePhoto, 
    wallet, 
    rewardType, 
    rewardPhone,
    ewalletAccount,
    points, 
    token,
    tanggalBergabung 
  } = userData;

  const isEwallet = rewardType === 'ewallet';
  const rewardIcon = isEwallet ? 'bi-wallet2' : 'bi-lightning-charge';
  const rewardTitle = isEwallet ? (wallet || 'E-Wallet') : 'Token Listrik';
  const rewardAccount = isEwallet ? (rewardPhone || ewalletAccount || '') : '';
  const maskedAccount = isEwallet ? maskAccount(rewardAccount) : null;
  const rewardSub = isEwallet
    ? (maskedAccount || 'Nomor reward belum diatur')
    : 'Token Meteran Listrik';

  // Mengambil tanggal bergabung dinamis dari localStorage/Redux, dengan fallback otomatis ke bulan berjalan jika kosong
  const displayTanggalBergabung = React.useMemo(() => {
    if (tanggalBergabung) return tanggalBergabung;
    const opsi = { month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('id-ID', opsi);
  }, [tanggalBergabung]);

  // Daftar menu kategori Akun - Sudah disesuaikan (Menghapus Notifikasi & Mengubah Metode Pembayaran -> Metode Pencairan)
  const accountMenuItems = [
    { label: 'Edit Profil', icon: 'bi-person', action: () => go('editProfil') },
    { label: 'Alamat Pickup', icon: 'bi-geo-alt', action: () => go('alamatPickup') },
    { label: 'Metode Pencairan', icon: 'bi-credit-card', action: () => go('rewardPref') },
    { label: 'Keamanan', icon: 'bi-shield-check', action: () => go('keamanan') },
  ];

  // Daftar menu kategori Lainnya
  const otherMenuItems = [
    { label: 'Bantuan & FAQ', icon: 'bi-question-circle', action: () => go('pusatBantuan') },
    { label: 'Tentang SiSA', icon: 'bi-info-circle', action: () => go('tentangSisa') },
  ];

  const handleLogout = async () => {
    if (token) apiLogout(token).catch(() => { });
    dispatch(logout());
    reset();
    go('login');
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setProfile({ profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative overflow-hidden">
      {/* Top App Bar dengan Ikon Pengaturan di Pojok Kanan Sesuai Referensi */}
      <div className="top-app-bar shrink-0 relative justify-center">
        <h2 className="text-xl font-extrabold">Profil Saya</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[100px]">
        {/* Input file tersembunyi untuk mengubah foto profil */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Identity Section - Terpusat */}
        <div className="flex flex-col items-center text-center mb-8">
          <div 
            onClick={handlePhotoClick}
            className="w-24 h-24 rounded-full bg-[#E2ECE9] flex items-center justify-center cursor-pointer relative mb-4 transition-transform active:scale-95"
            title="Klik untuk mengubah foto profil"
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Foto Profil" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-4xl font-extrabold text-[#0F8A5F]">
                {name ? name.charAt(0).toUpperCase() : 'S'}
              </span>
            )}
            
            {/* Kamera badge kecil */}
            <div className="absolute bottom-0 right-1 w-7 h-7 bg-white border border-line rounded-full flex items-center justify-center shadow-md">
              <i className="bi bi-camera-fill text-muted text-sm" />
            </div>
          </div>
          
          <h3 className="text-xl font-extrabold text-ink">{name || 'Pengguna'}</h3>
          <p className="text-sm text-muted font-bold mt-1">{phone || '+62 ••• •••• ••••'}</p>
        </div>

        {/* Info Grid Box (Total Poin & Bergabung Dinamis) */}
        <div className="bg-[#F8FAF9] border border-line rounded-geo-flip p-4 mb-7 grid grid-cols-2 text-center">
          <div className="border-r border-[#EAEAEA] py-2">
            <div className="text-xs text-muted font-bold tracking-wide uppercase">Total Poin</div>
            <div className="text-lg font-extrabold text-[#0F8A5F] mt-1">{points.toLocaleString('id-ID')} PT</div>
          </div>
          <div className="py-2">
            <div className="text-xs text-muted font-bold tracking-wide uppercase">Bergabung</div>
            <div className="text-base font-extrabold text-ink mt-1">{displayTanggalBergabung}</div>
          </div>
        </div>

        {/* Kelompok Menu: Akun */}
        <div className="text-sm text-ink font-bold uppercase mb-3 tracking-wide px-1">
          Akun
        </div>
        <div className="bg-white border border-line rounded-geo-flip overflow-hidden mb-7">
          {accountMenuItems.map((item, i) => (
            <div
              key={item.label}
              onClick={item.action}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-surface/50 transition-colors
                ${i < accountMenuItems.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
            >
              <i className={`bi ${item.icon} text-lg text-muted w-6`} />
              <span className="flex-1 text-sm font-bold text-ink">{item.label}</span>
              <i className="bi bi-chevron-right text-sm text-placeholder" />
            </div>
          ))}
        </div>

        {/* Kelompok Menu: Lainnya */}
        <div className="text-sm text-ink font-bold uppercase mb-3 tracking-wide px-1">
          Lainnya
        </div>
        <div className="bg-white border border-line rounded-geo-flip overflow-hidden mb-7">
          {otherMenuItems.map((item, i) => (
            <div
              key={item.label}
              onClick={item.action}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-surface/50 transition-colors
                ${i < otherMenuItems.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
            >
              <i className={`bi ${item.icon} text-lg text-muted w-6`} />
              <span className="flex-1 text-sm font-bold text-ink">{item.label}</span>
              <i className="bi bi-chevron-right text-sm text-placeholder" />
            </div>
          ))}
        </div>

        {/* Tombol Keluar */}
        <button 
          className="w-full py-3.5 border border-red-200 bg-white text-red-500 rounded-geo-flip font-extrabold text-sm hover:bg-red-50/50 transition-colors mt-2" 
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>

      <div className="shrink-0">
        <BottomNav active="profil" />
      </div>
    </div>
  );
}