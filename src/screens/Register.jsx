import React, { useState } from 'react';

export default function Register({ go, userData, setUserData }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('GoPay');

  const wallets = [
    { id: 'GoPay', logoPath: '/gopay.png' },
    { id: 'OVO', logoPath: '/ovo.png' },
    { id: 'Dana', logoPath: '/dana.png' },
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;
    setUserData(u => ({ ...u, name: name.trim() || u.name, phone, wallet }));
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

        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginTop: 20, marginBottom: 4 }}>Pilih E-Wallet Utama</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {wallets.map(w => {
            const isSelected = wallet === w.id;
            return (
              <div
                key={w.id}
                className={`chip ${isSelected ? 'active' : ''}`}
                onClick={() => setWallet(w.id)}
                style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
              >
                <img
                  src={w.logoPath}
                  alt={w.id}
                  style={{ width: 20, height: 20, objectFit: 'contain' }}
                />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{w.id}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <button className="btn-primary" onClick={handleSubmit}>Lanjutkan</button>
      </div>
    </div>
  );
}