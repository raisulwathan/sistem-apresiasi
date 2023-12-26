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
        const response = await axios.get("http://localhost:5001/api/v1/achievements/independents/faculties", {
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
    <div className="h-screen pt-3 overflow-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Lomba</h2>
      <div className="h-screen p-10 overflow-auto mt-9 shadow-boxShadow">
        {data.map((item, index) => (
          <div key={item.id} className="p-4 mb-6 border rounded-md">
            <p className="text-lg font-semibold">Nama Kegiatan: {item.name}</p>
            <p>Bidang Kegiatan: {item.level_activity}</p>
            <p>Tingkat: {item.participant_type}</p>
            <p>Tahun: {item.year}</p>
            <p>Pemilik:</p>
            {item.participants.map((participant, idx) => (
              <div key={idx} className="pl-4">
                <p>Nama: {participant.name}</p>
                <p>NPM: {participant.npm}</p>
              </div>
            ))}
          </div>
        ))}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default KegiatanLomba;
