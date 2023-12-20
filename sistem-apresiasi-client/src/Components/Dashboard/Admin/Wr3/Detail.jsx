import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Detail = () => {
  const [mahasiswa, setMahasiswa] = useState({});
  const [reason, setReason] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { NPM } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`URL_API/${NPM}`)
      .then((response) => {
        setMahasiswa(response.data);
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [NPM]);

  const handleAccept = () => {
    // Kirim data ke admin atau lakukan aksi yang sesuai untuk menerima data
  };

  const handleReject = () => {
    setShowPopup(true);
  };

  const submitRejectionReason = () => {
    // Kirim alasan penolakan ke server atau lakukan aksi yang sesuai
    setShowPopup(false); // Tutup pop-up setelah alasan penolakan dikirim
  };

  return (
    <div className="pt-8">
      <h2 className="pl-6">Detail Mahasiswa</h2>
      <div className="h-screen p-10 mt-4 shadow-boxShadow">
        <div>
          {dataLoaded ? (
            <>
              <h3>NPM: {mahasiswa.NPM}</h3>
              <p>Nama: {mahasiswa.NAMA}</p>
              <p>Kategori: {mahasiswa.KATEGORI}</p>
              <p>Prodi: {mahasiswa.PRODI}</p>
              {/* Tampilkan informasi lainnya sesuai kebutuhan */}
              <div>
                <button onClick={handleAccept}>Terima</button>
                <button onClick={handleReject}>Tolak</button>
              </div>
            </>
          ) : (
            <p className="text-red-500">Loading data...</p>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span onClick={() => setShowPopup(false)} className="close">
              &times;
            </span>
            <h3>Masukkan Alasan Penolakan</h3>
            <textarea rows="4" cols="50" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
            <button onClick={submitRejectionReason}>Kirim</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
