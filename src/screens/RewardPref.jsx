import React, { useState } from 'react';

export default function RewardPref({ go, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.rewardType || 'ewallet');

  const options = [
    { id: 'ewallet', title: 'E-Wallet', sub: 'GoPay, OVO, DANA', icon: 'bi bi-wallet2' },
    { id: 'listrik', title: 'Infrastruktur Utilitas', sub: 'Token Meteran Listrik', icon: 'bi bi-lightning-charge' },
  ];

  const handleConfirm = () => {
    setUserData(u => ({ ...u, rewardType: selected }));
    go('dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 844, background: '#FAFAFA' }}>
      <div className="status-bar"><span>9:41</span><span>●●●</span></div>

      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('register')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Reward</h2>
      </div>

      <div style={{ flex: 1, padding: '32px 24px 0' }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2, letterSpacing: -0.5 }}>
          Tentukan rute konversi saldo.
        </div>
        <div style={{ fontSize: 14, color: '#707070', marginTop: 8 }}>
          Parameter ini dapat diubah melalui menu pengaturan.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
          {options.map(opt => {
            const active = selected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  height: 80,
                  borderRadius: '0px 20px 0px 20px',
                  border: active ? '2px solid #F5A623' : '1px solid #E0E0E0',
                  background: active ? '#FFFCF7' : '#fff',
                  display: 'flex', alignItems: 'center', padding: '0 16px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  gap: 16,
                }}
              >
                <div style={{ width: 44, height: 44, background: active ? '#FFF8E1' : '#F0F0F0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={opt.icon} style={{ fontSize: 22, color: active ? '#F5A623' : '#1A1A1A' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{opt.title}</div>
                  <div style={{ fontSize: 13, color: '#707070', marginTop: 3 }}>{opt.sub}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#F5A623' : '#E0E0E0', letterSpacing: 0.5 }}>
                  {active ? 'AKTIF' : 'PILIH'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <button className="btn-primary" onClick={handleConfirm}>Konfirmasi Rute</button>
        <div style={{ fontSize: 11, color: '#9E9E9E', textAlign: 'center', marginTop: 14, lineHeight: 1.4 }}>
          Proses verifikasi mutu & pencairan maks. 1×24 jam operasional.
        </div>
      </div>
      <div className="home-indicator" />
    </div>
  );
}
