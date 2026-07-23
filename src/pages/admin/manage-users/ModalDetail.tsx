import { X, Mail, MapPin, Briefcase, Tag, FileText } from "lucide-react";
import type { User } from "./Index";
import { getStorageUrl } from "../../../lib/axios";

interface ModalDetailProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedUser: User | null;
}

export default function ModalDetail({
  isDetailOpen,
  setIsDetailOpen,
  selectedUser,
}: ModalDetailProps) {
  if (!isDetailOpen || !selectedUser) return null;

  const avatarUrl = selectedUser.photo
    ? getStorageUrl(selectedUser.photo)
    : "/default/user-icon.webp";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative animate-scale-up">
        <button
          onClick={() => setIsDetailOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-4 relative">
            <img
              src={avatarUrl || "/default/user-icon.webp"}
              alt={selectedUser.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default/user-icon.webp";
              }}
            />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{selectedUser.name}</h2>
          <span className="text-xs font-semibold text-slate-400 font-mono mt-0.5">
            {selectedUser.email}
          </span>
        </div>

        {/* Information Body */}
        <div className="py-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-600 shrink-0">
              <Briefcase size={16} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Jabatan Utama
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {selectedUser.position}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-600 shrink-0">
              <Tag size={16} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Kategori / Peran
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {selectedUser.category || "-"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-600 shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Alamat Rumah
              </span>
              <span className="text-sm font-semibold text-slate-700 leading-relaxed">
                {selectedUser.address || "-"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-600 shrink-0">
              <FileText size={16} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Keterangan
              </span>
              <span className="text-sm font-semibold text-slate-700 leading-relaxed">
                {selectedUser.description || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsDetailOpen(false)}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}
