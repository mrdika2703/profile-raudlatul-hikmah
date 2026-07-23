import { useState, useEffect, type FormEvent } from "react";
import { X, Loader2, Users, UserCheck } from "lucide-react";
import api from "../../../lib/axios";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  kelasList: any[];
  fetchRapors: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  defaultData: {
    tanggal: string;
    kelas_id: string;
    kegiatan: string;
  } | null;
}

export default function ModalEdit({
  isOpen,
  onClose,
  kelasList,
  fetchRapors,
  showSuccess,
  showError,
  defaultData,
}: ModalEditProps) {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    kelas_id: "",
    target: "semua" as "semua" | "hadir",
    kegiatan: "",
  });

  useEffect(() => {
    if (defaultData) {
      setFormData({
        tanggal: defaultData.tanggal,
        kelas_id: defaultData.kelas_id,
        target: "semua",
        kegiatan: defaultData.kegiatan,
      });
    }
  }, [defaultData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.kelas_id) {
      showError("Silakan pilih kelas!");
      return;
    }
    if (!formData.kegiatan.trim()) {
      showError("Kegiatan tidak boleh kosong!");
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await api.post("/rapor", formData);
      showSuccess(response.data.message || "Rapor berhasil diperbarui!");
      onClose();
      fetchRapors();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal memperbarui data rapor.";
      showError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative animate-scale-up">
        <button
          onClick={onClose}
          disabled={formSubmitting}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50 disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-pink-700 mb-1">
          Edit Kegiatan Masal (Batch)
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Memperbarui catatan kegiatan untuk kelompok kelas terpilih.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tanggal
            </label>
            <input
              type="date"
              required
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Kelas
            </label>
            <select
              required
              value={formData.kelas_id}
              onChange={(e) =>
                setFormData({ ...formData, kelas_id: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium cursor-pointer"
            >
              <option value="">Pilih Kelas</option>
              {kelasList.map((k: any) => {
                const displaySemester =
                  k.semester === "Ganjil"
                    ? "1"
                    : k.semester === "Genap"
                      ? "2"
                      : k.semester;
                return (
                  <option key={k.id} value={k.id.toString()}>
                    Kelas {k.kelas} ({k.tahun_ajaran}) - {displaySemester}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Target */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Target Siswa
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, target: "semua" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  formData.target === "semua"
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Users
                  size={18}
                  className={
                    formData.target === "semua"
                      ? "text-pink-500"
                      : "text-slate-400"
                  }
                />
                <span>Semua Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, target: "hadir" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  formData.target === "hadir"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <UserCheck
                  size={18}
                  className={
                    formData.target === "hadir"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }
                />
                <span>Hanya Hadir</span>
              </button>
            </div>
          </div>

          {/* Kegiatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Deskripsi Kegiatan
            </label>
            <textarea
              required
              rows={4}
              value={formData.kegiatan}
              onChange={(e) =>
                setFormData({ ...formData, kegiatan: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={formSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
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
              <span>Perbarui Kegiatan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
