import React from 'react';
import { useAppNavigation } from '../app/useAppNavigation';

const BUG_REPORT_URL = 'https://github.com/XnonXte/SISA/issues';
const DEVELOPER_EMAIL = 'quddussalam555@gmail.com';

export default function PusatBantuan() {
  const { go } = useAppNavigation();

  return (
    <div className="flex flex-col h-screen bg-surface">
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('profil')}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Pusat Bantuan</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-8">
        <div className="flex justify-start mb-6">
          <img
            src="/assets/Asset 1.png"
            alt="Ilustrasi pusat bantuan"
            className="w-full max-w-[300px] object-contain"
          />
        </div>
        <div className="text-h1 text-ink">Butuh bantuan?</div>
        <div className="text-sm text-muted mt-2 leading-relaxed">
          Pilih jalur yang paling sesuai untuk menghubungi tim pengembang atau melaporkan masalah.
        </div>

        <div className="mt-8 space-y-4">
          <a
            href={BUG_REPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="block bg-white border border-line rounded-geo-flip p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-accent-tint flex items-center justify-center shrink-0">
                <i className="bi bi-bug text-xl text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-extrabold text-ink">Laporkan masalah</div>
                <div className="text-xs text-muted mt-1 break-all">{BUG_REPORT_URL}</div>
              </div>
              <i className="bi bi-box-arrow-up-right text-placeholder text-sm mt-1" />
            </div>
          </a>

          <a
            href={`mailto:${DEVELOPER_EMAIL}`}
            className="block bg-white border border-line rounded-geo-flip p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-surface-card flex items-center justify-center shrink-0">
                <i className="bi bi-envelope text-xl text-ink" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-extrabold text-ink">Email developer</div>
                <div className="text-xs text-muted mt-1 break-all">{DEVELOPER_EMAIL}</div>
              </div>
              <i className="bi bi-box-arrow-up-right text-placeholder text-sm mt-1" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}