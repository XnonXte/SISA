import React, { useState } from 'react'; // Tambahkan useState
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import BottomNav from '../components/BottomNav';

const MIN_POINTS = 1500; // PRD: minimum penukaran = Rp 15.000, rate 1 poin = Rp 10
const MIN_RUPIAH = MIN_POINTS * 10;

const methods = [
  { id: 'gopay', label: 'GoPay', logoPath: '/gopay.png' },
  { id: 'ovo', label: 'OVO', logoPath: '/ovo.png' },
  { id: 'dana', label: 'Dana', logoPath: '/dana.png' },
  { id: 'pln', label: 'Token Listrik', logoPath: '/pln.png' },
];

export default function TukarPoin() {
  const { go } = useAppNavigation();
  const points = useSelector((state) => state.user.points) || 0;

  // State untuk kontrol pop-up gagal
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fungsi validasi klik metode
  const handleMethodClick = () => {
    if (points < MIN_POINTS) {
      setShowErrorModal(true);
    } else {
      go('konfirmasi');
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Tukar Poin</h2>
      </div>

      <div className="scroll-content px-6 pt-6 pb-[100px]">
        <div className="poin-card mb-7">
          <div className="text-xs text-muted font-bold uppercase">Saldo Tersedia</div>
          <div className="text-[36px] font-extrabold text-ink mt-1">{points} PT</div>
          <div className="text-[13px] font-semibold text-placeholder mt-1">
            ESTIMASI NILAI: IDR {(points * 10).toLocaleString('id-ID')}
          </div>
        </div>

        <div className="text-xs text-placeholder font-bold uppercase mb-3.5 tracking-wide">
          Pilih Metode Penarikan
        </div>

        {methods.map((m) => (
          <div
            key={m.id}
            onClick={handleMethodClick} // Diubah dari go('konfirmasi') ke fungsi validasi
            className="bg-white border border-line rounded-geo-flip h-[68px] px-4 flex items-center gap-4 cursor-pointer mb-3"
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src={m.logoPath} alt={m.label} className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 text-sm font-extrabold text-ink uppercase">{m.label}</div>
            <i className="bi bi-chevron-right text-base text-placeholder" />
          </div>
        ))}

        <div className="bg-white rounded-geo-sm p-4 mt-2 border border-primary border-l-4 border-l-primary flex flex-col gap-1.5">
          <div className="text-[11px] font-extrabold text-primary flex items-center gap-1.5">
            <i className="bi bi-info-circle-fill" /> KETENTUAN KHUSUS
          </div>
          <div className="text-xs text-muted leading-relaxed">
            Minimum batas penukaran instan adalah{' '}
            <span className="font-bold text-ink">{MIN_POINTS.toLocaleString('id-ID')} Poin</span>{' '}
            (≈ Rp {MIN_RUPIAH.toLocaleString('id-ID')}) per transaksi pencairan.
          </div>
        </div>
      </div>

      <BottomNav active="" />

      {/* Pop-up Gagal (Saldo Kurang) */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 w-80 text-center animate-pop-in mx-4">
            <div className="mb-4">
              <i className="bi bi-x-circle-fill text-red-500" style={{ fontSize: 56 }} />
            </div>
            <div className="text-[20px] font-extrabold text-ink">Poin Tidak Cukup</div>
            <div className="text-sm text-placeholder mt-2">
              Maaf, kamu butuh minimal <span className="font-bold text-ink">{MIN_POINTS.toLocaleString('id-ID')} Poin</span> untuk melakukan penukaran.
            </div>

            <button
              className="btn-primary mt-6 w-full bg-red-500 hover:bg-red-600 border-none"
              onClick={() => setShowErrorModal(false)}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}