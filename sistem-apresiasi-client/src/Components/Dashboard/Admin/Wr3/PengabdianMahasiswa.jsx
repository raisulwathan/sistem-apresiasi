import React, { useState, useEffect } from "react";
import axios from "axios";
import FormulirPertukaran from "./FormulirPertukaran"; // Impor komponen FormulirPertukaran
import { closePop } from "../../../../assets";
import FormulirPengabdian from "./FormulirPengabdian";

function PertukaranMahasiswa() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null); // State untuk menyimpan data yang diterima dari FormulirPertukaran
  const [apiData, setApiData] = useState([]); // State untuk menyimpan data dari API

  const handleInputClick = () => {
    setShowForm(true); // Mengubah state untuk menampilkan pop-up formulir
  };

  const handleFormClose = () => {
    setShowForm(false); // Mengubah state untuk menutup pop-up formulir
  };

  const handleFormSubmit = async (data) => {
    setFormData(data); // Menyimpan data yang diterima dari FormulirPertukaran ke state
    setShowForm(false); // Menutup pop-up formulir setelah pengiriman data
    // Kirim data ke server menggunakan axios (contoh)
    try {
      const response = await axios.post("URL_API", data);
      console.log("Data berhasil dikirim:", response.data);
      // Setelah data dikirim, panggil fungsi untuk mengambil data dari API
      fetchDataFromAPI();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fungsi untuk mengambil data dari API
  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get("URL_API");
      setApiData(response.data); // Menyimpan data dari API ke state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

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

        {showForm && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-[1200px] h-[800px] p-8 bg-white rounded-lg">
              {/* Tanda X sebagai tombol penutup */}
              <button className="absolute p-3 top-2 right-2" onClick={handleFormClose}>
                <img src={closePop} alt="" className="w-7" />
              </button>
              {/* Memanggil komponen FormulirPertukaran dan meneruskan fungsi untuk menyimpan data */}
              <FormulirPengabdian onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}

        {/* Menampilkan data yang diterima dari API */}
        {apiData.length > 0 && (
          <div className="mt-4">
            <h3>Data yang diambil dari API:</h3>
            <ul>
              {apiData.map((data) => (
                <li key={data.id}></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PertukaranMahasiswa;
