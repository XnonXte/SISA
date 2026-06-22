import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { redeemPoints } from '../features/user/userSlice';

const REDEEM_PTS = 250;
const REDEEM_DEST = 'GoPay';

export default function Konfirmasi() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const points = useSelector((state) => state.user.points);
  const [showSuccess, setShowSuccess] = useState(false);
  const remaining = Math.max(points - REDEEM_PTS, 0);

  const handleConfirmRedeem = () => {
    dispatch(redeemPoints(REDEEM_PTS));
    setShowSuccess(true);
  };

  return (
    <div className="flex flex-col h-screen bg-surface-alt relative">
      <div className="w-full h-14 bg-white flex items-center px-4 border-b border-[#F0F0F0] shrink-0 relative">
        <div
          onClick={() => go('tukarPoin')}
          className="w-9 h-9 rounded-[10px] bg-[#F5F5F5] flex items-center justify-center cursor-pointer text-lg"
        >
          <i className="bi bi-arrow-left" />
        </div>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-ink">
          Konfirmasi Penukaran
        </h2>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        <div className="bg-accent-tint2 rounded-2xl p-5 mt-6 shadow-card-accent">
          <div className="text-[13px] font-bold text-placeholder uppercase tracking-wide mb-3.5 flex items-center gap-2">
            <i className="bi bi-receipt" /> Ringkasan Penukaran
          </div>
          {[
            ['Poin Ditukar', `${REDEEM_PTS} Poin`, 'text-accent'],
            ['Nilai Rupiah', `Rp ${(REDEEM_PTS * 10).toLocaleString('id-ID')}`, 'text-ink'],
            ['Tujuan', null, 'text-primary'],
            ['Nomor Akun', '0812-3456-7890', 'text-ink'],
          ].map(([label, val, colorClass], i) => (
            <div key={label} className={`flex justify-between items-center py-2.5 ${i > 0 ? 'border-t border-line/50' : ''}`}>
              <span className="text-[13px] text-placeholder">{label}</span>
              {label === 'Tujuan' ? (
                <span className={`text-sm font-bold ${colorClass}`}>
                  <i className="bi bi-wallet2 mr-1.5" />{REDEEM_DEST}
                </span>
              ) : (
                <span className={`text-sm font-bold ${colorClass}`}>{val}</span>
              )}
            </div>
          ))}
        </div>

        <div className="px-2 mt-6 text-center">
          <div className="text-xs text-placeholder leading-relaxed">
            Dana akan masuk ke akunmu dalam 1×24 jam kerja. Proses aman & terjamin.
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 bg-white border-t border-line">
        <button className="btn-primary" onClick={handleConfirmRedeem}>Tukar Sekarang</button>
        <button className="btn-secondary mt-3" onClick={() => go('dashboard')}>Batal</button>
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 w-80 text-center animate-pop-in">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: 56 }} />
            </div>
            <div className="text-[22px] font-extrabold text-ink">Penukaran Berhasil!</div>
            <div className="text-sm text-placeholder mt-2">
              Rp {(REDEEM_PTS * 10).toLocaleString('id-ID')} sedang dalam proses ke {REDEEM_DEST}.
            </div>

            <div className="mt-5 pt-4 border-t border-dashed border-line">
              <div className="text-xs text-placeholder font-semibold">Sisa Poin Kamu</div>
              <div className="text-[26px] font-extrabold text-primary mt-0.5">{remaining} Poin</div>
              <div className="text-xs text-placeholder mt-1">Terus kumpulkan untuk penukaran berikutnya 🌱</div>
            </div>

            <button className="btn-primary mt-6" onClick={() => go('dashboard')}>Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
}
