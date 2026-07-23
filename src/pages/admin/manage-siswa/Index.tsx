import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import ModalCrud from "./ModalCrud";
import ModalQr from "./ModalQr";
import SearchBar from "./SearchBar";
import Table from "./Table";

export interface Siswa {
  id: number;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  kelas: any;
}

export default function KelolaSiswa() {
  const [siswas, setSiswas] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Aktif");
  const [selectedKelas, setSelectedKelas] = useState("Semua Kelas");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nisn: "",
    nama_lengkap: "",
    jenis_kelamin: "Laki-laki" as "Laki-laki" | "Perempuan",
    kelas: "",
  });

  const fetchSiswas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/siswas");
      setSiswas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
      toast.error("Gagal memuat data siswa dari server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchKelasList = async () => {
    try {
      const response = await api.get("/kelas");
      setKelasList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
    }
  };

  useEffect(() => {
    fetchSiswas();
    fetchKelasList();
  }, []);

  // Reset selectedKelas ketika selectedStatus berubah
  useEffect(() => {
    setSelectedKelas("Semua Kelas");
  }, [selectedStatus]);

  // Compile daftarKelas berdasarkan selectedStatus
  const filteredKelasList = kelasList.filter((k) =>
    selectedStatus === "Semua Status" ? true : k.status === selectedStatus
  );
  const daftarKelas = [
    { id: "Semua Kelas", display: "Semua Kelas" },
    ...filteredKelasList.map((k) => {
      const displaySemester = k.semester === "Ganjil" ? "1" : k.semester === "Genap" ? "2" : k.semester;
      return {
        id: k.id.toString(),
        display: `Kelas ${k.kelas} ${k.tahun_ajaran} - ${displaySemester}`,
      };
    }),
  ];

  const filteredSiswas = siswas.filter((s) => {
    const matchesSearch =
      s.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);

    const classObj = s.kelas;
    const classStatus = classObj && typeof classObj === "object" ? classObj.status : "Aktif";
    const classId = classObj && typeof classObj === "object" ? classObj.id.toString() : "";

    const matchesStatus =
      selectedStatus === "Semua Status" || classStatus === selectedStatus;

    const matchesKelas =
      selectedKelas === "Semua Kelas" || classId === selectedKelas;

    return matchesSearch && matchesStatus && matchesKelas;
  });

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      nisn: "",
      nama_lengkap: "",
      jenis_kelamin: "Laki-laki",
      kelas: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setModalMode("edit");
    setSelectedId(siswa.id);
    setFormData({
      nisn: siswa.nisn,
      nama_lengkap: siswa.nama_lengkap,
      jenis_kelamin: siswa.jenis_kelamin,
      kelas: siswa.kelas && typeof siswa.kelas === "object" ? siswa.kelas.id.toString() : String(siswa.kelas || ""),
    });
    setIsModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Buttons */}
      <Header
        setIsQrModalOpen={setIsQrModalOpen}
        siswas={siswas}
        handleOpenCreate={handleOpenCreate}
      />

      {/* Filter / Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedKelas={selectedKelas}
        setSelectedKelas={setSelectedKelas}
        daftarKelas={daftarKelas}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Tabel Data Siswa */}
      <Table
        filteredSiswas={filteredSiswas}
        siswas={siswas}
        setSiswas={setSiswas}
        api={api}
        loading={loading}
        handleOpenEdit={handleOpenEdit}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* --- MODAL PILIH KELAS & DOWNLOAD QR CODE --- */}
      <ModalQr
        siswas={siswas}
        kelasList={kelasList}
        isQrModalOpen={isQrModalOpen}
        setIsQrModalOpen={setIsQrModalOpen}
      />

      {/* --- MODAL FORM CRUD (Create / Edit) --- */}
      <ModalCrud
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        api={api}
        selectedId={selectedId}
        fetchSiswas={fetchSiswas}
        kelasList={kelasList}
        setFormData={setFormData}
        formData={formData}
        showSuccess={showSuccess}
        showError={showError}
      />
    </div>
  );
}
