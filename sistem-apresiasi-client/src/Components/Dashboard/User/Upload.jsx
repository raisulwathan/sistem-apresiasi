import React, { useState } from "react";
import styles from "../../../style";
import axios from "axios";
import { getToken, refreshToken } from "../../../utils/Config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Transkrip from "./Transkrip";

const Upload = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [file, setFile] = useState(null);
  const [selectedParticipation, setSelectedParticipation] = useState("");
  const [token, setToken] = useState("");
  const [level, setLevel] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const updateToken = async () => {
    try {
      await refreshToken();
      const newToken = getToken();
      setToken(newToken);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    // Reset nilai form ketika pop-up ditutup
    if (!showPopup) {
      setSelectedCategory("");
      setSelectedActivity("");
      setSelectedYear("");
      setFile("");
      setSelectedParticipation("");
      setLevel("");
      setName("");
      // ...reset nilai state form lainnya jika ada
    }
  }, [showPopup]);

  useEffect(() => {
    let timeout;
    if (showPopup) {
      // Setelah 5 detik, tutup pop-up
      timeout = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [showPopup]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        let storedToken = getToken();
        if (!storedToken) {
          await updateToken();
          storedToken = getToken();
        }
        setToken(storedToken);
      } catch (error) {
        console.error("Error fetching or refreshing token:", error);
      }
    };

    fetchToken();
  }, []);

  const formData = new FormData();
  formData.append("file", file); // T

  const handleUpload = async () => {
    try {
      const uploadFile = await axios.post("http://localhost:5001/api/v1/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = {
        name: name,
        fieldActivity: selectedCategory,
        activity: selectedActivity,
        level: level,
        possitionAchievement: selectedParticipation,
        years: selectedYear,
        fileUrl: uploadFile.data.data.fileUrl,
      };

      const response = await axios.post("http://localhost:5001/api/v1/activities", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const statusCode = response.status; // Mendapatkan statusCode dari respons API

      if (statusCode === 201) {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedParticipation("");
    setSelectedActivity("");
    setSelectedYear("");
    setName("");
    setLevel("");
    setFile("");
  };

  const handleActivityChange = (e) => {
    setSelectedActivity(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleParticipationChange = (e) => {
    setSelectedParticipation(e.target.value);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleLevel = (e) => {
    setLevel(e.target.value);
  };

  const participationOptionsForSelectedCategory = {
    bidangOrganisasi: ["Ketua", "Wakil Ketua", "Sekretaris", "Wakil Sekretaris", "Bendahara", "Wakil Bendahara", "Ketua Seksi", "Anggota Pengurus"],
    bidangKeilmuan: ["Juara 1", "Juara 2", "Juara 3", "Finalis", "Peserta terpilih"],
    bidangMinatBakat: ["Juara 1", "Juara 2", "Juara 3", "Finalis", "Peserta terpilih"],
    bidangBaktiSosial: ["Tidak Ada"],
    bidangLainnya: ["Tidak Ada"],
  };

  const kegiatanOptions = {
    kegiatanWajib: ["Pakarmaru Universitas", "Pakarmaru Fakultas"],
    bidangOrganisasi: ["pengurus organisasi intrakampus", "pengurus organisasi ekstrakampus", "mengikuti pelatihan kepemimpinan", "pelatihan kempemimpinan lainnya", "panitia dalam suatu kegiatan mahasiswa", "berpartisipasi dalam pemira"],
    bidangKeilmuan: [
      "lomba karya ilmiah",
      "kegiatan karya ilmiah",
      "menghasilkan temuan inovasi",
      "menghasilkan karya ilmiah",
      "kegiatan karya populer",
      "menghasilkan karya ilmiah yang didanai",
      "memberikan pelatihan karya tulis",
      "kuliah umum",
      "penelitian pihak lain",
      "pilmapres",
      "pelatihan soft skill",
    ],
    bidangMinatBakat: ["memperoleh prestasi", "mengikuti kegiatan", "pelatih", "pembinaan khusus", "mitra", "karya seni", "wirausaha"],
    bidangBaktiSosial: ["pelaksanaan bakti sosial", "penanganan bencana", "bantuan pembimbingan", "esktrakampus", "lainnya"],
    bidangLainnya: ["upacara/apel", "berpartisipasi dalam kegiatan organisasi alumni", "melakukan kunjungan/studi banding", "magang kerja non akademik", "mengikuti lomba mewakili institusi luar kampus atau individu"],
  };

  return (
    <div className="max-h-[887px] h-[878px] overflow-auto  lg:mt-6 bg-white lg:p-14 pb-3 lg:w-[98.5%] rounded-lg ">
      <h2 className="mb-6 text-[40px] text-gray-800  p-2 rounded-lg ml-8 font-bold mt-9 lg:mt-0 font-poppins">Upload Kegiatan</h2>
      <div className="border bg-slate-300 rounded-md mt-10 ml-8  h-1 lg:w-[600px]"></div>
      <div className=" mt-11 lg:mt-20 lg:flex">
        <label className="block text-lg font-poppins" htmlFor="category">
          Kategori :
        </label>
        <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border rounded-lg lg:ml-56 lg:mt-0 lg:w-96 font-poppins border-sky-500" id="category" onChange={handleCategoryChange} value={selectedCategory}>
          <option className="text-center " value="">
            -- Pilih Kategori --
          </option>
          <option value="kegiatanWajib">Kegiatan Wajib</option>
          <option value="bidangOrganisasi">Organisasi dan Kepemimpinan </option>
          <option value="bidangKeilmuan">Penalaran dan Keilmuan</option>
          <option value="bidangMinatBakat">Minat Bakat</option>
          <option value="bidangBaktiSosial">Kepedulian Sosial</option>
          <option value="bidangLainnya">Kegiatan Lainnya</option>
        </select>
      </div>

      <div className="lg:flex lg:mt-8">
        <label className="block mt-4 text-lg font-poppins" htmlFor="activity">
          Kegiatan :
        </label>
        <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border rounded-lg lg:ml-[218px] lg:w-96 font-poppins border-sky-500" id="activity" onChange={handleActivityChange} value={selectedActivity}>
          <option className="text-center " value="">
            -- Pilih Kegiatan --
          </option>
          {selectedCategory &&
            kegiatanOptions[selectedCategory].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>

      {selectedCategory !== "kegiatanWajib" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Nama Kegiatan :
          </label>
          <input type="text" id="participation" className="w-64 px-6 py-2 mt-4 lg:ml-[158px] text-sm text-center text-gray-500 border rounded-lg lg:w-96 font-poppins border-sky-500" onChange={handleName} placeholder="Nama Kegiatan" />
        </div>
      ) : null}

      {selectedCategory === "bidangOrganisasi" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Tingkat :
          </label>
          {selectedActivity === "pengurus organisasi ekstrakampus" || selectedActivity === "pelatihan kempemimpinan lainnya" ? (
            // Jika kegiatan merupakan 'pengurus organisasi ekstrakampus' atau 'pelatihan kempemimpinan lainnya'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          ) : selectedActivity === "mengikuti pelatihan kepemimpinan" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Lanjut">Lanjut</option>
              <option value="Menengah">Menengah</option>
              <option value="Dasar">Dasar</option>
            </select>
          ) : selectedActivity === "berpartisipasi dalam pemira" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Universitas">Universitas</option>
              <option value="Fakultas">Fakultas</option>
              <option value="Jurusan">Prodi/Jurusan</option>
            </select>
          ) : (
            // Untuk kegiatan lainnya
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Daerah / Regional</option>
              <option value="Universitas">Universitas</option>
              <option value="Fakultas">Fakultas</option>
            </select>
          )}
        </div>
      ) : selectedCategory === "bidangKeilmuan" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Tingkat :
          </label>
          {selectedActivity === "lomba karya ilmiah" || selectedActivity === "kegiatan karya ilmiah" || selectedActivity === "pilmapres" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Daerah / Regional</option>
              <option value="Universitas">Universitas</option>
              <option value="Fakultas">Fakultas</option>
            </select>
          ) : selectedActivity === "menghasilkan karya ilmiah" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          ) : selectedActivity === "kegiatan karya populer" ? (
            // Untuk kegiatan lainnya
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Interasional">Interasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Daerah / Regional</option>
              <option value="Universitas">Universitas</option>
            </select>
          ) : selectedActivity === "pelatihan soft skill" ? (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Interasional">Interasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Regional</option>
              <option value="Daerah">Daerah</option>
            </select>
          ) : (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          )}
        </div>
      ) : selectedCategory === "bidangMinatBakat" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Tingkat :
          </label>
          {selectedActivity === "memperoleh prestasi" || selectedActivity === "mengikuti kegiatan" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Daerah / Regional</option>
              <option value="Universitas">Universitas</option>
              <option value="Fakultas">Fakultas</option>
            </select>
          ) : selectedActivity === "pelatih" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Daerah / Regional</option>
              <option value="Universitas">Universitas</option>
              <option value="Fakultas">Fakultas</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          ) : (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          )}
        </div>
      ) : selectedCategory === "bidangBaktiSosial" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Tingkat :
          </label>
          {selectedActivity === "pelaksanaan bakti sosial" ? (
            // Jika kegiatan adalah 'mengikuti pelatihan kepemimpinan'
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleLevel}>
              <option value="">-- Tingkat --</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Regional">Daerah / Regional</option>
              <option value="Universitas">Universitas</option>
              <option value="Fakultas">Fakultas</option>
              <option value="Jurusan">Jurusan</option>
            </select>
          ) : (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          )}
        </div>
      ) : null}

      {selectedCategory === "bidangOrganisasi" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Partisipasi :
          </label>
          {selectedActivity === "pengurus organisasi intrakampus" ? (
            <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border lg:ml-[210px] rounded-lg lg:w-96 font-poppins border-sky-500" id="participation" onChange={handleParticipationChange}>
              <option value="">Pilih Partisipasi</option>
              {participationOptionsForSelectedCategory[selectedCategory] &&
                participationOptionsForSelectedCategory[selectedCategory].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          ) : (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[210px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          )}
        </div>
      ) : selectedCategory === "bidangKeilmuan" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Partisipasi :
          </label>
          {selectedActivity === "kegiatan karya ilmiah" ? (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[210px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleParticipationChange}>
              <option value="">-- pilih Partisipasi --</option>
              <option value="Pembicara">Pembicara</option>
              <option value="Moderator">Moderator</option>
              <option value="Peserta">Peserta</option>
            </select>
          ) : selectedActivity === "lomba karya ilmiah" || selectedActivity === "pilmapres" ? (
            <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border lg:ml-[209px] rounded-lg lg:w-96 font-poppins border-sky-500" id="participation" onChange={handleParticipationChange}>
              <option value="">Pilih Partisipasi</option>
              {participationOptionsForSelectedCategory[selectedCategory] &&
                participationOptionsForSelectedCategory[selectedCategory].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          ) : selectedActivity === "menghasilkan karya ilmiah" || selectedActivity === "kegiatan karya populer" || selectedActivity === "menghasilkan karya ilmiah yang didanai" ? (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleParticipationChange}>
              <option value="">-- pilih Partisipasi --</option>
              <option value="Ketua">Ketua</option>
              <option value="Anggota">Anggota</option>
            </select>
          ) : (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[210px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          )}
        </div>
      ) : selectedCategory === "bidangMinatBakat" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Partisipasi :
          </label>
          {selectedActivity === "mengikuti kegiatan" ? (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[210px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" onChange={handleParticipationChange}>
              <option value="">-- Pilih Partisipasi --</option>
              <option value="Delegasi">Delegasi</option>
              <option value="Peserta undangan">Peserta undangan</option>
              <option value="Peserta">Peserta</option>
            </select>
          ) : selectedActivity === "memperoleh prestasi" ? (
            <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border lg:ml-[209px] rounded-lg lg:w-96 font-poppins border-sky-500" id="participation" onChange={handleParticipationChange}>
              <option value="">Pilih Partisipasi</option>
              {participationOptionsForSelectedCategory[selectedCategory] &&
                participationOptionsForSelectedCategory[selectedCategory].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          ) : (
            <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
              <option value="">Tidak Ada</option>
            </select>
          )}
        </div>
      ) : selectedCategory === "bidangBaktiSosial" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Partisipasi :
          </label>
          <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[210px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-sky-500" id="participation" disabled>
            <option value="">Tidak Ada</option>
          </select>
        </div>
      ) : null}
      <div className="lg:flex lg:mt-8">
        <label className="block mt-4 text-lg font-poppins" htmlFor="year">
          Tahun Sertifikat :
        </label>
        <input className="w-64 px-6 py-2 mt-4 text-gray-500 border lg:ml-[161px] text-center text-sm lg:w-96 rounded-lg border-sky-500" type="text" id="year" placeholder="Masukkan Tahun" onChange={handleYearChange} value={selectedYear} />
      </div>

      <div className="lg:flex lg:mt-8">
        <label className="block mt-4 text-lg font-poppins" htmlFor="file">
          Sertifikat :
        </label>
        <input type="file" id="file" className="w-64 lg:ml-[226px] lg:w-96 text-sm lg:h-36 px-6 mt-4 border rounded-lg py-9 border-sky-500" onChange={handleFileChange} />
      </div>

      <div className="mt-16">
        <button className="lg:ml-[580px] shadow-md transition-transform hover:transform hover:scale-110 bg-customPurple px-7 py-3 font-serif rounded-lg text-base text-white hover:text-white" onClick={handleUpload}>
          Submit
        </button>
      </div>

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
    </div>
  );
};

export default Upload;
