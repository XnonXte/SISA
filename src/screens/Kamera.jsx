import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setScanResult } from '../features/user/userSlice';
import { apiScanImage } from '../services/api';

// Prefer rear camera on mobile, fall back to any available camera
const WEBCAM_CONSTRAINTS = {
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

export default function Kamera() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const webcamRef = useRef(null);
  const streamRef = useRef(null); // holds the raw MediaStream for torch control

  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false); // true while API call is in flight
  const [scanError, setScanError] = useState(null);

  // ── Torch / Flash ──────────────────────────────────────────────────────────
  // The torch constraint is only available via the track's applyConstraints() API
  // after the stream is live — not as an initial getUserMedia constraint.

  const onUserMedia = useCallback((stream) => {
    streamRef.current = stream;
    setCameraReady(true);
    setCameraError(null);

    // Check torch capability on the video track
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
      // torch applyConstraints failed — device doesn't actually support it
      setTorchSupported(false);
    }
  }, [torchOn]);

  // Turn off torch when leaving the screen
  useEffect(() => {
    return () => {
      const track = streamRef.current?.getVideoTracks()[0];
      if (track && torchOn) {
        track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => {});
      }
    };
  }, [torchOn]);

  // ── Capture + Scan ────────────────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || scanning) return;
    setScanError(null);

    // Capture frame as base64 JPEG
    const imageBase64 = webcamRef.current.getScreenshot({ width: 1280, height: 720 });
    if (!imageBase64) return;

    setScanning(true);

    const { data, error } = await apiScanImage(token, imageBase64);

    setScanning(false);

    if (error || !data) {
      setScanError(error ?? 'Gagal menghubungi server. Coba lagi.');
      return;
    }

    // Store full API response in Redux — HasilScan reads from here
    dispatch(setScanResult({
      imageBase64,          // used as preview in HasilScan
      category: data.category,
      estimatedPoints: data.estimatedPoints,
      confidence: data.confidence,
      grade: data.grade,
      status: data.status,  // 'accepted' | 'rejected'
      anomalies: data.anomalies ?? [],
      instruction: data.instruction,
    }));

    go('hasilScan');
  }, [dispatch, go, scanning, token]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-screen bg-[#0A0A0A] flex flex-col overflow-hidden">

      {/* Live webcam feed — fills the entire screen */}
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

      {/* Dark overlay tint */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Camera error state */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-20">
          <i className="bi bi-camera-video-off text-white/60 text-5xl mb-4" />
          <div className="text-white font-bold text-sm mb-2">Kamera tidak tersedia</div>
          <div className="text-white/60 text-xs leading-relaxed">{cameraError}</div>
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
        className="relative z-10 w-full h-20 flex items-center px-6 justify-between shrink-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, transparent 100%)' }}
      >
        <button
          onClick={() => go('dashboard')}
          className="bg-transparent border border-white/25 text-white font-sans text-[11px] font-bold tracking-wide
                     px-4 py-2 rounded-geo-xs cursor-pointer backdrop-blur-sm"
        >
          BATAL
        </button>

        {/* Flash/torch button — only rendered when hardware supports it */}
        {torchSupported && (
          <button
            onClick={toggleTorch}
            className={`border text-white font-sans text-[11px] font-bold tracking-wide
                       px-4 py-2 rounded-geo-xs cursor-pointer backdrop-blur-sm transition-all
                       ${torchOn
                         ? 'bg-accent/80 border-accent text-ink'
                         : 'bg-transparent border-white/25'}`}
          >
            <i className={`bi ${torchOn ? 'bi-lightning-fill' : 'bi-lightning'}`} />
          </button>
        )}
      </div>

      {/* Instruction text */}
      <div className="relative z-10 text-center mt-4 shrink-0">
        <div
          className="text-sm font-bold text-primary tracking-wide"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          {scanning ? 'Menganalisis material...' : 'Mendeteksi material kardus atau PET bening...'}
        </div>
        <div
          className="text-xs text-white/80 mt-1.5"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          Posisikan objek di tengah area pemindaian
        </div>
      </div>

      {/* Scan frame */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-[5]">
        <div className="w-full max-w-[300px] aspect-square relative">
          {/* Corner markers */}
          <div className="absolute top-[-2px] left-[-2px] w-5 h-5 border-t-[3px] border-l-[3px] border-accent" />
          <div className="absolute top-[-2px] right-[-2px] w-5 h-5 border-t-[3px] border-r-[3px] border-accent" />
          <div className="absolute bottom-[-2px] left-[-2px] w-5 h-5 border-b-[3px] border-l-[3px] border-accent" />
          <div className="absolute bottom-[-2px] right-[-2px] w-5 h-5 border-b-[3px] border-r-[3px] border-accent" />

          <div className="w-full h-full border-2 border-primary/60 rounded-geo-2xl relative overflow-hidden">
            {/* Scan line only animates when not awaiting API response */}
            {!scanning && (
              <div className="absolute left-0 right-0 h-[3px] bg-primary shadow-[0_0_16px_rgba(29,185,84,0.9)] animate-scan-line" />
            )}
            {/* Scanning spinner overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-10 h-10 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scan error toast */}
      {scanError && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-30
                        bg-danger text-white text-xs font-bold px-4 py-2.5 rounded-geo-xs
                        whitespace-nowrap shadow-lg flex items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill" />
          {scanError}
        </div>
      )}

      {/* Capture button */}
      <div
        className="relative z-10 pb-14 pt-10 flex flex-col items-center shrink-0"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 100%)' }}
      >
        <button
          onClick={handleCapture}
          disabled={scanning || !cameraReady}
          className={`w-[72px] h-[72px] rounded-full bg-white border-8 border-white/30
                      outline-none transition-all duration-200
                      ${scanning || !cameraReady
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer active:scale-95'}`}
        />
      </div>
    </div>
  );
}
