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
  const [itemsPerPage] = useState(8);
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
      setValidating(true);
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
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setValidating(false);
      setShowDetail(false); // Tutup pop-up detail
      setShowConfirmationPopup(false); // Tutup pop-up konfirmasi
      setDetailKegiatan({}); // Hilangkan data detail kegiatan
      setShowSuccessPopup(true); // Tampilkan pop-up sukses setelah validasi selesai
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
    <div className="h-screen p-16 bg-[#424461] overflow-y-auto ">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">SKPI</h2>
      <div className=" bg-[#313347] p-14 rounded-lg shadow-2xl mt-9 ">
        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <div>
            <div className="flex justify-center rounded-md">
              <button onClick={() => setCurrentCategory("unvalidated")} className={`px-4 py-2 border border-[#424461] rounded-l ${currentCategory === "unvalidated" ? "bg-[#0F6292] text-gray-300" : "bg-[#313347] text-gray-300"}`}>
                <p className=" text-[14px] text-gray-300 ">Belum Diterima</p>
              </button>
              <button onClick={() => setCurrentCategory("validated")} className={`px-4 py-2 border border-[#424461] rounded-r ${currentCategory === "validated" ? "bg-[#0F6292] text-gray-300" : "bg-[#313347] text-gray-300"}`}>
                <p className=" text-[14px] text-gray-300 ">Telah Diterima</p>
              </button>
            </div>
            <h2 className="mt-8 font-mono text-gray-300 ">{currentCategory === "unvalidated" ? "Belum Diterima" : "Telah Diterima"}</h2>
            <table className="w-full mt-5 ">
              <thead>
                <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] ">
                  <th className="px-4 py-2 font-normal  text-left text-[15px]">Nama</th>
                  <th className="px-4 py-2 text-left font-normal text-[15px]">NPM</th>
                  <th className="px-4 py-2 text-left font-normal text-[15px]">Jurusan</th>
                  {currentCategory === "unvalidated" && <th className="px-4 py-2 text-left font-normal text-[15px]">Detail</th>}
                </tr>
              </thead>
              <tbody>
                {(currentCategory === "unvalidated" ? unvalidatedSkpiData : validatedSkpiData).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                  <tr key={index} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
                    <td className="px-4 py-2 text-[14px]">{item.owner.name}</td>
                    <td className="px-4 py-2 text-[14px]">{item.owner.npm}</td>
                    <td className="px-4 py-2 text-[14px]">{item.owner.major}</td>
                    {currentCategory === "unvalidated" && (
                      <td className="px-4 py-2 text-base">
                        <button onClick={() => handleLihatDetail(item.id)} className="px-2 py-1 text-[14px] text-gray-300 rounded bg-[#0F6292] hover:bg-[#274e64]">
                          Lihat
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {currentCategory === "unvalidated" && (
              <div className="px-4 py-2 mt-7 ">
                <button className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]" onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <button
                  className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
                  onClick={handleNextPage}
                  disabled={(currentPage - 1) * itemsPerPage + itemsPerPage >= unvalidatedSkpiData.length}
                >
                  Next Page
                </button>
              </div>
            )}
            {currentCategory === "validated" && (
              <div className="px-4 py-2 mt-7">
                <button className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]" onClick={handlePreviousPageValidated} disabled={currentPage === 1}>
                  Previous Page
                </button>
                <button
                  className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
                  onClick={handleNextPageValidated}
                  disabled={(currentPage - 1) * itemsPerPage + itemsPerPage >= validatedSkpiData.length}
                >
                  Next Page
                </button>
              </div>
            )}

            {showConfirmationPopup && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="relative max-w-screen-lg p-6 mx-auto bg-[#3B4B60] rounded-lg" style={{ width: "50vw" }}>
                  <h3 className="text-gray-300 ">Konfirmasi Validasi</h3>
                  <div className="p-5">
                    <p className="text-gray-300 ">Apakah Anda yakin ingin memvalidasi kegiatan ini?</p>
                    <div className="flex justify-end mt-4">
                      <button onClick={() => setShowConfirmationPopup(false)} className="px-3 py-1 mr-4 text-white bg-red-500 rounded hover:bg-red-700">
                        Batal
                      </button>
                      <button onClick={handleValidation} className="px-4 py-2 text-white rounded bg-[#0F6292] hover:bg-[#274e64]">
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

            {showSuccessPopup && !validating && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="relative max-w-screen-lg p-6 mx-auto bg-[#3B4B60] rounded-lg" style={{ width: "50vw" }}>
                  <h3 className="text-gray-300 ">Sukses</h3>
                  <div className="p-5">
                    <p className="text-gray-300">Kegiatan berhasil divalidasi!</p>
                    <div className="flex justify-end mt-4">
                      <button onClick={() => setShowSuccessPopup(false)} className="px-5 py-3 text-white rounded bg-[#0F6292] hover:bg-[#274e64]">
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-3/4 p-6 mx-auto bg-[#2C3E50] rounded-lg shadow-lg">
              <h3 className="flex items-center justify-between mb-4 text-lg font-semibold text-white">
                <span>Detail Kegiatan</span>
                <button onClick={handleCloseDetail} className="text-red-500 hover:text-red-400">
                  <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-[#3B4B60] rounded-lg">
                  <h4 className="mb-2 text-lg font-semibold text-white">Kegiatan</h4>
                  <table className="w-full mt-4 text-left text-gray-300">
                    <tbody>
                      <tr>
                        <td className="py-1 font-medium text-white">Kegiatan Wajib:</td>
                        <td className="py-1">{detailKegiatan.mandatoryPoints}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-white">Organisasi dan Kepemimpinan:</td>
                        <td className="py-1">{detailKegiatan.organizationPoints}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-white">Penalaran dan Keilmuan:</td>
                        <td className="py-1">{detailKegiatan.scientificPoints}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-white">Minat dan Bakat:</td>
                        <td className="py-1">{detailKegiatan.talentPoints}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-white">Kepedulian Sosial:</td>
                        <td className="py-1">{detailKegiatan.charityPoints}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-white">Kegiatan Lainnya:</td>
                        <td className="py-1">{detailKegiatan.otherPoints}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#3B4B60] rounded-lg">
                  <h4 className="mb-2 text-lg font-semibold text-white">Mahasiswa</h4>
                  <div className="py-2">
                    <div>
                      <p className="font-medium text-white ">Nama:</p>
                      <p className="px-2 py-2 text-white bg-gray-700 rounded-lg ">{detailKegiatan.owner.name}</p>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium text-white">NPM:</p>
                      <p className="px-2 py-2 text-white bg-gray-700 rounded-lg">{detailKegiatan.owner.npm}</p>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium text-white">Jurusan:</p>
                      <p className="px-2 py-2 text-white bg-gray-700 rounded-lg">{detailKegiatan.owner.major}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={handleValidationConfirmation} className="px-3 py-3 mt-4 text-[14px] shadow-lg text-white rounded bg-[#0F6292] hover:bg-[#274e64]">
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
