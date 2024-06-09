import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const KegiatanLomba = () => {
  const [data, setData] = useState([]);
  const token = getToken();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/achievements/independents/faculties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setData(response.data.data);
        } else {
          setError("Data not found");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  const handleExports = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/v1/exports/independents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Mengatur tipe respons sebagai blob (binary data)
      });

      // Membuat objek URL dari blob data
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));

      // Membuat elemen <a> untuk pengunduhan file
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Kegiatan_Mandiri.xlsx"); // Atur nama file yang ingin diunduh
      document.body.appendChild(link);

      // Klik pada elemen <a> untuk memulai pengunduhan otomatis
      link.click();

      // Hapus elemen <a> setelah selesai pengunduhan
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  // Logic to calculate indexes of items to be displayed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pt-3 overflow-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Lomba</h2>

      <div className="h-screen p-10 overflow-auto mt-9 shadow-boxShadow">
        <button
          type="submit"
          onClick={handleExports}
          className="px-4 py-2 my-5 text-base  transition-transform hover:text-secondary rounded-lg w-[150px] bg-yellow-400 hover:bg-yellow-200 font-poppins hover:transform hover:scale-105  mr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Exports
        </button>
        {currentItems.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="border border-gray-600 ">
                <th className="px-4 py-2 text-[15px] font-normal text-left ">Nama Kegiatan</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left ">Bidang Kegiatan</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left ">Tingkat</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left ">Tahun</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left ">Pemilik</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-4 py-2 text-[14px]">{item.name}</td>
                  <td className="px-4 py-2 text-[14px]">{item.level_activity}</td>
                  <td className="px-4 py-2 text-[14px]">{item.participant_type}</td>
                  <td className="px-4 py-2 text-[14px]">{item.year}</td>
                  <td className="px-4 py-2 text-[14px]">
                    {item.participants.map((participant, idx) => (
                      <div key={idx}>
                        <p>Nama: {participant.name}</p>
                        <p>NPM: {participant.npm}</p>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button className="px-3 py-1 mr-2 text-[13px] border rounded-md hover:bg-dimBlue hover:border-white border-amber-500" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <button className="px-3 py-1 ml-2 text-[13px] border rounded-md hover:bg-dimBlue hover:border-white border-amber-500" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length}>
            Next
          </button>
        </div>

        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default KegiatanLomba;
