import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import DesktopUnavailableView from './DesktopUnavailableView';
import KameraMobileView from './KameraMobileView';
import { useKameraController } from './useKameraController';

export default function Kamera() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const name = useSelector((state) => state.user.name);
  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const points = useSelector((state) => state.user.points);

  const firstName = name?.split(' ')[0] ?? 'Pelanggan';
  const avatarSrc =
    profilePhoto ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name || 'Pelanggan SISA'
    )}&backgroundColor=1db954&textColor=ffffff&radius=50`;
  const notificationCount = 0;

  const [isDesktopDevice] = useState(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    return (
      window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
      navigator.maxTouchPoints === 0
    );
  });

  const allowDesktopCamera = import.meta.env.VITE_ALLOW_DESKTOP_CAMERA === 'true';
  const controller = useKameraController({ dispatch, token, go });

  if (isDesktopDevice && !allowDesktopCamera) {
    return (
      <DesktopUnavailableView
        avatarSrc={avatarSrc}
        name={name}
        firstName={firstName}
        points={points}
        notificationCount={notificationCount}
        onProfile={() => go('profil')}
        onNotifications={() => {}}
        onPoints={() => go('tukarPoin')}
        onBack={() => go('dashboard')}
      />
    );
  }

  return <KameraMobileView controller={controller} onGoDashboard={() => go('dashboard')} />;
}
