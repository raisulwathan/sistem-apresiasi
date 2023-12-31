import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

function Skpi() {
  const [skpiData, setSkpiData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [detailKegiatan, setDetailKegiatan] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGetSkpi = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/skpi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkpiData(response.data.data.skpi);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    handleGetSkpi();
  }, []);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/skpi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetailKegiatan(response.data.data);
      setShowDetail(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleValidation = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/skpi/${id}/validate`,
        { status: "accepted" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kegiatan berhasil divalidasi!");
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleValidate = async () => {
    setShowConfirmation(false);
    try {
      await handleValidation(detailKegiatan.id);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="h-screen pt-3 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">SKPI</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary">
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">NPM</th>
                <th className="px-4 py-2 text-left">Fakultas</th>
                <th className="px-4 py-2 text-left">Detail</th>
              </tr>
            </thead>
            <tbody>
              {skpiData.map((item, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-2 border-b-2 border-gray-300">{item.owner.name}</td>
                  <td className="px-4 py-2 border-b-2 border-gray-300">{item.owner.npm}</td>
                  <td className="px-4 py-2 border-b-2 border-gray-300">{item.owner.faculty}</td>
                  <td className="py-2">
                    <button onClick={() => handleLihatDetail(item.id)} className="text-secondary hover:underline focus:outline-none">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {skpiData.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    Data tidak tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {showDetail && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "50vw" }}>
              <h3 className="underline">Detail Kegiatan</h3>
              <div className="p-5">
                <p>Mandatory Points: {detailKegiatan.mandatoryPoints}</p>
                <p>Charity Points: {detailKegiatan.charityPoints}</p>
                <p>Scientific Points: {detailKegiatan.scientificPoints}</p>
                <p>Talent Points: {detailKegiatan.talentPoints}</p>
                <p>Organization Points: {detailKegiatan.organizationPoints}</p>
                <p>Other Points: {detailKegiatan.otherPoints}</p>
                <p>Status: {detailKegiatan.status}</p>

                <p className="mt-4">Mahasiswa:</p>
                <div className="pl-6">
                  <p>Nama: {detailKegiatan.owner.name}</p>
                  <p>NPM: {detailKegiatan.owner.npm}</p>
                  <p>Fakultas: {detailKegiatan.owner.faculty}</p>
                </div>
              </div>

              <button onClick={() => setShowDetail(false)} className="absolute text-gray-700 top-2 right-2 hover:text-gray-900">
                <span className="sr-only">Close</span>
                &#215;
              </button>
              <button className="px-2 py-3 rounded-lg bg-secondary" onClick={() => setShowConfirmation(true)}>
                Validasi
              </button>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "30vw" }}>
              <p>Apakah Anda yakin ingin memvalidasi kegiatan ini?</p>
              <div className="p-3 mx-auto">
                <button className="px-4 py-2 rounded-lg bg-secondary" onClick={handleValidate}>
                  Ya
                </button>
                <button className="px-4 py-2 ml-4 bg-red-600 rounded-lg" onClick={() => setShowConfirmation(false)}>
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skpi;
