import React, { useEffect, useState } from "react";
import axios from "axios";

const Transkrip = () => {
  const [kegiatanWajib, setKegiatanWajib] = useState([]);
  const [kegiatanPilihan, setKegiatanPilihan] = useState([]);

  useEffect(() => {
    axios
      .get("/api/kegiatan/wajib")
      .then((response) => {
        setKegiatanWajib(response.data);
      })
      .catch((error) => {
        console.error("Error fetching kegiatan wajib:", error);
      });

    axios
      .get("/api/kegiatan/pilihan")
      .then((response) => {
        setKegiatanPilihan(response.data);
      })
      .catch((error) => {
        console.error("Error fetching kegiatan pilihan:", error);
      });
  }, []);

  const totalPointWajib = kegiatanWajib.reduce((total, kegiatan) => total + kegiatan.point, 0);
  const totalPointPilihan = kegiatanPilihan.reduce((total, kegiatan) => total + kegiatan.point, 0);
  const totalPoint = totalPointWajib + totalPointPilihan;

  return (
    <div className="max-h-[887px]  h-[870px] lg:mt-4 lg:p-14 pb-3 overflow-y-auto lg:w-[97%] rounded-lg lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[120px] p-2 ml-8 rounded-lg font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Transkrip</h2>

      <div className="mt-24 mb-6 ">
        <div className="flex ">
          <img src="./src/assets/asteriks.png" className="w-5 h-5 mt-1 " />
          <h2 className="pt-0 pl-2 font-poppins">Kegiatan Wajib</h2>
        </div>
        <table className="lg:min-w-full   mt-6 lg:border-b-[1px] lg:border-secondary ">
          <thead>
            <tr className="lg:flex lg:gap-x-[450px] lg:ml-4">
              <th className="block text-left">Kegiatan</th>
              <th className="block text-left">Sertifikat</th>
              <th className="block text-left">Point</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanWajib.map((kegiatan, index) => (
              <tr key={index}>
                <td>{kegiatan.nama}</td>
                <td>{kegiatan.sertifikat}</td>
                <td>{kegiatan.point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-20">
        <div className="flex ">
          <img src="./src/assets/choise.png" className="w-5 h-5 mt-1 " />
          <h2 className="pt-0 pl-2 font-poppins">Kegiatan Pilihan</h2>
        </div>
        <table className="lg:min-w-full mt-6 lg:border-b-[1px] lg:border-secondary ">
          <thead>
            <tr className="lg:flex lg:gap-x-[450px] lg:ml-4 ">
              <th className="block text-left ">Kegiatan</th>
              <th className="block text-left ">Sertifikat</th>
              <th className="block text-left">Point</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanPilihan.map((kegiatan, index) => (
              <tr key={index}>
                <td>{kegiatan.nama}</td>
                <td>{kegiatan.sertifikat}</td>
                <td>{kegiatan.point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-6 mt-24 border-t-2 border-gray-300 lg:mt-40">
        <div className="bg-pink-100 w-[200px] p-5 rounded-3xl shadow-lg ">
          <h2 className="mb-2 font-poppins">Total Point</h2>
          <p className="text-2xl font-bold text-secondary">{totalPoint}</p>
        </div>
        <div className="flex px-4 py-3 mt-6 ml-1 text-base transition-transform hover:text-secondary rounded-lg w-[200px] bg-yellow-200 font-poppins hover:transform hover:scale-110 ">
          <img src="./src/assets/print.png" alt="" className="w-5 h-5" />
          <button className="pl-2 ">Cetak Transkrip</button>
        </div>
      </div>
    </div>
  );
};

export default Transkrip;
