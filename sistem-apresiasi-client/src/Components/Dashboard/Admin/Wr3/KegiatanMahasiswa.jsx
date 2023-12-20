import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const KegiatanMahasiswa = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/activities/faculties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.data.activities);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen pt-3 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Mahasiswa</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        <div className="p-10 mt-9">
          {error ? (
            <p>Terjadi kesalahan: {error}</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {data.map((activity, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-boxShadow">
                  <p>Kegiatan : {activity.activity}</p>
                  <p>Kategori Kegiatan : {activity.fieldsActivity}</p>
                  <p>Sertifikat : {activity.fileUrl}</p>
                  <p>tingkat : {activity.levels}</p>
                  <p>Nama Kegiatan : {activity.name}</p>
                  <p>Point : {activity.points} </p>
                  <p>Mahasiswa: </p>
                  <p>Nama : {activity.owner.name}</p>
                  <p>NPM : {activity.owner.npm}</p>
                  <p>Prodi : {activity.owner.major}</p>
                  <p>Harapan : {activity.possitions_achievements} </p>
                  <p> Status: {activity.status} </p>
                  <p> Tahun: {activity.years} </p>
                </div>
              ))}
              {data.length === 0 && <p>Data tidak tersedia.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KegiatanMahasiswa;
