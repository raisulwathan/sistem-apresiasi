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
    <div className="max-h-[887px] h-[870px] lg:mt-4 lg:p-14 pb-3 p-5 overflow-auto rounded-lg lg:w-[97%] lg:px-0 lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[120px] p-2 ml-8 rounded-lg font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Riwayat</h2>

      <div className="mt-6 p-9">
        <div className="lg:w-1/2">
          <div className="flex items-center mb-4">
            <img src="./src/assets/proses.png" alt="" className="w-6 h-6 mr-2" />
            <p className="text-gray-600">Dalam Proses</p>
          </div>
          {pendingActivities.length > 0 ? (
            <ul>
              {pendingActivities.map((activity) => (
                <li key={activity.id} className="p-3 mb-2 rounded-lg text-gray-950 bg-dimBlue">
                  {activity.activity}
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada data yang diproses.</p>
          )}
        </div>

        <div className="mt-11 lg:w-1/2">
          <div className="flex items-center mb-4">
            <img src="./src/assets/approved.png" alt="" className="w-6 h-6 mr-2" />
            <p className="text-gray-600 ">Diterima</p>
          </div>
          {acceptedActivities.length > 0 ? (
            <ul>
              {acceptedActivities.map((activity) => (
                <li key={activity.id} className="p-3 mb-2 rounded-lg text-gray-950 bg-dimBlue">
                  {activity.activity}
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada data yang diterima.</p>
          )}
        </div>

        <div className="mt-11 lg:w-1/2">
          <div className="flex items-center mb-4">
            <img src="./src/assets/rejected.png" alt="" className="w-6 h-6 mr-2" />
            <p className="text-gray-600">Ditolak</p>
          </div>
          {rejectedActivities.length > 0 ? (
            <table className="w-full border ">
              <thead>
                <tr className=" text-gray-950 bg-dimBlue">
                  <th className="p-3 text-left">Nama Kegiatan</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rejectedActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-200">
                    <td className="p-3">{activity.activity}</td>
                    <td className="p-3">
                      <button onClick={() => handleLihatDetail(activity.id)} className="text-secondary focus:outline-none">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Tidak ada data yang diterima.</p>
          )}
        </div>
      </div>

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
