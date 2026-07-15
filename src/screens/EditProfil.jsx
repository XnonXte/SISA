// components/EditProfil.jsx
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setProfile } from '../features/user/userSlice';
import BottomNav from '../components/BottomNav';

export default function EditProfil() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const userData = useSelector((state) => state.user);

  // local state form
  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [tanggalLahir, setTanggalLahir] = useState(userData.tanggalLahir || '');
  // MENGGUNAKAN STATE DEFAULT KOSONG JIKA BELUM ADA DATA DI USER
  const [jenisKelamin, setJenisKelamin] = useState(userData.jenisKelamin || '');
  const [profilePhoto, setProfilePhoto] = useState(userData.profilePhoto || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(setProfile({
      name,
      email,
      phone,
      tanggalLahir,
      jenisKelamin,
      profilePhoto
    }));
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      go('profil');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative overflow-hidden">
      {/* Top App Bar */}
      <div className="w-full h-14 bg-white flex items-center justify-center border-b border-line shrink-0 relative">
        <button 
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink" 
          onClick={() => go('profil')}
          aria-label="Kembali"
        >
          <i className="bi bi-arrow-left text-lg" />
        </button>
        <h2 className="text-lg font-extrabold text-ink">Edit Profil</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[100px]">
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-primary border border-green-200 rounded-geo-flip text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <i className="bi bi-check-circle-fill" /> Profil Anda berhasil diperbarui!
          </div>
        )}

        {/* Input file tersembunyi */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Centered Avatar Area */}
        <div className="flex flex-col items-center mb-6">
          <div 
            onClick={handlePhotoClick}
            className="w-24 h-24 rounded-full bg-[#E2ECE9] flex items-center justify-center cursor-pointer relative transition-transform active:scale-95"
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Foto Profil" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-4xl font-extrabold text-[#0F8A5F]">
                {name ? name.charAt(0).toUpperCase() : 'G'}
              </span>
            )}
            <div className="absolute bottom-0 right-1 w-7 h-7 bg-white border border-line rounded-full flex items-center justify-center shadow-sm text-placeholder">
              <i className="bi bi-camera-fill text-sm" />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-placeholder mb-1.5 px-0.5">Nama Lengkap</label>
            <input 
              type="text" 
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan Nama Anda"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-placeholder mb-1.5 px-0.5">Email</label>
            <input 
              type="email" 
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-placeholder mb-1.5 px-0.5">Nomor Telepon</label>
            <input 
              type="tel" 
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+628123456789"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-placeholder mb-1.5 px-0.5">Tanggal Lahir</label>
            <div className="relative">
              <input 
                type="date" 
                className="input-field appearance-none w-full"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-placeholder">
                <i className="bi bi-calendar3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-placeholder mb-1.5 px-0.5">Jenis Kelamin</label>
            <div className="relative">
              <select 
                className="input-field appearance-none w-full bg-white"
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                required
              >
                {/* OPSI DEFAULT JIKA BELUM MEMILIH */}
                <option value="" disabled hidden>Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-placeholder">
                <i className="bi bi-chevron-down" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="btn-primary w-full mt-4"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>

      <div className="shrink-0">
        <BottomNav active="profil" />
      </div>
    </div>
  );
}