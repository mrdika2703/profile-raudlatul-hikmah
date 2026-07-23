import { useState, useEffect } from "react";
import { X, Loader2, QrCode, Download } from "lucide-react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function ModalQr({
  siswas,
  kelasList,
  isQrModalOpen,
  setIsQrModalOpen,
}: any) {
  const [qrMode, setQrMode] = useState<"all" | "kelas" | "siswa">("all");
  const [selectedKelasId, setSelectedKelasId] = useState("");
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // Filter kelas aktif
  const activeKelas = kelasList.filter((k: any) => k.status === "Aktif");

  // Set default class ID jika ada kelas aktif
  useEffect(() => {
    if (activeKelas.length > 0 && !selectedKelasId) {
      setSelectedKelasId(activeKelas[0].id.toString());
    }
  }, [activeKelas]);

  // Filter siswa berdasarkan input pencarian
  const filteredSiswas = siswas.filter((s: any) => {
    const kelasStr =
      typeof s.kelas === "object" && s.kelas
        ? `Kelas ${s.kelas.kelas}`
        : s.kelas || "";
    const term = `${s.nama_lengkap} - ${kelasStr}`.toLowerCase();
    return (
      term.includes(searchQuery.toLowerCase()) || s.nisn.includes(searchQuery)
    );
  });

  const handleDownloadQrZip = async () => {
    let targetSiswas: any[] = [];
    let zipName = "QRCode_TK_Raudlatul_Hikmah.zip";

    if (qrMode === "all") {
      targetSiswas = siswas;
      zipName = "QRCode_Semua_Kelas_TK_Raudlatul_Hikmah.zip";
    } else if (qrMode === "kelas") {
      if (!selectedKelasId) {
        toast.error("Silakan pilih kelas terlebih dahulu!");
        return;
      }
      const kelasObj = activeKelas.find(
        (k: any) => k.id.toString() === selectedKelasId,
      );
      targetSiswas = siswas.filter((s: any) => {
        const sKelasId =
          s.kelas && typeof s.kelas === "object"
            ? s.kelas.id.toString()
            : String(s.kelas);
        return sKelasId === selectedKelasId;
      });
      zipName = `QRCode_Kelas_${kelasObj ? kelasObj.kelas.replace(/\s+/g, "_") : selectedKelasId}.zip`;
    } else if (qrMode === "siswa") {
      if (!selectedSiswaId) {
        toast.error("Silakan pilih siswa terlebih dahulu!");
        return;
      }
      const singleSiswa = siswas.find(
        (s: any) => s.id.toString() === selectedSiswaId,
      );
      if (singleSiswa) {
        targetSiswas = [singleSiswa];
        zipName = `QRCode_${singleSiswa.nama_lengkap.replace(/\s+/g, "_")}.zip`;
      }
    }

    if (targetSiswas.length === 0) {
      toast.error("Tidak ada data siswa ditemukan untuk target terpilih!");
      return;
    }

    setIsGeneratingQr(true);

    try {
      if (qrMode === "siswa") {
        const siswa = targetSiswas[0];
        const kelasStr =
          typeof siswa.kelas === "object" && siswa.kelas
            ? `Kelas ${siswa.kelas.kelas}`
            : siswa.kelas || "-";
        const qrContent = `NISN: ${siswa.nisn}\nNama: ${siswa.nama_lengkap}\nKelas: ${kelasStr}`;

        const qrDataUrl = await QRCode.toDataURL(qrContent, {
          width: 500,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        const cleanName = siswa.nama_lengkap
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .trim();
        const fileName = `${siswa.nisn} - ${cleanName}.png`;
        saveAs(qrDataUrl, fileName);

        setIsQrModalOpen(false);
        toast.success(
          `Berhasil mengunduh QR Code siswa ${siswa.nama_lengkap}!`,
        );
      } else {
        const zip = new JSZip();
        for (const siswa of targetSiswas) {
          const kelasStr =
            typeof siswa.kelas === "object" && siswa.kelas
              ? `Kelas ${siswa.kelas.kelas}`
              : siswa.kelas || "-";
          const qrContent = `NISN: ${siswa.nisn}\nNama: ${siswa.nama_lengkap}\nKelas: ${kelasStr}`;

          const qrDataUrl = await QRCode.toDataURL(qrContent, {
            width: 500,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });

          const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
          const cleanName = siswa.nama_lengkap
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .trim();
          const fileName = `${siswa.nisn} - ${cleanName}.png`;

          zip.file(fileName, base64Data, { base64: true });
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, zipName);
        setIsQrModalOpen(false);
        toast.success(
          `Berhasil mengunduh ${targetSiswas.length} QR Code dalam file ZIP!`,
        );
      }
    } catch (error) {
      console.error("Gagal membuat QR Code:", error);
      toast.error("Terjadi kesalahan saat membuat QR Code.");
    } finally {
      setIsGeneratingQr(false);
    }
  };

  return (
    <>
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative animate-scale-up">
            <button
              onClick={() => !isGeneratingQr && setIsQrModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
              <QrCode size={28} />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Cetak QR Code Siswa
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Pilih target pencetakan QR Code. Sistem akan membuat berkas ZIP
              berisi gambar QR Code masing-masing siswa.
            </p>

            <div className="space-y-4">
              {/* Pilihan Mode Tab */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQrMode("all")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    qrMode === "all"
                      ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Semua Kelas
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode("kelas")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    qrMode === "kelas"
                      ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Per Kelas
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode("siswa")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    qrMode === "siswa"
                      ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Siswa
                </button>
              </div>

              {/* Input Sesuai Mode */}
              {qrMode === "kelas" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilih Kelas Aktif
                  </label>
                  <select
                    value={selectedKelasId}
                    onChange={(e) => setSelectedKelasId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {activeKelas.length === 0 ? (
                      <option value="">Tidak ada kelas aktif</option>
                    ) : (
                      activeKelas.map((k: any) => {
                        const displaySemester =
                          k.semester === "Ganjil"
                            ? "1"
                            : k.semester === "Genap"
                              ? "2"
                              : k.semester;
                        return (
                          <option key={k.id} value={k.id.toString()}>
                            Kelas {k.kelas} ({k.tahun_ajaran}) -{" "}
                            {displaySemester}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              )}

              {qrMode === "siswa" && (
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cari Nama Siswa
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik nama siswa..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedSiswaId("");
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownOpen(false), 200)
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                  {isDropdownOpen && searchQuery.trim() !== "" && (
                    <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                      {filteredSiswas.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center font-medium">
                          Siswa tidak ditemukan 🔍
                        </div>
                      ) : (
                        filteredSiswas.map((s: any) => {
                          const kelasStr =
                            typeof s.kelas === "object" && s.kelas
                              ? `Kelas ${s.kelas.kelas}`
                              : s.kelas || "-";
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                setSelectedSiswaId(s.id.toString());
                                setSearchQuery(s.nama_lengkap);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-xs sm:text-sm text-slate-700 font-medium flex justify-between items-center transition-colors"
                            >
                              <span>{s.nama_lengkap}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">
                                {kelasStr}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  disabled={isGeneratingQr}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQrZip}
                  disabled={isGeneratingQr}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-bold rounded-xl shadow-md shadow-purple-200 flex items-center gap-2 transition-all disabled:opacity-70"
                >
                  {isGeneratingQr ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Membuat ZIP...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
