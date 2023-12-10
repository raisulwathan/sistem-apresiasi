import React, { useEffect, useState } from "react";
import { getToken } from "../../../utils/Config";
import axios from "axios";

const Transkrip = () => {
  const [kegiatanWajib, setKegiatanWajib] = useState([]);
  const [kegiatanPilihan, setKegiatanPilihan] = useState([]);
  const [detailKegiatan, setDetailKegiatan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activities = response.data.data.activities || [];
        const kegiatanWajib = activities.filter((activity) => activity.fieldsActivity === "Kegiatan Wajib");
        const kegiatanPilihan = activities.filter((activity) => activity.fieldsActivity !== "Kegiatan Wajib");

        setKegiatanWajib(kegiatanWajib);
        setKegiatanPilihan(kegiatanPilihan);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, []);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDetailKegiatan(response.data.data); // Sesuaikan dengan struktur responsenya
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const totalPointWajib = kegiatanWajib.reduce((total, kegiatan) => total + kegiatan.points, 0);
  const totalPointPilihan = kegiatanPilihan.reduce((total, kegiatan) => total + kegiatan.points, 0);
  const totalPoint = totalPointWajib + totalPointPilihan;

  return (
    <div className="max-h-[887px] h-[870px] lg:mt-4 lg:p-14 pb-3 overflow-y-auto lg:w-[97%] rounded-lg lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[120px] p-2 ml-8 rounded-lg font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Transkrip</h2>

      <div className="mt-24 mb-6">
        <div className="flex items-center">
          <img src="./src/assets/asteriks.png" className="w-5 h-5 mr-2" alt="asteriks" />
          <h2 className="text-lg font-bold font-poppins">Kegiatan Wajib</h2>
        </div>
        <table className="w-full mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 text-left">Kegiatan</th>
              <th className="py-2 text-left">Point</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanWajib.map((activity, index) => (
              <tr key={index}>
                <td className="py-2">{activity.activity}</td>
                <td className="py-2">{activity.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="mb-2 text-lg font-semibold">Detail Data:</h3>
              <p>{detailKegiatan.activity.activity}</p>
              <p>{detailKegiatan.activity.fieldsActivity}</p>
              <p>{detailKegiatan.activity.fileUrl}</p>
              <p>{detailKegiatan.activity.levels}</p>
              <p>{detailKegiatan.activity.name}</p>
              <p> {detailKegiatan.activity.points} </p>
              <p> {detailKegiatan.activity.possitions_achievements} </p>
              <p> {detailKegiatan.activity.status} </p>
              <p> {detailKegiatan.years} </p>

              <button onClick={() => setShowModal(false)} className="px-3 py-1 mt-4 text-white bg-blue-500 rounded-md">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <div className="flex items-center">
          <img src="./src/assets/choise.png" className="w-5 h-5 mr-2" alt="choise" />
          <h2 className="text-lg font-bold font-poppins">Kegiatan Pilihan</h2>
        </div>
        <table className="w-full mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 text-left">Kegiatan</th>
              <th className="py-2 text-left">Nama Kegiatan</th>
              <th className="py-2 text-left">Kategori</th>
              <th className="py-2 text-left">Point</th>
              <th className="py-2 text-left">Detail</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanPilihan.map((activity, index) => (
              <tr key={index}>
                <td className="py-2">{activity.activity}</td>
                <td className="py-2">{activity.name}</td>
                <td className="py-2">{activity.fieldsActivity}</td>
                <td className="py-2">{activity.points}</td>
                <td className="py-2">
                  <button onClick={() => handleLihatDetail(activity.id)} className="text-blue-500 hover:underline focus:outline-none">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="mb-2 text-lg font-semibold">Detail Data:</h3>
              <p>{detailKegiatan.activity.activity}</p>
              <p>{detailKegiatan.activity.fieldsActivity}</p>
              <p>{detailKegiatan.activity.fileUrl}</p>
              <p>{detailKegiatan.activity.levels}</p>
              <p>{detailKegiatan.activity.name}</p>
              <p> {detailKegiatan.activity.points} </p>
              <p> {detailKegiatan.activity.possitions_achievements} </p>
              <p> {detailKegiatan.activity.status} </p>
              <p> {detailKegiatan.years} </p>

              <button onClick={() => setShowModal(false)} className="px-3 py-1 mt-4 text-white bg-blue-500 rounded-md">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 mt-12 border-t-2 border-gray-300">
        <div className="bg-pink-100 w-[200px] p-5 rounded-3xl shadow-lg inline-block">
          <h2 className="mb-2 text-lg font-semibold font-poppins">Total Point</h2>
          <p className="text-2xl font-bold text-secondary">{totalPoint}</p>
        </div>
        <div className="flex mt-6">
          <img src="./src/assets/print.png" alt="print" className="w-5 h-5 mr-2" />
          <button className="px-2 py-1 font-semibold text-gray-700 bg-yellow-200 rounded-md hover:bg-yellow-300">Cetak Transkrip</button>
        </div>
      </div>
    </div>
  );
};

export default Transkrip;
