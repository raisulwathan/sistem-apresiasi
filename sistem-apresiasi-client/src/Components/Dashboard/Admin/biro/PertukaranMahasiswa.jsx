import React, { useState, useEffect } from "react";
import axios from "axios";
import FormulirPertukaran from "./FormulirPertukaran";
import { closePop } from "../../../../assets";
import { getToken } from "../../../../utils/Config";

function PertukaranMahasiswa() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [years, setYears] = useState([]);

  const token = getToken();
  const itemsPerPage = 5;
  const category = "Pertukaran Mahasiswa Nasional dan Internasional";

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
      const response = await axios.get("http://localhost:5001/api/v1/exports/noncompetitions/pertukaran", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Pertukaran_Mahasiswa.xlsx");
      document.body.appendChild(link);

      link.click();
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

          // Extract unique years from the data
          const uniqueYears = Array.from(new Set(filteredData.map((item) => item.year)));
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
    <div className="h-screen p-16 bg-[#424461] overflow-y-auto">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Pertukaran Mahasiswa</h2>
      <div className="bg-[#313347] p-14 rounded-lg shadow-2xl mt-9">
        <div className="flex justify-between">
          <button className="px-4 py-2 text-gray-300 text-[15px] transition-all duration-300 ease-in-out rounded-lg shadow-md cursor-pointer my-9 bg-[#0F6292] font-poppins hover:scale-105 hover:shadow-xl" onClick={handleInputClick}>
            Input Data
          </button>

          <button
            type="submit"
            onClick={handleExports}
            className="px-4 py-2 text-[15px] ml-auto mr-8 text-base text-gray-300 transition-transform border rounded-lg my-9 hover:text-white border-[#0F6292] hover:bg-[#0F6292]  font-poppins hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Exports
          </button>
        </div>

        <div className="mt-4">
          <select id="tahun" className="p-2 mt-5 bg-[#313347] text-gray-300 border text-[14px] rounded-md border-[#0F6292]" value={selectedYear} onChange={handleYearChange}>
            <option value="">Pilih Tahun</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-[1000px] h-auto p-8 bg-[#313347] rounded-lg">
              <button className="absolute p-3 top-2 right-2" onClick={handleFormClose}>
                <img src={closePop} alt="" className="w-7" />
              </button>
              <FormulirPertukaran onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full ">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29]">
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Kegiatan
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Tahun
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Fakultas
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData
                .filter((achievement) => selectedYear === "" || achievement.year === selectedYear)
                .map((achievement) => (
                  <tr key={achievement.id} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{achievement.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{achievement.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{achievement.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{achievement.faculty}</div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14">
          <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]">
            Previous
          </button>
          <button onClick={goToNextPage} disabled={indexOfLastItem >= data.length} className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]">
            Next
          </button>
          <p className="mt-4 text-gray-400 text-[15px]">
            Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
          </p>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default PertukaranMahasiswa;
