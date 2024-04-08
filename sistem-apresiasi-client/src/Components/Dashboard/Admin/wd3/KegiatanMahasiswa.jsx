import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const KegiatanMahasiswa = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(3); // Jumlah kegiatan per halaman
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/activities/faculties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.data.activities);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Menghitung index data awal dan akhir untuk halaman saat ini
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = data.slice(indexOfFirstActivity, indexOfLastActivity);

  // Mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pt-3 overflow-y-auto ">
      <h2 className="ml-4 font-semibold text-gray-700 font-poppins lg:ml-0">Kegiatan Mahasiswa</h2>
      <div className="h-screen overflow-y-auto lg:h-screen mt-9 shadow-boxShadow">
        <div className="p-4 mt-2">
          {error ? (
            <p>Terjadi kesalahan: {error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentActivities.map((activity, index) => (
                <div key={index} className="overflow-hidden bg-white rounded-lg shadow-lg">
                  <div className="p-6">
                    <p className="mb-4 text-sm text-gray-600">{activity.name}</p>
                    <p className="mb-4 text-sm text-gray-600">Kategori: {activity.fieldsActivity}</p>
                    <p className="mb-4 text-sm text-gray-600">Tingkat: {activity.levels}</p>
                    <p className="mb-4 text-sm text-gray-600">Poin: {activity.points}</p>
                    <p className="mb-4 text-sm text-gray-600">Mahasiswa: {activity.owner.name}</p>
                    <p className="mb-4 text-sm text-gray-600">Status: {activity.status}</p>
                    <p className="mb-4 text-sm text-gray-600">Tahun: {activity.years}</p>
                    <a href={activity.fileUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                      Lihat Sertifikat
                    </a>
                  </div>
                </div>
              ))}
              {data.length === 0 && <p className="col-span-3 text-center text-gray-600">Data tidak tersedia.</p>}
            </div>
          )}
          {/* Navigasi halaman */}
          <div className="flex justify-center gap-4 mt-4 mb-28">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary">
              Previous Page
            </button>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastActivity >= data.length} className="px-4 py-2 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary">
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KegiatanMahasiswa;
