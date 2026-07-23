import { Link } from "react-router";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-pink-900 text-pink-100 py-12 border-t border-pink-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Sekolah */}
        <div className="flex flex-col md:items-start md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">
              TK Raudlatul Hikmah
            </h2>
          </div>
          <p className="text-pink-200 text-sm leading-relaxed">
            Dsn. Juwet, Ds. Dukuhdimoro, Kec. Mojoagung, Kab. Jombang, Jawa
            Timur.
          </p>
        </div>

        {/* Akses Cepat */}
        <div className="flex flex-col md:items-center">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Akses Cepat</h3>
            <ul className="space-y-2 text-sm text-pink-200">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition-colors"
                >
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link
                  to="/acara"
                  className="hover:text-white transition-colors"
                >
                  Acara & Berita
                </Link>
              </li>
              <li>
                <Link
                  to="/rapot"
                  className="hover:text-white transition-colors"
                >
                  Rapot Harian
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Portal Guru */}
        <div className="flex flex-col md:items-end">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Media Sosial</h3>
            <ul className="space-y-2 text-sm text-pink-200">
              <li className="hover:text-white transition-colors">
                <a href="https://facebook.com/tkraudlatulhikmah">Facebook</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="https://instagram.com/tkraudlatulhikmah">Instagram</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="https://youtube.com/tkraudlatulhikmah">Youtube</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="https://tiktok.com/tkraudlatulhikmah">TikTok</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-pink-800/50 text-center text-sm text-pink-300">
        &copy; {new Date().getFullYear()} TK Raudlatul Hikmah. All rights
        reserved.
      </div>
    </footer>
  );
}
