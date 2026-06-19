import React, { useState } from 'react';

export default function Register({ go, userData, setUserData }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    setUserData(u => ({ ...u, name: name.trim() || u.name, phone }));
    go('rewardPref');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>
      {/* Fake status bar sudah dihapus total dari sini */}
      <div style={{ width: '100%', height: 56, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E0E0E0', flexShrink: 0 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Pendaftaran Pengguna</h2>
      </div>

      <div style={{ flex: 1, padding: '32px 24px 0' }}>
        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginBottom: 4 }}>Nama Lengkap Sesuai ID</div>
        <input
          type="text"
          placeholder="e.g. Budi Setiawan"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input-field"
        />

        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginTop: 20, marginBottom: 4 }}>Nomor Handphone Aktif</div>
        <div style={{ display: 'flex', height: 52, borderRadius: 10, border: '1px solid #E0E0E0', background: '#fff', overflow: 'hidden' }}>
          <div style={{ width: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EEEEEE', borderRight: '1px solid #E0E0E0', fontSize: 14, fontWeight: 700, color: '#1A1A1A', flexShrink: 0 }}>+62</div>
          <input
            type="tel"
            placeholder="812-3456-7890"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 14px', fontFamily: 'inherit', fontSize: 15, color: '#1A1A1A', outline: 'none' }}
          />
        </div>

        <div style={{ fontSize: 12, color: '#9E9E9E', marginTop: 16, lineHeight: 1.5 }}>
          Preferensi reward & metode pencairan akan ditentukan di langkah berikutnya.
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <button className="btn-primary" onClick={handleSubmit}>Lanjutkan</button>
      </div>
    </div>
  );
}
