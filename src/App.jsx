import React from 'react';
import { useSelector } from 'react-redux';

import Splash from './screens/Splash';
import Login from './screens/Login';
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
import Keranjang from './screens/Keranjang';

const SCREENS = {
  splash: Splash,
  login: Login,
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
  keranjang: Keranjang,
};

export default function App() {
  const screen = useSelector((state) => state.navigation.current);
  const Screen = SCREENS[screen] || Splash;

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center md:p-4">
      {/* Container Mobile */}
      <div className="w-full max-w-[425px] h-full md:h-[92vh] bg-surface flex flex-col overflow-hidden shadow-2xl md:rounded-[32px] md:border md:border-line">
        <Screen />
      </div>
    </div>
  );
}
