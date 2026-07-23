import { useState, type FormEvent, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface ModalCrudProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: "create" | "edit";
  api: any;
  selectedId: number | null;
  fetchKelasList: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: {
    kelas: string;
    semester: string;
    tahun_ajaran: string;
    status: "Aktif" | "Lulus";
  };
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function ModalCrud({
  isModalOpen,
  setIsModalOpen,
  modalMode,
  api,
  selectedId,
  fetchKelasList,
  setFormData,
  formData,
  showSuccess,
  showError,
}: ModalCrudProps) {
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (modalMode === "create") {
        await api.post("/kelas", formData);
        showSuccess("Kelas berhasil ditambahkan!");
      } else {
        await api.put(`/kelas/${selectedId}`, formData);
        showSuccess("Kelas berhasil diperbarui!");
      }
      setIsModalOpen(false);
      fetchKelasList();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        showError(err.response.data.message);
      } else {
        showError("Terjadi kesalahan sistem. Coba beberapa saat lagi.");
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-pink-700 mb-1">
          {modalMode === "create" ? "Tambah Data Kelas" : "Edit Data Kelas"}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Pastikan informasi kelas dan tahun ajaran sudah benar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kelas / Kelompok Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Kelas / Kelompok
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: A, B, Kelompok Bermain (KB)"
              value={formData.kelas}
              onChange={(e) =>
                setFormData({ ...formData, kelas: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            {/* Tahun Ajaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 2026/2027"
                value={formData.tahun_ajaran}
                onChange={(e) =>
                  setFormData({ ...formData, tahun_ajaran: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Status Kelas
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "Aktif" | "Lulus" })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            >
              <option value="Aktif">Aktif</option>
              <option value="Lulus">Lulus</option>
            </select>
          </div>

          {/* Actions */}
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
                {modalMode === "create" ? "Simpan Data" : "Update Data"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
