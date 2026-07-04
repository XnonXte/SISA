import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';

export default function Splash() {
  const { go } = useAppNavigation();
  const { token, name } = useSelector((state) => state.user);

  useEffect(() => {
    let redirected = false;

    const performRedirect = () => {
      if (!redirected) {
        redirected = true;
        if (token && name) {
          go('dashboard');
        } else {
          go('login');
        }
      }
    };

    // Minimum 1 detik splash ditampilkan
    const minWait = setTimeout(() => {
      performRedirect();
    }, 1000);

    // Maximum 3 detik safety timeout
    const maxWait = setTimeout(() => {
      performRedirect();
    }, 3000);

    return () => {
      clearTimeout(minWait);
      clearTimeout(maxWait);
    };
  }, [token, name, go]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen px-5 bg-white">
      {/* Logo & Tagline */}
      <div className="flex flex-col items-center justify-center">
        <img src="/logo-mark-sisa.svg" alt="SISA" className="w-32 h-32 object-contain animate-pulse" />
        <img src="/logo-text-sisa.svg" alt="SISA" className="w-24 h-auto object-contain mt-1" />
        <div className="text-base font-medium text-ink/70 mt-4 text-center">
          Smart Integrated Sustainable Waste Management
        </div>
      </div>
    </div>
  );
}