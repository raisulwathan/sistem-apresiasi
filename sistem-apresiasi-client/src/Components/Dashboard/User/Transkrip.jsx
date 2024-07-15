import React, { useEffect, useState } from "react";
import { getToken } from "../../../utils/Config";
import axios from "axios";
import { getUserId } from "../../../utils/Config";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SkpiStatus from "./DataVisualisation/SkpiStatus";

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
  const [isLoading, setIsLoading] = useState(false);

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
          console.log(response.data.data);
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

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const ttdUrl = skpi.ttd.url;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const bingkaiWidth = 210;
    const bingkaiHeight = 297;

    const bingkaiX = (pageWidth - bingkaiWidth) / 2;
    const bingkaiY = (pageHeight - bingkaiHeight) / 2;

    doc.addImage("./src/assets/bingkai.png", "PNG", bingkaiX, bingkaiY, bingkaiWidth, bingkaiHeight);

    const contentWidth = 170;
    const contentX = (pageWidth - contentWidth) / 2;
    const contentY = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.textWithLink("KEMENTERIAN PENDIDIKAN DAN BUDAYA", pageWidth / 2, contentY, { align: "center" });
    doc.textWithLink("UNIVERSITAS SYIAH KUALA", pageWidth / 2, contentY + 5, { align: "center" });
    doc.textWithLink(`FAKULTAS  ${data.faculty}`, pageWidth / 2, contentY + 10, { align: "center" });
    doc.setFont("helvetica", "normal");

    const logoLeftWidth = 18;
    const logoLeftHeight = 18;
    const logoLeftY = 35;
    const logoLeftX = 18 + logoLeftWidth / 2;
    doc.addImage("./src/assets/tutwuri.png", "PNG", logoLeftX, logoLeftY, logoLeftWidth, logoLeftHeight, "", "FAST");

    const logoRightWidth = 18;
    const logoRightHeight = 18;
    const logoRightY = 35;
    const logoRightX = pageWidth - 20 - logoRightWidth - 5;
    doc.addImage("./src/assets/logousk.png", "PNG", logoRightX, logoRightY, logoRightWidth, logoRightHeight, "", "FAST");

    doc.text("TRANSKRIP SURAT KETERENGAN PENDAPING IJAZAH", pageWidth / 2, contentY + 30, { align: "center" });

    const textSpacing = 7;
    const maxTextWidth = (Math.max(doc.getStringUnitWidth(`Nama: ${data.name}`), doc.getStringUnitWidth(`NPM: ${data.npm}`), doc.getStringUnitWidth(`Jurusan: ${data.major}`)) * doc.internal.getFontSize()) / doc.internal.scaleFactor;

    const startX = (pageWidth - maxTextWidth) / 2;
    const fontSize = 12;

    doc.setFontSize(fontSize);

    doc.text(`Nama: ${data.name}`, startX, contentY + 40, { align: "left" });
    doc.text(`NPM: ${data.npm}`, startX, contentY + 40 + textSpacing, { align: "left" });
    doc.text(`Jurusan: ${data.major}`, startX, contentY + 40 + textSpacing * 2, { align: "left" });

    const headers = [["Bidang", "Point"]];
    const rows = [
      ["Kegiatan Wajib", skpi.mandatoryPoints],
      ["Organisasi dan Kepemimpinan", skpi.organizationPoints],
      ["Penalaran dan Keilmuan", skpi.scientificPoints],
      ["Minat dan Bakat", skpi.talentPoints],
      ["Kepedulian Sosial", skpi.charityPoints],
      ["Kegiatan Lainnya", skpi.otherPoints],
    ];

    const tableY = 110;
    const tableMargin = { top: 10, right: 30, bottom: 10, left: 30 };

    doc.autoTable({
      startY: tableY,
      head: headers,
      body: rows,
      theme: "grid",
      margin: tableMargin,
      didDrawPage: function () {
        doc.setLineWidth(0.5);
        doc.line(tableMargin.left, tableY - tableMargin.top, pageWidth - tableMargin.right, tableY - tableMargin.top);
      },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5, lineColor: [0, 0, 0] },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5, lineColor: [0, 0, 0] },
    });

    const textY = doc.autoTable.previous.finalY + 20;
    const rightTextX = pageWidth - 30;

    const signatureImageWidth = 50;
    const signatureImageHeight = 20;
    const signatureImageY = textY + 10;
    const signatureImageX = rightTextX - signatureImageWidth;

    doc.text("a.n. Wakil Rektor III", rightTextX, textY, { align: "right" });
    doc.text("Bidang Kemahasiswaan", rightTextX, textY + 5, { align: "right" });
    doc.addImage(ttdUrl, "PNG", signatureImageX, signatureImageY, signatureImageWidth, signatureImageHeight);
    doc.text(`${skpi.ttd.user.name}`, rightTextX, textY + 35, { align: "right" });

    const leftTextX = 30;
    const catatanText = "Catatan:\nPredikat SKPI S1 :\nSangat baik => 251 skp\nBaik => 151 - 250 skp\nCukup => 45 - 150 skp";
    doc.setFontSize(10);
    doc.text(catatanText, leftTextX, textY + 40, { align: "left" });

    doc.save("sertifikat_skpi.pdf");
  };

  const confirmAjukanSkpi = async () => {
    setShowConfirmation(false);
    setIsLoading(true); // Mulai loading
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
    } finally {
      setIsLoading(false); // Selesai loading
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
    <div className="h-screen p-6 lg:p-16 bg-[#1d2638] overflow-y-auto">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Transkrip</h2>
      <div className="gap-5 mt-24 lg:flex lg:mt-12">
        <div className="lg:w-[50%]">
          <div className="p-6 mt-6 overflow-hidden shadow-xl bg-[#1A4057] text-gray-300 rounded-lg font-poppins">
            <h1 className="mb-4 text-[18px] font-mono "> Bobot SKP yang telah terkumpul </h1>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Kegiatan Wajib</span>
              <span>{skpi.mandatoryPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Organisasi dan Kepemimpinan</span>
              <span className="text-gray-300">{skpi.organizationPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Penalaran dan Keilmuan</span>
              <span className="text-gray-300">{skpi.scientificPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Minat dan Bakat</span>
              <span className="text-gray-300">{skpi.talentPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Kepedulian Sosial</span>
              <span className="text-gray-300">{skpi.charityPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Kegiatan Lainnya</span>
              <span className="text-gray-300">{skpi.otherPoints}</span>
            </div>
          </div>
        </div>
        <div className="flex mt-6 rounded-lg lg:w-[30%] shadow-xl p-2 justify-center bg-[#1A4057] relative">
          <h1 className="text-gray-300 flex  text-start text-[17px] font-mono absolute top-2 left-2 p-2">
            Status SKPI :{" "}
            <span>
              <h2 className="text-gray-300 text-[14px]">{skpi.status}</h2>
            </span>{" "}
          </h1>
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center lg:mt-0 mt-11">
              <SkpiStatus skpi={skpi} />
            </div>
          </div>
        </div>
        <div className="bg-[#1A4057] lg:w-[20%] shadow-xl mt-6 p-5 rounded-lg inline-block">
          <h2 className=" font-mono  text-[17px] text-gray-300 ">Total Point</h2>
          <div className="py-20 mt-20 text-center rounded-full bg-[#1d2638] ">
            <p className="text-[30px]  font-bold text-gray-300 ">{totalPoint}</p>
          </div>
          {skpi.status ? (
            <div>
              {skpi.status === "completed" ? (
                <div className="mt-4 text-center ">
                  <button onClick={generatePDF} className="px-4 py-2 font-normal  text-[16px] hover:bg-[#305a73] mt-7 text-gray-300 rounded-md bg-[#1d2638]">
                    Cetak Sertifikat SKPI
                  </button>
                </div>
              ) : (
                <h3 className=" text-base text-center text-gray-300 text-[16px] mt-4 ">SKPI Dalam Proses</h3>
              )}
            </div>
          ) : (
            <div className="mt-2 ">
              <button onClick={handleAjukanSkpi} className="block w-full mt-7 px-4 py-2 font-normal  text-[16px] text-gray-300 rounded-md bg-[#1d2638] hover:bg-purple-500">
                Ajukan SKPI
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="gap-6 mt-16 lg:flex">
        <div className="p-4 mx-2  mb-6 overflow-x-auto bg-[#1A4057] shadow-xl lg:w-[40%] rounded-md lg:mx-0">
          <div className="flex items-center">
            <img src="./src/assets/kegiatan_wajib.png" className="mr-2 w-14 h-14" alt="asteriks" />
            <h2 className="ml-2 font-mono text-gray-300 ">Kegiatan Wajib</h2>
          </div>
          <table className="w-full mt-3 font-poppins">
            <thead>
              <tr className="text-gray-300 text-[15px] border-b border-gray-600 bg-[#173344]">
                <th className="py-2 pl-2 pr-8 font-normal text-left ">Kegiatan</th>
                <th className="py-2 pr-2 font-normal text-left ">Point</th>
              </tr>
            </thead>
            <tbody>
              {kegiatanWajib.map((activity, index) => (
                <tr key={index} className="text-gray-400 border-b text-[14px] border-gray-600 bg-[#173344] rounded-lg">
                  <td className="py-2 pl-2 pr-8 ">{activity.activity}</td>
                  <td className="py-2 pr-2 ">{activity.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 mx-2  mb-6 overflow-x-auto shadow-xl bg-[#1A4057] lg:w-[60%]  rounded-md lg:mx-0">
          <div className="flex items-center">
            <img src="./src/assets/kegiatan_pilihan.png" className="mr-2 w-14 h-14" alt="choise" />
            <h2 className="ml-2 font-mono text-gray-300 ">Kegiatan Pilihan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-3 font-poppins">
              <thead>
                <tr className="text-gray-300 text-[15px] border-b border-gray-600 bg-[#173344]">
                  <th className="py-2 pl-2 font-normal text-left ">Kegiatan</th>
                  <th className="hidden py-2 font-normal text-left lg:table-cell ">Nama Kegiatan</th>
                  <th className="hidden py-2 font-normal text-left lg:table-cell ">Point</th>
                  <th className="hidden py-2 font-normal text-left lg:table-cell ">Status</th>
                  <th className="py-2 font-normal text-left ">Detail</th>
                </tr>
              </thead>
              <tbody>
                {kegiatanPilihan.map((activity, index) => (
                  <tr key={index} className="text-gray-400 border-b text-[14px] border-gray-600 bg-[#173344] rounded-lg">
                    <td className="py-2 pl-2 ">{activity.activity}</td>
                    <td className="hidden py-2 lg:table-cell">{activity.name}</td>
                    <td className="hidden py-2 lg:table-cell">{activity.points}</td>
                    <td className="hidden py-2 lg:table-cell">{activity.status}</td>
                    <td className="py-2">
                      <button onClick={() => handleLihatDetail(activity.id)} className=" text-gray-300 bg-[#1d2638] px-2 py-1 rounded-lg hover:bg-[#305a73] focus:outline-none">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
          <div className="bg-[#1d2638] w-[400px] p-8 rounded-lg text-center">
            <p className="text-gray-300">Data berhasil dikirim!</p>
            <button onClick={() => setShowPopup(false)} className="px-4 py-2 mt-4 text-gray-300 rounded-lg bg-customPurple">
              Tutup
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-[#1d2638] w-[400px] p-8 rounded-lg text-center">
            <p className="text-gray-300">Anda yakin ingin mengajukan SKPI? SKPI hanya dapat di ajukan satu kali</p>
            <div className="mt-4 space-x-4">
              <button onClick={confirmAjukanSkpi} className="px-4 py-2 text-white rounded-lg bg-customPurple">
                Ya
              </button>
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-white bg-red-600 rounded-lg">
                Tidak
              </button>
            </div>
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
  );
};

export default Transkrip;
