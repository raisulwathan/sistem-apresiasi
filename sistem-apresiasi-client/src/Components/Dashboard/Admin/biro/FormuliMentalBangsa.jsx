import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

function FormulirPengabdian() {
  const [formData, setFormData] = useState({
    eventName: "",
    categoryName: "Pembinaan Mental Kebangsaan",
    facultyName: "",
    activityName: "",
    level: "",
    years: "",
    file: null,
    uploadedFiles: [],
  });
  const token = getToken();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file,
      uploadedFiles: [...prevData.uploadedFiles, file.name],
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const dataToSend = {
    name: formData.eventName,
    category: formData.categoryName,
    activity: formData.activityName,
    faculty: formData.facultyName,
    year: formData.years,
    levelActivity: formData.level,
    fileUrl: formData.uploadedFiles,
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/v1/achievements/noncompetitions", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-[1130px] h-[700px] p-6">
      <h1 className="text-2xl font-semibold mb-11">Formulir Pembinaan Mental kebangsaan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="fakultas" className="w-36">
            Fakultas:
          </label>
          <select id="facultyName" value={formData.facultyName} onChange={handleInputChange} className="flex-grow p-2 border rounded-lg border-secondary">
            <option value="">Pilih Fakultas</option>
            <option value="Fakultas Mipa">Fakultas Mipa</option>
            <option value="Fakultas teknik">Fakultas teknik</option>
            <option value="Fakultas Kedokteran Hewan">Fakultas Kedokteran Hewan</option>
            <option value="Fakultas kedokteran">Fakultas Kedokteran</option>
            <option value="Fakultas Pertanian">Fakultas Pertanian</option>
            <option value="Fakultas FISIP">Fakultas Ilmu Sosial dan Ilmu Politik</option>
            <option value="Fakultas KIP">FKIP</option>
            <option value="Fakultas Keperawatan">Fakultas Keperawatan</option>
            <option value="Fakultas Pasca Sarjana">Fakultas Pasca Sarjana</option>
            <option value="Fakultas Ekonomi">Fakultas Ekonomi dan Bisnis</option>
            <option value="Fakultas Hukum">Fakultas Hukum</option>
            <option value="Fakultas Kelautan">Fakultas Kelautan dan perikanan</option>
            <option value="Fakultas Dokter gigi">Fakultas Kedokteran Gigi</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="program" className="w-36">
            Nama Kegiatan:
          </label>
          <input type="text" id="eventName" value={formData.eventName} onChange={handleInputChange} className="flex-grow p-2 border rounded-lg border-secondary" />
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="activityName" className="w-36">
            Tingkat Pengakuan Jenis Kegiatan:
          </label>
          <select id="activityName" value={formData.activityName} onChange={handleInputChange} className="flex-grow p-2 border rounded-lg border-secondary">
            <option value="">Tingkat pengakuan Jenis kegiatan</option>
            <option value="Pelatihan Kepemimpinan Mahasiswa">Pelatihan Kepemimpinan Mahasiswa</option>
            <option value="Pelatihan bela Negara">Pelatihan bela Negara/Kewiraan/Wawasan Nusantara</option>
            <option value="Pendidikan Norma etika">Pendidikan Norma ,etika,Pembinaan Karakter dan soft skills Mahasiswa</option>
            <option value="Pendidikan atau gerakan">Pendidikan atau gerakan anti penyalahgunaan NAPZA</option>
            <option value="Pendidikan atau gerakan radikalisme">Pendidikan atau gerakan anti radikalisme </option>
            <option value="Kampanye Pencegahan">Kampanye Pencegahan kekeran seksual dan perundungan</option>
            <option value="Kampanye Kampus">Kampanye Kampus sehat dan/ atau green kampus</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="tingkatan" className="w-36">
            Tingkatan:
          </label>
          <select id="level" onChange={handleInputChange} value={formData.level} className="flex-grow p-2 border rounded-lg border-secondary">
            {/* Options for levels */}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="tahunKegiatan" className="w-36">
            Tahun Kegiatan:
          </label>
          <input type="text" id="years" value={formData.years} onChange={handleInputChange} className="flex-grow p-2 border rounded-lg border-secondary" />
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="file" className="w-36">
            Unggah File:
          </label>
          <input type="file" id="file" onChange={handleFileChange} className="flex-grow p-2 border rounded-lg border-secondary" />
        </div>
        <button type="submit" onClick={handleUpload} className="px-4 py-2 text-base transition-transform hover:text-white rounded-lg w-[150px] bg-secondary font-poppins hover:transform hover:scale-110">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormulirPengabdian;
