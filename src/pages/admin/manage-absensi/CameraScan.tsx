import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, AlertTriangle, XCircle, ArrowLeft } from "lucide-react";

interface ScanAlert {
  type: "success" | "warning" | "error";
  nama: string;
  kelas: string;
  status: string;
  waktu?: string;
  message: string;
}

export default function CameraScan({
  setIsCameraOpen,
  isCameraOpen,
  api,
  fetchAbsensis,
}: {
  setIsCameraOpen: (open: boolean) => void;
  isCameraOpen: boolean;
  api: any;
  fetchAbsensis: () => void;
}) {
  // State Scanner & Alert Overlay
  const [scanAlert, setScanAlert] = useState<ScanAlert | null>(null);
  const [, setIsProcessingScan] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // --- 1. LOGIKA KAMERA LANGSUNG (TANPA TOMBOL BAWAAN) ---
  useEffect(() => {
    let isMounted = true;

    if (isCameraOpen) {
      // Tunggu 300ms agar elemen DOM <div id="qr-reader"> selesai di-render oleh React
      const timer = setTimeout(() => {
        if (!isMounted) return;

        const qrCodeInstance = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = qrCodeInstance;

        // Nyalakan kamera belakang (environment) atau kamera web default secara otomatis
        qrCodeInstance
          .start(
            { facingMode: "environment" },
            {
              fps: 30, // Naikkan FPS dari 10 ke 30 agar deteksi lebih responsif/cepat
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.75;
                return {
                  width: Math.max(220, size),
                  height: Math.max(220, size),
                };
              }, // Kotak scan dinamis (75% lebar area) agar presisi
              aspectRatio: 1.0,
            },
            (decodedText) => {
              handleScanSuccess(decodedText);
            },
            () => {
              // Abaikan error frame per detik saat kamera sedang mencari fokus
            },
          )
          .catch((err) => {
            console.error("Gagal memulai kamera:", err);
            alert(
              "Kamera gagal diaktifkan. Pastikan izin kamera di browser sudah dibuka dan tidak sedang dipakai aplikasi lain.",
            );
            setIsCameraOpen(false);
          });
      }, 300);

      return () => {
        isMounted = false;
        clearTimeout(timer);
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(console.error);
        }
      };
    } else {
      // Jika kamera ditutup, refresh tabel absensi
      fetchAbsensis();
    }
  }, [isCameraOpen]);

  const playBeep = (type: "success" | "error") => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "success") {
        // Nada bip tinggi ganda untuk sukses
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          1200,
          audioCtx.currentTime + 0.15,
        );
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.2,
        );
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.2);
      } else {
        // Nada dengung rendah untuk gagal/peringatan
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.3,
        );
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Gagal memutar audio:", e);
    }
  };

  const isProcessingRef = useRef(false);

  // Fungsi Eksekusi Hasil Scan
  const handleScanSuccess = async (decodedText: string) => {
    // Blokir deteksi ganda secara sinkron via Ref
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessingScan(true);

    // Hentikan sementara deteksi kamera (pause) agar tidak menumpuk frame/request
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        html5QrCodeRef.current.pause(true);
      } catch (e) {
        console.error("Gagal pause scanner:", e);
      }
    }

    try {
      // Ekstrak NISN (Mendukung format teks "NISN: 012345" atau angka langsung)
      const match =
        decodedText.match(/NISN:\s*([0-9a-zA-Z]+)/i) ||
        decodedText.match(/^([0-9a-zA-Z]+)$/);
      const nisn = match ? match[1] : decodedText.trim();

      const response = await api.post("/absensis/scan", { nisn });
      const { status, message, data } = response.data;

      setScanAlert({
        type: status === "success" ? "success" : "warning",
        nama: data.nama_lengkap,
        kelas: data.kelas,
        status: data.status,
        waktu: data.waktu,
        message: message,
      });

      // Putar suara sesuai status
      playBeep(status === "success" ? "success" : "error");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "QR Code tidak valid atau siswa tidak ditemukan!";
      setScanAlert({
        type: "error",
        nama: "Gagal Scan!",
        kelas: "-",
        status: "Error",
        message: errorMsg,
      });

      playBeep("error");
    } finally {
      // Cooldown 0.5 detik: Tahan alert sebelum siap scan anak berikutnya
      setTimeout(() => {
        setScanAlert(null);
        setIsProcessingScan(false);
        isProcessingRef.current = false;

        // Lanjutkan deteksi kamera (resume)
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          try {
            html5QrCodeRef.current.resume();
          } catch (e) {
            console.error("Gagal resume scanner:", e);
          }
        }
      }, 500);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between animate-fade-in">
        {/* Top Bar Bersih */}
        <div className="p-4 sm:p-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight">
                Scanner Absensi Aktif
              </h2>
              <p className="text-xs text-slate-400">
                Arahkan kartu QR Code siswa tepat ke kotak fokus
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCameraOpen(false)}
            className="bg-slate-800 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <ArrowLeft size={18} />
            <span>Tutup Kamera</span>
          </button>
        </div>

        {/* Area Tengah: Kamera Full & Overlay Alert */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-4 overflow-hidden">
          {/* ALERT OVERLAY (MUNCUL 1.5 DETIK SAAT BERHASIL/GAGAL SCAN) */}
          {scanAlert && (
            <div
              className={`absolute top-6 max-w-md w-full mx-auto z-50 p-5 rounded-2xl shadow-2xl border flex items-center gap-4 animate-bounce transition-all ${
                scanAlert.type === "success"
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : scanAlert.type === "warning"
                    ? "bg-amber-500 text-white border-amber-300"
                    : "bg-red-600 text-white border-red-400"
              }`}
            >
              <div className="p-3 bg-white/20 rounded-xl shrink-0">
                {scanAlert.type === "success" && <CheckCircle2 size={32} />}
                {scanAlert.type === "warning" && <AlertTriangle size={32} />}
                {scanAlert.type === "error" && <XCircle size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase font-extrabold tracking-wider opacity-90">
                  {scanAlert.message}
                </p>
                <h3 className="text-xl font-black truncate leading-tight mt-0.5">
                  {scanAlert.nama}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                  <span className="bg-white/20 px-2 py-0.5 rounded">
                    {scanAlert.kelas}
                  </span>
                  {scanAlert.waktu && <span>⏰ {scanAlert.waktu} WIB</span>}
                  <span className="underline font-bold">
                    Status: {scanAlert.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Render Kotak Kamera HTML5 */}
          <div
            id="qr-reader"
            className="w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden border-4 border-pink-500/60 shadow-2xl bg-black"
          ></div>
        </div>

        {/* Bottom Bar Panduan */}
        <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 text-center text-xs text-slate-400">
          💡 Tips: Sistem otomatis memblokir absen ganda. Siswa yang sudah absen
          akan mendapat notifikasi warna kuning.
        </div>
      </div>
    </>
  );
}
