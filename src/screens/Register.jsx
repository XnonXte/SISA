import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setProfile } from '../features/user/userSlice';
import { apiRegister } from '../services/api';
import { loginSuccess } from '../features/user/userSlice';

export default function Register() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    const { data, error: apiError } = await apiRegister({ name: name.trim(), phone });

    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Pendaftaran gagal. Coba lagi.');
      return;
    }
    dispatch(loginSuccess(data));
    // loginSuccess persists token + profile to Redux (store.js syncs to localStorage)
    dispatch(setProfile({ name: data.name ?? name.trim(), phone: data.phone ?? phone }));
    go('rewardPref');
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="w-full h-14 bg-white flex items-center justify-center border-b border-line shrink-0">
        <h2 className="text-lg font-extrabold text-ink">Pendaftaran Pengguna</h2>
      </div>

      <div className="flex-1 px-6 pt-8">
        <div className="text-xs text-placeholder font-medium mb-1">Nama Lengkap Sesuai ID</div>
        <input
          type="text"
          placeholder="Nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          disabled={loading}
        />

        <div className="text-xs text-placeholder font-medium mt-5 mb-1">Nomor Handphone Aktif</div>
        <div className="flex h-[52px] rounded-[10px] border border-line bg-white overflow-hidden">
          <div className="w-14 flex items-center justify-center bg-[#EEEEEE] border-r border-line text-sm font-bold text-ink shrink-0">
            +62
          </div>
          <input
            type="tel"
            placeholder="812-3456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 border-none bg-transparent px-3.5 font-sans text-[15px] text-ink outline-none"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mt-4 text-xs text-danger font-semibold flex items-center gap-1.5">
            <i className="bi bi-exclamation-circle-fill" />
            {error}
          </div>
        )}

        <div className="text-xs text-placeholder mt-4 leading-relaxed">
          Preferensi reward & metode pencairan akan ditentukan di langkah berikutnya.
        </div>
      </div>

      <div className="p-6">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading
            ? <><i className="bi bi-arrow-repeat animate-spin mr-2" />Mendaftar...</>
            : 'Lanjutkan'}
        </button>
      </div>
    </div>
  );
}
