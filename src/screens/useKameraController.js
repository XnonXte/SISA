import { useCallback, useEffect, useRef, useState } from 'react';
import { setScanResult } from '../features/user/userSlice';
import { apiScanImage } from '../services/api';

export function useKameraController({ dispatch, token, go }) {
  const webcamRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const frameRef = useRef(null);

  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [showTips, setShowTips] = useState(false);

  const permissionDenied =
    cameraError &&
    (cameraError.toLowerCase().includes('permission') ||
      cameraError.toLowerCase().includes('denied') ||
      cameraError.toLowerCase().includes('notallowed'));

  const onUserMedia = useCallback((stream) => {
    streamRef.current = stream;
    setCameraReady(true);
    setCameraError(null);

    const track = stream.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.() ?? {};
    setTorchSupported(!!capabilities.torch);
  }, []);

  const onUserMediaError = useCallback((err) => {
    setCameraReady(false);
    setCameraError(err?.message ?? 'Permission Denied');
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
        track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => {});
      }
    };
  }, [torchOn]);

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

      const nativeW = video.videoWidth;
      const nativeH = video.videoHeight;
      const videoRect = video.getBoundingClientRect();
      const frameRect = frameEl.getBoundingClientRect();

      const scaleX = nativeW / videoRect.width;
      const scaleY = nativeH / videoRect.height;

      const cropX = Math.max(0, (frameRect.left - videoRect.left) * scaleX);
      const cropY = Math.max(0, (frameRect.top - videoRect.top) * scaleY);
      const cropW = Math.min(frameRect.width * scaleX, nativeW - cropX);
      const cropH = Math.min(frameRect.height * scaleY, nativeH - cropY);

      const outputSize = Math.max(800, Math.round(cropW), Math.round(cropH));
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, outputSize, outputSize);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    });
  }, []);

  const processImage = useCallback(
    async (imageBase64) => {
      setScanning(true);
      setScanError(null);
      setScanSuccess(false);

      try {
        const { data, error } = await apiScanImage(token, imageBase64);

        if (error || !data) {
          setScanning(false);
          setScanError(error ?? 'Material tidak dapat dikenali.');
          return;
        }

        dispatch(
          setScanResult({
            imageBase64,
            scanId: data.scanId,
            category: data.category,
            material: data.material,
            subtype: data.subtype,
            confidence: data.confidence,
            grade: data.grade,
            status: data.status,
            recycleCategory: data.recycleCategory,
            recommendation: data.recommendation,
            icon: data.icon,
            materialPrice: data.materialPrice,
            anomalies: data.anomalies ?? [],
            instruction: data.instruction,
          })
        );

        localStorage.setItem('lastScan', JSON.stringify(data));

        setScanning(false);
        setScanSuccess(true);

        // Durasi diubah dari 2000 menjadi 1000 (1 detik)
        setTimeout(() => {
          go('hasilScan');
        }, 1000);
      } catch {
        setScanning(false);
        setScanError('Gagal memproses gambar. Silakan coba kembali.');
      }
    },
    [dispatch, go, token]
  );

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || scanning || scanSuccess) return;
    const cropped = await cropToFrame();
    if (!cropped) return;
    await processImage(cropped);
  }, [cropToFrame, processImage, scanning, scanSuccess]);

  const handlePickFromStorage = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file || scanning || scanSuccess) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
        await processImage(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [processImage, scanning, scanSuccess]
  );

  return {
    webcamRef,
    streamRef,
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
  };
}