import React from 'react';
import { useSelector } from 'react-redux';

import Splash from './screens/Splash';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Register from './screens/Register';
import CompleteProfile from './screens/CompleteProfile';
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
  forgotPassword: ForgotPassword,
  register: Register,
  completeProfile: CompleteProfile,
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
    <div className="w-full h-screen bg-surface flex flex-col overflow-hidden">
      <Screen />
    </div>
  );
}
