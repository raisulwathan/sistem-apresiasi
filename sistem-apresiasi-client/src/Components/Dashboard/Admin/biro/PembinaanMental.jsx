import React, { useState, useEffect } from "react";
import axios from "axios";
import FormulirPertukaran from "./FormulirPertukaran"; // Impor komponen FormulirPertukaran
import { closePop } from "../../../../assets";
import { getToken } from "../../../../utils/Config";
import FormulirMentalBangsa from "./FormuliMentalBangsa";

function PertukaranMahasiswa() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null); // State untuk menyimpan data yang diterima dari FormulirPertukaran // State untuk menyimpan data dari API
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [selectedYear, setSelectedYear] = useState("");
  const category = "Pembinaan Mental Kebangsaan";

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
      <h2 className="font-semibold text-gray-800 font-poppins">Pembinaan Mental Kebangsaan</h2>
      <div className="h-screen p-8 mt-8 shadow-boxShadow">
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
              <FormulirMentalBangsa onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {data
            .filter((achievement) => {
              if (selectedYear === "") {
                return true;
              } else {
                return achievement.year === selectedYear;
              }
            })
            .map((achievement) => (
              <div className="p-4 transition duration-300 bg-white border rounded-lg shadow-md border-secondary hover:shadow-lg" key={achievement.id}>
                <p className="text-gray-700">
                  <span className="text-lg font-semibold text-gray-900 ">
                    Nama : <br />
                  </span>
                  <span> - {achievement.name}</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-lg font-semibold text-gray-900 ">Pengakuan / jenis kegiatan : </span> <br />
                  <span> - {achievement.activity}</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-lg font-semibold text-gray-900 ">Tingkatan : </span> <br />
                  <span> - {achievement.level_activity}</span>
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
      </div>
    </div>
  );
}

export default PertukaranMahasiswa;
