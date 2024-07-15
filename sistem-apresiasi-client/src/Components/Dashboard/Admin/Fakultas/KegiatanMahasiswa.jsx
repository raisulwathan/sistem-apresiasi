import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";
import { IoIosCloseCircleOutline } from "react-icons/io";

const KegiatanMahasiswa = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [detailKegiatan, setDetailKegiatan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();
  const [confirmValidation, setConfirmValidation] = useState(false);
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [validatedData, setValidatedData] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonInput, setRejectionReasonInput] = useState(false);
  const [showRejectionConfirmation, setShowRejectionConfirmation] = useState(false);
  const [currentPageNonValidated, setCurrentPageNonValidated] = useState(1);
  const [currentPageValidated, setCurrentPageValidated] = useState(1);
  const itemsPerPage = 5;
  const [currentNonValidatedItems, setCurrentNonValidatedItems] = useState([]);
  const [currentValidatedItems, setCurrentValidatedItems] = useState([]);

  const handleConfirmValidation = (id) => {
    setSelectedItemId(id);
    setConfirmValidation(true);
  };

  const handleConfirmRejection = (id) => {
    setSelectedItemId(id);
    setConfirmRejection(true);
  };

  const handleValidation = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/activities/${id}/validate`,
        { status: "accepted" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kegiatan berhasil divalidasi!");
      setShowModal(false);
      setConfirmValidation(false);
      setValidationSuccess(true);

      const validatedActivity = data.find((activity) => activity.id === id);
      setValidatedData((prevData) => {
        const updatedData = [...prevData, validatedActivity];
        localStorage.setItem("validatedData", JSON.stringify(updatedData)); // Simpan ke localStorage
        return updatedData;
      });

      const updatedData = data.filter((activity) => activity.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleRejection = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/activities/${id}/validate`,
        { status: "rejected", message: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kegiatan berhasil ditolak!");
      setConfirmRejection(false);
      setRejectionReason("");
      setShowRejectionConfirmation(true);

      const updatedData = validatedData.filter((activity) => activity.id !== id);
      setValidatedData(updatedData);
      localStorage.setItem("validatedData", JSON.stringify(updatedData)); // Simpan ke localStorage
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/activities/faculties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const nonValidatedActivities = response.data.data.activities.filter((activity) => activity.status === "pending");
        setData(nonValidatedActivities);

        // Ambil data dari localStorage
        const savedValidatedData = JSON.parse(localStorage.getItem("validatedData")) || [];
        setValidatedData(savedValidatedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValidatedData([]);
    }, 24 * 60 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [validatedData]);

  useEffect(() => {
    const startIndexNonValidated = (currentPageNonValidated - 1) * itemsPerPage;
    const endIndexNonValidated = startIndexNonValidated + itemsPerPage;
    setCurrentNonValidatedItems(data.slice(startIndexNonValidated, endIndexNonValidated));
  }, [data, currentPageNonValidated]);

  useEffect(() => {
    const startIndexValidated = (currentPageValidated - 1) * itemsPerPage;
    const endIndexValidated = startIndexValidated + itemsPerPage;
    setCurrentValidatedItems(validatedData.slice(startIndexValidated, endIndexValidated));
  }, [validatedData, currentPageValidated]);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetailKegiatan(response.data.data.activity);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };
  return (
    <div className="h-screen p-16 bg-[#424461] overflow-y-auto ">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Kegiatan Mahasiswa</h2>
      <div className="">
        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <div className="mt-12 bg-[#313347] p-10 rounded-md shadow-2xl">
            <h2 className="font-mono font-medium text-gray-300">Belum Divalidasi</h2>
            <table className="w-full mt-4 mb-7">
              <thead className="">
                <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29]">
                  <th className="px-4 py-2 text-[15px] text-left  font-normal  ">Kategori</th>
                  <th className="px-4 py-2 text-[15px] text-left  font-normal ">Nama Kegiatan</th>
                  <th className="px-4 py-2 text-[15px] text-left  font-normal ">Mahasiswa</th>
                  <th className="px-4 py-2 text-[15px] text-left  font-normal ">Point</th>
                  <th className="px-4 py-2 text-[15px] text-left  font-normal ">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentNonValidatedItems.length > 0 ? (
                  currentNonValidatedItems.map((activity, index) => (
                    <tr key={index} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
                      <td className="px-4 py-2  text-[14px] ">{activity.activity}</td>
                      <td className="px-4 py-2  text-[14px]">{activity.fieldsActivity}</td>
                      <td className="px-4 py-2  text-[14px]">{activity.owner.name}</td>
                      <td className="px-4 py-2  text-[14px]">{activity.points}</td>
                      <td className="py-2">
                        <button onClick={() => handleLihatDetail(activity.id)} className="px-2 py-1 text-[14px] text-gray-300 rounded bg-[#0F6292] hover:bg-[#274e64]">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center">
                      <p className="text-base text-[12px] text-gray-400">Tidak ada data yang masuk</p>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="mt-7">
                  <td colSpan="5" className="px-4 py-2 ">
                    <button
                      className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
                      onClick={() => setCurrentPageNonValidated(currentPageNonValidated - 1)}
                      disabled={currentPageNonValidated === 1}
                    >
                      Previous Page
                    </button>
                    <button
                      className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
                      onClick={() => setCurrentPageNonValidated(currentPageNonValidated + 1)}
                      disabled={currentNonValidatedItems.length < itemsPerPage}
                    >
                      Next Page
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="mt-12 bg-[#313347] p-10 rounded-md shadow-2xl">
          <h2 className="font-mono font-medium text-gray-300">Sudah Divalidasi</h2>
          <table className="w-full mt-4 mb-7">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] ">
                <th className="px-4 py-2 text-[15px] font-medium text-left  ">Kategori</th>
                <th className="px-4 py-2 text-[15px] font-medium text-left  ">Nama Kegiatan</th>
                <th className="px-4 py-2 text-[15px] font-medium text-left  ">Tingkat</th>
                <th className="px-4 py-2 text-[15px] font-medium text-left  ">Point</th>
              </tr>
            </thead>
            <tbody>
              {currentValidatedItems.map((activity, index) => (
                <tr key={index} className="text-gray-400 border-b border-gray-600 bg-[#1c1d29] rounded-lg">
                  <td className="px-4 py-2 text-[14px] ">{activity.activity}</td>
                  <td className="px-4 py-2 text-[14px] ">{activity.fieldsActivity}</td>
                  <td className="px-4 py-2 text-[14px] ">{activity.levels}</td>
                  <td className="px-4 py-2 text-[14px] ">{activity.points}</td>
                </tr>
              ))}
              {currentValidatedItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    <p className="text-base text-[12px] text-gray-500">Tidak ada data yang masuk</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-2 mt-7">
            <button
              className="px-3 py-1 text-sm text-[13px] text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
              onClick={() => setCurrentPageValidated(currentPageValidated - 1)}
              disabled={currentPageValidated === 1}
            >
              Previous Page
            </button>
            <button
              className="px-3 py-1 ml-5 text-[13px] text-sm text-gray-300 border cursor-pointer rounded-md hover:bg-dimBlue hover:border-white border-[#0F6292]"
              onClick={() => setCurrentPageValidated(currentPageValidated + 1)}
              disabled={currentValidatedItems.length < itemsPerPage}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative flex flex-col md:flex-row p-4 bg-[#424461] rounded-lg w-11/12 md:w-[800px] lg:w-[1000px] h-auto max-h-[90%] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute p-1 text-red-600 rounded-md top-2 right-2 focus:outline-none focus:ring focus:border-blue-300">
              <IoIosCloseCircleOutline size={30} />
            </button>
            <div className="w-full pr-0 mb-4 md:w-1/2 md:pr-4 md:mb-0">
              <h3 className="mb-2 text-lg text-[16px] text-gray-300">Detail Data:</h3>
              <div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Kegiatan:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.activity || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Kategori Kegiatan:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.fieldsActivity || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Sertifikat:</p>
                  <p className="px-4 py-2 rounded-lg bg-[#313347]">
                    <a href={detailKegiatan.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-400 hover:underline">
                      Lihat Sertifikat
                    </a>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Tingkat:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.levels || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Nama Kegiatan:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.name || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Point:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.points || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Status:</p>
                  <p className="px-4 py-2 text-[14px ] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.status || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Tahun:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.years || "-"}</p>
                </div>
                <div className="mt-5">
                  <p className="text-[15px] text-gray-300 ">Harapan:</p>
                  <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.possitions_achievements || "-"}</p>
                </div>
              </div>
            </div>
            <div className="w-full pl-0 md:w-1/2 md:pl-4">
              <h3 className="mb-2 text-[15px] text-gray-300  mt-4 md:mt-11">Mahasiswa:</h3>
              <div className="mt-5">
                <p className="text-[15px] text-gray-300 ">Nama:</p>
                <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.owner.name || "-"}</p>
              </div>
              <div className="mt-5">
                <p className="text-[15px] text-gray-300 ">NPM:</p>
                <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.owner.npm || "-"}</p>
              </div>
              <div className="mt-5">
                <p className="text-[15px] text-gray-300 ">Prodi:</p>
                <p className="px-4 py-2 text-[14px] text-gray-400 rounded-lg bg-[#313347]">{detailKegiatan.owner.major || "-"}</p>
              </div>
              <div className="flex mt-10 justify-evenly bg-[#212231] md:mt-36 py-9 rounded-xl ">
                <h2 className="font-sans text-gray-300">Lakukan Aksi Disini !!</h2>
                <button onClick={() => handleConfirmValidation(detailKegiatan.id)} className="px-3 py-1  rounded-md text-gray-300 text-[14px] bg-[#0F6292] hover:bg-[#274e64] focus:outline-none">
                  Validasi
                </button>
                <button onClick={() => handleConfirmRejection(detailKegiatan.id)} className="px-3 py-1 text-[14px] text-gray-300 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none">
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmValidation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-[#424461] rounded-lg">
            <p className="text-gray-300">Apakah Anda yakin ingin melakukan validasi kegiatan ini?</p>
            <div className="flex justify-around mt-4">
              <button onClick={() => handleValidation(selectedItemId)} className="px-3 py-1 text-white rounded-md bg-[#0F6292] hover:bg-[#274e64]">
                Ya
              </button>
              <button onClick={() => setConfirmValidation(false)} className="px-3 py-1 text-white bg-red-600 rounded-md hover:bg-red-700">
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRejection && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-[#424461] rounded-lg">
            <p className="text-gray-300">Apakah Anda yakin ingin menolak kegiatan ini?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => {
                  setConfirmRejection(false);
                  setRejectionReason("");
                }}
                className="px-3 py-1 text-white bg-[#0F6292] hover:bg-[#274e64] rounded-md"
              >
                Tidak
              </button>
              <button onClick={() => setRejectionReasonInput(true)} className="px-3 py-1 text-white bg-red-500 rounded-md">
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectionReasonInput && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-1/3 p-6 bg-[#424461] rounded-lg">
            <textarea placeholder="Alasan penolakan" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full bg-[#424461] text-gray-300 h-32 p-2 border border-gray-300 rounded-md" />
            <div className="flex justify-around mt-4">
              <button
                onClick={() => {
                  handleRejection(selectedItemId);
                  setRejectionReasonInput(false);
                }}
                className="px-3 py-1 text-white bg-red-500 rounded-md"
              >
                Kirim
              </button>
              <button onClick={() => setRejectionReasonInput(false)} className="px-3 py-1 text-gray-300 bg-gray-500 rounded-md">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectionConfirmation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-[#313347] rounded-lg">
            <p className="text-gray-300">Kegiatan berhasil ditolak dan pesan berhasil dikirim.</p>
            <button onClick={() => setShowRejectionConfirmation(false)} className="px-3 py-1 mt-4 text-white rounded-md bg-[#0F6292] hover:bg-[#274e64]">
              Tutup
            </button>
          </div>
        </div>
      )}

      {validationSuccess && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-[#313347] rounded-lg">
            <p className="text-gray-300">Kegiatan berhasil divalidasi!</p>
            <button onClick={() => setValidationSuccess(false)} className="px-3 py-1 mt-4 text-white rounded-md bg-[#0F6292] hover:bg-[#274e64] focus:outline-none">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanMahasiswa;
