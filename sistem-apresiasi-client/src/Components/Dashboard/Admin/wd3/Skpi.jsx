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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentPageUnvalidate, setCurrentPageUnvalidate] = useState(1);
  const [currentPageValidated, setCurrentPageValidated] = useState(1);
  const [itemsPerPage] = useState(4);
  const [showSuccessMessageAll, setShowSuccessMessageAll] = useState(false);
  const [showErrorMessageAll, setShowErrorMessageAll] = useState(false);
  const [errorMessageAll, setErrorMessageAll] = useState("");
  const [showProcessing, setShowProcessing] = useState(false);

  const handleValidateAll = async () => {
    try {
      if (unvalidateSkpi.length === 0) {
        setShowProcessing(false);
        return;
      }

      setShowConfirmation(true);
    } catch (error) {
      setShowProcessing(false);
      console.error(error);
    }
  };

  const handleValidateAllConfirmed = async () => {
    setShowConfirmation(false);

    try {
      await Promise.all(
        unvalidateSkpi.map(async (skpi) => {
          await handleValidation(skpi.id);
        })
      );

      setShowProcessing(false);
      setShowSuccessMessageAll(true);

      setTimeout(() => {
        setShowSuccessMessageAll(false);
      }, 2000);
    } catch (error) {
      setShowProcessing(false);
      setShowErrorMessageAll(true);
      setErrorMessageAll(error.message);

      setTimeout(() => {
        setShowErrorMessageAll(false);
      }, 2000);
    }
  };

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
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kegiatan berhasil divalidasi!");
      setShowConfirmation(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const unvalidateSkpi = skpiData.filter((skpi) => skpi.status === "accepted by OPERATOR");
  const validatedSkpi = skpiData.filter((skpi) => skpi.status !== "pending" && skpi.status !== "accepted by OPERATOR");

  const indexOfLastItemUnvalidate = currentPageUnvalidate * itemsPerPage;
  const indexOfFirstItemUnvalidate = indexOfLastItemUnvalidate - itemsPerPage;
  const currentUnvalidateSkpi = unvalidateSkpi.slice(indexOfFirstItemUnvalidate, indexOfLastItemUnvalidate);

  const indexOfLastItemValidated = currentPageValidated * itemsPerPage;
  const indexOfFirstItemValidated = indexOfLastItemValidated - itemsPerPage;
  const currentValidatedSkpi = validatedSkpi.slice(indexOfFirstItemValidated, indexOfLastItemValidated);

  const paginateUnvalidate = (pageNumber) => setCurrentPageUnvalidate(pageNumber);

  const paginateValidated = (pageNumber) => setCurrentPageValidated(pageNumber);

  return (
    <div className="pt-3 overflow-y-auto">
      <h2 className="ml-4 font-semibold text-gray-700 font-poppins lg:ml-0">SKPI</h2>
      <div className="h-screen overflow-y-auto p-7 lg:p-10 lg:h-screen mt-9 shadow-boxShadow">
        {error ? (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "30vw" }}>
              <p>{error}</p>
              <button className="absolute text-gray-700 top-2 right-2 hover:text-gray-900" onClick={() => setError(null)}>
                <span className="sr-only">Close</span>
                &#215;
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mt-8 mb-5 text-base font-medium text-gray-800">Belum Diterima</h2>
            <button
              onClick={handleValidateAll}
              className={`px-4 py-2 rounded-lg border border-secondary hover:bg-secondary cursor-pointer ${showProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={showProcessing || unvalidateSkpi.length === 0}
            >
              {showProcessing ? "Memproses..." : "Validasi Semua"}
            </button>
            {unvalidateSkpi.length === 0 && <p className="mt-5 mb-5 text-sm text-red-500">Tidak ada kegiatan yang perlu divalidasi.</p>}
            <div className="sm:overflow-x-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {currentUnvalidateSkpi.map((item, index) => (
                  <div key={index} className="p-4 mt-6 bg-gray-100 border rounded-lg shadow-lg border-secondary">
                    <div>
                      <p className="text-base font-medium text-secondary">Nama :</p> <br /> <p className="py-2 font-semibold text-gray-700"> {item.owner.name}</p>
                    </div>
                    <p className="text-base font-medium text-secondary">
                      <strong>NPM:</strong> {item.owner.npm}
                    </p>
                    <p>
                      <strong>Fakultas:</strong> {item.owner.faculty}
                    </p>
                    <button onClick={() => handleLihatDetail(item.id)} className="text-secondary hover:underline focus:outline-none">
                      Detail
                    </button>
                  </div>
                ))}
                {currentUnvalidateSkpi.length === 0 && <p className="text-sm text-center col-span-full">Data tidak tersedia.</p>}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => paginateUnvalidate(currentPageUnvalidate - 1)}
                  className={`px-3 py-1 text-sm mr-1 rounded-lg ${currentPageUnvalidate === 1 ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                  disabled={currentPageUnvalidate === 1}
                >
                  Prev
                </button>
                <button
                  onClick={() => paginateUnvalidate(currentPageUnvalidate + 1)}
                  className={`px-3 py-1 ml-1 text-sm rounded-lg ${currentUnvalidateSkpi.length < itemsPerPage ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                  disabled={currentUnvalidateSkpi.length < itemsPerPage}
                >
                  Next
                </button>
              </div>
            </div>

            <h2 className="mt-8 mb-5 text-base font-medium text-gray-800">Sudah Diterima</h2>
            <div className="sm:overflow-x-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {currentValidatedSkpi.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-100 border rounded-lg shadow-lg border-secondary">
                    <div>
                      <p className="text-base font-medium text-secondary">Nama :</p> <p className="py-2 font-semibold text-gray-700">{item.owner.name}</p>
                    </div>
                    <div>
                      <p className="text-base font-medium text-secondary">NPM :</p> <p className="py-2 font-semibold text-gray-700">{item.owner.npm}</p>
                    </div>
                    <div>
                      <p className="text-base font-medium text-secondary">Fakultas :</p>
                      <p className="py-2 font-semibold text-gray-700">{item.owner.faculty}</p>
                    </div>
                  </div>
                ))}
                {currentValidatedSkpi.length === 0 && <p className="text-sm text-center col-span-full">Data tidak tersedia.</p>}
              </div>
              <div className="flex justify-center mt-4 mb-32">
                <button
                  onClick={() => paginateValidated(currentPageValidated - 1)}
                  className={`px-3 text-sm py-1 mr-1 rounded-lg ${currentPageValidated === 1 ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                  disabled={currentPageValidated === 1}
                >
                  Prev
                </button>
                <button
                  onClick={() => paginateValidated(currentPageValidated + 1)}
                  className={`px-3 text-sm py-1 ml-1 rounded-lg ${currentValidatedSkpi.length < itemsPerPage ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                  disabled={currentValidatedSkpi.length < itemsPerPage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetail && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg md:w-3/4 sm:w-full">
              <h3 className="mb-4 text-center underline">Detail Kegiatan</h3>
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
              <div className="flex justify-center mt-4">
                <button className="px-4 py-2 rounded-lg bg-secondary" onClick={() => setShowConfirmation(true)}>
                  Validasi
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative lg:w-[600px] p-6 mx-auto bg-white rounded-lg md:w-3/4 sm:w-full">
              <p className="mb-4 text-center">Apakah Anda yakin ingin memvalidasi semua kegiatan?</p>
              <div className="flex flex-col items-center justify-center p-3 mx-auto md:flex-row">
                <button className="px-4 py-2 mb-2 rounded-lg bg-secondary md:mb-0 md:mr-2" onClick={handleValidateAllConfirmed}>
                  Ya
                </button>
                <button className="px-4 py-2 ml-0 bg-red-600 rounded-lg md:ml-4" onClick={() => setShowConfirmation(false)}>
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessMessageAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="z-50 p-8 bg-white rounded-lg shadow-md">
              <p className="mb-4 font-semibold text-green-600">Semua kegiatan berhasil divalidasi!</p>
              <button className="font-bold text-gray-900 focus:outline-none" onClick={() => setShowSuccessMessageAll(false)}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {showErrorMessageAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="z-50 p-8 bg-white rounded-lg shadow-md">
              <p className="mb-4 text-red-500">{errorMessageAll}</p>
              <button className="font-bold text-red-500 focus:outline-none" onClick={() => setShowErrorMessageAll(false)}>
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skpi;
