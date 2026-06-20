import React from 'react';
import BottomNav from '../components/BottomNav';

const maskAccount = (acc) => {
  if (!acc) return null;
  const digits = acc.replace(/\s/g, '');
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 4)}••••${digits.slice(-3)}`;
};

export default function Profil({ go, userData }) {
  const { name, phone, wallet, rewardType, ewalletAccount, points } = userData;

  const cartItems = userData.cartItems || [];
  const isEwallet = rewardType !== 'listrik';
  const rewardIcon = isEwallet ? 'bi-wallet2' : 'bi-lightning-charge';
  const rewardTitle = isEwallet ? (wallet || 'E-Wallet') : 'Token Listrik';
  const maskedAccount = isEwallet ? maskAccount(ewalletAccount) : null;
  const rewardSub = isEwallet
    ? (maskedAccount || 'Nomor akun belum diatur')
    : 'Token Meteran Listrik';

  const menuItems = [
    { label: 'Riwayat Transaksi', icon: 'bi-clock-history', action: () => go('riwayat') },
    { label: 'Pusat Bantuan', icon: 'bi-question-circle', action: null },
    { label: 'Tentang SISA', icon: 'bi-info-circle', action: null },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      {/* Fake status bar tidak digunakan */}
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Profil</h2>
      </div>

      <div className="scroll-content" style={{ flex: 1, padding: '24px 24px 100px', overflowY: 'auto' }}>
        {/* Identity card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: '0px 18px 0px 18px', background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="bi bi-person-fill" style={{ fontSize: 30, color: '#fff' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name || 'Pengguna SISA'}
            </div>
            <div style={{ fontSize: 13, color: '#707070', marginTop: 2, fontWeight: 600 }}>
              {phone ? `+62 ${phone}` : 'Nomor HP belum diatur'}
            </div>
          </div>
        </div>

        {/* Points summary */}
        <div className="poin-card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#707070', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Total Poin Terkumpul</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1A1A1A', marginTop: 4 }}>{points} PT</div>
        </div>

        {/* Reward preference */}
        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>
          Metode Pencairan
        </div>
        <div
          style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '0px 16px 0px 16px', padding: 14, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, cursor: 'pointer' }}
          onClick={() => go('rewardPref')}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={`bi ${rewardIcon}`} style={{ fontSize: 20, color: '#1A1A1A' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A' }}>{rewardTitle}</div>
            <div style={{ fontSize: 12, color: '#707070', marginTop: 2 }}>{rewardSub}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#1DB954', letterSpacing: 0.5 }}>UBAH</span>
        </div>

        {/* Menu list */}
        <div style={{ fontSize: 12, color: '#9E9E9E', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>
          Lainnya
        </div>
        <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '0px 16px 0px 16px', overflow: 'hidden', marginBottom: 24 }}>
          {menuItems.map((item, i) => (
            <div
              key={item.label}
              onClick={item.action || undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < menuItems.length - 1 ? '1px solid #F0F0F0' : 'none',
                cursor: item.action ? 'pointer' : 'default',
              }}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: 18, color: '#1A1A1A', width: 20 }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{item.label}</span>
              <i className="bi bi-chevron-right" style={{ fontSize: 14, color: '#9E9E9E' }} />
            </div>
          ))}
        </div>

        <button className="btn-secondary" onClick={() => go('splash')}>
          <i className="bi bi-box-arrow-right" style={{ marginRight: 8 }} /> Keluar
        </button>
      </div>

      <BottomNav active="profil" go={go} cartCount={cartItems.length} />
    </div>
  );
}