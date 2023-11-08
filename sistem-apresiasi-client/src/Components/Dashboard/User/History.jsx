import React, { useState, useEffect } from "react";

const History = () => {
  const [data, setData] = useState([]);
  const [alasanDitolak, setAlasanDitolak] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("URL_API")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  const handleLihatDetail = (alasan) => {
    setAlasanDitolak(alasan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="max-h-[887px]  h-[870px] lg:mt-4 lg:p-16 pb-3 overflow-y-auto lg:w-[97%] rounded-lg lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[104px] p-2 rounded-lg ml-8 font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Riwayat</h2>

      <div className="flex mt-20">
        <img src="./src/assets/proses.png" alt="" className="w-6 h-6 mt-[3px]" />
        <div className="pl-2">
          <p className="text-gray-600">Dalam Proses</p>
          <h3 className="py-6 lg:w-[600px] mt-4 bg-pink-100 rounded-md ">{data.proses}</h3>
        </div>
      </div>

      <div className="flex mt-20">
        <img src="./src/assets/approved.png" alt="" className="w-6 h-6 mt-[3px]" />
        <div className="pl-2">
          <p className="text-gray-600">Diterima</p>
          <h3 className="py-6 lg:w-[600px] mt-4 bg-pink-100 rounded-md">{data.diterima}</h3>
        </div>
      </div>

      <div className="flex mt-20">
        <img src="./src/assets/rejected.png" alt="" className="w-6 h-6 mt-[3px]" />
        <div className="pl-2">
          <p className="text-gray-600">Ditolak</p>
          <h3 className="flex lg:w-[600px] px-5 py-4 mt-4 bg-pink-100 rounded-md ">
            {data.ditolak}{" "}
            <button className="pl-3 text-gray-600 border-l-2  lg:ml-[500px] hover:text-secondary border-secondary" onClick={() => handleLihatDetail(data.alasanDitolak)}>
              Detail
            </button>
          </h3>{" "}
          {/* Menggunakan data dari API */}
        </div>
      </div>

      {alasanDitolak && (
        <div className="mt-4 bg-pink-100 ml-9 w-[400px]">
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
