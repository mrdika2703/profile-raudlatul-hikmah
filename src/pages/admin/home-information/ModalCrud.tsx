import { useState, type FormEvent } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ModalCrudProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: "create" | "edit";
  activeTab: "program_unggulan" | "visi_misi";
  api: any;
  selectedId: number | null;
  fetchData: () => void;
  programForm: {
    judul: string;
    keterangan: string;
    icon: string;
  };
  setProgramForm: React.Dispatch<
    React.SetStateAction<{
      judul: string;
      keterangan: string;
      icon: string;
    }>
  >;
  visiMisiForm: {
    kategori: "Visi" | "Misi";
    keterangan: string;
  };
  setVisiMisiForm: React.Dispatch<
    React.SetStateAction<{
      kategori: "Visi" | "Misi";
      keterangan: string;
    }>
  >;
  hasVisi: boolean;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

const PRESET_ICONS = [
  "Sparkles",
  "BookOpen",
  "Heart",
  "GraduationCap",
  "Award",
  "Star",
  "Sun",
  "ShieldCheck",
  "Smile",
  "Music",
  "Palette",
  "Globe",
];

export default function ModalCrud({
  isModalOpen,
  setIsModalOpen,
  modalMode,
  activeTab,
  api,
  selectedId,
  fetchData,
  programForm,
  setProgramForm,
  visiMisiForm,
  setVisiMisiForm,
  hasVisi,
  showSuccess,
  showError,
}: ModalCrudProps) {
  const [formSubmitting, setFormSubmitting] = useState(false);

  const getPreviewIcon = (iconName: string) => {
    const MaybeIcon = (LucideIcons as Record<string, any>)[iconName];
    const IconComponent =
      typeof MaybeIcon === "function" || (MaybeIcon && typeof MaybeIcon === "object" && "$$typeof" in MaybeIcon)
        ? MaybeIcon
        : Sparkles;
    return <IconComponent size={24} className="text-pink-600" />;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (activeTab === "program_unggulan") {
        const payload = {
          type: "program_unggulan",
          judul: programForm.judul,
          keterangan: programForm.keterangan,
          icon: programForm.icon || "Sparkles",
        };

        if (modalMode === "create") {
          await api.post("/home-information", payload);
          showSuccess("Program Unggulan berhasil ditambahkan!");
        } else {
          await api.put(`/home-information/${selectedId}`, payload);
          showSuccess("Program Unggulan berhasil diperbarui!");
        }
      } else {
        const payload = {
          type: "visi_misi",
          kategori: visiMisiForm.kategori,
          keterangan: visiMisiForm.keterangan,
        };

        if (modalMode === "create") {
          await api.post("/home-information", payload);
          showSuccess(`${visiMisiForm.kategori} berhasil ditambahkan!`);
        } else {
          await api.put(`/home-information/${selectedId}`, payload);
          showSuccess(`${visiMisiForm.kategori} berhasil diperbarui!`);
        }
      }

      setIsModalOpen(false);
      fetchData();
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 animate-scale-up">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-pink-700 mb-1">
          {modalMode === "create"
            ? `Tambah ${activeTab === "program_unggulan" ? "Program Unggulan" : "Visi / Misi"}`
            : `Edit ${activeTab === "program_unggulan" ? "Program Unggulan" : "Visi / Misi"}`}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Isi detail informasi untuk ditampilkan pada halaman utama web.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "program_unggulan" ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Program Unggulan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pendidikan Karakter & Tahfidz Juz 30"
                  value={programForm.judul}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, judul: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Icon (Lucide React) *
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 shadow-xs">
                    {getPreviewIcon(programForm.icon)}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sparkles, BookOpen, Heart, GraduationCap"
                    value={programForm.icon}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, icon: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ketik nama icon Lucide React atau pilih rekomendasi di bawah.
                </p>

                {/* Preset Icons Selection */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_ICONS.map((iconName) => {
                    const MaybeIcon = (LucideIcons as Record<string, any>)[iconName];
                    const IconComp =
                      typeof MaybeIcon === "function" || (MaybeIcon && typeof MaybeIcon === "object" && "$$typeof" in MaybeIcon)
                        ? MaybeIcon
                        : Sparkles;
                    const isSelected = programForm.icon === iconName;

                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() =>
                          setProgramForm({ ...programForm, icon: iconName })
                        }
                        className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-pink-50 hover:text-pink-600"
                        }`}
                      >
                        <IconComp size={14} />
                        <span>{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Keterangan Program *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Penjelasan rinci mengenai program unggulan..."
                  value={programForm.keterangan}
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      keterangan: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium resize-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori *
                </label>
                <select
                  value={visiMisiForm.kategori}
                  onChange={(e) =>
                    setVisiMisiForm({
                      ...visiMisiForm,
                      kategori: e.target.value as "Visi" | "Misi",
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                >
                  <option value="Visi" disabled={hasVisi}>
                    Visi {hasVisi ? "(Maksimal 1)" : ""}
                  </option>
                  <option value="Misi">Misi</option>
                </select>
                {hasVisi && (
                  <p className="text-[11px] text-amber-600 mt-1 font-medium">
                    * Visi sudah ada (maksimal 1 Visi).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Isi Visi / Misi *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pernyataan Visi atau Misi sekolah..."
                  value={visiMisiForm.keterangan}
                  onChange={(e) =>
                    setVisiMisiForm({
                      ...visiMisiForm,
                      keterangan: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium resize-none"
                />
              </div>
            </>
          )}

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
