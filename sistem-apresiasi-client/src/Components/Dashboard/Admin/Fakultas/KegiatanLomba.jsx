import React, { useState, useEffect } from "react";
import axios from "axios";

const KegiatanLomba = () => {
  const [dataApi, setDataApi] = useState([]);

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      const response = await axios.get("URL_API");
      setDataApi(response.data); // Menyimpan data dari API ke state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Memanggil fungsi fetchData saat komponen dimuat
  }, []);

  return (
    <div className="pt-3">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Lomba</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        {dataApi.map((item) => (
          <div key={item.id}>
            <p>Nama Kegiatan: {item.eventName}</p>
            {/* Tampilkan informasi lainnya dari data API */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KegiatanLomba;
