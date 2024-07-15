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
    <div className="h-screen p-6 lg:p-16 bg-[#1d2638] overflow-y-auto">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Riwayat</h2>

      <div className="flex flex-wrap justify-between p-3 mt-6 lg:p-9">
        <div className="w-full p-7 lg:w-[26%] shadow-xl rounded-lg bg-[#1A4057]">
          <div className="lg:flex items-center py-2 mb-4 rounded-lg px-7 bg-[#173344]">
            <img src="./src/assets/dalam_proses.png" alt="" className="w-[64px] h-[64px] mr-2" />
            <p className="text-gray-300 lg:text-[17px] ml-4 ">Dalam Proses</p>
          </div>
          {pendingActivities.length > 0 ? (
            <ul>
              {pendingActivities.map((activity) => (
                <li key={activity.id} className="p-3 mb-2 text-[17px] text-gray-400 border border-gray-400 rounded-2xl ">
                  {activity.activity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Tidak ada data yang diproses.</p>
          )}
        </div>

        <div className="w-full lg:w-[26%] shadow-xl rounded-lg mt-11 p-7 lg:mt-0 bg-[#1A4057] ">
          <div className="flex items-center py-2 mb-4 rounded-lg px-7 bg-[#173344]">
            <img src="./src/assets/sudah_diterima.png" alt="" className="w-[64px] h-[64px] mr-2" />
            <p className="text-gray-300 text-[17px] ml-4 ">Diterima</p>
          </div>
          {acceptedActivities.length > 0 ? (
            <ul>
              {acceptedActivities.map((activity) => (
                <li key={activity.id} className="p-3 mb-2 text-[17px] text-gray-400 border border-gray-400 rounded-2xl ">
                  {activity.activity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Tidak ada data yang diterima.</p>
          )}
        </div>

        <div className="w-full lg:w-[27%] shadow-xl mt-11 bg-[#1A4057] p-7 rounded-lg lg:mt-0">
          <div className="flex items-center py-2 mb-4 rounded-lg px-7 bg-[#173344]">
            <img src="./src/assets/ditolak.png" alt="" className="w-[64px] h-[64px] mr-2" />
            <p className="text-gray-300 text-[17px] ml-4">Ditolak</p>
          </div>
          {rejectedActivities.length > 0 ? (
            <ul>
              {rejectedActivities.map((activity) => (
                <li key={activity.id} className="p-3 mb-2 text-[17px] text-gray-400 border border-gray-400 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span>{activity.activity}</span>
                    <button onClick={() => handleLihatDetail(activity.id)} className="bg-[#1d2638] py-1 px-2 text-gray-400 rounded-lg ">
                      Detail
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Tidak ada data yang diterima.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white z-10 rounded-lg p-8 w-[400px] relative">
            <button className="absolute top-2 right-2" onClick={handleCloseModal}>
              <img src="./src/assets/closeDetail.png" alt="" className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-medium ">Alasan Ditolak:</h3>
              <p className="text-base text-[17px] py-4 px-3 bg-[#173344] text-gray-400 rounded-lg mt-5">{alasanDitolak}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
