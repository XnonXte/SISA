import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { loginSuccess, setProfile } from '../features/user/userSlice';
import { apiRegister, apiSendOtp } from '../services/api';
import ProgressStepper from '../components/ProgressStepper';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_CODE = '123456';

export default function Register() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();

  const [step, setStep] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCount, setResendCount] = useState(0);

  const emailValid = useMemo(() => EMAIL_RE.test(email.trim()), [email]);
  const nameValid = name.trim().length > 0;

  // PERUBAHAN DI SINI: Validasi password baru (min 8 karakter, 1 huruf kapital, 1 huruf kecil, 1 angka)
  const passwordValid = 
    password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[a-z]/.test(password) && 
    /\d/.test(password);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSendOtp = nameValid && emailValid && !loading;
  const canCreateAccount = passwordValid && passwordsMatch && !loading;

  const handleSendOtp = async () => {
    if (!canSendOtp) return;

    setError(null);
    setLoading(true);

    const { data, error: apiError } = await apiSendOtp({ email: email.trim() });
    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Gagal mengirim OTP. Coba lagi.');
      return;
    }

    setOtp('');
    setResendCount(0);
    setStep('otp');
  };

  const handleResendOtp = async () => {
    if (resendCount >= 3) {
      setError('OTP maksimal dikirim ulang sebanyak 3 kali.');
      return;
    }

    setError(null);
    setLoading(true);

    const { data, error: apiError } = await apiSendOtp({ email: email.trim() });
    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Gagal mengirim ulang OTP.');
      return;
    }

    setOtp('');
    setResendCount((value) => value + 1);
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setError('OTP wajib diisi.');
      return;
    }

    if (otp.trim() !== OTP_CODE) {
      setError('OTP salah. Gunakan kode 123456 untuk testing.');
      return;
    }

    setError(null);
    setStep('password');
  };

  const handleRegister = async () => {
    if (!canCreateAccount) return;

    setError(null);
    setLoading(true);

    const { data, error: apiError } = await apiRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Pendaftaran gagal. Coba lagi.');
      return;
    }

    dispatch(loginSuccess(data));
    dispatch(setProfile({ name: data.name ?? name.trim(), email: data.email ?? email.trim() }));
    go('completeProfile');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step === 'email') {
      await handleSendOtp();
      return;
    }

    if (step === 'otp') {
      handleVerifyOtp();
      return;
    }

    await handleRegister();
  };

  return (
    <form className="flex flex-col h-full bg-surface" onSubmit={handleSubmit}>
      <div className="w-full h-14 bg-white flex items-center justify-center border-b border-line shrink-0 relative">
        <button
          type="button"
          onClick={() => {
            if (step === 'email') {
              go('login');
              return;
            }
            if (step === 'otp') {
              setStep('email');
              setError(null);
              return;
            }
            setStep('otp');
            setError(null);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink"
          aria-label="Kembali"
        >
          <i className="bi bi-arrow-left text-lg" />
        </button>
        <h2 className="text-lg font-extrabold text-ink">Pendaftaran Pengguna</h2>
      </div>

      <div className="flex-1 px-6 pt-8 overflow-y-auto">
        <ProgressStepper current={step === 'password' ? 2 : 1} />
        {step === 'email' && (
          <>
            <div className="flex flex-col items-center pb-6">
              <img
                src="/logo-mark-sisa.svg"
                alt="SISA"
                className="w-24 h-24 object-contain"
              />
              <img
                src="/logo-text-sisa.svg"
                alt="SISA"
                className="w-20 h-auto object-contain mt-2"
              />
            </div>

            <div className="text-xs text-placeholder font-medium mb-1">Nama Lengkap</div>
            <input
              type="text"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              disabled={loading}
            />

            <div className="text-xs text-placeholder font-medium mt-5 mb-1">Alamat Email</div>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="text-sm text-placeholder mb-2">Kode OTP telah dikirim ke</div>
            <div className="text-base font-bold text-ink">{email}</div>

            <div className="text-xs text-placeholder font-medium mt-6 mb-1">Kode OTP</div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-field tracking-[0.3em] text-center"
              disabled={loading}
            />

            <div className="mt-3 text-xs text-placeholder">
              Sisa kirim ulang: {Math.max(0, 3 - resendCount)} kali.
            </div>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="text-xs text-placeholder font-medium mb-1">Password</div>
            <div className="flex h-[52px] rounded-[10px] border border-line bg-white overflow-hidden relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 karakter (A-Z, a-z, 0-9)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border-none bg-transparent px-3.5 pr-12 font-sans text-[15px] text-ink outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-placeholder hover:text-ink transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-lg`} />
              </button>
            </div>

            <div className="text-xs text-placeholder font-medium mt-5 mb-1">Konfirmasi Password</div>
            <input
              type="password"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </>
        )}

        {error && (
          <div className="mt-4 text-xs text-danger font-semibold flex items-center gap-1.5">
            <i className="bi bi-exclamation-circle-fill" />
            {error}
          </div>
        )}
      </div>

      <div className="p-6">
        {step === 'email' && (
          <button type="submit" className="btn-primary" disabled={!canSendOtp || loading}>
            {loading ? <><i className="bi bi-arrow-repeat animate-spin mr-2" />Mengirim OTP...</> : 'Lanjutkan'}
          </button>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><i className="bi bi-arrow-repeat animate-spin mr-2" />Memverifikasi...</> : 'Verifikasi OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (resendCount >= 3) {
                  setStep('email');
                  setError(null);
                  setOtp('');
                  return;
                }
                handleResendOtp();
              }}
              className="text-sm font-semibold text-primary bg-transparent border-none"
              disabled={loading}
            >
              {resendCount >= 3 ? 'Kembali' : 'Kirim Ulang OTP'}
            </button>
          </div>
        )}

        {step === 'password' && (
          <button type="submit" className="btn-primary" disabled={!canCreateAccount || loading}>
            {loading ? <><i className="bi bi-arrow-repeat animate-spin mr-2" />Mendaftar...</> : 'Buat Akun'}
          </button>
        )}
      </div>
    </form>
  );
}