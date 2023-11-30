import React, { useState } from "react";
import axios from "axios";

function Formulir() {
  const [formData, setFormData] = useState({
    facultyName: "",
    eventName: "",
    studyProgram: "",
    category: "",
    participationType: "",
    participantCount: "",
    achievement: "",
    advisorNIDN: "",
    advisorName: "",
    advisorNIP: "",
    organizer: "",
    startDate: "",
    endDate: "",
    year: "",
    file: null,
    fotoFile: null, // Menambah state untuk foto
    suratFile: null, // Menambah state untuk surat
    link: "",
    keterangan: "", // Menambah state untuk keterangan
  });

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFotoChange = (e) => {
    const fotoFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      fotoFile,
    }));
  };

  const handleSuratChange = (e) => {
    const suratFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      suratFile,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file,
    }));
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeteranganChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post("URL_SERVER_AND_ENDPOINT", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      setFormData({
        facultyName: "",
        eventName: "",
        studyProgram: "",
        category: "",
        participationType: "",
        participantCount: "",
        achievement: "",
        advisorNIDN: "",
        advisorName: "",
        advisorNIP: "",
        organizer: "",
        startDate: "",
        endDate: "",
        year: "",
        file: null,
        fotoFile: null,
        suratFile: null,
        link: "",
        keterangan: "",
      });

      // Tambahkan logika penanganan jika pengiriman berhasil di sini (contoh: tampilkan pesan sukses)
    } catch (error) {
      // Tambahkan logika penanganan jika pengiriman gagal di sini (contoh: tampilkan pesan error)
      console.error("Error:", error);
    }
  };

  return (
    <div className="pt-3 ">
      <h2 className="font-semibold text-gray-700 font-poppins">Formulir</h2>

      <form className="max-h-[80vh] p-10 overflow-auto mt-9 shadow-boxShadow" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="facultyName" className="block mb-2 font-medium text-gray-700 font-poppins">
            Nama Fakultas
          </label>
          <select id="facultyName" name="facultyName" value={formData.facultyName} onChange={handleDropdownChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Fakultas</option>
            <option value="Fakultas A">Fakultas Mipa</option>
            <option value="Fakultas B">Fakultas Teknik</option>
            <option value="Fakultas C">Fakultas Ekonomi</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="eventName" className="block mb-2 font-medium font-poppins">
            Nama Kegiatan
          </label>
          <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleDropdownChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="studyProgram" className="block mb-2 font-medium text-gray-700 font-poppins">
            Program Studi
          </label>
          <input type="text" id="studyProgram" name="studyProgram" value={formData.studyProgram} onChange={handleDropdownChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        {/* Kategori Kegiatan */}
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 font-medium text-gray-700 font-poppins">
            Kategori Kegiatan
          </label>
          <select id="category" name="category" value={formData.category} onChange={handleDropdownChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Kategori</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Wilayah">Wilayah</option>
            <option value="Nasional">Nasional</option>
            <option value="Internasional">Internasional</option>
          </select>
        </div>

        {/* Jenis Kegiatan */}
        <div className="mb-4">
          <label htmlFor="participationType" className="block mb-2 font-medium text-gray-700 font-poppins">
            Jenis Kegiatan
          </label>
          <select
            id="participationType"
            name="participationType"
            value={formData.participationType}
            onChange={handleDropdownChange}
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Pilih Jenis Kegiatan</option>
            <option value="Individu">Individu</option>
            <option value="Kelompok">Kelompok</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="participantCount" className="block mb-2 font-medium text-gray-700 font-poppins">
            Jumlah Peserta
          </label>
          <input
            type="number"
            id="participantCount"
            name="participantCount"
            value={formData.participantCount}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="achievement" className="block mb-2 font-medium text-gray-700 font-poppins">
            Capaian Prestasi
          </label>
          <select id="achievement" name="achievement" value={formData.achievement} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Capaian Prestasi</option>
            <option value="Juara 1">Juara 1</option>
            <option value="Juara 2">Juara 2</option>
            <option value="Juara 3">Juara 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="advisorNIDN" className="block mb-2 font-medium text-gray-700 font-poppins">
            NIDN Pembimbing
          </label>
          <input type="text" id="advisorNIDN" name="advisorNIDN" value={formData.advisorNIDN} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        {/* Nama Pembimbing */}
        <div className="mb-4">
          <label htmlFor="advisorName" className="block mb-2 font-medium text-gray-700 font-poppins">
            Nama Pembimbing
          </label>
          <input type="text" id="advisorName" name="advisorName" value={formData.advisorName} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        {/* NIP Pembimbing */}
        <div className="mb-4">
          <label htmlFor="advisorNIP" className="block mb-2 font-medium text-gray-700 font-poppins">
            NIP Pembimbing
          </label>
          <input type="text" id="advisorNIP" name="advisorNIP" value={formData.advisorNIP} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        {/* Penyelenggara */}
        <div className="mb-4">
          <label htmlFor="organizer" className="block mb-2 font-medium text-gray-700 font-poppins">
            Penyelenggara
          </label>
          <input type="text" id="organizer" name="organizer" value={formData.organizer} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="achievementType" className="block mb-2 font-medium text-gray-700 font-poppins">
            Jenis Prestasi
          </label>
          <select id="achievementType" name="achievementType" value={formData.achievementType} onChange={handleDropdownChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Jenis Prestasi</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Seni">Seni</option>
            <option value="Sains">Sains</option>
            {/* Tambahkan opsi lainnya di sini */}
          </select>
        </div>

        {/* Tanggal Mulai */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block mb-2 font-medium text-gray-700 font-poppins">
            Tanggal Mulai
          </label>
          <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        {/* Tanggal Selesai */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-2 font-medium text-gray-700 font-poppins">
            Tanggal Selesai
          </label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        {/* Tahun Kegiatan */}
        <div className="mb-4">
          <label htmlFor="year" className="block mb-2 font-medium text-gray-700 font-poppins">
            Tahun Kegiatan
          </label>
          <input type="text" id="year" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block mb-2 font-medium text-gray-700 font-poppins">
            Upload File
          </label>
          <input type="file" id="file" name="file" onChange={handleFileChange} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="link" className="block mb-2 font-medium text-gray-700 font-poppins">
            URL Link
          </label>
          <input type="url" id="link" name="link" value={formData.link} onChange={handleLinkChange} className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="foto" className="block mb-2 font-medium text-gray-700 font-poppins">
            Unggah Foto
          </label>
          <input type="file" id="foto" name="foto" onChange={handleFotoChange} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="surat" className="block mb-2 font-medium text-gray-700 font-poppins">
            Unggah Surat
          </label>
          <input type="file" id="surat" name="surat" onChange={handleSuratChange} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="keterangan" className="block mb-2 font-medium text-gray-700 font-poppins">
            Keterangan
          </label>
          <textarea
            id="keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleKeteranganChange}
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700 font-poppins focus:outline-none focus:shadow-outline">
          Daftar
        </button>
      </form>
    </div>
  );
}

export default Formulir;
