import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";
import SignatureCanvas from "react-signature-canvas";

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
    }
  };

  const handleValidate = async () => {
    setShowConfirmation(false);
    try {
      handleSaveSignature();
      await handleUpload();
      await handleValidation(detailKegiatan.id);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleValidateAll = async () => {
    setShowConfirmation(false);
    try {
      for (let i = 0; i < unvalidateSkpi.length; i++) {
        const skpi = unvalidateSkpi[i];
        handleSaveSignature();
        await handleUpload();
        await handleValidation(skpi.id);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
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

  return (
    <div className="h-screen pt-3 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">SKPI</h2>
      <div className="h-screen p-10 mt-9 shadow-boxShadow">
        {!ttdExist && (
          <>
            <div className="mt-4">
              <SignatureCanvas ref={signatureRef} canvasProps={{ width: 500, height: 200, className: "signature-canvas" }} />
            </div>
            <button className="px-2 py-4 mt-4 text-white rounded-lg bg-primary" onClick={handleSaveSignature}>
              Simpan Tanda Tangan
            </button>
            <button className="px-2 py-4 mt-4 text-white rounded-lg bg-primary" onClick={handleUpload}>
              Kirim Tanda Tangan
            </button>
          </>
        )}

        <button className="px-2 py-4 mt-4 ml-4 text-white rounded-lg bg-secondary" onClick={handleValidateAll}>
          Validasi Semua
        </button>

        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <div>
            <h2 className="mt-8">Belum Diterima</h2>
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
                {unvalidateSkpi.map((item, index) => (
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
                {unvalidateSkpi.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">
                      Data tidak tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <h2 className="mt-8">Sudah Diterima</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-secondary">
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">NPM</th>
                  <th className="px-4 py-2 text-left">Fakultas</th>
                </tr>
              </thead>
              <tbody>
                {validatedSkpi.map((item, index) => (
                  <tr key={index} className="">
                    <td className="px-4 py-2 border-b-2 border-gray-300">{item.owner.name}</td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">{item.owner.npm}</td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">{item.owner.faculty}</td>
                  </tr>
                ))}
                {validatedSkpi.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center">
                      Data tidak tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
              <button className="px-2 py-3 mt-4 rounded-lg bg-secondary" onClick={() => setShowConfirmation(true)}>
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

        {showSuccessMessage && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative max-w-screen-lg p-6 mx-auto bg-white rounded-lg" style={{ width: "30vw" }}>
              <p>Kegiatan berhasil divalidasi!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skpi;
