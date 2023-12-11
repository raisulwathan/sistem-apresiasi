import React, { useEffect, useState } from "react";
import { getToken } from "../../../utils/Config";
import axios from "axios";

const Transkrip = () => {
  const [kegiatanWajib, setKegiatanWajib] = useState([]);
  const [kegiatanPilihan, setKegiatanPilihan] = useState([]);
  const [detailKegiatan, setDetailKegiatan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    let timeout;
    if (showPopup) {
      // Setelah 5 detik, tutup pop-up
      timeout = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [showPopup]);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setDetailKegiatan(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleAjukanSkpi = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/skpi",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statusCode = response.status;

      if (statusCode === 201) {
        setShowPopup(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        console.log("points tidak cukup");
      } else {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    }
  };

  const totalPointWajib = kegiatanWajib.reduce((total, kegiatan) => {
    if (kegiatan.status === "accepted") {
      return total + kegiatan.points;
    }
    return total;
  }, 0);

  const totalPointPilihan = kegiatanPilihan.reduce((total, kegiatan) => {
    if (kegiatan.status === "accepted") {
      return total + kegiatan.points;
    }
    return total;
  }, 0);

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
            <tr className="border-b-2 border-secondary ">
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
      </div>

      <div className="mt-12">
        <div className="flex items-center">
          <img src="./src/assets/choise.png" className="w-5 h-5 mr-2" alt="choise" />
          <h2 className="text-lg font-bold font-poppins">Kegiatan Pilihan</h2>
        </div>
        <table className="w-full mt-6">
          <thead>
            <tr className="border-b-2 border-secondary">
              <th className="py-2 text-left">Kegiatan</th>
              <th className="py-2 text-left">Nama Kegiatan</th>
              <th className="py-2 text-left">Point</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Detail</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanPilihan.map((activity, index) => (
              <tr key={index}>
                <td className="py-2">{activity.activity}</td>
                <td className="py-2">{activity.name}</td>
                <td className="py-2">{activity.points}</td>
                <td className="py-2">{activity.status}</td>
                <td className="py-2">
                  <button onClick={() => handleLihatDetail(activity.id)} className=" text-secondary hover:underline focus:outline-none">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 ">
            <div className="p-4 bg-white rounded-lg w-[1200px] h-[800px] ">
              <h3 className="mb-2 text-lg font-semibold">Detail Data:</h3>
              <div>
                <p>Kegiatan : {detailKegiatan.activity.activity}</p>
                <p>Kategori Kegiatan : {detailKegiatan.activity.fieldsActivity}</p>
                <p>Sertifikat : {detailKegiatan.activity.fileUrl}</p>
                <p>tingkat : {detailKegiatan.activity.levels}</p>
                <p>Nama Kegiatan : {detailKegiatan.activity.name}</p>
                <p>Point : {detailKegiatan.activity.points} </p>
                <p>Harapan : {detailKegiatan.activity.possitions_achievements} </p>
                <p> {detailKegiatan.activity.status} </p>
                <p> {detailKegiatan.years} </p>
              </div>

              <button onClick={() => setShowModal(false)} className="px-3 py-1 mt-4 text-white rounded-md bg-secondary">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 mt-12 ">
        <div className=" bg-dimBlue w-[200px] p-5 rounded-3xl shadow-lg inline-block">
          <h2 className="mb-2 text-lg font-semibold font-poppins">Total Point</h2>
          <p className="text-2xl font-bold text-secondary">{totalPoint}</p>
        </div>
        <div className="flex mt-6">
          <img src="./src/assets/print.png" alt="print" className="mt-2 mr-2 w-7 h-7" />
          <button onClick={handleAjukanSkpi} className="px-4 py-2 font-semibold text-gray-700 bg-yellow-200 rounded-md hover:bg-yellow-300">
            Ajukan
          </button>
        </div>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-[400px] p-8 rounded-lg text-center">
              <p>Data berhasil dikirim!</p>
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 mt-4 text-white rounded-lg bg-secondary">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transkrip;
