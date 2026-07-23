import { useState, type FormEvent, type ChangeEvent } from "react";
import { X, Loader2, Upload, Trash2, Sparkles } from "lucide-react";
import type { ActivityFormData } from "./Index";
import { getStorageUrl } from "../../../lib/axios";
import * as LucideIcons from "lucide-react";

interface ModalCrudProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: "create" | "edit";
  api: any;
  selectedId: number | null;
  fetchActivities: () => void;
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  files: {
    gambar_1: File | null;
    gambar_2: File | null;
    gambar_3: File | null;
  };
  setFiles: React.Dispatch<
    React.SetStateAction<{
      gambar_1: File | null;
      gambar_2: File | null;
      gambar_3: File | null;
    }>
  >;
  existingImages: {
    gambar_1: string | null;
    gambar_2: string | null;
    gambar_3: string | null;
  };
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

const PRESET_ICONS = [
  "Activity",
  "Compass",
  "Award",
  "BookOpen",
  "Music",
  "Heart",
  "Flame",
  "Palette",
  "Shield",
  "Smile",
  "Star",
  "Users",
];

export default function ModalCrud({
  isModalOpen,
  setIsModalOpen,
  modalMode,
  api,
  selectedId,
  fetchActivities,
  formData,
  setFormData,
  files,
  setFiles,
  existingImages,
  showSuccess,
  showError,
}: ModalCrudProps) {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [clearedImages, setClearedImages] = useState<Record<string, boolean>>({});

  const getImageUrl = getStorageUrl;

  const getPreviewIcon = (iconName: string) => {
    const MaybeIcon = (LucideIcons as Record<string, any>)[iconName];
    const IconComponent =
      typeof MaybeIcon === "function" || (MaybeIcon && typeof MaybeIcon === "object" && "$$typeof" in MaybeIcon)
        ? MaybeIcon
        : Sparkles;
    return <IconComponent size={24} className="text-pink-600" />;
  };

  const handleFileChange = (
    key: "gambar_1" | "gambar_2" | "gambar_3",
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("judul", formData.judul);
      payload.append("kategori", formData.kategori);
      payload.append("icon", formData.icon || "Compass");
      payload.append("keterangan", formData.keterangan || "");

      if (files.gambar_1) payload.append("gambar_1", files.gambar_1);
      if (files.gambar_2) payload.append("gambar_2", files.gambar_2);
      if (files.gambar_3) payload.append("gambar_3", files.gambar_3);

      // Send clear flags for photos that were removed
      if (clearedImages.gambar_2) payload.append("clear_gambar_2", "1");
      if (clearedImages.gambar_3) payload.append("clear_gambar_3", "1");

      if (modalMode === "create") {
        await api.post("/activity", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("Kegiatan berhasil ditambahkan!");
      } else {
        payload.append("_method", "PUT");
        await api.post(`/activity/${selectedId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("Kegiatan berhasil diperbarui!");
      }

      setIsModalOpen(false);
      fetchActivities();
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
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 animate-scale-up">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-pink-700 mb-1">
          {modalMode === "create"
            ? "Tambah Kegiatan & Ekskul"
            : "Edit Kegiatan & Ekskul"}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Isi detail informasi kegiatan ekstrakurikuler atau program sejenis yang ditawarkan sekolah.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Judul Kegiatan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ekstrakurikuler Drumband / Renang Mingguan"
              value={formData.judul}
              onChange={(e) =>
                setFormData({ ...formData, judul: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kategori Kegiatan *
              </label>
              <select
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              >
                <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                <option value="Kegiatan Rutin">Kegiatan Rutin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Icon (Lucide React) *
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 shadow-xs">
                  {getPreviewIcon(formData.icon)}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Compass, Award, Music"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-medium"
                />
              </div>
            </div>
          </div>

          <div className="mt-1">
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
                const isSelected = formData.icon === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon: iconName })
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
              Keterangan / Deskripsi Kegiatan
            </label>
            <textarea
              rows={4}
              placeholder="Tuliskan penjelasan kegiatan, manfaat, jadwal, atau perlengkapan yang diperlukan di sini..."
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium resize-none"
            />
          </div>

          {/* Upload Foto / Gambar (Maks 3 Gambar) */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Upload Foto Dokumentasi Kegiatan (Opsional, Maks 3 Foto)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["gambar_1", "gambar_2", "gambar_3"] as const).map(
                (key, index) => {
                  const existing = existingImages[key];
                  const fileSelected = files[key];
                  const isCleared = clearedImages[key];
                  const hasImage = (fileSelected || existing) && !isCleared;
                  const canClear = (key === "gambar_2" || key === "gambar_3") && modalMode === "edit" && hasImage;

                  return (
                    <div
                      key={key}
                      className="border border-dashed border-slate-300 rounded-2xl p-3 bg-slate-50/50 flex flex-col items-center justify-center text-center relative hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-pink-600 uppercase mb-2">
                        Foto {index + 1}
                      </span>

                      {isCleared ? (
                        <div className="text-xs text-slate-400 mb-2 italic">Foto dihapus</div>
                      ) : fileSelected ? (
                        <div className="text-xs font-semibold text-slate-700 mb-2 truncate max-w-full">
                          {fileSelected.name}
                        </div>
                      ) : existing ? (
                        <img
                          src={getImageUrl(existing) || ""}
                          alt={`Foto ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-xl border mb-2"
                        />
                      ) : (
                        <Upload size={24} className="text-slate-400 mb-2" />
                      )}

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
                          <span>
                            {hasImage ? "Ubah" : "Pilih File"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileChange(key, e);
                              setClearedImages((prev) => ({ ...prev, [key]: false }));
                            }}
                            className="hidden"
                          />
                        </label>

                        {canClear && (
                          <button
                            type="button"
                            onClick={() => {
                              setFiles((prev) => ({ ...prev, [key]: null }));
                              setClearedImages((prev) => ({ ...prev, [key]: true }));
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
                            title="Hapus foto"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
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
              {formSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>
                {modalMode === "create" ? "Simpan Kegiatan" : "Update Kegiatan"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
