import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setScanResult } from '../features/user/userSlice';
import { apiScanImage } from '../services/api';
import TopBoard from '../components/TopBoard';

const DUMMY_QR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" shape-rendering="crispEdges">
  <rect width="128" height="128" rx="14" fill="#ffffff"/>
  <rect x="8" y="8" width="36" height="36" rx="6" fill="#111111"/>
  <rect x="16" y="16" width="20" height="20" rx="3" fill="#ffffff"/>
  <rect x="20" y="20" width="12" height="12" rx="2" fill="#111111"/>
  <rect x="84" y="8" width="36" height="36" rx="6" fill="#111111"/>
  <rect x="92" y="16" width="20" height="20" rx="3" fill="#ffffff"/>
  <rect x="96" y="20" width="12" height="12" rx="2" fill="#111111"/>
  <rect x="8" y="84" width="36" height="36" rx="6" fill="#111111"/>
  <rect x="16" y="92" width="20" height="20" rx="3" fill="#ffffff"/>
  <rect x="20" y="96" width="12" height="12" rx="2" fill="#111111"/>
  <rect x="56" y="14" width="8" height="8" fill="#111111"/>
  <rect x="56" y="30" width="8" height="8" fill="#111111"/>
  <rect x="72" y="22" width="8" height="8" fill="#111111"/>
  <rect x="56" y="54" width="8" height="8" fill="#111111"/>
  <rect x="72" y="54" width="8" height="8" fill="#111111"/>
  <rect x="88" y="54" width="8" height="8" fill="#111111"/>
  <rect x="56" y="70" width="8" height="8" fill="#111111"/>
  <rect x="72" y="70" width="8" height="8" fill="#111111"/>
  <rect x="88" y="70" width="8" height="8" fill="#111111"/>
  <rect x="56" y="86" width="8" height="8" fill="#111111"/>
  <rect x="72" y="86" width="8" height="8" fill="#111111"/>
  <rect x="88" y="86" width="8" height="8" fill="#111111"/>
  <rect x="56" y="102" width="8" height="8" fill="#111111"/>
  <rect x="72" y="102" width="8" height="8" fill="#111111"/>
  <rect x="88" y="102" width="8" height="8" fill="#111111"/>
</svg>`;

const DUMMY_QR_DATA_URI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(DUMMY_QR_SVG)}`;

// ─────────────────────────────────────────────────────────────
// CAMERA CONSTRAINTS
// ─────────────────────────────────────────────────────────────
const WEBCAM_CONSTRAINTS = {
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

function DesktopUnavailableView({ avatarSrc, name, firstName, points, notificationCount, onProfile, onNotifications, onPoints, onBack }) {
  return (
    <div
      dir="ltr"
      className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#F6F8F5] text-slate-900"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(49, 163, 84, 0.08), transparent 34%), radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 28%), linear-gradient(180deg, #FBFCFA 0%, #F2F5F1 100%)',
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-36 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <TopBoard
        avatarSrc={avatarSrc}
        name={name}
        firstName={firstName}
        points={points}
        notificationCount={notificationCount}
        onProfile={onProfile}
        onNotifications={onNotifications}
        onPoints={onPoints}
      />

      <main dir="ltr" className="scroll-content w-full px-0">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-6 pb-8 lg:px-8 lg:py-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">AI Scanner</h1>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <i className="bi bi-info-circle text-[11px]" />
              </span>
              Panduan Scan
            </button>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="px-5 py-8 lg:px-8 lg:py-10">
              <div className="mx-auto flex max-w-[820px] flex-col items-center">
                <div className="relative flex h-[220px] w-full items-center justify-center lg:h-[250px]">
                  <svg
                    viewBox="0 0 320 220"
                    className="h-full w-full max-w-[340px] drop-shadow-[0_18px_30px_rgba(15,23,42,0.08)]"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="monitorScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#EEF2F7" />
                      </linearGradient>
                      <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF7A7A" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>

                    <ellipse cx="160" cy="174" rx="74" ry="10" fill="rgba(148,163,184,0.16)" />
                    <rect x="77" y="48" width="166" height="108" rx="18" fill="#ffffff" stroke="#CBD5E1" strokeWidth="4" />
                    <rect x="89" y="60" width="142" height="84" rx="12" fill="url(#monitorScreenGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
                    <rect x="147" y="156" width="26" height="12" rx="4" fill="#CBD5E1" />
                    <rect x="126" y="168" width="68" height="8" rx="4" fill="#94A3B8" />

                    <circle cx="229" cy="140" r="19" fill="#FFFFFF" stroke="url(#slashGrad)" strokeWidth="4" />
                    <path d="M221 148 237 132" stroke="url(#slashGrad)" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                  <div className="pointer-events-none absolute left-1/2 top-[46%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500 shadow-inner">
                    <i className="bi bi-camera-fill text-[30px]" />
                  </div>
                </div>

                <h2 className="max-w-[760px] text-center text-[22px] font-extrabold leading-tight text-slate-900 lg:text-[24px]">
                  Fitur AI Scanner hanya dapat digunakan di perangkat mobile.
                </h2>
                <p className="mt-3 max-w-[720px] text-center text-[15px] leading-7 text-slate-500">
                  Fitur pemindaian sampah menggunakan kamera tidak tersedia pada desktop. Silakan gunakan aplikasi SISA di smartphone Anda untuk memindai sampah.
                </p>
              </div>

              <div className="mx-auto mt-8 grid max-w-[920px] gap-4 rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-5 lg:grid-cols-3">
                {[
                  {
                    icon: 'bi-camera-fill',
                    title: 'Akses kamera perangkat',
                    text: 'AI Scanner membutuhkan kamera untuk memindai sampah secara akurat.',
                  },
                  {
                    icon: 'bi-upc-scan',
                    title: 'Hasil lebih optimal',
                    text: 'Pencahayaan dan sudut pengambilan di mobile lebih memudahkan AI.',
                  },
                  {
                    icon: 'nature',
                    title: 'Pengalaman terbaik',
                    text: 'Kami menghadirkan pengalaman terbaik untuk kamu di aplikasi mobile.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-[18px] bg-white/75 p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      {item.title === 'Pengalaman terbaik' ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" aria-hidden="true">
                          <path
                            d="M18.5 4.5c-4.7.2-8.2 2.1-10.4 5.7-1.6 2.6-2.2 5.4-1.9 8.4.1.7.6 1.2 1.2 1.3 2.9.3 5.8-.3 8.4-1.9 3.6-2.2 5.5-5.7 5.7-10.4 0-.8-.6-1.4-1.4-1.4h-1.6Zm-8.7 12.3c1.7-2.8 4.2-4.9 7.4-6.4-2.1 2.5-4.4 4.7-7 6.5l-.4-.1Zm-3.1-1.6c2.1-4.7 5.9-7.8 11.4-9-4.8 2.5-8.4 5.9-10.9 10.2-.3-.4-.4-.8-.5-1.2Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <i className={`bi ${item.icon} text-[20px]`} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-6 max-w-[920px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-emerald-700">Unduh aplikasi SISA sekarang</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Pindai, pilah, dan tukar sampah jadi poin di mana saja!</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a href="/play_store.png" className="inline-flex" aria-label="Google Play">
                        <img src="/play_store.png" alt="Google Play badge" className="h-14 w-auto select-none" />
                      </a>
                      <a href="/app_store.png" className="inline-flex" aria-label="App Store">
                        <img src="/app_store.png" alt="App Store badge" className="h-14 w-auto select-none" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 lg:justify-end">
                    <div className="max-w-[170px] text-sm font-semibold leading-6 text-slate-600 lg:text-right">
                      Scan QR untuk mengunduh aplikasi
                    </div>
                    <div className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm">
                      <img src={DUMMY_QR_DATA_URI} alt="QR code dummy" className="h-28 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-8 py-3 text-sm font-bold text-emerald-600 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <i className="bi bi-arrow-left" />
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Kamera() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const name = useSelector((state) => state.user.name);
  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const points = useSelector((state) => state.user.points);
  const firstName = name?.split(' ')[0] ?? 'Customer';
  const avatarSrc = profilePhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'SISA Customer')}&backgroundColor=1db954&textColor=ffffff&radius=50`;
  const notificationCount = 0;
  const [isDesktopDevice] = useState(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    return window.matchMedia?.('(hover: hover) and (pointer: fine)').matches && navigator.maxTouchPoints === 0;
  });

  const webcamRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const frameRef = useRef(null);

  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);

  // ── CAMERA SETUP ────────────────────────────────────────────
  const onUserMedia = useCallback((stream) => {
    streamRef.current = stream;
    setCameraReady(true);
    setCameraError(null);

    const track = stream.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.() ?? {};
    setTorchSupported(!!capabilities.torch);
  }, []);

  const onUserMediaError = useCallback((err) => {
    setCameraError(err.message ?? 'Kamera tidak dapat diakses.');
    setCameraReady(false);
  }, []);

  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;

    try {
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch {
      setTorchSupported(false);
    }
  }, [torchOn]);

  useEffect(() => {
    return () => {
      const track = streamRef.current?.getVideoTracks()[0];
      if (track && torchOn) {
        track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => { });
      }
    };
  }, [torchOn]);

  // ── CROP TO SCAN FRAME ──────────────────────────────────────
  const cropToFrame = useCallback(() => {
    return new Promise((resolve) => {
      if (!frameRef.current || !webcamRef.current) {
        const fallback = webcamRef.current?.getScreenshot({ width: 1280, height: 720 });
        resolve(fallback ?? null);
        return;
      }

      const video = webcamRef.current.video;
      const frameEl = frameRef.current;

      if (!video || !video.videoWidth) {
        const fallback = webcamRef.current?.getScreenshot({ width: 1280, height: 720 });
        resolve(fallback ?? null);
        return;
      }

      // Gambar langsung dari elemen video ke canvas — resolusi native kamera
      const nativeW = video.videoWidth;
      const nativeH = video.videoHeight;

      const videoRect = video.getBoundingClientRect();
      const frameRect = frameEl.getBoundingClientRect();

      // Scale factor: dari ukuran tampilan ke resolusi native
      const scaleX = nativeW / videoRect.width;
      const scaleY = nativeH / videoRect.height;

      const cropX = Math.max(0, (frameRect.left - videoRect.left) * scaleX);
      const cropY = Math.max(0, (frameRect.top - videoRect.top) * scaleY);
      const cropW = Math.min(frameRect.width * scaleX, nativeW - cropX);
      const cropH = Math.min(frameRect.height * scaleY, nativeH - cropY);

      // Output canvas: upscale ke min 800px agar tidak blur di preview
      const OUTPUT_SIZE = Math.max(800, Math.round(cropW), Math.round(cropH));

      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');

      // imageSmoothingQuality tinggi agar interpolasi lebih tajam
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Gambar langsung dari video (bukan dari base64 screenshot)
      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    });
  }, []);

  // ── SHARED PIPELINE ─────────────────────────────────────────
  const processImage = useCallback(
    async (imageBase64) => {
      setScanning(true);
      setScanError(null);

      try {
        // Mengirimkan base64 asli langsung ke API tanpa modifikasi client-side
        const { data, error } = await apiScanImage(token, imageBase64);

        setScanning(false);

        if (error || !data) {
          setScanError(error ?? 'Gagal menghubungi server. Coba lagi.');
          return;
        }

        dispatch(
          setScanResult({
            imageBase64: imageBase64, // Menyimpan gambar asli di state
            category: data.category,
            estimatedPoints: data.estimatedPoints,
            confidence: data.confidence,
            grade: data.grade,
            status: data.status,
            anomalies: data.anomalies ?? [],
            instruction: data.instruction,
          })
        );

        localStorage.setItem('lastScan', JSON.stringify(data));
        go('hasilScan');
      } catch (err) {
        setScanning(false);
        setScanError('Gagal memproses gambar.');
      }
    },
    [dispatch, go, token]
  );

  // ── CAMERA CAPTURE ─────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || scanning) return;

    const croppedBase64 = await cropToFrame();
    if (!croppedBase64) return;
    await processImage(croppedBase64);
  }, [processImage, scanning]);

  // ── GALLERY PICK ────────────────────────────────────────────
  const handlePickFromStorage = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file || scanning) return;

      const reader = new FileReader();

      reader.onloadend = async () => {
        await processImage(reader.result);
      };

      reader.readAsDataURL(file);
    },
    [processImage, scanning]
  );

  if (isDesktopDevice) {
    return (
      <DesktopUnavailableView
        avatarSrc={avatarSrc}
        name={name}
        firstName={firstName}
        points={points}
        notificationCount={notificationCount}
        onProfile={() => go('profil')}
        onNotifications={() => { }}
        onPoints={() => go('tukarPoin')}
        onBack={() => go('dashboard')}
      />
    );
  }

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div className="relative h-screen bg-[#0A0A0A] flex flex-col overflow-hidden">

      {/* Webcam */}
      {!cameraError && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.92}
          videoConstraints={WEBCAM_CONSTRAINTS.video}
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: cameraReady ? 1 : 0, transition: 'opacity 0.4s' }}
        />
      )}

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePickFromStorage}
      />

      {/* Error state */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-20">
          <i className="bi bi-camera-video-off text-white/60 text-5xl mb-4" />
          <div className="text-white font-bold text-sm mb-2">
            Kamera tidak tersedia
          </div>
          <div className="text-white/60 text-xs">
            {cameraError}
          </div>
          <button
            onClick={() => go('dashboard')}
            className="mt-6 px-6 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-geo-xs"
          >
            Kembali
          </button>
        </div>
      )}

      {/* Top bar */}
      <div
        className="relative z-10 w-full h-20 flex items-center px-6 justify-between"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.85), transparent)',
        }}
      >
        <button
          onClick={() => go('dashboard')}
          className="px-4 py-2 border border-white/25 text-white text-[11px] font-bold rounded-geo-xs"
        >
          BATAL
        </button>

        {torchSupported && (
          <button
            onClick={toggleTorch}
            className={`px-4 py-2 border text-[11px] font-bold rounded-geo-xs ${torchOn
              ? 'bg-accent/80 border-accent text-ink'
              : 'border-white/25 text-white'
              }`}
          >
            <i className={`bi ${torchOn ? 'bi-lightning-fill' : 'bi-lightning'}`} />
          </button>
        )}
      </div>

      {/* Instruction */}
      <div className="relative z-10 text-center mt-4">
        <div className="text-sm font-bold text-primary">
          {scanning
            ? 'Menganalisis material...'
            : 'Arahkan ke objek atau pilih dari galeri'}
        </div>
      </div>

      {/* Scan frame */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div ref={frameRef} className="w-full max-w-[300px] aspect-square border-2 border-primary/60 rounded-geo-2xl relative">

          {!scanning && (
            <div className="absolute left-0 right-0 h-[3px] bg-primary animate-scan-line" />
          )}

          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-10 h-10 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Scan error */}
      {scanError && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-danger text-white text-xs px-4 py-2 rounded-geo-xs">
          {scanError}
        </div>
      )}

      {/* Actions */}
      <div className="relative z-10 pb-14 pt-10 flex flex-col items-center">

        <button
          onClick={handleCapture}
          disabled={scanning || !cameraReady}
          className="w-[72px] h-[72px] rounded-full bg-white border-8 border-white/30"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="mt-4 px-5 py-2 text-xs font-bold text-white border border-white/25 rounded-geo-xs bg-white/5"
        >
          Ambil dari Galeri
        </button>

      </div>
    </div>
  );
}