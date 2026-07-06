import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ProgressStepper from '../components/ProgressStepper';
import { setProfile } from '../features/user/userSlice';
import { apiUpdateProfile } from '../services/api';

export default function CompleteProfile() {
  const { go, back } = useAppNavigation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user);

  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Nama Lengkap wajib diisi.');
      return;
    }
    if (!username.trim()) {
      setError('Username wajib diisi.');
      return;
    }
    if (!phone || !phone.trim()) {
      setError('Nomor HP wajib diisi.');
      return;
    }

    setLoading(true);
    const { data, error: apiError } = await apiUpdateProfile({
      email: user.email,
      name: name.trim(),
      username: username.trim(),
      phone: phone.trim(),
      profilePhoto,
    });
    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Gagal menyimpan profil. Coba lagi.');
      return;
    }

    dispatch(setProfile({
      name: data.name,
      email: data.email,
      phone: data.phone,
      username: data.username,
      profilePhoto: data.profilePhoto,
    }));
    go('dashboard');
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="w-full h-14 bg-white flex items-center justify-center border-b border-line shrink-0 relative">
        <button
          type="button"
          onClick={() => back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink"
          aria-label="Kembali"
        >
          <i className="bi bi-arrow-left text-lg" />
        </button>
        <h2 className="text-lg font-extrabold text-ink">Lengkapi Profil</h2>
      </div>

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <ProgressStepper current={3} />
        <div className="text-center mb-6">
          <h1 className="text-lg font-extrabold text-ink">Lengkapi Profilmu</h1>
          <p className="text-xs text-placeholder mt-2">Informasi ini akan membantu kami memberikan pengalaman terbaik untukmu.</p>
        </div>

        <div className="flex flex-col items-center mb-4 gap-3">
          <div className="text-xs text-placeholder uppercase tracking-[0.24em] font-bold">Foto Profil (Opsional)</div>
          <label htmlFor="profile-photo" className="cursor-pointer relative w-28 h-28 rounded-full bg-[#EAF5EB] overflow-hidden border border-line flex items-center justify-center">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Foto Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="text-green-600 text-4xl">
                <i className="bi bi-person-circle" />
              </div>
            )}
            <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center text-green-600 shadow-sm">
              <i className="bi bi-camera-fill" />
            </div>
          </label>
          <input id="profile-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={loading} />
          <div className="text-xs text-placeholder">Unggah foto profil atau biarkan default</div>
        </div>

        <div className="bg-white rounded-geo-lg p-4 shadow-sm mb-4">
          <div className="text-sm font-bold text-ink mb-1">Informasi Pribadi</div>
          <div className="text-xs text-placeholder font-medium mt-2 mb-1">Nama Lengkap <span className="text-danger">*</span></div>
          <input type="text" className="input-field" placeholder="Contoh: Budi Santoso" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />

          <div className="text-xs text-placeholder font-medium mt-4 mb-1">Username <span className="text-danger">*</span></div>
          <input type="text" className="input-field" placeholder="Contoh: budisantoso123" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
          <div className="text-[12px] text-placeholder mt-2">Username akan digunakan untuk identitas kamu di aplikasi</div>
        </div>

        <div className="bg-white rounded-geo-lg p-4 shadow-sm mb-4">
          <div className="text-sm font-bold text-ink mb-1">Email</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
            <input type="email" className="input-field bg-surface-card" value={user.email} disabled />
              <i className="bi bi-check-circle-fill" /> Terverifikasi
            </div>
            <div className="text-[12px] text-placeholder">Email tidak dapat diubah</div>
          </div>
        </div>

        <div className="bg-white rounded-geo-lg p-4 shadow-sm mb-6">
          <div className="text-sm font-bold text-ink mb-1">Nomor HP <span className="text-danger">*</span></div>
          <div className="phone-input-wrapper mt-2">
            <PhoneInput
              international
              defaultCountry="ID"
              placeholder="812 3456 7890"
              className="w-full"
              inputClassName="input-field"
              countrySelectProps={{ className: 'text-ink' }}
              value={phone}
              onChange={setPhone}
              disabled={loading}
            />
          </div>
          <div className="text-[12px] text-placeholder mt-2">Nomor HP ini akan digunakan untuk penukaran poin ke e-wallet.</div>
        </div>

        {error && (
          <div className="mt-2 text-xs text-danger font-semibold flex items-center gap-1.5">
            <i className="bi bi-exclamation-circle-fill" />
            {error}
          </div>
        )}
      </div>

      <div className="p-6">
        <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? <><i className="bi bi-arrow-repeat animate-spin mr-2" />Menyimpan...</> : 'Simpan Profil'}
        </button>
      </div>
    </div>
  );
}
