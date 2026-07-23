import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col">
      <Header />

      {/* flex-grow membuat konten otomatis mengisi ruang kosong, mendorong footer ke bawah */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
