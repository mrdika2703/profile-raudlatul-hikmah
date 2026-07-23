import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import SearchBar from "./SearchBar";
import Table from "./Table";
import ModalCrud from "./ModalCrud";
import ModalDetail from "./ModalDetail";

export interface User {
  id: number;
  name: string;
  email: string;
  position: "Kepala Sekolah" | "Operator" | "Guru";
  category: string | null;
  photo: string | null;
  address: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  position: "Kepala Sekolah" | "Operator" | "Guru";
  category: string;
  address: string;
  description: string;
}

export default function ManageUsers() {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("Semua Jabatan");
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Modal CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal Detail State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form Data State
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    position: "Guru",
    category: "",
    address: "",
    description: "",
  });

  // Files State
  const [files, setFiles] = useState<{
    photo: File | null;
  }>({
    photo: null,
  });

  // Existing images state for edit mode
  const [existingImages, setExistingImages] = useState<{
    photo: string | null;
  }>({
    photo: null,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsersList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      toast.error("Gagal memuat data user dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition =
      selectedPosition === "Semua Jabatan" || u.position === selectedPosition;

    return matchesSearch && matchesPosition;
  });

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      name: "",
      email: "",
      password: "",
      position: "Guru",
      category: "",
      address: "",
      description: "",
    });
    setFiles({
      photo: null,
    });
    setExistingImages({
      photo: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: User) => {
    setModalMode("edit");
    setSelectedId(item.id);
    setFormData({
      name: item.name,
      email: item.email,
      password: "", // Jangan tampilkan password lama demi keamanan
      position: item.position,
      category: item.category || "",
      address: item.address || "",
      description: item.description || "",
    });
    setFiles({
      photo: null,
    });
    setExistingImages({
      photo: item.photo,
    });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (item: User) => {
    setSelectedUser(item);
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

      {/* Search Bar & Filter Jabatan */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
      />

      {/* Tabel Data User */}
      <Table
        filteredUsers={filteredUsers}
        usersList={usersList}
        setUsersList={setUsersList}
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
        fetchUsers={fetchUsers}
        formData={formData}
        setFormData={setFormData}
        files={files}
        setFiles={setFiles}
        existingImages={existingImages}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Detail User */}
      <ModalDetail
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
}
