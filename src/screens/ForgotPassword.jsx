import React, { useState } from 'react';
import { useAppNavigation } from '../app/useAppNavigation';
import { apiResetPassword, apiSendPasswordResetOtp } from '../services/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_CODE = '123456';

export default function ForgotPassword() {
  const { go, back } = useAppNavigation();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSendOtp = async () => {
    if (!emailValid || loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    const { data, error: apiError } = await apiSendPasswordResetOtp({ email: email.trim() });
    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Gagal mengirim OTP. Coba lagi.');
      return;
    }

    setOtp('');
    setStep('otp');
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

  const handleResetPassword = async () => {
    if (!passwordValid || !passwordsMatch || loading) return;

    setError(null);
    setLoading(true);

    const { data, error: apiError } = await apiResetPassword({
      email: email.trim(),
      otp: otp.trim(),
      password,
    });

    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? 'Gagal mengubah password. Coba lagi.');
      return;
    }

    setSuccess('Password berhasil diubah. Silakan masuk dengan password baru.');
    setStep('success');
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

    if (step === 'password') {
      await handleResetPassword();
    }
  };

  return (
    <form className="flex flex-col h-full bg-surface" onSubmit={handleSubmit}>
      <div className="top-app-bar">
        <button type="button" className="back-btn" onClick={() => back()}>
          <i className="bi bi-arrow-left" />
        </button>
        <h2>Lupa Password</h2>
      </div>

      <div className="flex-1 px-6 pt-8 overflow-y-auto">
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

        {step === 'email' && (
          <>
            <div className="text-xs text-placeholder font-medium mb-1">Alamat Email</div>
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
          </>
        )}

        {step === 'password' && (
          <>
            <div className="text-xs text-placeholder font-medium mb-1">Password Baru</div>
            <input
              type="password"
              placeholder="Min. 8 karakter (A-Z, a-z, 0-9)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              disabled={loading}
            />

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

        {step === 'success' && success && (
          <div className="mt-4 rounded-[14px] border border-line bg-white p-4 text-sm text-ink font-medium">
            {success}
          </div>
        )}

        {(error && step !== 'success') && (
          <div className="mt-4 text-xs text-danger font-semibold flex items-center gap-1.5">
            <i className="bi bi-exclamation-circle-fill shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {step === 'email' && (
          <button type="submit" className="btn-primary" disabled={!emailValid || loading}>
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin mr-2" />
                Mengirim OTP...
              </>
            ) : (
              'Kirim OTP'
            )}
          </button>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              Verifikasi OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setError(null);
                setOtp('');
              }}
              className="text-sm font-semibold text-primary bg-transparent border-none"
              disabled={loading}
            >
              Ubah Email
            </button>
          </div>
        )}

        {step === 'password' && (
          <button type="submit" className="btn-primary" disabled={!passwordValid || !passwordsMatch || loading}>
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              'Simpan Password Baru'
            )}
          </button>
        )}

        {step === 'success' && (
          <button type="button" className="btn-primary" onClick={() => go('login')}>
            Kembali ke Login
          </button>
        )}
      </div>
    </form>
  );
}