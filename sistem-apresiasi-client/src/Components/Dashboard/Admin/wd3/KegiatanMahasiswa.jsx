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
    <div className="h-screen p-6 lg:p-16 bg-[#424461] overflow-y-auto ">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Kegiatan Mahasiswa</h2>
      <div className=" bg-[#313347] rounded-md p-2 lg:p-5 shadow-2xl mt-9">
        <div className="mt-2 lg:p-4">
          {error ? (
            <p>Terjadi kesalahan: {error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentActivities.map((activity, index) => (
                <div key={index} className="overflow-hidden bg-[#1c1d29] rounded-lg shadow-lg ">
                  <div className="p-4">
                    <p className="mb-4 text-[15px] font-medium text-gray-300">
                      Kategori: <span className=" text-[14px] font-normal text-gray-400 ">{activity.fieldsActivity}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-300">
                      Tingkat: <span className=" text-[14px] font-normal text-gray-400 ">{activity.levels}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-300">
                      Poin: <span className=" text-[14px] font-normal text-gray-400 ">{activity.points}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-300">
                      Mahasiswa: <span className=" text-[14px] font-normal text-gray-400 ">{activity.owner.name}</span>
                    </p>
                    <p className="mb-4 text-[15px] font-medium text-gray-300">
                      Tahun: <span className=" text-[14px] font-normal text-gray-400 ">{activity.years}</span>
                    </p>
                    <a href={activity.fileUrl} target="_blank" rel="noopener noreferrer" className=" text-[14px] text-[#0F6292] font-medium hover:underline">
                      Lihat Sertifikat
                    </a>
                  </div>
                </div>
              ))}
              {data.length === 0 && <p className="col-span-3 text-center text-gray-600">Data tidak tersedia.</p>}
            </div>
          )}
          {/* Navigasi halaman */}
          <div className="flex justify-center gap-4 mt-9 ">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]">
              Previous Page
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastActivity >= data.length}
              className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KegiatanMahasiswa;
