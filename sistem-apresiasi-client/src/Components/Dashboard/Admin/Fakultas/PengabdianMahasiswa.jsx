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
      const response = await axios.get("http://localhost:5001/api/v1/exports/independents/faculties", {
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
      link.setAttribute("download", "Pengabdian_Mahasiswa.xlsx");
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
        } else {
          setError("Data not found");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="pt-6">
      <h2 className="font-semibold text-gray-800 font-poppins">Pengabdian Mahasiswa kepada Masyarakat</h2>
      <div className="h-screen p-8 mt-8 shadow-boxShadow ">
        <div className="flex items-center py-3 transition-all duration-300 ease-in-out hover:text-white rounded-lg w-[150px] bg-dimBlue font-poppins hover:scale-105 cursor-pointer shadow-md hover:shadow-xl">
          <img src="./src/assets/print.png" alt="" className="w-5 h-5 pl-2 mr-2" />
          <button className=" text-secondary" onClick={handleInputClick}>
            Input Data
          </button>
        </div>

        <div className="mt-4">
          <select id="tahun" className="p-2 mt-5 border rounded-md border-secondary" value={selectedYear} onChange={handleYearChange}>
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

        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {data
            .filter((achievement) => selectedYear === "" || achievement.year === selectedYear)
            .map((achievement) => (
              <div className="p-4 transition duration-300 bg-white border rounded-lg shadow-md border-secondary hover:shadow-lg" key={achievement.id}>
                <p className="">
                  <span className="text-lg font-semibold text-gray-900 ">
                    Nama : <br />
                  </span>
                  <span> - {achievement.name}</span>
                </p>
                <p className="text-gray-700">
                  <span className="text-lg font-semibold text-gray-900">Kegiatan :</span>
                  <br /> <span className=""> - {achievement.category}</span>
                </p>
                <p className="text-gray-700">
                  <span className="text-lg font-semibold text-gray-900 ">Tahun: </span> <br />
                  <span> - {achievement.year}</span>
                </p>
                <p className="text-gray-700">
                  <span className="text-lg font-semibold text-gray-900">Fakultas: </span>
                  <br /> <span> - {achievement.faculty}</span>
                </p>
              </div>
            ))}
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <button
          type="submit"
          onClick={handleExports}
          className="px-4 py-2 my-9 text-base transition-transform hover:text-white rounded-lg w-[150px] bg-yellow-400 font-poppins hover:transform hover:scale-105 ml-auto mr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Exports
        </button>
      </div>
    </div>
  );
}

export default PengabdianMahasiswa;
