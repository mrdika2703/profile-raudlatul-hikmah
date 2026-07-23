import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import CameraScan from "./CameraScan";
import Header from "./Header";
import Table from "./Table";
import Modal from "./Modal";

interface Siswa {
  id: number;
  nisn: string;
  nama_lengkap: string;
  kelas: any;
}

export interface Absensi {
  id: number;
  siswa_id: number;
  absen_date: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  keterangan: string | null;
  siswa: Siswa;
}

export default function ManageAbsensi() {
  const [searchParams] = useSearchParams();
  // State Mode Layar
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("scan") === "true") {
      setIsCameraOpen(true);
    }
  }, [searchParams]);

  // State Daftar Absensi & Filter
  const [absensis, setAbsensis] = useState<Absensi[]>([]);
  const [allSiswas, setAllSiswas] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0],
  );
  const [filterKelas, setFilterKelas] = useState("Semua Kelas");
  const [searchQuery, setSearchQuery] = useState("");

  // State Modal CRUD Manual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    siswa_id: "",
    absen_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    status: "Hadir" as "Hadir" | "Izin" | "Sakit" | "Alpa",
    keterangan: "",
  });

  // --- LOGIKA DATA ABSEN & CRUD ---
  const fetchAbsensis = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/absensis?date=${filterDate}&kelas=${filterKelas}`,
      );
      setAbsensis(response.data);
    } catch (error) {
      console.error("Gagal memuat absensi:", error);
      toast.error("Gagal memuat riwayat absensi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSiswas = async () => {
    try {
      const response = await api.get("/siswas");
      setAllSiswas(response.data);
    } catch (error) {
      console.error("Gagal memuat data siswa:", error);
    }
  };

  const fetchKelasList = async () => {
    try {
      const response = await api.get("/kelas");
      setKelasList(response.data);
    } catch (error) {
      console.error("Gagal memuat data kelas:", error);
    }
  };

  useEffect(() => {
    fetchKelasList();
  }, []);

  useEffect(() => {
    fetchAbsensis();
    fetchAllSiswas();
  }, [filterDate, filterKelas]);

  const filteredAbsensis = absensis.filter(
    (a) =>
      a.siswa?.nama_lengkap
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      a.siswa?.nisn?.includes(searchQuery) ||
      a.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      siswa_id: "",
      absen_date: new Date().toISOString().slice(0, 16),
      status: "Hadir",
      keterangan: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (absen: Absensi) => {
    setModalMode("edit");
    setSelectedId(absen.id);
    setFormData({
      siswa_id: absen.siswa_id.toString(),
      absen_date: absen.absen_date.slice(0, 16),
      status: absen.status,
      keterangan: absen.keterangan || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post("/absensis", formData);
        toast.success("Absensi berhasil disimpan!");
      } else {
        await api.put(`/absensis/${selectedId}`, {
          status: formData.status,
          keterangan: formData.keterangan,
        });
        toast.success("Status absensi berhasil diperbarui!");
      }
      setIsModalOpen(false);
      fetchAbsensis();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Gagal menyimpan data absensi.";
      toast.error(errorMsg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const showSuccess = (msg: string) => toast.success(msg);
  const showError = (msg: string) => toast.error(msg);

  const getKelasName = (kelas: any) => {
    if (!kelas) return "";
    if (typeof kelas === "object") {
      return kelas.kelas ? `Kelas ${kelas.kelas}` : "";
    }
    return String(kelas).startsWith("Kelas")
      ? String(kelas)
      : `Kelas ${kelas}`;
  };

  const activeKelasList = kelasList.filter((k) => k.status === "Aktif");
  const daftarKelas = [
    { id: "Semua Kelas", display: "Semua Kelas" },
    ...activeKelasList.map((k) => {
      const displaySemester = k.semester === "Ganjil" ? "1" : k.semester === "Genap" ? "2" : k.semester;
      return {
        id: k.id.toString(),
        display: `Kelas ${k.kelas} ${k.tahun_ajaran} - ${displaySemester}`,
      };
    }),
  ];

  // =================================================================
  // RENDER 1: MODE FULL KAMERA BERSIH
  // =================================================================
  if (isCameraOpen) {
    return (
      <CameraScan
        setIsCameraOpen={setIsCameraOpen}
        isCameraOpen={isCameraOpen}
        api={api}
        fetchAbsensis={fetchAbsensis}
      />
    );
  }

  // =================================================================
  // RENDER 2: TAMPILAN DEFAULT
  // =================================================================
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. SECTION ATAS: TOMBOL HERO KAMERA ABSENSI */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-pink-200 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="max-w-xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ⚡ Absensi Otomatis
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 leading-tight">
            Siap Memulai Absensi Hari Ini?
          </h1>
          <p className="text-pink-100 text-sm mt-2 leading-relaxed">
            Klik tombol di samping untuk membuka layar kamera bersih. Arahkan
            kartu QR siswa dan sistem akan mencatat kehadiran secara otomatis
            tanpa ketuk layar.
          </p>
        </div>

        <button
          onClick={() => setIsCameraOpen(true)}
          className="w-full md:w-auto px-8 py-5 bg-white text-pink-600 hover:bg-pink-50 active:bg-pink-100 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 shrink-0 group transform hover:-translate-y-0.5"
        >
          <Camera
            size={26}
            className="text-pink-600 group-hover:scale-110 transition-transform"
          />
          <span>Buka Kamera Absensi</span>
          <Maximize2 size={18} className="text-slate-400" />
        </button>
      </div>

      {/* 2. SECTION BAWAH: CRUD & DAFTAR ABSENSI HARI INI */}
      <div className="space-y-4">
        {/* Header & Filter */}
        <Header
          fetchAbsensis={fetchAbsensis}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          daftarKelas={daftarKelas}
          filterKelas={filterKelas}
          setFilterKelas={setFilterKelas}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleOpenCreate={handleOpenCreate}
        />

        {/* Tabel Data Absensi */}
        <Table
          loading={loading}
          filteredAbsensis={filteredAbsensis}
          absensis={absensis}
          setAbsensis={setAbsensis}
          api={api}
          handleOpenEdit={handleOpenEdit}
          showSuccess={showSuccess}
          showError={showError}
        />
      </div>

      {/* MODAL FORM MANUAL (IZIN / SAKIT / EDIT) */}
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          modalMode={modalMode}
          handleSubmitModal={handleSubmitModal}
          allSiswas={allSiswas}
          formData={formData}
          setFormData={setFormData}
          formSubmitting={formSubmitting}
        />
      )}
    </div>
  );
}
