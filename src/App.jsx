import React, { useState } from 'react';
import Splash from './screens/Splash';
import Register from './screens/Register';
import RewardPref from './screens/RewardPref';
import Kamera from './screens/Kamera';
import HasilScan from './screens/HasilScan';
import FormPickup from './screens/FormPickup';
import Tracking from './screens/Tracking';
import Dashboard from './screens/Dashboard';
import Riwayat from './screens/Riwayat';
import TukarPoin from './screens/TukarPoin';
import Konfirmasi from './screens/Konfirmasi';

const SCREENS = {
  splash: Splash,
  register: Register,
  rewardPref: RewardPref,
  kamera: Kamera,
  hasilScan: HasilScan,
  formPickup: FormPickup,
  tracking: Tracking,
  dashboard: Dashboard,
  riwayat: Riwayat,
  tukarPoin: TukarPoin,
  konfirmasi: Konfirmasi,
};

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [userData, setUserData] = useState({
    name: 'Budi Setiawan',
    phone: '',
    wallet: 'GoPay',
    rewardType: 'ewallet',
    points: 750,
    milestone: 1000,
    pickupPoints: 150,
  });

  const go = (s) => setScreen(s);

  const Screen = SCREENS[screen] || Splash;
  return (
    <div style={{ width: 390, minHeight: 844, background: '#FAFAFA', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Screen go={go} userData={userData} setUserData={setUserData} />
    </div>
  );
}
