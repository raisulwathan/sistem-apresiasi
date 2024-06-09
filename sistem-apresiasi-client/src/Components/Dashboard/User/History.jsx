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
    <div className="max-h-[887px] h-[878px] overflow-auto my-2 mx-[3px]  lg:mt-6 bg-white lg:p-14 pb-3 lg:w-[98.5%] rounded-lg">
      <div className="h-screen">
        <h2 className="mb-6 lg:text-[40px] text-[25px] font-medium text-gray-800 w-[85px] p-2 rounded-lg ml-8 lg:font-bold mt-9 lg:mt-0 font-poppins">Riwayat</h2>
        <div className="border bg-slate-300 rounded-md mt-10 lg:mt-20 ml-8 w-[250px]  h-1 lg:w-[600px]"></div>
        <div className="flex flex-wrap justify-between mt-6 p-9">
          <div className="w-full lg:w-[26%]">
            <div className="flex items-center py-2 mb-4 rounded-lg px-7 bg-customGray">
              <img src="./src/assets/dalam_proses.png" alt="" className="w-[64px] h-[64px] mr-2" />
              <p className="text-gray-300 text-[17px] ml-4 ">Dalam Proses</p>
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
              <p>Tidak ada data yang diproses.</p>
            )}
          </div>

          <div className="w-full lg:w-[26%] mt-11 lg:mt-0 ">
            <div className="flex items-center py-2 mb-4 rounded-lg px-7 bg-customGray">
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
              <p>Tidak ada data yang diterima.</p>
            )}
          </div>

          <div className="w-full lg:w-[27%] mt-11 lg:mt-0">
            <div className="flex items-center py-2 mb-4 rounded-lg px-7 bg-customGray">
              <img src="./src/assets/ditolak.png" alt="" className="w-[64px] h-[64px] mr-2" />
              <p className="text-gray-300 text-[17px] ml-4">Ditolak</p>
            </div>
            {rejectedActivities.length > 0 ? (
              <ul>
                {rejectedActivities.map((activity) => (
                  <li key={activity.id} className="p-3 mb-2 text-[17px] text-gray-400 border border-gray-400 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span>{activity.activity}</span>
                      <button onClick={() => handleLihatDetail(activity.id)} className="text-sky-600 focus:outline-none">
                        Detail
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Tidak ada data yang diterima.</p>
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
                <p className="text-base text-[17px] py-4 px-3 bg-customGray text-gray-400 rounded-lg mt-5">{alasanDitolak}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
