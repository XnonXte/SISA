import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { loginSuccess } from '../features/user/userSlice';
import { apiLogin, getLoginLockoutStatus } from '../services/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GUEST_USER = {
    userId: 'guest',
    token: 'guest-token',
    accessToken: 'guest-token',
    name: 'Guest',
    username: 'guest',
    phone: '+628123456789',
    email: 'guest@email.com',
    points: 0,
    milestone: 1000,
};

export default function Login() {
    const { go } = useAppNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lockoutMsg, setLockoutMsg] = useState(null);

    const emailValid = EMAIL_RE.test(email.trim());
    const passwordValid = password.length >= 8;
    const canSubmit = emailValid && passwordValid && !loading && !lockoutMsg;

    useEffect(() => {
        if (!email.trim()) {
            setLockoutMsg(null);
            return;
        }

        const checkLockout = () => {
            const { locked, remainingMs } = getLoginLockoutStatus(email);
            if (locked) {
                const minutes = Math.ceil(remainingMs / 60000);
                setLockoutMsg(`Akun terkunci sementara. Coba lagi dalam ${minutes} menit.`);
            } else {
                setLockoutMsg(null);
            }
        };

        checkLockout();
        const interval = setInterval(checkLockout, 30_000);
        return () => clearInterval(interval);
    }, [email]);

    const handleSubmit = async (e) => {
        // Intercepts the HTML browser refresh behavior
        e.preventDefault();

        if (!canSubmit) return;

        setError(null);
        setLoading(true);

        const { data, error: apiError } = await apiLogin({
            email: email.trim(),
            password,
        });

        setLoading(false);

        if (apiError || !data) {
            setError(apiError ?? 'Login gagal. Coba lagi.');
            const { locked, remainingMs } = getLoginLockoutStatus(email);
            if (locked) {
                const minutes = Math.ceil(remainingMs / 60000);
                setLockoutMsg(`Akun terkunci sementara. Coba lagi dalam ${minutes} menit.`);
            }
            return;
        }

        dispatch(loginSuccess(data));
        go('dashboard');
    };

    const handleGuestLogin = () => {
        // Prefill the email field for guest and include it in the login payload
        setEmail(GUEST_USER.email || 'guest@email.com');
        setPassword('');
        dispatch(loginSuccess(GUEST_USER));
        go('dashboard');
    };

    return (
        <form className="flex flex-col h-full bg-surface" onSubmit={handleSubmit}>
            <div className="top-app-bar">
                <h2>Masuk ke Akun</h2>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-6 pt-8 overflow-y-auto">
                {/* Logo Section */}
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

                {/* Input Email */}
                <div className="text-xs text-placeholder font-medium mb-1">Alamat Email</div>
                <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    disabled={loading || !!lockoutMsg}
                />

                {/* Input Password */}
                <div className="text-xs text-placeholder font-medium mt-5 mb-1">Password</div>
                <div className="flex h-[52px] rounded-[10px] border border-line bg-white overflow-hidden relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 border-none bg-transparent px-3.5 pr-12 font-sans text-[15px] text-ink outline-none"
                        disabled={loading || !!lockoutMsg}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-placeholder hover:text-ink transition-colors"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        tabIndex={-1}
                    >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-lg`} />
                    </button>
                </div>

                {/* Lupa Password */}
                <div className="flex justify-end mt-2">
                    <button
                        type="button"
                        onClick={() => go('forgotPassword')}
                        className="text-xs text-placeholder font-medium bg-transparent border-none cursor-pointer hover:text-ink transition-colors"
                    >
                        Lupa Password?
                    </button>
                </div>

                {/* Error / Lockout Messages */}
                {(lockoutMsg || error) && (
                    <div className="mt-4 text-xs text-danger font-semibold flex items-center gap-1.5">
                        <i className="bi bi-exclamation-circle-fill shrink-0" />
                        <span>{lockoutMsg ?? error}</span>
                    </div>
                )}

                {/* Redirect to Register */}
                <div className="mt-8 text-center text-sm text-placeholder">
                    Belum punya akun?{' '}
                    <button
                        type="button"
                        onClick={() => go('register')}
                        className="text-primary font-bold bg-transparent border-none cursor-pointer hover:underline"
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-6 space-y-3">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!canSubmit}
                >
                    {loading ? (
                        <>
                            <i className="bi bi-arrow-repeat animate-spin mr-2" />
                            Memproses...
                        </>
                    ) : (
                        'Masuk'
                    )}
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleGuestLogin}
                    disabled={loading}
                >
                    Gunakan Guest Account
                </button>
            </div>
        </form>
    );
}