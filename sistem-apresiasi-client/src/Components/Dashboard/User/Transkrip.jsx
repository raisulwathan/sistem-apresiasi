import React, { useEffect, useState } from "react";
import { getToken } from "../../../utils/Config";
import axios from "axios";
import { getUserId } from "../../../utils/Config";
import html2pdf from "html2pdf.js";

const Transkrip = () => {
  const [kegiatanWajib, setKegiatanWajib] = useState([]);
  const [kegiatanPilihan, setKegiatanPilihan] = useState([]);
  const [detailKegiatan, setDetailKegiatan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();
  const [showPopup, setShowPopup] = useState(false);
  const [showInsufficientPointsPopup, setShowInsufficientPointsPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [skpiProcessed, setSkpiProcessed] = useState(false);
  const [skpi, setSkpi] = useState({});
  const [data, setData] = useState({});
  const userId = getUserId();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/users/${userId}`)
      .then((response) => {
        setData(response.data.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activities = response.data.data.activities || [];
        const kegiatanWajib = activities.filter((activity) => activity.fieldsActivity === "Kegiatan Wajib");
        const kegiatanPilihan = activities.filter((activity) => activity.fieldsActivity !== "Kegiatan Wajib");

        setKegiatanWajib(kegiatanWajib);
        setKegiatanPilihan(kegiatanPilihan);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    };

    const fetchDataSkpi = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v1/skpi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setSkpi(response.data.data);
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    };

    fetchData();
    fetchDataSkpi();
  }, []);

  useEffect(() => {
    let timeout;
    if (showPopup) {
      timeout = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [showPopup]);

  useEffect(() => {
    let timeout;
    if (showInsufficientPointsPopup) {
      timeout = setTimeout(() => {
        setShowInsufficientPointsPopup(false);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [showInsufficientPointsPopup]);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetailKegiatan(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };
  const handleAjukanSkpi = async () => {
    setShowConfirmation(true);
  };

  const generatePDF = () => {
    const certificateHTML = `
      <div>
        <p>Kementrian Kebudayaan, Riset, dan Teknologi</p>
        <p>Fakultas: ${data.faculty}</p>
        <p>Transkrip Surat Keterangan Pendamping Ijazah</p>
        <div style="margin-top: 10px;">
          <p><strong>Nama:</strong> ${data.name}</p>
          <p><strong>NPM:</strong> ${data.npm}</p>
          <p><strong>Jurusan:</strong> ${data.major}</p>
          <p><strong>Fakultas:</strong> ${data.faculty}</p>
        </div>
        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <thead>
            <tr style="border: 1px solid #ddd; padding: 8px;">
              <th style="border: 1px solid #ddd; padding: 8px;">Bidang</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Kegiatan Wajib</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${skpi.mandatoryPoints}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Organisasi dan Kepemimpinan</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${skpi.organizationPoints}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Penalaran dan Keilmuan</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${skpi.scientificPoints}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Minat dan Bakat</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${skpi.talentPoints}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Kepedulian Sosial</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${skpi.charityPoints}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Kegiatan Lainnya</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${skpi.otherPoints}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = certificateHTML;
    html2pdf(element, {
      margin: 10,
      filename: "sertifikat_skpi.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  };

  const confirmAjukanSkpi = async () => {
    setShowConfirmation(false);
    try {
      const response = await axios.post("http://localhost:5001/api/v1/skpi", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const statusCode = response.status;
      setSkpi({
        ...skpi,
        status: "pending",
      });
      if (statusCode === 201) {
        setShowPopup(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400 && error.response.data.message === "this users already have skpi data") {
        setSkpiProcessed(true);
      } else if (error.response && error.response.status === 400) {
        setShowInsufficientPointsPopup(true);
      } else {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    }
  };

  const totalPointWajib = kegiatanWajib.reduce((total, kegiatan) => {
    if (kegiatan.status === "accepted") {
      return total + kegiatan.points;
    }
    return total;
  }, 0);

  const totalPointPilihan = kegiatanPilihan.reduce((total, kegiatan) => {
    if (kegiatan.status === "accepted") {
      return total + kegiatan.points;
    }
    return total;
  }, 0);

  const totalPoint = totalPointWajib + totalPointPilihan;

  return (
    <div className="max-h-[887px] h-[870px] lg:mt-4 lg:p-14 pb-3 overflow-y-auto lg:w-[97%] rounded-lg lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[120px] p-2 ml-8 rounded-lg font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Transkrip</h2>

      <div className="mt-24 mb-6">
        <div className="flex items-center">
          <img src="./src/assets/asteriks.png" className="w-5 h-5 mr-2" alt="asteriks" />
          <h2 className="text-lg font-bold font-poppins">Kegiatan Wajib</h2>
        </div>
        <table className="w-full mt-6 font-poppins">
          <thead>
            <tr>
              <th className="py-2 pl-2 text-left text-white bg-secondary ">Kegiatan</th>
              <th className="py-2 text-left text-white bg-secondary">Point</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanWajib.map((activity, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="py-2 text-base">{activity.activity}</td>
                <td className="py-2 text-base">{activity.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <div className="flex items-center">
          <img src="./src/assets/choise.png" className="w-5 h-5 mr-2" alt="choise" />
          <h2 className="text-lg font-bold font-poppins">Kegiatan Pilihan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-6 font-poppins">
            <thead>
              <tr className="">
                <th className="py-2 pl-2 text-left text-white bg-secondary">Kegiatan</th>
                <th className="hidden py-2 text-left text-white lg:table-cell bg-secondary">Nama Kegiatan</th>
                <th className="hidden py-2 text-left text-white lg:table-cell bg-secondary">Point</th>
                <th className="hidden py-2 text-left text-white lg:table-cell bg-secondary">Status</th>
                <th className="py-2 text-left text-white bg-secondary">Detail</th>
              </tr>
            </thead>
            <tbody>
              {kegiatanPilihan.map((activity, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="py-2 text-base">{activity.activity}</td>
                  <td className="hidden py-2 text-base lg:table-cell">{activity.name}</td>
                  <td className="hidden py-2 text-base lg:table-cell">{activity.points}</td>
                  <td className="hidden py-2 text-base lg:table-cell">{activity.status}</td>
                  <td className="py-2">
                    <button onClick={() => handleLihatDetail(activity.id)} className="text-base text-secondary hover:underline focus:outline-none">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen overflow-auto bg-black bg-opacity-75">
            <div className=" w-[800px] p-6 mx-auto h-[890px] overflow-y-auto bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Detail Kegiatan</h3>
              <div className="text-gray-700">
                <div className="">
                  <p className="font-semibold">Nama Kegiatan :</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.activity || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Kategori Kegiatan:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.fieldsActivity || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Sertifikat:</p>
                  {detailKegiatan.activity.fileUrl ? (
                    <a href={detailKegiatan.activity.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-lg text-secondary bg-dimBlue hover:bg-blue-500">
                      Lihat
                    </a>
                  ) : (
                    <p className="px-4 py-2 rounded-lg bg-dimBlue">-</p>
                  )}
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Tingkat:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.levels || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Nama Kegiatan:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.name || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Point:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.points || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Harapan:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.possitions_achievements || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Status:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.activity.status || "-"}</p>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Tahun:</p>
                  <p className="px-4 py-2 rounded-lg bg-dimBlue">{detailKegiatan.years || "-"}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="block w-full py-2 mt-6 font-semibold text-white rounded-md bg-secondary hover:bg-secondary-dark focus:outline-none">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 mt-12 ">
        <div className=" bg-dimBlue w-[200px] p-5 rounded-3xl shadow-lg inline-block">
          <h2 className="mb-2 text-lg font-semibold font-poppins">Total Point</h2>
          <p className="text-2xl font-bold text-secondary">{totalPoint}</p>
        </div>
        <div className="flex mt-6">
          {skpi.status ? (
            <div>
              <div className="mt-12 ">
                <div className="flex items-center">
                  <img src="./src/assets/choise.png" className="w-5 h-5 mr-2" alt="choise" />
                  <h2 className="text-lg font-bold font-poppins">SKPI</h2>
                </div>
                {skpi.status === "completed" ? (
                  <div>
                    <button onClick={generatePDF} className="px-4 py-2 font-semibold text-gray-700 bg-yellow-200 rounded-md hover:bg-yellow-300">
                      Cetak
                    </button>
                  </div>
                ) : (
                  <h3> {skpi.status} </h3>
                )}
                <table className="w-full mt-6 overflow-hidden border border-collapse border-gray-300 rounded-lg font-poppins">
                  <thead className="text-white bg-secondary">
                    <tr>
                      <th className="px-6 py-3 text-left">Bidang</th>
                      <th className="px-6 py-3 text-left">Point</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100">
                    <tr>
                      <td className="px-6 py-4 text-base">Kegiatan Wajib</td>
                      <td className="px-6 py-4">{skpi.mandatoryPoints}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-base">Organisasi dan Kepemimpinan</td>
                      <td className="px-6 py-4">{skpi.organizationPoints}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-base">Penalaran dan Keilmuan</td>
                      <td className="px-6 py-4">{skpi.scientificPoints}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-base">Minat dan Bakat</td>
                      <td className="px-6 py-4">{skpi.talentPoints}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-base">Kepedulian Sosial</td>
                      <td className="px-6 py-4 text-base">{skpi.charityPoints}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-base">Kegiatan Lainnya</td>
                      <td className="px-6 py-4">{skpi.otherPoints}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <button onClick={handleAjukanSkpi} className="px-4 py-2 font-semibold text-gray-700 bg-yellow-200 rounded-md hover:bg-yellow-300">
              Ajukan
            </button>
          )}
        </div>
        {showInsufficientPointsPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-[400px] p-8 rounded-lg text-center">
              <p>Point Anda belum mencukupi!</p>
              <button onClick={() => setShowInsufficientPointsPopup(false)} className="px-4 py-2 mt-4 text-white rounded-lg bg-secondary">
                Tutup
              </button>
            </div>
          </div>
        )}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-[400px] p-8 rounded-lg text-center">
              <p>Data berhasil dikirim!</p>
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 mt-4 text-white rounded-lg bg-secondary">
                Tutup
              </button>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-[400px] p-8 rounded-lg text-center">
              <p>Anda yakin ingin mengajukan SKPI? SKPI hanya dapat di ajukan satu kali</p>
              <div className="mt-4 space-x-4">
                <button onClick={confirmAjukanSkpi} className="px-4 py-2 text-white rounded-lg bg-secondary">
                  Ya
                </button>
                <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-white bg-gray-400 rounded-lg">
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transkrip;
