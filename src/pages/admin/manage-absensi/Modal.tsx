import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Modal({
  setIsModalOpen,
  modalMode,
  handleSubmitModal,
  allSiswas,
  formData,
  setFormData,
  formSubmitting,
}: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize search input with selected student name if there is one
  useEffect(() => {
    if (formData.siswa_id && allSiswas.length > 0) {
      const selected = allSiswas.find((s: any) => s.id.toString() === formData.siswa_id);
      if (selected) {
        setSearchQuery(selected.nama_lengkap);
      }
    }
  }, [formData.siswa_id, allSiswas]);

  const filteredSiswas = allSiswas.filter((s: any) => {
    const kelasStr = typeof s.kelas === "object" && s.kelas
      ? `Kelas ${s.kelas.kelas}`
      : s.kelas || "";
    const term = `${s.nama_lengkap} - ${kelasStr}`.toLowerCase();
    return term.includes(searchQuery.toLowerCase()) || s.nisn.includes(searchQuery);
  });

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (modalMode === "create" && !formData.siswa_id) {
      toast.error("Silakan pilih siswa dari daftar hasil pencarian!");
      return;
    }
    handleSubmitModal(e);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative animate-scale-up">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-slate-800 mb-1">
            {modalMode === "create"
              ? "Input Absen Manual"
              : "Edit Status Absensi"}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Gunakan fitur ini untuk mencatat siswa yang Izin, Sakit, atau lupa
            membawa QR Code.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {modalMode === "create" && (
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pilih Siswa
                </label>
                <input
                  type="text"
                  placeholder="Cari nama siswa..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFormData({ ...formData, siswa_id: "" }); // Reset ID on type
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                  required
                />
                
                {/* Floating Dropdown */}
                {isDropdownOpen && searchQuery.trim() !== "" && (
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                    {filteredSiswas.length === 0 ? (
                      <div className="p-3 text-xs text-slate-400 text-center font-medium">
                        Siswa tidak ditemukan 🔍
                      </div>
                    ) : (
                      filteredSiswas.map((s: any) => {
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, siswa_id: s.id.toString() });
                              setSearchQuery(s.nama_lengkap);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-pink-50 text-xs sm:text-sm text-slate-700 font-medium transition-colors"
                          >
                            <span>{s.nama_lengkap}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tanggal & Waktu Absen
              </label>
              <input
                type="datetime-local"
                disabled={modalMode === "edit"}
                value={formData.absen_date}
                onChange={(e) =>
                  setFormData({ ...formData, absen_date: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Status Kehadiran
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Hadir">✔ Hadir</option>
                <option value="Izin">✉ Izin</option>
                <option value="Sakit">🏥 Sakit</option>
                <option value="Alpa">✖ Alpa (Tanpa Keterangan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Keterangan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Surat dokter menyusul, izin acara keluarga..."
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded-xl shadow-md shadow-pink-200 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {formSubmitting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                <span>
                  {modalMode === "create" ? "Simpan Absen" : "Update Status"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
