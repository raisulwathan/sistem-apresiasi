import React, { useState, useEffect } from "react";
import { getToken } from "../../../utils/Config";
import axios from "axios";

const History = () => {
  const [activities, setActivities] = useState([]);
  const [alasanDitolak, setAlasanDitolak] = useState("");
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
        setActivities(response.data.data.activities);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, []);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/activities/${id}/rejects`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setAlasanDitolak(response.data.data.rejectedActivity.message);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // data activities
  const pendingActivities = activities.filter((activity) => activity.status === "pending");
  const acceptedActivities = activities.filter((activity) => activity.status === "accepted");
  const rejectedActivities = activities.filter((activity) => activity.status === "rejected");

  return (
    <div className="max-h-[887px]  h-[870px] lg:mt-4 lg:p-16 pb-3 overflow-y-auto lg:w-[97%] rounded-lg lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[104px] p-2 rounded-lg ml-8 font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Riwayat</h2>

      <div className="flex mt-20">
        <img src="./src/assets/proses.png" alt="" className="w-6 h-6 mt-[3px]" />
        <div className="pl-2">
          <p className="text-gray-600">Dalam Proses</p>
          <div>
            {pendingActivities.length > 0 ? (
              <ul className="">
                {pendingActivities.map((activity) => (
                  <li key={activity.id} className="p-3 mt-3 bg-dimBlue lg:w-[600px] rounded-lg ">
                    {activity.activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Tidak ada data yang diproses.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex mt-20">
        <img src="./src/assets/approved.png" alt="" className="w-6 h-6 mt-[3px]" />
        <div className="pl-2">
          <p className="text-gray-600">Diterima</p>
          <h3 className="p-3 lg:w-[600px] mt-4 bg-dimBlue rounded-md">
            <div>
              {acceptedActivities.length > 0 ? (
                <ul>
                  {acceptedActivities.map((activity) => (
                    <li key={activity.id}>{activity.activity}</li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada data yang diterima.</p>
              )}
            </div>
          </h3>
        </div>
      </div>

      <div className="flex mt-20">
        <img src="./src/assets/rejected.png" alt="" className="w-6 h-6 mt-[3px]" />
        <div className="pl-2">
          <p className="text-gray-600">Ditolak</p>
          <h3 className="flex lg:w-[600px] px-5 py-4 mt-4 bg-dimBlue rounded-md ">
            <div>
              {rejectedActivities.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kegiatan</th>
                      {/* Tambahkan kolom lain di sini sesuai kebutuhan */}
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.activity}</td>
                        <td className="py-2">
                          <button onClick={() => handleLihatDetail(activity.id)} className="text-blue-500 hover:underline focus:outline-none">
                            Detail
                          </button>
                        </td>
                        {/* Tambahkan sel lain di sini sesuai kebutuhan */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Tidak ada data yang diterima.</p>
              )}
            </div>
          </h3>{" "}
          {/* Menggunakan data dari API */}
        </div>
      </div>

      {alasanDitolak && (
        <div className="mt-4 bg-pink-100   lg:w-[600px]">
          <h3>Alasan Ditolak:</h3>
          <p>{alasanDitolak}</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white z-10 rounded-lg p-8 max-w-[400px] relative">
            <button className="absolute top-2 right-2" onClick={handleCloseModal}>
              <img src="./src/assets/closeDetail.png" alt="" className="w-5 h-5" />
            </button>
            <h3>Alasan Ditolak:</h3>
            <p>{alasanDitolak}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
