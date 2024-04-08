import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

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
      setValidatedData((prevData) => [...prevData, validatedActivity]);

      const updatedData = data.filter((activity) => activity.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleRejection = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/activities/${id}/validate`,
        { status: "rejected", message: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      console.log("Kegiatan berhasil ditolak!");
      setConfirmRejection(false);
      setRejectionReason("");
      setShowRejectionConfirmation(true);
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

        const nonValidatedActivities = response.data.data.activities.filter((activity) => activity.status !== "accepted");
        setData(nonValidatedActivities);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

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
    <div className="pt-3 overflow-y-auto ">
      <h2 className="font-semibold text-gray-700 font-poppins">Kegiatan Mahasiswa</h2>
      <div className="h-screen p-10 overflow-auto mt-9 shadow-boxShadow">
        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <div className="mt-2">
            <h2 className="font-medium text-secondary font-poppins">Belum Divalidasi</h2>
            <table className="w-full mt-4 mb-7">
              <thead className="border">
                <tr className="border border-gray-600 ">
                  <th className="px-4 py-2 font-semibold text-left text-white bg-secondary ">Kategori</th>
                  <th className="px-4 py-2 font-semibold text-left text-white bg-secondary">Nama Kegiatan</th>
                  <th className="px-4 py-2 font-semibold text-left text-white bg-secondary">Mahasiswa</th>
                  <th className="px-4 py-2 font-semibold text-left text-white bg-secondary">Point</th>
                  <th className="px-4 py-2 font-semibold text-left text-white bg-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentNonValidatedItems.length > 0 ? (
                  currentNonValidatedItems.map((activity, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100 border border-gray-600" : "bg-white border border-gray-600"}>
                      <td className="px-4 py-2 text-base ">{activity.activity}</td>
                      <td className="px-4 py-2 text-base ">{activity.fieldsActivity}</td>
                      <td className="px-4 py-2 text-base ">{activity.owner.name}</td>
                      <td className="px-4 py-2 text-base ">{activity.points}</td>
                      <td className="py-2">
                        <button onClick={() => handleLihatDetail(activity.id)} className="px-2 text-base text-secondary hover:underline focus:outline-none">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center">
                      Data tidak tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="px-4 py-2">
                    <button
                      className="px-4 py-2 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary"
                      onClick={() => setCurrentPageNonValidated(currentPageNonValidated - 1)}
                      disabled={currentPageNonValidated === 1}
                    >
                      Previous Page
                    </button>
                    <button
                      className="px-4 py-2 ml-5 text-sm border cursor-pointer hover:border-white hover:bg-dimBlue border-secondary"
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

        <div className="h-screen py-10 mt-9">
          <h2 className="font-medium text-secondary font-poppins">Sudah Divalidasi</h2>
          <table className="w-full mt-4 mb-7">
            <thead>
              <tr className="border border-gray-600">
                <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Kategori</th>
                <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Nama Kegiatan</th>
                <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Tingkat</th>
                <th className="px-4 py-2 font-medium text-left text-white bg-secondary">Point</th>
              </tr>
            </thead>
            <tbody>
              {currentValidatedItems.map((activity, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-2 text-base border border-gray-600">{activity.activity}</td>
                  <td className="px-4 py-2 text-base border border-gray-600">{activity.fieldsActivity}</td>
                  <td className="px-4 py-2 text-base border border-gray-600">{activity.levels}</td>
                  <td className="px-4 py-2 text-base border border-gray-600">{activity.points}</td>
                </tr>
              ))}
              {currentValidatedItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    Data tidak tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-2">
            <button className="px-4 py-2 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary" onClick={() => setCurrentPageValidated(currentPageValidated - 1)} disabled={currentPageValidated === 1}>
              Previous Page
            </button>
            <button
              className="px-4 py-2 ml-5 text-sm border cursor-pointer hover:bg-dimBlue hover:border-white border-secondary"
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
          <div className="p-4 bg-white rounded-lg w-[1000px] h-[900px] relative flex">
            <div className="w-1/2 pr-4">
              <button onClick={() => setShowModal(false)} className="absolute p-1 text-gray-600 rounded-md top-2 right-2 hover:bg-gray-200 focus:outline-none focus:ring focus:border-blue-300">
                X
              </button>
              <h3 className="mb-2 text-lg font-medium">Detail Data:</h3>
              <div>
                <div className="mt-5 ">
                  <p>
                    <p className="font-medium">Kegiatan :</p> <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.activity || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="">
                    <p className="font-medium">Kategori Kegiatan :</p> <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.fieldsActivity || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="font-medium">Sertifikat :</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">
                    <a href={detailKegiatan.fileUrl} target="_blank" rel="noopener noreferrer" className="text-base text-secondary hover:underline">
                      Lihat Sertifikat
                    </a>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="">
                    <p className="font-medium">Tingkat :</p>
                    <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.levels || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="">
                    <p className="font-medium">Nama Kegiatan :</p>
                    <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.name || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="">
                    <p className="font-medium">Point :</p>
                    <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.points || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="">
                    <p className="font-medium">Status:</p>
                    <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.status || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  <p className="">
                    <p className="font-medium">Tahun:</p>
                    <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.years || "-"}</p>
                  </p>
                </div>
                <div className="mt-5">
                  {" "}
                  <p className="">
                    <p className="font-medium">Harapan :</p>
                    <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.possitions_achievements || "-"}</p>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/2 pl-4">
              <h3 className="mb-2 text-lg font-medium mt-11">Mahasiswa:</h3>
              <div className="mt-5">
                <p className="">
                  <p className="font-medium">Nama :</p>
                  <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.owner.name || "-"}</p>
                </p>
              </div>
              <div className="mt-5">
                <p className="">
                  <p className="font-medium">NPM :</p>
                  <p className="px-4 py-2 text-base rounded-lg bg-dimBlue">{detailKegiatan.owner.npm || "-"}</p>
                </p>
              </div>
              <div className="mt-5">
                <p className="">
                  <p className="font-medium">Prodi :</p>
                  <p className="px-4 py-2 text-base rounded-lg bg-dimBlue"> {detailKegiatan.owner.major || "-"}</p>
                </p>
              </div>

              <div className="flex border justify-evenly mt-36 bg-emerald-100 py-9 rounded-xl border-secondary ">
                <h2 className="font-sans ">Lakukan Aksi Disini !!</h2>
                <button onClick={() => handleConfirmValidation(detailKegiatan.id)} className="px-4 py-2 text-base text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                  Validasi
                </button>
                <button onClick={() => handleConfirmRejection(detailKegiatan.id)} className="px-4 py-2 text-base text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none">
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmValidation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Apakah Anda yakin ingin melakukan validasi kegiatan ini?</p>
            <div className="flex justify-around mt-4">
              <button onClick={() => handleValidation(selectedItemId)} className="px-3 py-1 text-white bg-green-500 rounded-md">
                Ya
              </button>
              <button onClick={() => setConfirmValidation(false)} className="px-3 py-1 text-white bg-red-500 rounded-md">
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRejection && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Apakah Anda yakin ingin menolak kegiatan ini?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => {
                  setConfirmRejection(false);
                  setRejectionReason("");
                }}
                className="px-3 py-1 text-white bg-gray-500 rounded-md"
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
          <div className="p-4 bg-white rounded-lg">
            <input type="text" placeholder="Alasan penolakan" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
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
            </div>
          </div>
        </div>
      )}
      {showRejectionConfirmation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Kegiatan berhasil ditolak dan pesan berhasil dikirim.</p>
            <button onClick={() => setShowRejectionConfirmation(false)} className="px-3 py-1 mt-4 text-white rounded-md bg-secondary">
              Tutup
            </button>
          </div>
        </div>
      )}

      {validationSuccess && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Kegiatan berhasil divalidasi!</p>
            <button onClick={() => setValidationSuccess(false)} className="px-3 py-1 mt-4 text-white rounded-md bg-secondary">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanMahasiswa;
