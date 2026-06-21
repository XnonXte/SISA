import React, { useState } from 'react';

const WALLETS = [
  { id: 'GoPay', logoPath: '/gopay.png' },
  { id: 'OVO', logoPath: '/ovo.png' },
  { id: 'Dana', logoPath: '/dana.png' },
];

export default function RewardPref({ go, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.rewardType || 'ewallet');
  const [wallet, setWallet] = useState(userData.wallet || 'GoPay');
  const [account, setAccount] = useState(userData.ewalletAccount || '');

  const options = [
    { id: 'ewallet', title: 'E-Wallet', sub: 'GoPay, OVO, DANA', icon: 'bi bi-wallet2' },
    { id: 'listrik', title: 'Infrastruktur Utilitas', sub: 'Token Meteran Listrik', icon: 'bi bi-lightning-charge' },
  ];

  const isEwallet = selected === 'ewallet';
  // ONB-03: jika pilih e-wallet, wajib pilih provider + isi nomor akun saat itu juga.
  const canConfirm = isEwallet ? account.trim().length >= 6 : true;

  const handleConfirm = () => {
    if (!canConfirm) return;
    setUserData(u => ({
      ...u,
      rewardType: selected,
      wallet: isEwallet ? wallet : null,
      ewalletAccount: isEwallet ? account.trim() : null,
    }));
    go('dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA' }}>
      {/* Fake Status bar completely removed */}

      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('register')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Setup Reward</h2>
      </div>

      <div style={{ flex: 1, padding: '32px 24px 0', overflowY: 'auto' }}>
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
                  height: 80, borderRadius: '0px 20px 0px 20px',
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

        {/* Lanjutan form e-wallet — hanya muncul jika kategori "E-Wallet" dipilih (ONB-03) */}
        {isEwallet && (
          <div style={{ marginTop: 28, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              Hubungkan Akun E-Wallet
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {WALLETS.map(w => {
                const isSelected = wallet === w.id;
                return (
                  <div
                    key={w.id}
                    className={`chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setWallet(w.id)}
                    style={{
                      padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                      flex: 1, height: 40, borderRadius: 20,
                      border: isSelected ? '1.5px solid #1DB954' : '1.5px solid #EEEEEE',
                      background: isSelected ? '#E8F5E9' : '#EEEEEE',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <img src={w.logoPath} alt={w.id} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#1DB954' : '#9E9E9E' }}>{w.id}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 500, marginBottom: 4 }}>
              Nomor Akun {wallet}
            </div>
            <input
              type="tel"
              placeholder="812-3456-7890"
              value={account}
              onChange={e => setAccount(e.target.value)}
              className="input-field"
            />
          </div>
        )}

        {/* Token Listrik: hanya simpan preferensi kategori, detail nomor meter ditandai OQ-1 */}
        {!isEwallet && (
          <div style={{ marginTop: 24, background: '#F5F5F5', borderRadius: 12, padding: 14, display: 'flex', gap: 10 }}>
            <i className="bi bi-info-circle" style={{ color: '#9E9E9E', fontSize: 16, flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: '#707070', lineHeight: 1.5 }}>
              Detail nomor meter listrik dapat ditambahkan nanti melalui menu pengaturan.
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '24px', background: '#fff', borderTop: '1px solid #E0E0E0' }}>
        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={!canConfirm ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}