import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const KegiatanLomba = () => {
  const [data, setData] = useState([]);
  const token = getToken();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

          // Extract unique years from the data
          const uniqueYears = Array.from(new Set(response.data.data.map((item) => item.year)));
          setYears(uniqueYears);
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Logic to filter data based on search query
  const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Logic to calculate indexes of items to be displayed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.filter((item) => selectedYear === "" || item.year === selectedYear).slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="h-screen p-16 bg-[#424461] overflow-y-auto">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Kegiatan Lomba</h2>

      <div className="mt-9 p-10 bg-[#313347] rounded-2xl">
        <button
          type="submit"
          onClick={handleExports}
          className="px-4 py-2 my-5 text-base transition-transform rounded-lg w-[150px] bg-yellow-400 hover:bg-yellow-600 font-poppins hover:transform hover:scale-105 mr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Exports
        </button>

        <div className="flex justify-between mb-6 mt-7">
          <div>
            <select id="tahun" className="p-2 text-gray-300 border bg-[#313347] text-[14px] rounded-md border-[#0F6292]" value={selectedYear} onChange={handleYearChange}>
              <option value="">Pilih Tahun</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <input type="text" placeholder="Cari Nama kegiatan" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 text-gray-300 border bg-[#313347] text-[14px] rounded-md border-[#0F6292]" />
          </div>
        </div>

        {currentItems.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] ">
                <th className="px-4 py-2 text-[15px] font-normal text-left">Nama Kegiatan</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left">Bidang Kegiatan</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left">Tingkat</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left">Tahun</th>
                <th className="px-4 py-2 text-[15px] font-normal text-left">Pemilik</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
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
          <button className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <button
            className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= data.length}
          >
            Next
          </button>
        </div>

        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default KegiatanLomba;
