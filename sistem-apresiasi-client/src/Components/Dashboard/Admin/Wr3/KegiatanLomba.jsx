import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const KegiatanLomba = () => {
  const [data, setData] = useState([]);
  const token = getToken();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/achievements/independents", {
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

  return (
    <div className="h-screen pt-3 overflow-auto ">
      <h2 className="mb-4 font-semibold text-gray-700 font-poppins">Kegiatan Lomba</h2>
      <div className="h-screen p-10 overflow-auto mt-9 shadow-boxShadow">
        <div className="h-screen overflow-auto bg-white rounded-xl ">
          {data.map((item, index) => (
            <div key={item.id} className="p-6 mb-8 border-2 rounded-md border-secondary ">
              <p className="mb-2 text-lg font-semibold">Nama Kegiatan: {item.name}</p>
              <p className="mb-2 text-gray-600">Bidang Kegiatan: {item.level_activity}</p>
              <p className="mb-2 text-gray-600">Tingkat: {item.participant_type}</p>
              <p className="mb-2 text-gray-600">Tahun: {item.year}</p>
              <div className="mt-4">
                <p className="mb-2 font-semibold">Pemilik:</p>
                {item.participants.map((participant, idx) => (
                  <div key={idx} className="pl-4 mb-2">
                    <p className="text-gray-600">Nama: {participant.name}</p>
                    <p className="text-gray-600">NPM: {participant.npm}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {error && <p>{error}</p>}
          <button
            type="submit"
            onClick={handleExports}
            className="px-4 py-2 my-5 text-base transition-transform hover:text-white rounded-lg w-[150px] bg-yellow-400 font-poppins hover:transform hover:scale-105 ml-auto mr-8 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Exports
          </button>
        </div>
      </div>
    </div>
  );
};

export default KegiatanLomba;
