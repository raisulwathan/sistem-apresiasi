import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

function Skpi() {
  const [skpiData, setSkpiData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [detailKegiatan, setDetailKegiatan] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  // State untuk pop-up konfirmasi dan pop-up sukses
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [unvalidatedSkpiData, setUnvalidatedSkpiData] = useState([]);
  const [validatedSkpiData, setValidatedSkpiData] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("unvalidated");

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

  useEffect(() => {
    const unvalidateSkpi = skpiData.filter((skpi) => skpi.status === "pending");
    const validatedSkpi = skpiData.filter((skpi) => skpi.status !== "pending");
    setUnvalidatedSkpiData(unvalidateSkpi);
    setValidatedSkpiData(validatedSkpi);
  }, [skpiData]);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/skpi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetailKegiatan(response.data.data);
      setShowDetail(true); // Tampilkan pop-up detail
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleValidationConfirmation = () => {
    setShowConfirmationPopup(true);
  };

  const handleValidation = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/skpi/${detailKegiatan.id}/validate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kegiatan berhasil divalidasi!");

      // Menghapus data yang sudah divalidasi dari tampilan
      const updatedSkpiData = skpiData.filter((item) => item.id !== detailKegiatan.id);
      setSkpiData(updatedSkpiData);

      // Sembunyikan pop-up konfirmasi
      setShowConfirmationPopup(false);

      // Sembunyikan pop-up detail
      setShowDetail(false);

      // Tampilkan pop-up sukses
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageValidated = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPageValidated = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  return (
    <div className="pt-3 overflow-y-auto ">
      <h2 className="font-semibold text-gray-700 font-poppins">SKPI</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <div>
            <div className="flex justify-center">
              <button onClick={() => setCurrentCategory("unvalidated")} className={`px-4 py-2 border rounded-l ${currentCategory === "unvalidated" ? "bg-green-500 text-white" : "bg-white text-gray-700"}`}>
                Belum Diterima
              </button>
              <button onClick={() => setCurrentCategory("validated")} className={`px-4 py-2 border rounded-r ${currentCategory === "validated" ? "bg-green-500 text-white" : "bg-white text-gray-700"}`}>
                Telah Diterima
              </button>
            </div>
            <h2 className="mt-8 ml-4 text-secondary">{currentCategory === "unvalidated" ? "Belum Diterima" : "Telah Diterima"}</h2>
            <table className="w-full">
              <thead>
                <tr className="border border-gray-600">
                  <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Nama</th>
                  <th className="px-4 py-2 font-medium text-left text-white bg-secondary">NPM</th>
                  <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Fakultas</th>
                  <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Detail</th>
                </tr>
              </thead>
              <tbody>
                {(currentCategory === "unvalidated" ? unvalidatedSkpiData : validatedSkpiData).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="px-4 py-2 text-base">{item.owner.name}</td>
                    <td className="px-4 py-2 text-base">{item.owner.npm}</td>
                    <td className="px-4 py-2 text-base">{item.owner.faculty}</td>
                    <td className="px-4 py-2 text-base">
                      <button onClick={() => handleLihatDetail(item.id)} className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600">
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentCategory === "unvalidated" && (
              <div className="px-4 py-2">
                <button className="px-4 py-2 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <button
                  className="px-4 py-2 ml-5 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary"
                  onClick={handleNextPage}
                  disabled={(currentPage - 1) * itemsPerPage + itemsPerPage >= unvalidatedSkpiData.length}
                >
                  Next Page
                </button>
              </div>
            )}
            {currentCategory === "validated" && (
              <div className="px-4 py-2">
                <button className="px-4 py-2 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary" onClick={handlePreviousPageValidated} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <button
                  className="px-4 py-2 ml-5 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary"
                  onClick={handleNextPageValidated}
                  disabled={(currentPage - 1) * itemsPerPage + itemsPerPage >= validatedSkpiData.length}
                >
                  Next Page
                </button>
              </div>
            )}

            {showConfirmationPopup && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "50vw" }}>
                  <h3 className="underline">Konfirmasi Validasi</h3>
                  <div className="p-5">
                    <p>Apakah Anda yakin ingin memvalidasi kegiatan ini?</p>
                    <div className="flex justify-end mt-4">
                      <button onClick={() => setShowConfirmationPopup(false)} className="px-4 py-2 mr-4 text-white bg-red-500 rounded hover:bg-red-600">
                        Batal
                      </button>
                      <button onClick={handleValidation} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                        Ya
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showSuccessPopup && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "50vw" }}>
                  <h3 className="underline">Sukses</h3>
                  <div className="p-5">
                    <p>Kegiatan berhasil divalidasi!</p>
                    <div className="flex justify-end mt-4">
                      <button onClick={() => setShowSuccessPopup(false)} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showDetail && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "50vw" }}>
              <h3 className="flex items-center justify-between">
                <span className="underline">Detail Kegiatan</span>
                <button onClick={handleCloseDetail} className="text-gray-600 hover:text-gray-800">
                  <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </h3>
              <div className="p-5">
                <p>Kegiatan Wajib : {detailKegiatan.mandatoryPoints}</p>
                <p>Organisasi dan Kepemimpinan : {detailKegiatan.organizationPoints}</p>
                <p>Penalaran dan Keilmuan: {detailKegiatan.scientificPoints}</p>
                <p>Minat dan Bakat: {detailKegiatan.talentPoints}</p>
                <p>Kepedulian Sosial: {detailKegiatan.charityPoints}</p>
                <p>Other Points: {detailKegiatan.otherPoints}</p>
                <p>Status: {detailKegiatan.status}</p>

                <p className="mt-4">Mahasiswa:</p>
                <div className="pl-6">
                  <p>Nama: {detailKegiatan.owner.name}</p>
                  <p>NPM: {detailKegiatan.owner.npm}</p>
                  <p>Fakultas: {detailKegiatan.owner.faculty}</p>
                </div>

                {/* Tombol validasi di sini */}
                <button onClick={handleValidationConfirmation} className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600">
                  Validasi Kegiatan
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
