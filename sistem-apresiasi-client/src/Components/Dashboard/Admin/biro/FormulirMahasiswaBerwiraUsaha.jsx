import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

function FormulirMahasiswaBerwiraUsaha() {
  const [formData, setFormData] = useState({
    eventName: "",
    categoryName: "Mahasiswa Berwirausaha",
    facultyName: "",
    activityName: "",
    numberOfStudent: null,
    years: "",
    file: null,
    uploadedFiles: [],
  });
  const token = getToken();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    faculty: formData.facultyName,
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
      setShowSuccess(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    await handleUpload();
  };

  return (
    <div className="max-w-[800px] bg-[#313347]  h-auto p-6 ">
      <h1 className="text-lg font-semibold text-gray-300 text-start mb-11">Formulir Mahasiswa Berwirausaha</h1>
      <form onSubmit={handleSubmit} className=" space-y-11">
        <div className="flex flex-col mb-4 md:flex-row md:items-center">
          <label htmlFor="fakultas" className="mb-2 text-gray-300 md:mb-0 md:w-1/3 md:text-right md:pr-4">
            Fakultas:
          </label>
          <select id="facultyName" value={formData.facultyName} onChange={handleInputChange} className="flex-grow p-2 border bg-[#242535] border-[#0F6292] text-gray-300 text-[14px] rounded-lg">
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
        <div className="flex flex-col mb-4 md:flex-row md:items-center">
          <label htmlFor="program" className="mb-2 text-gray-300 md:mb-0 md:w-1/3 md:text-right md:pr-4">
            Program Pengabdian:
          </label>
          <input type="text" id="eventName" value={formData.eventName} onChange={handleInputChange} className="flex-grow p-2 border bg-[#242535] border-[#0F6292] text-gray-300 text-[14px] rounded-lg" />
        </div>
        <div className="flex flex-col mb-4 md:flex-row md:items-center">
          <label htmlFor="jumlahPeserta" className="mb-2 text-gray-300 md:mb-0 md:w-1/3 md:text-right md:pr-4">
            Jumlah Peserta:
          </label>
          <input type="number" id="numberOfStudent" value={formData.numberOfStudent} onChange={handleInputChange} className="flex-grow p-2 border bg-[#242535] border-[#0F6292] text-gray-300 text-[14px] rounded-lg" />
        </div>
        <div className="flex flex-col mb-4 md:flex-row md:items-center">
          <label htmlFor="tahunKegiatan" className="mb-2 text-gray-300 md:mb-0 md:w-1/3 md:text-right md:pr-4">
            Tahun Kegiatan:
          </label>
          <input type="text" id="years" value={formData.years} onChange={handleInputChange} className="flex-grow p-2 border bg-[#242535] border-[#0F6292] text-gray-300 text-[14px] rounded-lg" />
        </div>
        <div className="flex flex-col mb-4 md:flex-row md:items-center">
          <label htmlFor="file" className="mb-2 text-gray-300 md:mb-0 md:w-1/3 md:text-right md:pr-4">
            Unggah File:
          </label>
          <input type="file" id="file" onChange={handleFileChange} className="flex-grow p-2 border bg-[#242535] border-[#0F6292] text-gray-300 text-[14px] rounded-lg" />
        </div>
        <button type="submit" className="px-4 py-2 text-base transition-transform text-gray-300  rounded-lg w-[150px]  bg-[#0F6292]  hover:bg-[#1c2a33] hover:border-white font-poppins hover:transform hover:scale-110 ">
          Submit
        </button>
      </form>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-[#424461] rounded-lg shadow-lg">
            <p className="mb-4 text-gray-300">Apakah anda yakin Mendaftarkan data ini?</p>
            <button onClick={handleConfirmSubmit} className="px-4 py-1 mr-2 text-white rounded-lg hover:bg-[#1c2a33] bg-[#0F6292]">
              Ya
            </button>
            <button onClick={() => setShowConfirmation(false)} className="px-4 py-1 bg-red-500 rounded-lg hover:bg-red-700">
              Tidak
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-[#424461] rounded-lg shadow-lg">
            <p className="mb-4 text-gray-300">Berhasil didaftarkan!</p>
            <button onClick={() => setShowSuccess(false)} className="px-4 py-2 text-white rounded-lg hover:bg-[#1c2a33] bg-[#0F6292]">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormulirMahasiswaBerwiraUsaha;
