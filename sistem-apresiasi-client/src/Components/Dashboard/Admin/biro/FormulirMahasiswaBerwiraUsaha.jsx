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
    <div className="w-[1130px] h-[700px] p-6 ">
      <h1 className="text-2xl font-semibold mb-11">Formulir Mahasiswa Berwirausaha</h1>
      <form onSubmit={handleSubmit} className=" space-y-14">
        <div className="flex items-center">
          <label htmlFor="fakultas" className="w-36">
            Fakultas:
          </label>
          <select id="facultyName" value={formData.facultyName} onChange={handleInputChange} className="flex-grow p-2 ml-32 text-center border rounded-lg border-amber-500 ">
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
        <div className="flex items-center">
          <label htmlFor="program" className="w-39">
            Program Pengabdian:
          </label>
          <input type="text" id="eventName" value={formData.eventName} onChange={handleInputChange} className="flex-grow p-2 border border-amber-500 rounded-lg ml-[88px]" />
        </div>
        <div className="flex items-center">
          <label htmlFor="jumlahPeserta" className="w-36">
            Jumlah Peserta:
          </label>
          <input type="number" id="numberOfStudent" value={formData.numberOfStudent} onChange={handleInputChange} className="flex-grow ml-[129px] p-2 border border-amber-500 rounded-lg" />
        </div>
        <div className="flex items-center">
          <label htmlFor="tahunKegiatan" className="w-39">
            Tahun Kegiatan:
          </label>
          <input type="text" id="years" value={formData.years} onChange={handleInputChange} className="flex-grow ml-[128px] p-2 border border-amber-500 rounded-lg" />
        </div>
        <div className="flex items-center">
          <label htmlFor="file" className="w-36">
            Unggah File:
          </label>
          <input type="file" id="file" onChange={handleFileChange} className="flex-grow p-2 ml-[129px] border rounded-lg border-amber-500" />
        </div>
        <button type="submit" className="px-4 py-2 text-base transition-transform hover:text-white rounded-lg w-[150px] bg-amber-500 font-poppins hover:transform hover:scale-110 ml-[270px] ">
          Submit
        </button>
      </form>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="mb-4">Apakah anda yakin Mendaftarkan data ini?</p>
            <button onClick={handleConfirmSubmit} className="px-4 py-1 mr-2 text-white rounded-lg hover:bg-amber-700 bg-amber-500">
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
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="mb-4">Berhasil didaftarkan!</p>
            <button onClick={() => setShowSuccess(false)} className="px-4 py-2 text-white rounded-lg bg-amber-500">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormulirMahasiswaBerwiraUsaha;
