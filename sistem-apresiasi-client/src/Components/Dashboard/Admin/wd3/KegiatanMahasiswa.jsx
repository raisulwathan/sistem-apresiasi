import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const KegiatanMahasiswa = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(6); // Jumlah kegiatan per halaman
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

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = data.slice(indexOfFirstActivity, indexOfLastActivity);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pt-3 overflow-y-auto ">
      <h2 className="ml-4 font-semibold text-gray-700 font-poppins lg:ml-0">Kegiatan Mahasiswa</h2>
      <div className="h-screen overflow-y-auto bg-slate-50 lg:h-screen mt-9 shadow-boxShadow">
        <div className="p-4 mt-2">
          {error ? (
            <p>Terjadi kesalahan: {error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentActivities.map((activity, index) => (
                <div key={index} className="overflow-hidden bg-white border border-opacity-50 rounded-lg shadow-lg border-rose-300">
                  <div className="p-4">
                    <p className="mb-4 text-[15px] font-medium text-gray-600">
                      Kategori: <span className=" text-[14px] font-normal text-gray-700 ">{activity.fieldsActivity}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-600">
                      Tingkat: <span className=" text-[14px] font-normal text-gray-700 ">{activity.levels}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-600">
                      Poin: <span className=" text-[14px] font-normal text-gray-700 ">{activity.points}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-600">
                      Mahasiswa: <span className=" text-[14px] font-normal text-gray-700 ">{activity.owner.name}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-600">
                      Tahun: <span className=" text-[14px] font-normal text-gray-700 ">{activity.years}</span>
                    </p>
                    <a href={activity.fileUrl} target="_blank" rel="noopener noreferrer" className=" text-[14px] text-amber-700 font-medium hover:underline">
                      Lihat Sertifikat
                    </a>
                  </div>
                </div>
              ))}
              {data.length === 0 && <p className="col-span-3 text-center text-gray-600">Data tidak tersedia.</p>}
            </div>
          )}
          {/* Navigasi halaman */}
          <div className="flex justify-center gap-4 mt-9 mb-28">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm border rounded-md cursor-pointer hover:bg-dimBlue hover:border-white border-amber-500">
              Previous Page
            </button>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastActivity >= data.length} className="px-3 py-1 text-sm border rounded-md cursor-pointer hover:bg-dimBlue hover:border-white border-amber-500">
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KegiatanMahasiswa;
