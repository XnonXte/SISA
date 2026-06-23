import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../app/useAppNavigation';
import { setScanResult } from '../features/user/userSlice';
import { apiScanImage } from '../services/api';

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

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Kamera() {
  const { go } = useAppNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

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
  const cropToFrame = useCallback((imageBase64) => {
    return new Promise((resolve) => {
      if (!frameRef.current || !webcamRef.current) {
        resolve(imageBase64);
        return;
      }

      const video = webcamRef.current.video;
      const frameEl = frameRef.current;

      if (!video) {
        resolve(imageBase64);
        return;
      }

      const videoRect = video.getBoundingClientRect();
      const frameRect = frameEl.getBoundingClientRect();

      // Scale factor from displayed video size to actual video resolution
      const scaleX = video.videoWidth / videoRect.width;
      const scaleY = video.videoHeight / videoRect.height;

      const cropX = (frameRect.left - videoRect.left) * scaleX;
      const cropY = (frameRect.top - videoRect.top) * scaleY;
      const cropW = frameRect.width * scaleX;
      const cropH = frameRect.height * scaleY;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => resolve(imageBase64);
      img.src = imageBase64;
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

    const imageBase64 = webcamRef.current.getScreenshot({
      width: 1280,
      height: 720,
    });

    if (!imageBase64) return;

    const croppedBase64 = await cropToFrame(imageBase64);
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