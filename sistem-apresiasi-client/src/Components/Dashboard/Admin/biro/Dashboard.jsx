import React from "react";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Selamat Datang di Aplikasi Kami!</h1>
      <p>Terima kasih telah bergabung. Anda dapat mulai menjelajahi fitur-fitur kami.</p>
      <div className="dashboard-features">
        <div className="dashboard-feature">
          <h2>Kelola Kegiatan</h2>
          <p>Kelola kegiatan Anda dengan mudah.</p>
        </div>

        <div className="dashboard-feature">
          <h2>Profil Anda</h2>
          <p>Lihat dan sunting profil Anda di sini.</p>
        </div>

        {/* Tambahkan fitur lain sesuai kebutuhan */}
      </div>
    </div>
  );
}

export default Dashboard;
