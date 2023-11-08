import React, { useState } from "react";
import styles from "../../../style";

const Upload = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [file, setFile] = useState("");
  const [selectedParticipation, setSelectedParticipation] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedParticipation("");
    setSelectedActivity("");
    setSelectedYear("");
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
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    console.log("Kategori:", selectedCategory);
    console.log("Kegiatan:", selectedActivity);
    console.log("Nama Kegiatan:", selectedParticipation);
    console.log("Tahun Sertifikat:", selectedYear);
    console.log("Partisipasi:", selectedParticipation);
    console.log("File:", file);
  };

  const participationOptionsForSelectedCategory = {
    "Kategori 2": ["Ketua", "Wakil Ketua", "Sekretaris", "Wakil Sekretaris", "Bendahara", "Wakil Bendahara", "Ketua Seksi", "Anggota Pengurus"],
    "Kategori 3": ["Juara 1", "Juara 2", "Juara 3", "Finalis", "Peserta terpilih"],
    "Kategori 4": ["Juara 1", "Juara 2", "Juara 3", "Finalis", "Peserta terpilih"],
    "Kategori 5": ["Tidak Ada"],
    "Kategori 6": ["Tidak Ada"],
    "Kategori 7": ["Tidak Ada"],
  };

  const kegiatanOptions = {
    "Kategori 1": ["Pakarmaru Universitas", "Pakarmaru Fakultas"],
    "Kategori 2": ["Pengurus organisasi interakampus", "pengurus organisasi extrakampus", "mengikuti pelatihan kepemimpinan", "latihan kepemimpinan lain", "panitia dalam suatu kegiatan mahasiswa", "partisipasi dalam pemira"],
    "Kategori 3": [
      "Memperoleh Prestasi dalam lomba karya ilmiah/lingkungan hidup/kreativitas/inovatif/pemikiran kritis dll",
      "mengikuti kegiatan/forum ilmiah(seminar lokakarya,workshop,pameran)",
      "menghaslkan temuan inovasi yang dipatenkan",
      "menghasilkan karya yang dipublikasikan dalam majalah ilmiah",
      "menghasilkan karya populer/yang diterbitkan disurat kabar/majalah /media lainnya",
      "menghasilkan karya yang didanai oleh pemerintah atau pihak lain",
      "Memberikan pelatihan atau bimbingan atau penyusunan karya tulis",
      "mengikuti kuliah tamu/umum",
      "terlibat dalam penelitian pihak lain",
      "pilmapres, debat bahasa inggris, dan ON MIPA ,PT,KDMI,PKM,PIMnas,KRI,KRTI dll",
      "Pelatihan/pembinaan soft skill/keterampilan",
      "mengikuti program pertukaran mahasiswa",
    ],
    "Kategori 4": [
      "memperoleh prestasi dalam kegiatan minat dan bakat",
      "mengikuti kegiatan minat dan bakat",
      "menjadi pelatih/pembimbing kegiatan minat dan bakat",
      "melaksanakan aktivitas pembinaan khusus berkaitan dengan kegiatan minat dan bakat",
      "menjadi mitra tanding pada kegiatan minat dan bakat",
    ],
    "Kategori 5": ["mengikuti pelaksanaan bakti sosial", "penangaanan bencana", "bantuan pembimbingan rutin (LBB ,pengajian TPA< PAUD)", "kegiatan lain induvidual sosial"],
    "Kategori 6": ["upacara/apel", "berpartisipasi dalam kegiatan organisasi alumni", "melakukan kunjungan /studi banding", "magang kerja non akademi"],
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
          <option value="Kategori 1">Kegiatan Wajib</option>
          <option value="Kategori 2">Organisasi dan Kepemimpinan </option>
          <option value="Kategori 3">Penalaran dan Keilmuan</option>
          <option value="Kategori 4">Minat Bakat</option>
          <option value="Kategori 5">Kepedulian Sosial</option>
          <option value="Kategori 6">Kegiatan Lainnya</option>
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

      {selectedCategory === "Kategori 2" || selectedCategory === "Kategori 3" || selectedCategory === "Kategori 4" || selectedCategory === "Kategori 5" || selectedCategory === "Kategori 6" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Nama Kegiatan :
          </label>
          <input
            type="text"
            id="participation"
            className="w-64 px-6 py-2 mt-4 lg:ml-[158px] text-sm text-center text-gray-500 border rounded-lg lg:w-96 font-poppins border-secondary"
            onChange={handleParticipationChange}
            placeholder="Nama Kegiatan"
          />
        </div>
      ) : null}

      {selectedCategory === "Kategori 2" || selectedCategory === "Kategori 3" || selectedCategory === "Kategori 4" ? (
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

      {selectedCategory !== "Kategori 1" && selectedCategory !== "Kategori 6" ? (
        <div className="lg:flex lg:mt-8">
          <label className="block mt-4 text-lg font-poppins" htmlFor="participation">
            Tingkat :
          </label>
          <select className="w-64 px-6 py-2 mt-4 text-gray-500 lg:ml-[236px] lg:w-96 text-sm text-center border rounded-lg font-poppins border-secondary" id="participation" onChange={handleParticipationChange}>
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
