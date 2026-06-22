import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setRewardPref } from '../features/user/userSlice';

const WALLETS = [
  { id: 'GoPay', logoPath: '/gopay.png' },
  { id: 'OVO', logoPath: '/ovo.png' },
  { id: 'Dana', logoPath: '/dana.png' },
];

export default function RewardPref() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const token = userData.token;

  const [selected, setSelected] = useState(userData.rewardType || 'ewallet');
  const [wallet, setWallet] = useState(userData.wallet || 'GoPay');
  const [account, setAccount] = useState(userData.ewalletAccount || '');

  const options = [
    { id: 'ewallet', title: 'E-Wallet', sub: 'GoPay, OVO, DANA', icon: 'bi bi-wallet2' },
    { id: 'listrik', title: 'Infrastruktur Utilitas', sub: 'Token Meteran Listrik', icon: 'bi bi-lightning-charge' },
  ];

  const isEwallet = selected === 'ewallet';
  const canConfirm = isEwallet ? account.trim().length >= 6 : true;

  const handleConfirm = () => {
    if (!canConfirm) return;
    dispatch(setRewardPref({
      rewardType: selected,
      wallet: isEwallet ? wallet : null,
      ewalletAccount: isEwallet ? account.trim() : null,
    }));
    go('dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-surface">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go(token ? 'profil' : 'register')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Setup Reward</h2>
      </div>

      <div className="flex-1 px-6 pt-8 overflow-y-auto">
        <div className="text-h1 text-ink">Tentukan rute konversi saldo.</div>
        <div className="text-sm text-muted mt-2">
          Parameter ini dapat diubah melalui menu pengaturan.
        </div>

        <div className="flex flex-col gap-4 mt-10">
          {options.map((opt) => {
            const active = selected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`h-20 rounded-geo-lg flex items-center px-4 gap-4 cursor-pointer transition-all
                  ${active ? 'border-2 border-accent bg-accent-tint' : 'border border-line bg-white'}`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-accent-tint2' : 'bg-surface-card'}`}>
                  <i className={opt.icon} style={{ fontSize: 22, color: active ? '#F5A623' : '#1A1A1A' }} />
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-ink">{opt.title}</div>
                  <div className="text-[13px] text-muted mt-0.5">{opt.sub}</div>
                </div>
                <div className={`text-[11px] font-bold tracking-wide ${active ? 'text-accent' : 'text-line'}`}>
                  {active ? 'AKTIF' : 'PILIH'}
                </div>
              </div>
            );
          })}
        </div>

        {isEwallet && (
          <div className="mt-7">
            <div className="text-xs text-placeholder font-bold uppercase tracking-wide mb-3">
              Hubungkan Akun E-Wallet
            </div>

            <div className="flex gap-2 mb-4">
              {WALLETS.map((w) => {
                const isSelected = wallet === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setWallet(w.id)}
                    className={`chip flex-1 ${isSelected ? 'active' : ''}`}
                  >
                    <img src={w.logoPath} alt={w.id} className="w-5 h-5 object-contain" />
                    <span className="text-[13px] font-bold">{w.id}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-placeholder font-medium mb-1">Nomor Akun {wallet}</div>
            <input
              type="tel"
              placeholder="812-3456-7890"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="input-field"
            />
          </div>
        )}

        {!isEwallet && (
          <div className="mt-6 bg-surface-card rounded-xl p-3.5 flex gap-2.5">
            <i className="bi bi-info-circle text-placeholder text-base shrink-0 mt-0.5" />
            <div className="text-xs text-muted leading-relaxed">
              Detail nomor meter listrik dapat ditambahkan nanti melalui menu pengaturan.
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-line">
        <button className="btn-primary" onClick={handleConfirm} disabled={!canConfirm}>
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
