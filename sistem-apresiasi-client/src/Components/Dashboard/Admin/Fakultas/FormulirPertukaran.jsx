import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

function FormulirPertukaran() {
  const [formData, setFormData] = useState({
    facultyName: "",
    eventName: "",
    categoryName: "Pertukaran Mahasiswa Nasional dan Internasional",
    majorName: "",
    activityName: "",
    numberOfStudent: null,
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
    faculty: formData.facultyName,
    category: formData.categoryName,
    major: formData.majorName,
    numberOfStudents: Number(formData.numberOfStudent),
    year: formData.years,
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
    <div className="w-[1130px] h-[700px] p-6  ">
      <h1 className="text-2xl font-semibold mb-11">Formulir Pertukaran Mahasiswa</h1>
      <form onSubmit={handleSubmit} className=" space-y-14">
        <div className="flex items-center">
          <label htmlFor="jurusan" className="w-36">
            Jurusan:
          </label>
          <select id="majorName" value={formData.majorName} onChange={handleInputChange} className="flex-grow p-2 ml-32 text-center border rounded-lg border-secondary">
            <option value="">Pilih Jurusan</option>
            <option value="Jurusan Informatika">Jurusan Informatika</option>
            <option value="Jurusan Statistika">Jurusan Statistika</option>
            <option value="Jurusan D3-Manajement Informatika">Jurusan D3-Manajement Informatika</option>
            <option value="Jurusan Fisika">Jurusan Fisika</option>
            <option value="Jurusan Kimia">Jurusan Kimia</option>
            <option value="Jurusan Biologi">Jurusan Biologi</option>
            <option value="Jurusan Farmasi">Farmasi</option>
            <option value="Jurusan Matematika">Jurusan Matematika</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="program" className="w-39">
            Program Pertukaran:
          </label>
          <input type="text" id="eventName" value={formData.eventName} onChange={handleInputChange} className="flex-grow p-2 border border-secondary rounded-lg ml-[88px]" />
        </div>
        <div className="flex items-center">
          <label htmlFor="jumlahPeserta" className="w-36">
            Jumlah Peserta:
          </label>
          <input type="number" id="numberOfStudent" value={formData.numberOfStudent} onChange={handleInputChange} className="flex-grow border-secondary ml-[129px] p-2 border rounded-lg" />
        </div>
        <div className="flex items-center">
          <label htmlFor="tahunKegiatan" className="w-39">
            Tahun Kegiatan:
          </label>
          <input type="text" id="years" value={formData.years} onChange={handleInputChange} className="flex-grow border-secondary ml-[128px] p-2 border rounded-lg" />
        </div>
        <div className="flex items-center">
          <label htmlFor="file" className="w-36">
            Unggah File:
          </label>
          <input type="file" id="file" onChange={handleFileChange} className="flex-grow border-secondary p-2 ml-[129px] border rounded-lg" />
        </div>
        <button type="submit" onClick={handleUpload} className="px-4 py-2 text-base transition-transform hover:text-white rounded-lg w-[150px] bg-secondary font-poppins hover:transform hover:scale-110 ml-[270px] ">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormulirPertukaran;
