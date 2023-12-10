import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link dari react-router-dom

const KegiatanMahasiswa = () => {
  const [mahasiswaData, setMahasiswaData] = useState([]);

  useEffect(() => {
    axios
      .get("URL_API")
      .then((response) => {
        setMahasiswaData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <div className="pt-3">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Mahasiswa</h2>

      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        <table className="w-full ">
          <thead>
            <tr>
              <th className="text-base font-normal">Npm</th>
              <th className="text-base font-normal">Nama</th>
              <th className="text-base font-normal">Kategori</th>
              <th className="text-base font-normal">Podi</th>
              <th className="text-base font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswaData.map((mahasiswa, index) => (
              <tr key={index}>
                <td>{mahasiswa.NPM}</td>
                <td>{mahasiswa.NAMA}</td>
                <td>{mahasiswa.KATEGORI}</td>
                <td>{mahasiswa.PRODI}</td>
                <td>
                  <Link to={`/detail/${mahasiswa.NPM}`}>
                    <button>Detail</button>
                  </Link>
                </td>
              </tr>
            ))}
            {mahasiswaData.length === 0 && (
              <tr>
                <td colSpan="5">Data tidak tersedia.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KegiatanMahasiswa;
