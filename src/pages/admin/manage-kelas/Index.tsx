import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import SearchBar from "./SearchBar";
import Table from "./Table";
import ModalCrud from "./ModalCrud";

export interface Kelas {
  id: number;
  kelas: string;
  semester: string;
  tahun_ajaran: string;
  status: "Aktif" | "Lulus";
  created_at?: string;
  updated_at?: string;
}

export default function ManageKelas() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Modal CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const defaultTahunAjaran = `${currentYear}/${currentYear + 1}`;

  const [formData, setFormData] = useState({
    kelas: "",
    semester: "Ganjil",
    tahun_ajaran: defaultTahunAjaran,
    status: "Aktif" as "Aktif" | "Lulus",
  });

  const fetchKelasList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/kelas");
      setKelasList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
      toast.error("Gagal memuat data kelas dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelasList();
  }, []);

  const filteredKelas = kelasList.filter((item) => {
    const matchesSearch =
      item.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tahun_ajaran.includes(searchQuery) ||
      item.semester.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "Semua Status" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      kelas: "",
      semester: "Ganjil",
      tahun_ajaran: defaultTahunAjaran,
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kelas: Kelas) => {
    setModalMode("edit");
    setSelectedId(kelas.id);
    setFormData({
      kelas: kelas.kelas,
      semester: kelas.semester,
      tahun_ajaran: kelas.tahun_ajaran,
      status: kelas.status,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (kelas: Kelas) => {
    try {
      const response = await api.patch(`/kelas/${kelas.id}/status`);
      toast.success(response.data.message || "Status kelas berhasil diperbarui!");
      // Update local state
      setKelasList((prev) =>
        prev.map((k) => (k.id === kelas.id ? response.data.data : k))
      );
    } catch (error) {
      toast.error("Gagal mengubah status kelas.");
    }
  };

  const handleNaikKelas = async (kelas: Kelas) => {
    try {
      const response = await api.post(`/kelas/${kelas.id}/naik-kelas`);
      toast.success(response.data.message || "Kelas berhasil naik kelas!");
      // Update local state
      setKelasList((prev) =>
        prev.map((k) => (k.id === kelas.id ? response.data.data : k))
      );
    } catch (error) {
      toast.error("Gagal menaikkan semester/tahun ajaran kelas.");
    }
  };

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  return (
    <div className="space-y-6">
      <Header handleOpenCreate={handleOpenCreate} />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <Table
        filteredKelas={filteredKelas}
        kelasList={kelasList}
        setKelasList={setKelasList}
        api={api}
        loading={loading}
        handleOpenEdit={handleOpenEdit}
        handleNaikKelas={handleNaikKelas}
        showSuccess={showSuccess}
        showError={showError}
      />

      <ModalCrud
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        api={api}
        selectedId={selectedId}
        fetchKelasList={fetchKelasList}
        setFormData={setFormData}
        formData={formData}
        showSuccess={showSuccess}
        showError={showError}
      />
    </div>
  );
}
