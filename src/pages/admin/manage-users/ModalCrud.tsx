import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import type { UserFormData } from "./Index";
import { getStorageUrl } from "../../../lib/axios";

interface ModalCrudProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: "create" | "edit";
  api: any;
  selectedId: number | null;
  fetchUsers: () => void;
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  files: {
    photo: File | null;
  };
  setFiles: React.Dispatch<
    React.SetStateAction<{
      photo: File | null;
    }>
  >;
  existingImages: {
    photo: string | null;
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
  fetchUsers,
  formData,
  setFormData,
  files,
  setFiles,
  existingImages,
  showSuccess,
  showError,
}: ModalCrudProps) {
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("position", formData.position);
      payload.append("category", formData.category || "");
      payload.append("address", formData.address || "");
      payload.append("description", formData.description || "");

      // Password handling
      if (formData.password) {
        payload.append("password", formData.password);
      }

      if (files.photo) {
        payload.append("photo", files.photo);
      }

      if (modalMode === "create") {
        if (!formData.password) {
          showError("Password wajib diisi untuk user baru!");
          setFormSubmitting(false);
          return;
        }
        await api.post("/users", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("User berhasil ditambahkan!");
      } else {
        payload.append("_method", "PUT");
        await api.post(`/users/${selectedId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("User berhasil diperbarui!");
      }

      setIsModalOpen(false);
      fetchUsers();
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
          {modalMode === "create" ? "Tambah Akun Staff / User" : "Edit Akun Staff / User"}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Isi detail data staff dan atur hak akses sistem.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Siti Rosyidah"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Email *
              </label>
              <input
                type="email"
                required
                placeholder="Contoh: rosyidah@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password {modalMode === "create" ? "*" : "(Kosongkan jika tidak diubah)"}
              </label>
              <input
                type="password"
                required={modalMode === "create"}
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Jabatan / Posisi *
              </label>
              <select
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value as any })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              >
                <option value="Guru">Guru</option>
                <option value="Operator">Operator</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kategori / Peran Tambahan
              </label>
              <input
                type="text"
                placeholder="Contoh: Admin, Operator dan Guru"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Rumah
              </label>
              <input
                type="text"
                placeholder="Contoh: Jl. Diponegoro No. 12"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Keterangan / Deskripsi Ringkas
            </label>
            <textarea
              rows={3}
              placeholder="Tulis informasi tambahan mengenai staff di sini..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium resize-none"
            />
          </div>

          {/* Upload Foto Profil */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Foto Profil
            </label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="w-16 h-16 rounded-full border border-slate-100 overflow-hidden bg-white shrink-0">
                {files.photo ? (
                  <img
                    src={URL.createObjectURL(files.photo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : existingImages.photo ? (
                  <img
                    src={getStorageUrl(existingImages.photo) || "/default/user-icon.webp"}
                    alt="Existing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/default/user-icon.webp"
                    alt="Default User"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs">
                  <Upload size={14} />
                  <span>Pilih Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">
                  Format gambar JPG, PNG, atau WEBP. Maksimal 2MB.
                </p>
              </div>
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
                {modalMode === "create" ? "Simpan User" : "Update User"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
