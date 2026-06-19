import React from 'react';

const tabs = [
  { id: 'home', label: 'HOME', icon: 'bi-house-fill', screen: 'dashboard' },
  { id: 'scan', label: null, icon: 'bi-qr-code-scan', screen: 'kamera' },
  { id: 'riwayat', label: 'RIWAYAT', icon: 'bi-clock-fill', screen: 'riwayat' },
  { id: 'profil', label: 'PROFIL', icon: 'bi-person-fill', screen: 'profil' },
];

export default function BottomNav({ active, go }) {
  return (
    <div className="bottom-nav">
      {tabs.map(tab => {
        if (tab.id === 'scan') {
          return (
            <div key="scan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button className="nav-scan-btn" onClick={() => go('kamera')}>
                <i className="bi bi-qr-code-scan" />
              </button>
            </div>
          );
        }
        const isActive = active === tab.id;
        return (
          <div key={tab.id} className={`nav-tab ${isActive ? 'active' : ''}`} onClick={() => go(tab.screen)}>
            <i className={`bi ${tab.icon}`} />
            {tab.label && <span>{tab.label}</span>}
          </div>
        );
      })}
    </div>
  );
}