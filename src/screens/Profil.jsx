import React from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

const maskAccount = (acc) => {
  if (!acc) return null;
  const digits = acc.replace(/\s/g, '');
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 4)}••••${digits.slice(-3)}`;
};

export default function Profil() {
  const { go, reset } = useAppNavigation();
  const userData = useSelector((state) => state.user);
  const { name, phone, wallet, rewardType, ewalletAccount, points } = userData;

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

  const handleLogout = () => {
    reset(); // clears navigation history and returns to splash
  };

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Profil</h2>
      </div>

      <div className="scroll-content px-6 pt-6 pb-[100px]">
        {/* Identity card */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-geo-flip bg-ink-soft flex items-center justify-center shrink-0">
            <i className="bi bi-person-fill text-white text-3xl" />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-ink truncate">{name || 'Pengguna SISA'}</div>
            <div className="text-[13px] text-muted mt-0.5 font-semibold">
              {phone ? `+62 ${phone}` : 'Nomor HP belum diatur'}
            </div>
          </div>
        </div>

        {/* Points summary */}
        <div className="poin-card mb-6">
          <div className="text-xs text-muted font-bold tracking-wide uppercase">Total Poin Terkumpul</div>
          <div className="text-[32px] font-extrabold text-ink mt-1">{points} PT</div>
        </div>

        {/* Reward preference */}
        <div className="text-xs text-placeholder font-bold uppercase mb-3 tracking-wide">
          Metode Pencairan
        </div>
        <div
          className="bg-white border border-line rounded-geo-flip p-3.5 flex items-center gap-3.5 mb-6 cursor-pointer"
          onClick={() => go('rewardPref')}
        >
          <div className="w-11 h-11 rounded-lg bg-surface-card flex items-center justify-center shrink-0">
            <i className={`bi ${rewardIcon} text-xl text-ink`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-ink">{rewardTitle}</div>
            <div className="text-xs text-muted mt-0.5">{rewardSub}</div>
          </div>
          <span className="text-[11px] font-extrabold text-primary tracking-wide">UBAH</span>
        </div>

        {/* Menu list */}
        <div className="text-xs text-placeholder font-bold uppercase mb-3 tracking-wide">
          Lainnya
        </div>
        <div className="bg-white border border-line rounded-geo-flip overflow-hidden mb-6">
          {menuItems.map((item, i) => (
            <div
              key={item.label}
              onClick={item.action || undefined}
              className={`flex items-center gap-3.5 px-4 py-3.5 ${i < menuItems.length - 1 ? 'border-b border-[#F0F0F0]' : ''} ${item.action ? 'cursor-pointer' : ''}`}
            >
              <i className={`bi ${item.icon} text-lg text-ink w-5`} />
              <span className="flex-1 text-sm font-semibold text-ink">{item.label}</span>
              <i className="bi bi-chevron-right text-sm text-placeholder" />
            </div>
          ))}
        </div>

        <button className="btn-secondary" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right mr-2" /> Keluar
        </button>
      </div>

      <BottomNav active="profil" />
    </div>
  );
}
