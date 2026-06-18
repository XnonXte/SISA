import React, { useState } from 'react';

export default function Register({ go, userData, setUserData }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('GoPay');

  const wallets = [
    { id: 'GoPay', icon: 'bi bi-wallet2', color: '#00AED6' },
    { id: 'OVO', icon: 'bi bi-qr-code-scan', color: '#4C3494' },
    { id: 'Dana', icon: 'bi bi-credit-card-2-front-fill', color: '#118EEA' },
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;
    setUserData(u => ({ ...u, name: name.trim() || u.name, phone, wallet }));
    go('rewardPref');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA' }}>
      {/* Fake Status bar completely removed */}

      {/* Top bar */}
      <div style={{ width: '100%', height: 56, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E0E0E0', flexShrink: 0 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Buat Akun</h2>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginTop: 32, marginBottom: 4 }}>Nama Lengkap</div>
        <input className="input-field" type="text" placeholder="Nama kamu" value={name} onChange={e => setName(e.target.value)} />

        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginTop: 16, marginBottom: 4 }}>Nomor HP</div>
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

        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginTop: 20, marginBottom: 4 }}>Pilih E-Wallet</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {wallets.map(w => (
            <div key={w.id} className={`chip ${wallet === w.id ? 'active' : ''}`} onClick={() => setWallet(w.id)}>
              <i className={w.icon} style={{ marginRight: 6, color: wallet === w.id ? '#fff' : w.color }} /> {w.id}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #E0E0E0' }}>
        <button className="btn-primary" onClick={handleSubmit}>Daftar</button>
      </div>
    </div>
  );
}