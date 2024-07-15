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
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showSignatureSuccessMessage, setShowSignatureSuccessMessage] = useState(false);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [showSuccessUploadMessage, setShowSuccessUploadMessage] = useState(false);

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
      setShowSignatureSuccessMessage(true);
      setTimeout(() => {
        setShowSignatureSuccessMessage(false);
      }, 2000);
    }
  };

  const getTtdHandler = async () => {
    try {
      const ttd = await axios.get("http://localhost:5001/api/v1/ttd?role=WR", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (ttd.status === 200) {
        setTtdExist(true);
      }
    } catch (error) {
      console.error("Error checking signature:", error);
    }
  };

  const handleUpload = async () => {
    if (!signatureImage) {
      console.error("No signature image to upload");
      return;
    }

    setShowUploadConfirmation(true);
  };

  const handleUploadConfirmed = async () => {
    const data = {
      url: String(signatureImage),
    };

    try {
      const response = await axios.post("http://localhost:5001/api/v1/ttd", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowSignaturePad(false); // Hide the signature pad after upload
      setTtdExist(true); // Set ttdExist to true after upload
      setShowUploadConfirmation(false); // Hide the confirmation pop-up after upload
      setShowSuccessUploadMessage(true); // Show the success message pop-up
      setTimeout(() => {
        setShowSuccessUploadMessage(false); // Hide the success message pop-up after a few seconds
      }, 2000);
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

  const handleValidate = async (id) => {
    if (!ttdExist) {
      setShowSignaturePad(true);
      return;
    }
    setShowConfirmation(false);
    setIsLoading(true);

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

  const handleValidateAll = async () => {
    try {
      setShowConfirmation(true);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleAddSignatureClick = () => {
    if (ttdExist) {
      alert("Tanda tangan sudah ada");
    } else {
      setShowSignaturePad(true);
    }
  };

  const handleValidateAllConfirmed = async () => {
    if (!ttdExist) {
      setShowSignaturePad(true);
      return;
    }

    setShowConfirmation(false);
    setIsLoading(true);

    try {
      await Promise.all(
        unvalidateSkpi.map(async (skpi) => {
          await handleValidation(skpi.id);
        })
      );

      setIsLoading(false);
      setShowSuccessMessageAll(true);
      setTimeout(() => {
        setShowSuccessMessageAll(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setShowErrorMessageAll(true);
      setErrorMessageAll(error.message);

      setTimeout(() => {
        setShowErrorMessageAll(false);
      }, 2000);
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
    <div className="h-screen p-5 lg:p-16 bg-[#424461] overflow-y-auto ">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">SKPI</h2>
      <div className="mt-6 ">
        <button className={`px-5 py-4 mt-4 text-gray-300 text-[15px] font-mono shadow-xl hover:scale-110 transition transform rounded-lg bg-[#313347] ${ttdExist ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleAddSignatureClick}>
          Tambah Tanda Tangan
        </button>

        <button
          className={`px-5 py-4 ml-5 lg:ml-11 text-[15px] text-gray-300 font-mono shadow-xl rounded-md hover:scale-105 transition transform bg-[#313347] ${unvalidateSkpi.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => {
            if (unvalidateSkpi.length === 0) {
              alert("Tidak ada data yang perlu divalidasi");
            } else {
              handleValidateAll();
            }
          }}
          disabled={unvalidateSkpi.length === 0}
        >
          Validasi Semua
        </button>
      </div>

      {!ttdExist && (
        <>
          {showSignaturePad && (
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <div className="relative p-8 mx-auto bg-white rounded-lg shadow-lg">
                <button className="absolute top-0 right-0 text-2xl text-gray-600" onClick={() => setShowSignaturePad(false)}>
                  <IoMdCloseCircleOutline />
                </button>
                <SignatureCanvas ref={signatureRef} canvasProps={{ width: 500, height: 200, className: "signature-canvas border" }} />
                <div className="flex gap-5">
                  <button className="px-4 py-2 mt-4 text-gray-300 rounded-lg hover:scale-105 transition transform bg-[#0F6292] hover:bg-[#0F6292]  " onClick={handleSaveSignature}>
                    Simpan
                  </button>
                  <button className="px-4 py-2 mt-4 text-gray-300 rounded-lg hover:scale-105 transition transform bg-[#0F6292] hover:bg-[#0F6292] " onClick={handleUpload}>
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className=" sm:overflow-x-auto p-3 rounded-md shadow-2xl  lg:p-10 bg-[#313347] mt-9">
        <h2 className="mb-5 font-mono text-base text-gray-300 ">Belum Diterima</h2>
        <table className="lg:min-w-full">
          <thead>
            <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29]">
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase ">Nama</th>
              <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase sm:table-cell">NPM</th>
              <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase sm:table-cell">Fakultas</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase ">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentUnvalidateSkpi.map((item, index) => (
              <tr key={index} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
                <td className="px-6 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{item.owner.name}</div>
                </td>
                <td className="hidden px-6 py-2 whitespace-nowrap sm:table-cell">
                  <div className="text-sm text-gray-400">{item.owner.npm}</div>
                </td>
                <td className="hidden px-6 py-2 whitespace-nowrap sm:table-cell">
                  <div className="text-sm text-gray-400">{item.owner.faculty}</div>
                </td>
                <td className="px-6 py-2 text-sm font-medium text-left whitespace-nowrap">
                  <button onClick={() => handleLihatDetail(item.id)} className="px-2 py-1 text-[14px] text-gray-300 rounded bg-[#0F6292] hover:bg-[#3f4481]">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {currentUnvalidateSkpi.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-sm text-center text-gray-400 " colSpan="4">
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
          className={`px-4 py-1 text-sm mr-1 rounded-lg ${currentPageUnvalidate === 1 ? " border border-[#0F6292]  cursor-not-allowed" : "border border-[#0F6292]   text-gray-300"}`}
          disabled={currentPageUnvalidate === 1}
        >
          Prev
        </button>
        <button
          onClick={() => paginateUnvalidate(currentPageUnvalidate + 1)}
          className={`px-4 py-1 ml-1 text-sm rounded-lg ${currentUnvalidateSkpi.length < itemsPerPage ? "border border-[#0F6292] cursor-not-allowed" : "  text-gray-300 border border-[#0F6292]"}`}
          disabled={currentUnvalidateSkpi.length < itemsPerPage}
        >
          Next
        </button>
      </div>

      <div className="sm:overflow-x-auto p-3 rounded-md shadow-2xl  lg:p-10 bg-[#313347] mt-9">
        <h2 className="mb-5 font-mono text-base text-gray-300">Diterima</h2>
        <table className="lg:min-w-full w-[235px]">
          <thead>
            <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29]">
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-400 uppercase">Nama</th>
              <th className="hidden px-6 py-3 text-xs font-medium text-left text-gray-400 uppercase sm:table-cell">NPM</th>
              <th className="hidden px-6 py-3 text-xs font-medium text-left text-gray-400 uppercase sm:table-cell">Fakultas</th>
            </tr>
          </thead>
          <tbody>
            {currentValidatedSkpi.map((item, index) => (
              <tr key={index} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
                <td className="px-6 py-2 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-400">{item.owner.name}</p>
                  <p className="mt-1 text-xs text-gray-500 sm:hidden">{item.owner.npm}</p>
                </td>
                <td className="hidden px-6 py-2 whitespace-nowrap sm:table-cell">
                  <p className="text-sm text-gray-400">{item.owner.npm}</p>
                </td>
                <td className="hidden px-6 py-2 whitespace-nowrap sm:table-cell">
                  <p className="text-sm text-gray-400">{item.owner.faculty}</p>
                </td>
              </tr>
            ))}
            {currentValidatedSkpi.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-sm text-[13px] text-center text-gray-300 whitespace-nowrap" colSpan="3">
                  Data tidak tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10 ">
        <button
          onClick={() => paginateValidated(currentPageValidated - 1)}
          className={`px-4 py-1 mr-1 text-sm rounded-lg ${currentPageValidated === 1 ? " border border-[#0F6292]  cursor-not-allowed" : "border border-[#0F6292]   text-gray-300"}`}
          disabled={currentPageValidated === 1}
        >
          Prev
        </button>
        <button
          onClick={() => paginateValidated(currentPageValidated + 1)}
          className={`px-4 py-1 ml-1 text-sm rounded-lg ${currentValidatedSkpi.length < itemsPerPage ? "border border-[#0F6292] cursor-not-allowed" : "  text-gray-300 border border-[#0F6292]"}`}
          disabled={currentValidatedSkpi.length < itemsPerPage}
        >
          Next
        </button>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-w-4xl w-full bg-[#2d2f45] rounded-lg shadow-lg p-6">
            <button
              className="absolute text-3xl text-red-600 transition duration-200 top-3 right-3 hover:text-red-800"
              onClick={() => {
                setShowDetail(false);
                setDetailKegiatan({});
              }}
            >
              <IoMdCloseCircleOutline />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-center text-white">Detail SKPI</h2>
            <div className="flex justify-between">
              <div className="w-1/2 pr-4">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Kategori
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Point
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">Kegiatan Wajib</td>
                      <td className="px-6 py-4">{detailKegiatan.mandatoryPoints}</td>
                    </tr>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">Organisasi dan Kepemimpinan</td>
                      <td className="px-6 py-4">{detailKegiatan.organizationPoints}</td>
                    </tr>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">Penalaran dan Keilmuan</td>
                      <td className="px-6 py-4">{detailKegiatan.scientificPoints}</td>
                    </tr>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">Minat dan Bakat</td>
                      <td className="px-6 py-4">{detailKegiatan.talentPoints}</td>
                    </tr>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <td className="px-6 py-4">Kepedulian Sosial</td>
                      <td className="px-6 py-4">{detailKegiatan.charityPoints}</td>
                    </tr>
                    <tr className="bg-gray-800">
                      <td className="px-6 py-4">Kegiatan Lainnya</td>
                      <td className="px-6 py-4">{detailKegiatan.otherPoints}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-1/2 p-4 bg-gray-700 rounded-lg ">
                <div className="py-2">
                  <div>
                    <p className="text-[14px] text-white ">Nama:</p>
                    <p className="px-2 py-2 text-sm text-white bg-[#2d2f45] rounded-lg ">{detailKegiatan.owner.name}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-[14px] text-white">NPM:</p>
                    <p className="px-2 py-2 text-sm text-white bg-[#2d2f45] rounded-lg">{detailKegiatan.owner.npm}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-[14px] text-white">Fakultas:</p>
                    <p className="px-2 py-2 text-sm text-white bg-[#2d2f45] rounded-lg">{detailKegiatan.owner.faculty}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowDetailConfirmation(true);
                  setShowDetail(false);
                }}
                className={`px-6 py-2 text-sm font-medium text-white bg-[#0F6292] rounded-full hover:bg-blue-700 transition duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Validasi"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <h2 className="mb-4 text-lg font-medium text-gray-300">Konfirmasi Validasi Semua</h2>
            <p className="mb-4 text-sm text-gray-300">Apakah Anda yakin ingin memvalidasi semua kegiatan?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-red-500 rounded-lg hover:bg-red-700">
                Batal
              </button>
              <button onClick={handleValidateAllConfirmed} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#0F6292] hover:bg-[#3f4481]">
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetailConfirmation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <h2 className="mb-4 text-lg font-medium text-gray-300">Konfirmasi Validasi</h2>
            <p className="mb-4 text-sm text-gray-300">Apakah Anda yakin ingin memvalidasi kegiatan ini?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowDetailConfirmation(false)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-red-500 rounded-lg hover:bg-red-700">
                Batal
              </button>
              <button
                onClick={() => {
                  handleValidate(detailKegiatan.id);
                  setShowDetailConfirmation(false);
                  setDetailKegiatan({});
                }}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#0F6292] hover:bg-[#3f4481]"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <p className="text-sm text-center text-gray-300">Validasi berhasil!</p>
          </div>
        </div>
      )}
      {showSuccessMessageAll && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <p className="text-sm text-center text-gray-300">Validasi semua berhasil!</p>
          </div>
        </div>
      )}
      {showErrorMessageAll && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <p className="text-sm text-center text-red-600">{errorMessageAll}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="p-8 text-center bg-[#424461] rounded-lg">
            <p className="text-gray-300">Loading...</p>
            <div className="loader"></div>
          </div>
        </div>
      )}
      {showSignatureSuccessMessage && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <p className="text-sm text-center text-gray-300">Tanda tangan berhasil disimpan!</p>
          </div>
        </div>
      )}

      {showUploadConfirmation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <h2 className="mb-4 text-lg font-medium text-gray-300">Konfirmasi Unggah Tanda Tangan</h2>
            <p className="mb-4 text-sm text-gray-300">Apakah Anda yakin ingin mengunggah tanda tangan ini?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowUploadConfirmation(false)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-red-500 rounded-lg hover:bg-red-700">
                Batal
              </button>
              <button onClick={handleUploadConfirmed} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#0F6292] hover:bg-[#3f4481]">
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessUploadMessage && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-3/4 p-8 mx-auto bg-[#424461] rounded-lg shadow-lg sm:w-96">
            <p className="text-sm text-center text-gray-300">Tanda tangan berhasil diunggah!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Skpi;
