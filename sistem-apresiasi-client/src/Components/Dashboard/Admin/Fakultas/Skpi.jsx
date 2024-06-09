import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

function Skpi() {
  const [skpiData, setSkpiData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [detailKegiatan, setDetailKegiatan] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [validating, setValidating] = useState(false);
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
    console.log("Detail id:", id);
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

  const handleValidationConfirmation = () => {
    setShowConfirmationPopup(true);
  };

  const handleValidation = async () => {
    try {
      setValidating(true); // Set validating true saat proses validasi dimulai
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

      const updatedSkpiData = skpiData.filter((item) => item.id !== detailKegiatan.id);
      setSkpiData(updatedSkpiData);
      setShowConfirmationPopup(false);
      setShowDetail(false);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setValidating(false); // Set validating false setelah proses validasi selesai
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
            <div className="flex justify-center rounded-md">
              <button onClick={() => setCurrentCategory("unvalidated")} className={`px-4 py-2 border rounded-l ${currentCategory === "unvalidated" ? "bg-amber-500 text-white" : "bg-white text-gray-700"}`}>
                <p className=" text-[14px] ">Belum Diterima</p>
              </button>
              <button onClick={() => setCurrentCategory("validated")} className={`px-4 py-2 border rounded-r ${currentCategory === "validated" ? "bg-amber-500 text-white" : "bg-white text-gray-700"}`}>
                <p className=" text-[14px] ">Telah Diterima</p>
              </button>
            </div>
            <h2 className="mt-8 ">{currentCategory === "unvalidated" ? "Belum Diterima" : "Telah Diterima"}</h2>
            <table className="w-full mt-5">
              <thead>
                <tr className="border border-gray-600 ">
                  <th className="px-4 py-2 font-normal  text-left text-[15px]">Nama</th>
                  <th className="px-4 py-2 text-left font-normal text-[15px]">NPM</th>
                  <th className="px-4 py-2 text-left font-normal text-[15px]">Fakultas</th>
                  <th className="px-4 py-2 text-left font-normal text-[15px]">Detail</th>
                </tr>
              </thead>
              <tbody>
                {(currentCategory === "unvalidated" ? unvalidatedSkpiData : validatedSkpiData).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="px-4 py-2 text-[14px]">{item.owner.name}</td>
                    <td className="px-4 py-2 text-[14px]">{item.owner.npm}</td>
                    <td className="px-4 py-2 text-[14px]">{item.owner.faculty}</td>
                    {currentCategory === "unvalidated" && (
                      <td className="px-4 py-2 text-base">
                        <button onClick={() => handleLihatDetail(item.id)} className="px-2 py-1 text-[14px] text-white rounded bg-amber-500 hover:bg-amber-700">
                          Lihat
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {currentCategory === "unvalidated" && (
              <div className="px-4 py-2">
                <button className="px-3 py-1 text-sm text-[13px] border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-amber-500" onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <button
                  className="px-3 py-1 ml-5 text-[13px] text-sm border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-amber-500"
                  onClick={handleNextPage}
                  disabled={(currentPage - 1) * itemsPerPage + itemsPerPage >= unvalidatedSkpiData.length}
                >
                  Next Page
                </button>
              </div>
            )}
            {currentCategory === "validated" && (
              <div className="px-4 py-2">
                <button className="px-3 py-1 text-sm text-[13px] border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-amber-500" onClick={handlePreviousPageValidated} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <button
                  className="px-3 py-1 ml-5 text-[13px] text-sm border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-amber-500"
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
                      <button onClick={() => setShowConfirmationPopup(false)} className="px-3 py-1 mr-4 text-white bg-red-500 rounded hover:bg-red-700">
                        Batal
                      </button>
                      <button onClick={handleValidation} className="px-3 py-1 text-white rounded bg-amber-500 hover:bg-amber-700">
                        {validating ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                            <span>Validating...</span>
                          </div>
                        ) : (
                          "Ya"
                        )}
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
                      <button onClick={() => setShowSuccessPopup(false)} className="px-4 py-2 text-white rounded bg-amber-500 hover:bg-amber-700">
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
                <button onClick={handleValidationConfirmation} className="px-3 py-1 mt-4 text-[14px] text-white rounded bg-amber-500 hover:bg-amber-700">
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
