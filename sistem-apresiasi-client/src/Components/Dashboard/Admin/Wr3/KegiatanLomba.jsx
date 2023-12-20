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

  return (
    <div className="pt-3">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Lomba</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        {data.map((item) => (
          <div key={item.id} className="p-4 mb-6 border rounded-md">
            <p className="text-lg font-semibold">Nama Kegiatan: {item.name}</p>
            <p>Bidang Kegiatan: {item.level_activity}</p>
            <p>Tingkat: {item.participant_type}</p>
            <p>Tahun: {item.year}</p>
            <p>Pemilik:</p>
            <p className="pl-4">Nama: {item.participants}</p>
            <p className="pl-4">Fakultas: {item.faculty}</p>
          </div>
        ))}
        {error && <p>{error}</p>} {/* Tampilkan pesan error jika ada kesalahan */}
      </div>
    </div>
  );
};

export default KegiatanLomba;
