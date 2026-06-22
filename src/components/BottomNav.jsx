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
            <div key={tab.key} className="flex items-center justify-center">
              <button
                onClick={() => go(tab.screen)}
                aria-label="Scan Sampah"
                className="nav-scan-btn"
              >
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>SCAN</span>
              </button>
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
