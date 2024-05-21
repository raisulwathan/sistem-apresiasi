import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";
import { IoMdCloseCircleOutline } from "react-icons/io";

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
    setShowProcessing(true); // Ensure processing state is set

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
    setShowProcessing(true); // Set processing state

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

      setShowProcessing(false);
      setShowSuccessMessage(true); // Set success message state

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

      // Fetch the updated data after validation
      handleGetSkpi();
    } catch (error) {
      setShowProcessing(false);
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
      <div className="h-screen overflow-y-auto p-7 lg:p-10 bg-slate-50 lg:h-screen mt-9 shadow-boxShadow">
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
          <div className="p-6 border shadow-lg ">
            <div className="flex justify-between ">
              <h2 className="mt-8 mb-5 text-base font-medium text-gray-800">Belum Diterima</h2>
              <button
                onClick={handleValidateAll}
                className={`px-3 py-1 text-[14px] rounded-md border border-amber-500 hover:bg-amber-500 hover:text-white cursor-pointer ${showProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={showProcessing || unvalidateSkpi.length === 0}
              >
                {showProcessing ? "Memproses..." : "Validasi Semua"}
              </button>
            </div>
            {unvalidateSkpi.length === 0 && <p className="mt-5 mb-5 text-sm text-red-500">Tidak ada kegiatan yang perlu divalidasi.</p>}
            <div className="p-5 mt-4 sm:overflow-x-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {currentUnvalidateSkpi.map((item, index) => (
                  <div key={index} className="p-10 border rounded-md shadow-lg ">
                    <div>
                      <p className="text-[16px] font-medium text-gray-700">
                        Nama : <span className=" text-[15px] font-semibold text-gray-800 ">{item.owner.name}</span>
                      </p>
                    </div>
                    <p className="text-[16px] font-medium text-gray-700">
                      NPM: <span className="text-[15px] font-semibold text-gray-800">{item.owner.npm}</span>
                    </p>
                    <p className="text-[16px] font-medium text-gray-700">
                      Fakultas:<span className="text-[15px] font-semibold text-gray-800"> {item.owner.faculty}</span>
                    </p>
                    <button onClick={() => handleLihatDetail(item.id)} className="text-indigo-400 text-[17px] mt-8 hover:underline focus:outline-none">
                      Detail
                    </button>
                  </div>
                ))}
                {currentUnvalidateSkpi.length === 0 && <p className="text-sm text-center col-span-full">Data tidak tersedia.</p>}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => paginateUnvalidate(currentPageUnvalidate - 1)}
                className={`px-4 py-2 text-sm mr-1 rounded-lg ${currentPageUnvalidate === 1 ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                disabled={currentPageUnvalidate === 1}
              >
                Prev
              </button>
              <button
                onClick={() => paginateUnvalidate(currentPageUnvalidate + 1)}
                className={`px-4 py-2 ml-1 text-sm rounded-lg ${currentUnvalidateSkpi.length < itemsPerPage ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                disabled={currentUnvalidateSkpi.length < itemsPerPage}
              >
                Next
              </button>
            </div>

            <h2 className="mb-5 text-base font-medium text-gray-800 mt-11">Sudah Diterima</h2>
            <div className="sm:overflow-x-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {currentValidatedSkpi.map((item, index) => (
                  <div key={index} className="p-10 border rounded-md shadow-lg ">
                    <div>
                      <p className="text-[16px] font-medium text-gray-700">
                        Nama : <span className=" text-[15px] font-semibold text-gray-800 ">{item.owner.name}</span>
                      </p>
                    </div>
                    <p className="text-[16px] font-medium text-gray-700">
                      NPM: <span className="text-[15px] font-semibold text-gray-800">{item.owner.npm}</span>
                    </p>
                    <p className="text-[16px] font-medium text-gray-700">
                      Fakultas:<span className="text-[15px] font-semibold text-gray-800"> {item.owner.faculty}</span>
                    </p>
                  </div>
                ))}
                {currentValidatedSkpi.length === 0 && <p className="text-sm text-center col-span-full">Data tidak tersedia.</p>}
              </div>
              <div className="flex justify-center mt-6 mb-32">
                <button
                  onClick={() => paginateValidated(currentPageValidated - 1)}
                  className={`px-4 text-sm py-2 mr-1 rounded-lg ${currentPageValidated === 1 ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                  disabled={currentPageValidated === 1}
                >
                  Prev
                </button>
                <button
                  onClick={() => paginateValidated(currentPageValidated + 1)}
                  className={`px-4 text-sm py-2 ml-1 rounded-lg ${currentValidatedSkpi.length < itemsPerPage ? "bg-gray-100 border border-secondary cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark text-white"}`}
                  disabled={currentValidatedSkpi.length < itemsPerPage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetail && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-11/12 max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-center text-gray-800 underline">Detail Kegiatan</h3>
              <div className="flex flex-wrap justify-between p-5">
                <div className="w-full md:w-1/2">
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Mandatory Points: <span className="font-normal">{detailKegiatan.mandatoryPoints}</span>
                  </p>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Charity Points: <span className="font-normal">{detailKegiatan.charityPoints}</span>
                  </p>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Scientific Points: <span className="font-normal">{detailKegiatan.scientificPoints}</span>
                  </p>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Talent Points: <span className="font-normal">{detailKegiatan.talentPoints}</span>
                  </p>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Organization Points: <span className="font-normal">{detailKegiatan.organizationPoints}</span>
                  </p>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Other Points: <span className="font-normal">{detailKegiatan.otherPoints}</span>
                  </p>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Status: <span className="font-normal">{detailKegiatan.status}</span>
                  </p>
                </div>
                <div className="w-full mt-4 md:mt-0 md:w-1/2">
                  <p className="mb-2 text-lg font-semibold text-gray-700">Mahasiswa:</p>
                  <p className="mb-1 text-lg text-gray-700">
                    Nama: <span className="font-normal">{detailKegiatan.owner.name}</span>
                  </p>
                  <p className="mb-1 text-lg text-gray-700">
                    NPM: <span className="font-normal">{detailKegiatan.owner.npm}</span>
                  </p>
                  <p className="mb-1 text-lg text-gray-700">
                    Fakultas: <span className="font-normal">{detailKegiatan.owner.faculty}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="absolute text-gray-700 top-2 right-2 hover:text-gray-900">
                <IoMdCloseCircleOutline size={30} />
              </button>
              <div className="flex justify-center mt-4">
                <button className="px-4 py-2 text-white rounded-lg shadow-md bg-amber-500 hover:bg-amber-700" onClick={() => setShowConfirmation(true)}>
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
        {showSuccessMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="z-50 p-8 bg-white rounded-lg shadow-md">
              <p className="mb-4 font-semibold text-green-600">Kegiatan berhasil divalidasi!</p>
              <button className="font-bold text-gray-900 focus:outline-none" onClick={() => setShowSuccessMessage(false)}>
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
