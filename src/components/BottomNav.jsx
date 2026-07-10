import React from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';

const TABS = [
  { key: 'home',      label: 'HOME',      screen: 'dashboard', icon: 'bi-house' },
  { key: 'riwayat',  label: 'RIWAYAT',   screen: 'riwayat',   icon: 'bi-clock-history' },
  { key: 'scan',     label: null,         screen: 'kamera',    isScan: true },
  { key: 'keranjang',label: 'KERANJANG',  screen: 'keranjang', icon: 'bi-basket2', showBadge: true },
  { key: 'profil',   label: 'PROFIL',     screen: 'profil',    icon: 'bi-person' },
];

export default function BottomNav({ active }) {
  const { go } = useAppNavigation();
  const cartCount = useSelector((state) => state.user.cartItems.length);

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        if (tab.isScan) {
          return (
            <div key={tab.key} className="flex h-full flex-col items-center justify-center">
              <button
                onClick={() => go(tab.screen)}
                aria-label="Scan Sampah"
                className="nav-scan-btn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-scan-icon">
                  <path d="M7 3H4a1 1 0 0 0-1 1v3h2V5h2V3zm13 0h-3v2h2v2h2V4a1 1 0 0 0-1-1zM7 21H4a1 1 0 0 1-1-1v-3h2v2h2v2zm13-4v3a1 1 0 0 1-1 1h-3v-2h2v-2h2zM7 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                </svg>
              </button>
              <span className="nav-scan-label">Scan</span>
            </div>
          );
        }

        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => go(tab.screen)}
            className={`nav-tab ${isActive ? 'active' : ''}`}
          >
            <div className="relative">
              <i className={`bi ${tab.icon}`} />
              {tab.showBadge && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[9px] font-extrabold
                                 w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </div>
            {tab.label && <span>{tab.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
