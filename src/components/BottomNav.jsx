import React from 'react';

const tabs = [
  { id: 'home', label: 'HOME', icon: 'bi-house-fill', screen: 'dashboard' },
  { id: 'riwayat', label: 'RIWAYAT', icon: 'bi-clock-fill', screen: 'riwayat' },
  { id: 'scan', label: null, icon: 'bi-cpu-fill', screen: 'kamera' },
  { id: 'keranjang', label: 'KERANJANG', icon: 'bi-basket2-fill', screen: 'keranjang' },
  { id: 'profil', label: 'PROFIL', icon: 'bi-person-fill', screen: 'profil' },
];

export default function BottomNav({ active, go, cartCount = 0 }) {
  return (
    <div className="bottom-nav">
      {tabs.map(tab => {
         if (tab.id === 'scan') {
          return (
            <div key="scan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button className="nav-scan-btn" onClick={() => go('kamera')}>
                SCAN
              </button>
            </div>
          );
        }

        const isActive = active === tab.id;
        const showBadge = tab.id === 'keranjang' && cartCount > 0;

        return (
          <div key={tab.id} className={`nav-tab ${isActive ? 'active' : ''}`} onClick={() => go(tab.screen)} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <i className={`bi ${tab.icon}`} />
              {showBadge && (
                <span style={{
                  position: 'absolute', top: -4, right: -8, background: '#F5A623', color: '#fff',
                  fontSize: 9, fontWeight: 800, minWidth: 14, height: 14, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: '0 3px',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            {tab.label && <span>{tab.label}</span>}
          </div>
        );
      })}
    </div>
  );
}