import { useState, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";

interface ModalCrudProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: "create" | "edit";
  api: any;
  selectedId: number | null;
  fetchSiswas: () => void;
  kelasList: any[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: {
    nisn: string;
    nama_lengkap: string;
    jenis_kelamin: "Laki-laki" | "Perempuan";
    kelas: string;
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
  fetchSiswas,
  kelasList,
  setFormData,
  formData,
  showSuccess,
  showError,
}: ModalCrudProps) {
  const [formSubmitting, setFormSubmitting] = useState(false);

  const activeClasses = kelasList.filter((k) => k.status === "Aktif");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.kelas) {
      showError("Silakan pilih kelas aktif!");
      return;
    }

    setFormSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post("/siswas", formData);
        showSuccess("Data siswa berhasil ditambahkan!");
      } else {
        await api.put(`/siswas/${selectedId}`, formData);
        showSuccess("Data siswa berhasil diperbarui!");
      }
      setIsModalOpen(false);
      fetchSiswas();
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
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-pink-700 mb-1">
          {modalMode === "create" ? "Tambah Data Siswa" : "Edit Data Siswa"}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Pastikan NISN dan nama sesuai dengan dokumen resmi anak.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              NISN (Nomor Induk Siswa Nasional)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 0182938475"
              value={formData.nisn}
              onChange={(e) =>
                setFormData({ ...formData, nisn: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Aisyah Putri Rahmadani"
              value={formData.nama_lengkap}
              onChange={(e) =>
                setFormData({ ...formData, nama_lengkap: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Jenis Kelamin
              </label>
              <select
                value={formData.jenis_kelamin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jenis_kelamin: e.target.value as "Laki-laki" | "Perempuan",
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kelas / Kelompok
              </label>
              <select
                value={formData.kelas}
                onChange={(e) =>
                  setFormData({ ...formData, kelas: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium cursor-pointer"
                required
              >
                <option value="">Pilih Kelas Aktif</option>
                {activeClasses.map((k: any) => {
                  const displaySemester = k.semester === "Ganjil" ? "1" : k.semester === "Genap" ? "2" : k.semester;
                  return (
                    <option key={k.id} value={k.id.toString()}>
                      Kelas {k.kelas} ({k.tahun_ajaran}) - {displaySemester}
                    </option>
                  );
                })}
              </select>
            </div>
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
                {modalMode === "create" ? "Simpan Data" : "Update Data"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
