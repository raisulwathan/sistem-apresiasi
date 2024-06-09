import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";
import SignatureCanvas from "react-signature-canvas";
import { IoMdCloseCircleOutline } from "react-icons/io";

function Skpi() {
  const [skpiData, setSkpiData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [detailKegiatan, setDetailKegiatan] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [signatureImage, setSignatureImage] = useState("");
  const signatureRef = useRef(null);
  const [ttdExist, setTtdExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessageAll, setShowSuccessMessageAll] = useState(false);
  const [showErrorMessageAll, setShowErrorMessageAll] = useState(false);
  const [errorMessageAll, setErrorMessageAll] = useState("");
  const [showDetailConfirmation, setShowDetailConfirmation] = useState(false);
  const [currentPageUnvalidate, setCurrentPageUnvalidate] = useState(1);
  const [currentPageValidated, setCurrentPageValidated] = useState(1);
  const [itemsPerPage] = useState(4);

  const handleGetSkpi = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/v1/skpi", {
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
    getTtdHandler();
  }, []);

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      const trimmedCanvas = signatureRef.current.getTrimmedCanvas();
      const image = trimmedCanvas.toDataURL("image/png");
      setSignatureImage(image);
    }
  };

  const getTtdHandler = async () => {
    const ttd = await axios.get("http://localhost:5001/api/v1/ttd?role=WR", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (ttd.status === 200) {
      setTtdExist(true);
    }
  };

  const handleUpload = async () => {
    if (!signatureImage) {
      console.error("No signature image to upload");
      return;
    }

    const data = {
      url: String(signatureImage),
    };

    try {
      const response = await axios.post("http://localhost:5001/api/v1/ttd", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Tanda tangan digital berhasil diunggah:", response.data);
      return response.data.data.fileUrl;
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const handleValidation = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/skpi/${id}/validate`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Kegiatan berhasil divalidasi!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
      handleGetSkpi();
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    try {
      handleSaveSignature();
      await handleUpload();
      await handleValidation(detailKegiatan.id);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateAll = async () => {
    try {
      setShowConfirmation(true);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleValidateAllConfirmed = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    try {
      await Promise.all(
        unvalidateSkpi.map(async (skpi) => {
          handleSaveSignature();
          await handleUpload();
          await handleValidation(skpi.id);
        })
      );

      setShowSuccessMessageAll(true);
      setTimeout(() => {
        setShowSuccessMessageAll(false);
      }, 2000);
    } catch (error) {
      setShowErrorMessageAll(true);
      setErrorMessageAll(error.message);

      setTimeout(() => {
        setShowErrorMessageAll(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

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

  const unvalidateSkpi = skpiData.filter((skpi) => skpi.status === "accepted by ADMIN");
  const validatedSkpi = skpiData.filter((skpi) => skpi.status === "completed");

  const indexOfLastItemUnvalidate = currentPageUnvalidate * itemsPerPage;
  const indexOfFirstItemUnvalidate = indexOfLastItemUnvalidate - itemsPerPage;
  const currentUnvalidateSkpi = unvalidateSkpi.slice(indexOfFirstItemUnvalidate, indexOfLastItemUnvalidate);

  const indexOfLastItemValidated = currentPageValidated * itemsPerPage;
  const indexOfFirstItemValidated = indexOfLastItemValidated - itemsPerPage;
  const currentValidatedSkpi = validatedSkpi.slice(indexOfFirstItemValidated, indexOfLastItemValidated);

  const paginateUnvalidate = (pageNumber) => setCurrentPageUnvalidate(pageNumber);

  const paginateValidated = (pageNumber) => setCurrentPageValidated(pageNumber);

  return (
    <div className="pt-3 overflow-y-auto ">
      <h2 className="ml-4 font-semibold text-gray-700 font-poppins lg:ml-0">SKPI</h2>
      <div className="h-screen overflow-y-auto p-7 lg:p-10 bg-slate-50 lg:h-screen mt-9 shadow-boxShadow">
        <div className="border w-auto shadow-lg p-[27px] ">
          {!ttdExist && (
            <>
              <div className="mt-4">
                <SignatureCanvas ref={signatureRef} canvasProps={{ width: 500, height: 200, className: "signature-canvas border " }} />
              </div>
              <button className="px-4 py-2 mt-4 text-white border rounded-lg border-amber-500" onClick={handleSaveSignature}>
                Simpan Tanda Tangan
              </button>
              <button className="px-4 py-2 mt-4 text-white border rounded-lg border-amber-500" onClick={handleUpload}>
                Kirim Tanda Tangan
              </button>
            </>
          )}
          <button className="px-3 py-1 text-[14px] rounded-md border border-amber-500 hover:bg-amber-700 hover:text-white cursor-pointer" onClick={handleValidateAll}>
            Validasi Semua
          </button>
          <div className="p-5 mt-4 sm:overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">Nama</th>
                  <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 sm:table-cell">NPM</th>
                  <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 sm:table-cell">Fakultas</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentUnvalidateSkpi.map((item, index) => (
                  <tr key={index} className="bg-white divide-y divide-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.owner.name}</div>
                    </td>
                    <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                      <div className="text-sm text-gray-900">{item.owner.npm}</div>
                    </td>
                    <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                      <div className="text-sm text-gray-900">{item.owner.faculty}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                      <button onClick={() => handleLihatDetail(item.id)} className="text-amber-500 hover:text-amber-700 hover:underline focus:outline-none">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {currentUnvalidateSkpi.length === 0 && (
                  <tr className="bg-white divide-y divide-gray-200">
                    <td className="px-6 py-4 text-sm text-center whitespace-nowrap" colSpan="4">
                      Data tidak tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => paginateUnvalidate(currentPageUnvalidate - 1)}
              className={`px-4 py-1 text-sm mr-1 rounded-lg ${currentPageUnvalidate === 1 ? "bg-gray-100 border border-amber-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-700 text-white"}`}
              disabled={currentPageUnvalidate === 1}
            >
              Prev
            </button>
            <button
              onClick={() => paginateUnvalidate(currentPageUnvalidate + 1)}
              className={`px-4 py-1 ml-1 text-sm rounded-lg ${currentUnvalidateSkpi.length < itemsPerPage ? "bg-gray-100 border border-amber-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-700 text-white"}`}
              disabled={currentUnvalidateSkpi.length < itemsPerPage}
            >
              Next
            </button>
          </div>
          <h2 className="mb-5 text-base font-medium text-gray-800 mt-11">Diterima</h2>
          <div className="mt-4 lg:p-5 sm:overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Nama</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:table-cell">NPM</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:table-cell">Fakultas</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentValidatedSkpi.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-700">{item.owner.name}</p>
                      <p className="mt-1 text-xs text-gray-500 sm:hidden">{item.owner.npm}</p>
                    </td>
                    <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                      <p className="text-sm text-gray-700">{item.owner.npm}</p>
                    </td>
                    <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                      <p className="text-sm text-gray-700">{item.owner.faculty}</p>
                    </td>
                  </tr>
                ))}
                {currentValidatedSkpi.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-sm text-center whitespace-nowrap" colSpan="3">
                      Data tidak tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-10 mb-24 ">
            <button
              onClick={() => paginateValidated(currentPageValidated - 1)}
              className={`px-4 py-1 mr-1 text-sm rounded-lg ${currentPageValidated === 1 ? "bg-gray-100 border border-amber-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-700 text-white"}`}
              disabled={currentPageValidated === 1}
            >
              Prev
            </button>
            <button
              onClick={() => paginateValidated(currentPageValidated + 1)}
              className={`px-4 py-1 ml-1 text-sm rounded-lg ${currentValidatedSkpi.length < itemsPerPage ? "bg-gray-100 border border-amber-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-700 text-white"}`}
              disabled={currentValidatedSkpi.length < itemsPerPage}
            >
              Next
            </button>
          </div>
        </div>

        {showDetail && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-50">
            <div className="relative w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
              <button
                className="absolute text-2xl text-gray-600 top-3 right-3 hover:text-gray-900"
                onClick={() => {
                  setShowDetail(false);
                  setDetailKegiatan({});
                }}
              >
                <IoMdCloseCircleOutline />
              </button>
              <h2 className="mb-4 text-lg font-medium text-gray-700">Detail Kegiatan</h2>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">Nama:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.owner.name}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">Jurusan:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.owner.major}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">NPM:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.owner.npm}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">Point Mandatory:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.mandatoryPoints}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">Point Scientific:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.scientificPoints}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">Point Organization:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.organizationPoints}</p>
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600">Point Other:</p>
                <p className="text-sm text-gray-800">{detailKegiatan.otherPoints}</p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowDetailConfirmation(true);
                    setShowDetail(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "" : "Validasi"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showConfirmation && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-3/4 p-8 mx-auto bg-white rounded-lg shadow-lg sm:w-96">
              <h2 className="mb-4 text-lg font-medium text-gray-700">Konfirmasi Validasi Semua</h2>
              <p className="mb-4 text-sm text-gray-600">Apakah Anda yakin ingin memvalidasi semua kegiatan?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Batal
                </button>
                <button onClick={handleValidateAllConfirmed} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-amber-500 hover:bg-amber-700">
                  Ya
                </button>
              </div>
            </div>
          </div>
        )}
        {showDetailConfirmation && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-3/4 p-8 mx-auto bg-white rounded-lg shadow-lg sm:w-96">
              <h2 className="mb-4 text-lg font-medium text-gray-700">Konfirmasi Validasi</h2>
              <p className="mb-4 text-sm text-gray-600">Apakah Anda yakin ingin memvalidasi kegiatan ini?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setShowDetailConfirmation(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Batal
                </button>
                <button
                  onClick={() => {
                    handleValidate(detailKegiatan.id);
                    setShowDetailConfirmation(false);
                    setDetailKegiatan({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-amber-500 hover:bg-amber-700"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessMessage && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-3/4 p-8 mx-auto bg-white rounded-lg shadow-lg sm:w-96">
              <p className="text-sm text-center text-gray-600">Validasi berhasil!</p>
            </div>
          </div>
        )}
        {showSuccessMessageAll && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-3/4 p-8 mx-auto bg-white rounded-lg shadow-lg sm:w-96">
              <p className="text-sm text-center text-gray-600">Validasi semua berhasil!</p>
            </div>
          </div>
        )}
        {showErrorMessageAll && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-3/4 p-8 mx-auto bg-white rounded-lg shadow-lg sm:w-96">
              <p className="text-sm text-center text-red-600">{errorMessageAll}</p>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="p-8 text-center bg-white rounded-lg">
              <p>Loading...</p>
              <div className="loader"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skpi;
