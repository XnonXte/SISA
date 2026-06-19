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
import Profil from './screens/Profil';

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
  profil: Profil,
};

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [userData, setUserData] = useState({
    name: 'Budi Setiawan',
    phone: '',
    wallet: 'GoPay',
    ewalletAccount: '',
    rewardType: 'ewallet',
    points: 750,
    milestone: 1000,
    estimatedPoints: 150,
    verifiedPoints: null,
  });

  const go = (s) => setScreen(s);

  const Screen = SCREENS[screen] || Splash;

  return (
    <div style={{ width: '100%', height: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Screen go={go} userData={userData} setUserData={setUserData} />
    </div>
  );
}