import React from 'react';
import Webcam from 'react-webcam';

const WEBCAM_CONSTRAINTS = {
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

export default function KameraMobileView({ controller, onGoDashboard }) {
  const {
    webcamRef,
    fileInputRef,
    frameRef,
    torchOn,
    torchSupported,
    cameraReady,
    cameraError,
    permissionDenied,
    scanning,
    scanSuccess,
    scanError,
    showTips,
    setScanError,
    setShowTips,
    onUserMedia,
    onUserMediaError,
    toggleTorch,
    handleCapture,
    handlePickFromStorage,
  } = controller;

  // Attempt to trigger prompt, guide user if browser has hard-blocked it
  const handleRequestPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Try requesting access to trigger the native prompt
        await navigator.mediaDevices.getUserMedia({ video: true });
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (err) {
      // If code execution lands here, the browser actively blocked the prompt.
      // We must instruct the user to unblock it via the browser UI.
      alert(
        "Izin kamera diblokir oleh browser. Silakan klik ikon kamera/gembok di sebelah kiri alamat URL Anda untuk mengubah izin menjadi 'Izinkan' atau 'Allow'."
      );
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black text-white">
      {!cameraError && !scanSuccess && !scanError && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.92}
          videoConstraints={WEBCAM_CONSTRAINTS.video}
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: cameraReady ? 1 : 0,
            transition: 'opacity .35s',
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-black/35" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePickFromStorage}
      />

      {permissionDenied && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white px-6">
          <div className="w-full max-w-sm rounded-geo-2xl border border-neutral-100 bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
              <i className="bi bi-camera-video-off text-3xl text-danger" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Izin Kamera Diperlukan</h2>
            <p className="mt-3 px-2 text-sm leading-6 text-neutral-500">
              SISA memerlukan akses kamera untuk melakukan identifikasi sampah. Silakan aktifkan izin kamera dari pengaturan browser Anda.
            </p>
            <button
              onClick={handleRequestPermission}
              className="mt-6 w-full rounded-geo-md bg-primary py-3 font-bold text-ink transition hover:brightness-105"
            >
              Izinkan Kamera
            </button>
            <button
              onClick={onGoDashboard}
              className="mt-3 w-full py-2 text-sm font-semibold text-neutral-400 hover:text-neutral-600"
            >
              Nanti
            </button>
          </div>
        </div>
      )}

      {cameraError && !permissionDenied && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 px-8 text-center">
          <i className="bi bi-camera-video-off text-6xl text-white/50" />
          <div className="mt-5 text-lg font-bold text-white">Kamera Tidak Tersedia</div>
          <div className="mt-2 text-sm text-white/60">{cameraError}</div>
          <button
            onClick={onGoDashboard}
            className="mt-8 rounded-geo-md border border-white/15 px-6 py-3 text-sm font-bold text-white"
          >
            Kembali
          </button>
        </div>
      )}

      {scanning && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-black/40 pt-24 pb-16 transition-all duration-300">
          <div className="h-10" />
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
              <div className="px-2 text-center">
                <span className="block text-xs font-semibold text-white">Sedang menganalisis</span>
                <span className="block text-xs font-semibold text-white">material...</span>
              </div>
            </div>
            <span className="mt-3 rounded-full border border-white/5 bg-black/40 px-3 py-1 text-xs font-bold text-white/80">
              1-2 detik
            </span>
          </div>
          <div className="mx-6 max-w-xs rounded-2xl border border-white/15 bg-neutral-800 px-6 py-3.5 text-center shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold leading-5 text-white">Jangan tutup aplikasi atau pindahkan kamera</p>
          </div>
        </div>
      )}

      {scanSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <i className="bi bi-check-circle-fill text-5xl text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-neutral-900">Analisis berhasil!</h2>
          <p className="mt-2 text-sm text-neutral-500">Mengalihkan ke hasil scan...</p>
        </div>
      )}

      {scanError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <i className="bi bi-exclamation-circle-fill text-4xl text-danger" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-neutral-900">Material tidak dapat dikenali.</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500">
            Silakan ambil foto kembali dengan pencahayaan yang lebih baik.
          </p>

          <div className="mt-10 w-full max-w-xs space-y-4">
            <button
              onClick={() => setScanError(null)}
              className="w-full rounded-geo-md bg-primary py-3.5 font-bold text-ink transition hover:brightness-105"
            >
              Scan Ulang
            </button>
            <button
              onClick={() => {
                setScanError(null);
                setShowTips(true);
              }}
              className="w-full py-2 text-sm font-semibold text-primary hover:underline"
            >
              Tips Scan
            </button>
          </div>
        </div>
      )}

      {showTips && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-geo-2xl border border-neutral-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900">
                <i className="bi bi-lightbulb text-lg text-primary" /> Tips Scan
              </h3>
              <button onClick={() => setShowTips(false)} className="text-neutral-400 hover:text-neutral-600">
                <i className="bi bi-x-lg text-sm" />
              </button>
            </div>

            <ul className="mt-4 space-y-3.5 text-sm text-neutral-700">
              <li className="flex items-start gap-2.5">
                <i className="bi bi-check2-circle mt-0.5 text-primary" />
                <span>Gunakan pencahayaan yang cukup.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bi bi-check2-circle mt-0.5 text-primary" />
                <span>Hindari latar belakang yang ramai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bi bi-check2-circle mt-0.5 text-primary" />
                <span>Pastikan objek terlihat jelas.</span>
              </li>
            </ul>

            <button
              onClick={() => setShowTips(false)}
              className="mt-6 w-full rounded-geo-md bg-primary py-2.5 font-bold text-ink transition hover:brightness-105"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {!scanSuccess && !scanError && (
        <>
          <div
            className="relative z-20 flex h-20 items-center justify-between px-6"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,.85), rgba(0,0,0,0))',
            }}
          >
            <button
              onClick={onGoDashboard}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md"
            >
              <i className="bi bi-x-lg text-lg text-white" />
            </button>

            {torchSupported && cameraReady ? (
              <button
                onClick={toggleTorch}
                className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition ${
                  torchOn ? 'border-primary bg-primary text-ink' : 'border-white/15 bg-black/30 text-white'
                }`}
              >
                <i className={`bi ${torchOn ? 'bi-lightning-fill' : 'bi-lightning'}`} />
              </button>
            ) : (
              <div className="h-11 w-11" />
            )}
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
            <div ref={frameRef} className="relative aspect-square w-full max-w-[310px]">
              <div className="absolute left-0 top-0 h-12 w-12 rounded-tl-lg border-l-4 border-t-4 border-primary" />
              <div className="absolute right-0 top-0 h-12 w-12 rounded-tr-lg border-r-4 border-t-4 border-primary" />
              <div className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-lg border-b-4 border-l-4 border-primary" />
              <div className="absolute bottom-0 right-0 h-12 w-12 rounded-br-lg border-b-4 border-r-4 border-primary" />

              {cameraReady && (
                <div className="absolute left-0 right-0 top-0 h-[3px] animate-scan-line bg-primary shadow-[0_0_18px_rgba(34,197,94,.8)]" />
              )}
            </div>

            {!scanning && (
              <div className="mt-8 max-w-xs rounded-xl border border-white/10 bg-black/60 px-5 py-3 text-center text-sm font-medium text-white/95 shadow-lg backdrop-blur-md">
                Pastikan hanya satu jenis material berada di dalam area scan.
              </div>
            )}
          </div>

          <div className="relative z-20 border-t border-white/10 bg-black/75 pb-6 pt-4 backdrop-blur-md">
            <div className="relative mx-auto flex max-w-sm items-center justify-evenly">
              <button
                disabled={!cameraReady || scanning}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 text-white/80 transition hover:text-white disabled:opacity-40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 backdrop-blur-xl">
                  <i className="bi bi-images text-base" />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Galeri</span>
              </button>

              <button
                onClick={handleCapture}
                disabled={!cameraReady || scanning}
                className="-translate-y-2 group relative z-30 flex h-20 w-20 items-center justify-center disabled:opacity-40"
              >
                <div className="absolute inset-0 rounded-full bg-white/15 blur-md transition group-active:scale-95" />
                <div className="absolute inset-0 rounded-full border-[4px] border-white/40" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-2xl transition duration-150 group-active:scale-90">
                  <div className="h-10 w-10 rounded-full bg-primary" />
                </div>
              </button>

              <button
                disabled={!cameraReady || scanning}
                onClick={() => setShowTips(true)}
                className="flex flex-col items-center gap-1.5 text-white/80 transition hover:text-white disabled:opacity-40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 backdrop-blur-xl">
                  <i className="bi bi-lightbulb text-base" />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Tips</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}