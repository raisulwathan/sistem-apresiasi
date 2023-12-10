import React, { useState } from "react";
import styles from "../../../style";
import axios from "axios";
import { getToken, refreshToken } from "../../../utils/Config";
import { useEffect } from "react";

const Upload = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("");
  const [selectedParticipation, setSelectedParticipation] = useState("");
  const [token, setToken] = useState("");
  const [level, setLevel] = useState("");
  const [name, setName] = useState("");

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

  const data = {
    name: name,
    fieldActivity: selectedCategory,
    activity: selectedActivity,
    level: level,
    possitionAchievement: selectedParticipation,
    years: selectedYear,
    fileUrl: filename,
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/v1/activities", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response.data);
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
    setFilename(uploadedFile.name);
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
    bidangMinat: ["Juara 1", "Juara 2", "Juara 3", "Finalis", "Peserta terpilih"],
    bidangSosial: ["Tidak Ada"],
    bidangLainnya: ["Tidak Ada"],
  };

  const kegiatanOptions = {
    kegiatanWajib: ["Pakarmaru Universitas", "Pakarmaru Fakultas"],
    bidangOrganisasi: ["pengurus organisasi intrakampus", "pengurus organisasi ekstrakampus", "mengikuti pelatihan kempemimpinan", "pelatihan kempemimpinan lainnya", "panitia dalam suatu kegiatan mahasiswa", "berpartisipasi dalam pemira"],
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
    bidangMinat: ["memperoleh prestasi", "mengikuti kegiatan", "pelatih", "pembinaan khusus", "mitra", "karya seni", "wirausaha"],
    bidangSosial: ["pelaksanaan bakti sosial", "penanganan bencana", "bantuan pembimbingan", "esktrakampus", "lainnya"],
    bidangLainnya: ["upacara/apel", "berpartisipasi dalam kegiatan organisasi alumni", "melakukan kunjungan/studi banding", "magang kerja non akademik", "mengikuti lomba mewakili institusi luar kampus atau individu"],
  };

  return (
    <div className="max-h-[887px]  h-[870px] lg:mt-4 lg:p-14 pb-3  overflow-y-auto lg:w-[90%] rounded-lg lg:shadow-Shadow  ">
      <h2 className="mb-6 text-xl ml-8 text-gray-700 w-[195px] p-2 rounded-lg font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Upload Kegiatan</h2>
      <div className=" mt-11 lg:mt-20 lg:flex">
        <label className="block text-lg font-poppins" htmlFor="category">
          Kategori :
        </label>
        <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border rounded-lg lg:ml-56 lg:mt-0 lg:w-96 font-poppins border-secondary" id="category" onChange={handleCategoryChange} value={selectedCategory}>
          <option className="text-center " value="">
            -- Pilih Kategori --
          </option>
          <option value="kegiatanWajib">Kegiatan Wajib</option>
          <option value="bidangOrganisasi">Organisasi dan Kepemimpinan </option>
          <option value="bidangKeilmuan">Penalaran dan Keilmuan</option>
          <option value="bidangMinat">Minat Bakat</option>
          <option value="bidangSosial">Kepedulian Sosial</option>
          <option value="bidangLainnya">Kegiatan Lainnya</option>
        </select>
      </div>

      <div className="lg:flex lg:mt-8">
        <label className="block mt-4 text-lg font-poppins" htmlFor="activity">
          Kegiatan :
        </label>
        <select className="w-64 px-6 py-2 mt-4 text-sm text-gray-500 border rounded-lg lg:ml-[218px] lg:w-96 font-poppins border-secondary" id="activity" onChange={handleActivityChange} value={selectedActivity}>
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

      {selectedCategory === "bidangOrganisasi" || selectedCategory === "bidangKeilmuan" || selectedCategory === "bidangMinat" || selectedCategory === "bidangSosial" || selectedCategory === "bidangLainnya" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Nama Kegiatan :
          </label>
          <input type="text" id="participation" className="w-64 px-6 py-2 mt-4 lg:ml-[158px] text-sm text-center text-gray-500 border rounded-lg lg:w-96 font-poppins border-secondary" onChange={handleName} placeholder="Nama Kegiatan" />
        </div>
      ) : null}

      {selectedCategory === "bidangOrganisasi" || selectedCategory === "bidangKeilmuan" || selectedCategory === "bidangMinat" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Partisipasi :
          </label>
          <select className="w-64 px-6 py-2 mt-4 text-sm text-center text-gray-500 border lg:ml-[209px] rounded-lg lg:w-96 font-poppins border-secondary" id="participation" onChange={handleParticipationChange}>
            <option value="">Pilih Partisipasi</option>
            {participationOptionsForSelectedCategory[selectedCategory] &&
              participationOptionsForSelectedCategory[selectedCategory].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
      ) : null}

      {selectedCategory !== "kegiatanWajib" && selectedCategory !== "bidangLainnya" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Tingkat :
          </label>
          <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-secondary" id="participation" onChange={handleLevel}>
            <option value="">-- Tingkat --</option>
            <option value="Nasional">Nasional</option>
            <option value="Internasional">Internasional</option>
          </select>
        </div>
      ) : null}

      <div className="lg:flex lg:mt-8">
        <label className="block mt-4 text-lg font-poppins" htmlFor="year">
          Tahun Sertifikat :
        </label>
        <input className="w-64 px-6 py-2 mt-4 text-gray-500 border lg:ml-[161px] text-center text-sm lg:w-96 rounded-lg border-secondary" type="text" id="year" placeholder="Masukkan Tahun" onChange={handleYearChange} value={selectedYear} />
      </div>

      <div className="lg:flex lg:mt-8">
        <label className="block mt-4 text-lg font-poppins" htmlFor="file">
          Sertifikat :
        </label>
        <input type="file" id="file" className="w-64 lg:ml-[226px] lg:w-96 text-sm lg:h-36 px-6 mt-4 border rounded-lg py-9 border-secondary" onChange={handleFileChange} />
      </div>

      <div className="mt-16">
        <button className="lg:ml-[580px] shadow-md transition-transform hover:transform hover:scale-110 bg-secondary px-7 py-3 font-serif rounded-lg text-base hover:text-white " onClick={handleUpload}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Upload;
