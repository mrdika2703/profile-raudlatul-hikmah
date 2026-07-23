import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import SearchBar from "./SearchBar";
import Table from "./Table";
import ModalCrud from "./ModalCrud";
import ModalDetail from "./ModalDetail";

export interface Activity {
  id: number;
  judul: string;
  kategori: string;
  keterangan: string | null;
  icon: string | null;
  gambar_1: string | null;
  gambar_2: string | null;
  gambar_3: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityFormData {
  judul: string;
  kategori: string;
  keterangan: string;
  icon: string;
}

export default function ManageActivity() {
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Ekstrakurikuler");
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Modal CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal Detail State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Form Data State
  const [formData, setFormData] = useState<ActivityFormData>({
    judul: "",
    kategori: "Ekstrakurikuler",
    keterangan: "",
    icon: "Compass",
  });

  // Files State
  const [files, setFiles] = useState<{
    gambar_1: File | null;
    gambar_2: File | null;
    gambar_3: File | null;
  }>({
    gambar_1: null,
    gambar_2: null,
    gambar_3: null,
  });

  // Existing images state for edit mode
  const [existingImages, setExistingImages] = useState<{
    gambar_1: string | null;
    gambar_2: string | null;
    gambar_3: string | null;
  }>({
    gambar_1: null,
    gambar_2: null,
    gambar_3: null,
  });

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await api.get("/activity");
      setActivitiesList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kegiatan:", error);
      toast.error("Gagal memuat data kegiatan dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const categories = ["Ekstrakurikuler", "Kegiatan Rutin"];

  const filteredActivities = activitiesList.filter((a) => {
    const matchesSearch = a.judul
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = a.kategori === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      judul: "",
      kategori: "Ekstrakurikuler",
      keterangan: "",
      icon: "Compass",
    });
    setFiles({
      gambar_1: null,
      gambar_2: null,
      gambar_3: null,
    });
    setExistingImages({
      gambar_1: null,
      gambar_2: null,
      gambar_3: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Activity) => {
    setModalMode("edit");
    setSelectedId(item.id);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      keterangan: item.keterangan || "",
      icon: item.icon || "Compass",
    });
    setFiles({
      gambar_1: null,
      gambar_2: null,
      gambar_3: null,
    });
    setExistingImages({
      gambar_1: item.gambar_1,
      gambar_2: item.gambar_2,
      gambar_3: item.gambar_3,
    });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (item: Activity) => {
    setSelectedActivity(item);
    setIsDetailOpen(true);
  };

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <Header handleOpenCreate={handleOpenCreate} />

      {/* Search Bar & Filter Kategori */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Tabel Data Kegiatan */}
      <Table
        filteredActivities={filteredActivities}
        activitiesList={activitiesList}
        setActivitiesList={setActivitiesList}
        api={api}
        loading={loading}
        handleOpenEdit={handleOpenEdit}
        handleOpenDetail={handleOpenDetail}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Form CRUD */}
      <ModalCrud
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        api={api}
        selectedId={selectedId}
        fetchActivities={fetchActivities}
        formData={formData}
        setFormData={setFormData}
        files={files}
        setFiles={setFiles}
        existingImages={existingImages}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Detail Kegiatan */}
      <ModalDetail
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        selectedActivity={selectedActivity}
      />
    </div>
  );
}
