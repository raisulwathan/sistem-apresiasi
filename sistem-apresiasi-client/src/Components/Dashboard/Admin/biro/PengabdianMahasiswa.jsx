import React, { useState, useEffect } from "react";
import axios from "axios";
import { closePop } from "../../../../assets";
import { getToken } from "../../../../utils/Config";
import FormulirPengabdian from "./FormulirPengabdian";

function PengabdianMahasiswa() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null); // State untuk menyimpan data yang diterima dari FormulirPertukaran // State untuk menyimpan data dari API
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const category = "Pengabdian Mahasiswa kepada Masyarakat";

  const handleInputClick = () => {
    setShowForm(true);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setShowForm(false);
  };

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
      link.setAttribute("download", "Pengabdian_Mahasiswa.xlsx"); // Atur nama file yang ingin diunduh
      document.body.appendChild(link);

      // Klik pada elemen <a> untuk memulai pengunduhan otomatis
      link.click();

      // Hapus elemen <a> setelah selesai pengunduhan
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/achievements/noncompetitions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const responseData = response.data.data;
          const filteredData = responseData.filter((data) => data.category === category);

          setData(filteredData);
        } else {
          setError("Data not found");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="pt-3 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">Pengabdian Mahasiswa</h2>
      <div className="h-screen p-5 overflow-y-auto mt-9 shadow-boxShadow bg-slate-50" style={{ overflowY: "scroll", maxHeight: "90vh", minHeight: "90vh" }}>
        <div className="p-10 bg-white border shadow-xl">
          <div className="flex justify-between">
            <button className="px-4 py-2 text-white text-[15px] transition-all duration-300 ease-in-out rounded-lg shadow-md cursor-pointer my-9 bg-amber-500 font-poppins hover:scale-105 hover:shadow-xl" onClick={handleInputClick}>
              Input Data
            </button>

            <button
              type="submit"
              onClick={handleExports}
              className="px-4 py-2 text-[15px] ml-auto mr-8 text-base transition-transform border rounded-lg my-9 hover:text-white border-amber-500 hover:bg-yellow-500 font-poppins hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Exports
            </button>
          </div>

          <div className="mt-4">
            <select id="tahun" className="p-2 mt-5 bg-white border text-[14px] rounded-md border-amber-500" value={selectedYear} onChange={handleYearChange}>
              <option value="">Pilih Tahun</option>
              {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative w-[1200px] h-[800px] p-8 bg-white rounded-lg">
                <button className="absolute p-3 top-2 right-2" onClick={handleFormClose}>
                  <img src={closePop} alt="" className="w-7" />
                </button>
                <FormulirPengabdian onSubmit={handleFormSubmit} />
              </div>
            </div>
          )}

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Kegiatan
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Tahun
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Fakultas
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData
                  .filter((achievement) => selectedYear === "" || achievement.year === selectedYear)
                  .map((achievement, index) => (
                    <tr key={achievement.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{achievement.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{achievement.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{achievement.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{achievement.faculty}</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-14">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-1 mr-2 border text-[15px] rounded-lg hover:text-white hover:border-white hover:bg-amber-500 border-amber-500">
              Previous
            </button>
            <button onClick={goToNextPage} disabled={indexOfLastItem >= data.length} className="px-3 py-1 border text-[15px] rounded-lg hover:text-white hover:border-white hover:bg-amber-500 border-amber-500">
              Next
            </button>
            <p className="mt-4 text-[15px]">
              Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
            </p>
          </div>

          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default PengabdianMahasiswa;
