import React, { useState, useMemo } from 'react';
import BottomNav from '../components/BottomNav';

export default function Keranjang({ go, userData, setUserData }) {
  const cartItems = userData.cartItems || [];
  const [checked, setChecked] = useState(() => {
    // Default: semua item tercentang saat screen dibuka (sesuai brief "1 item otomatis tercentang", diperluas ke semua saat awal)
    const init = {};
    cartItems.forEach(item => { init[item.id] = true; });
    return init;
  });

  const toggleItem = (id) => {
    // Kalau cuma 1 item di keranjang, checkbox dikunci tercentang — tidak bisa di-uncheck
    if (cartItems.length === 1) return;
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = useMemo(
    () => cartItems.filter(item => checked[item.id]),
    [cartItems, checked]
  );
  const totalPoints = selectedItems.reduce((sum, item) => sum + item.estimatedPoints, 0);
  const canRequest = selectedItems.length > 0;

  const handleRequestPickup = () => {
    // Item yang tidak dicentang tetap in_cart — hanya selectedItems yang dibawa ke Form Pickup
    setUserData(u => ({
      ...u,
      pickupDraft: { source: 'cart', items: selectedItems },
      cartItems: (u.cartItems || []).filter(item => !checked[item.id]),
    }));
    go('formPickup');
  };

  const formatUsia = (daysAgo) => {
    if (daysAgo === 0) return 'Disimpan hari ini';
    if (daysAgo === 1) return 'Disimpan 1 hari lalu';
    return `Disimpan ${daysAgo} hari lalu`;
  };

  const isUrgent = (daysAgo) => daysAgo >= 11; // mendekati batas 14 hari, sinyal visual saja — bukan status baru

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAFA', position: 'relative' }}>
      <div className="top-app-bar">
        <button className="back-btn" onClick={() => go('dashboard')}><i className="bi bi-arrow-left" /></button>
        <h2>Keranjang Sampah</h2>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' }}>
          <i className="bi bi-basket2" style={{ fontSize: 56, color: '#BDBDBD' }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', marginTop: 16 }}>Keranjang Kamu Masih Kosong</div>
          <div style={{ fontSize: 13, color: '#9E9E9E', marginTop: 6, lineHeight: 1.5 }}>
            Mulai scan sampah pertamamu!
          </div>
          <button className="btn-primary" style={{ marginTop: 24, width: 'auto', padding: '0 24px' }} onClick={() => go('kamera')}>
            Scan Sekarang
          </button>
        </div>
      ) : (
        <>
          <div className="scroll-content" style={{ flex: 1, padding: '20px 24px 140px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            {cartItems.map((item) => {
              const isChecked = !!checked[item.id];
              const locked = cartItems.length === 1;
              const urgent = isUrgent(item.daysInCart);

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                    background: '#fff', border: isChecked ? '1.5px solid #1DB954' : '1px solid #E0E0E0',
                    borderRadius: '0px 16px 0px 16px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                    disabled={locked}
                    style={{ width: 20, height: 20, flexShrink: 0, accentColor: '#1DB954', cursor: locked ? 'default' : 'pointer' }}
                  />
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FAFAFA', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bi ${item.icon}`} style={{ fontSize: 22, color: '#1A1A1A' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.category}
                    </div>
                    <div style={{ fontSize: 11, color: urgent ? '#F5A623' : '#9E9E9E', marginTop: 4, fontWeight: 600 }}>
                      {formatUsia(item.daysInCart)}
                      {urgent && ' · segera ajukan pickup'}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#F5A623', flexShrink: 0 }}>
                    +{item.estimatedPoints} Poin
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px 24px 24px', background: '#fff', borderTop: '1px solid #E0E0E0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#707070', fontWeight: 600 }}>
                Total estimasi ({selectedItems.length} item dipilih)
              </span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>~{totalPoints} Poin</span>
            </div>
            <button
              className="btn-primary"
              onClick={handleRequestPickup}
              disabled={!canRequest}
              style={!canRequest ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              Request Pickup untuk Item Terpilih
            </button>
          </div>
        </>
      )}

      <BottomNav active="keranjang" go={go} cartCount={cartItems.length} />
    </div>
  );
}