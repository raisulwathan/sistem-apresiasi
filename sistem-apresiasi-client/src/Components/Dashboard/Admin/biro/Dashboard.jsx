import React from "react";

function Dashboard() {
  return (
    <div className="pt-6">
      <div className="min-h-screen py-12 dashboard-container shadow-boxShadow">
        <div className="max-w-4xl px-4 mx-auto">
          <h1 className="mb-6 text-3xl font-semibold text-gray-800">Selamat Datang di Aplikasi Kami!</h1>
          <p className="mb-8 text-lg text-gray-600">Terima kasih telah bergabung. Anda dapat mulai menjelajahi fitur-fitur kami.</p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-md dashboard-feature">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">Kelola Kegiatan</h2>
              <p className="text-gray-600">Kelola kegiatan Anda dengan mudah.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dashboard-feature">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">Profil Anda</h2>
              <p className="text-gray-600">Lihat dan sunting profil Anda di sini.</p>
            </div>
            {/* Tambahkan fitur lain sesuai kebutuhan */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
