import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setProfile } from '../features/user/userSlice';

export default function Register() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch(setProfile({ name, phone }));
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
          placeholder="e.g. Budi Setiawan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
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
          />
        </div>

        <div className="text-xs text-placeholder mt-4 leading-relaxed">
          Preferensi reward & metode pencairan akan ditentukan di langkah berikutnya.
        </div>
      </div>

      <div className="p-6">
        <button className="btn-primary" onClick={handleSubmit}>Lanjutkan</button>
      </div>
    </div>
  );
}
