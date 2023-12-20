import React, { useState, useEffect } from "react";
import axios from "axios";
import FormulirPertukaran from "./FormulirPertukaran"; // Impor komponen FormulirPertukaran
import { closePop } from "../../../../assets";
import { getToken } from "../../../../utils/Config";

function PertukaranMahasiswa() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null); // State untuk menyimpan data yang diterima dari FormulirPertukaran // State untuk menyimpan data dari API
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [selectedYear, setSelectedYear] = useState("");

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

        console.log(response.data);

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

  return (
    <div className="pt-3">
      <h2 className="font-semibold text-gray-700 font-poppins">Pertukaran mahasiswa</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        <div className="flex px-3 py-3 mt-6 ml-1 text-base transition-transform hover:text-secondary rounded-lg w-[150px] bg-yellow-200 font-poppins hover:transform hover:scale-110 ">
          <img src="./src/assets/print.png" alt="" className="w-5 h-5" />
          <button className="pl-2" onClick={handleInputClick}>
            Input Data
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="tahun" className="block font-semibold">
            Filter berdasarkan Tahun:
          </label>
          <select id="tahun" className="p-2 border border-gray-300 rounded" value={selectedYear} onChange={handleYearChange}>
            <option value="">Pilih Tahun</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {showForm && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-[1200px] h-[800px] p-8 bg-white rounded-lg">
              {/* Tanda X sebagai tombol penutup */}
              <button className="absolute p-3 top-2 right-2" onClick={handleFormClose}>
                <img src={closePop} alt="" className="w-7" />
              </button>
              <FormulirPertukaran onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}

        <div className="p-4">
          {data
            .filter((achievement) => {
              if (selectedYear === "") {
                return true;
              } else {
                return achievement.year === selectedYear;
              }
            })
            .map((achievement) => (
              <div className="p-4 border border-secondary" key={achievement.id}>
                <p>Nama: {achievement.name}</p>
                <p>Kegiatan: {achievement.activity}</p>
                <p>Tahun: {achievement.year}</p>
                <p>Fakultas: {achievement.faculty}</p>
              </div>
            ))}
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default PertukaranMahasiswa;
