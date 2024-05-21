import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUserId } from "../../../../utils/Config";

function Formulir() {
  const [faculty, setFaculty] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchDataUser = async () => {
      const response = await axios.get(`http://localhost:5001/api/v1/users/${getUserId()}`);

      if (response.status === 200) {
        const userFaculty = response.data.data.user.faculty;
        setFaculty(userFaculty);

        // Memperbarui daftar program studi berdasarkan fakultas dari respons API
        const updatedPrograms = facultyPrograms[userFaculty] || [];
        const firstProgram = updatedPrograms.length > 0 ? updatedPrograms[0] : "";
        setFormData((prevData) => ({
          ...prevData,
          facultyName: userFaculty,
          studyProgram: firstProgram,
          studyPrograms: updatedPrograms,
        }));
      }
    };

    fetchDataUser();
  }, []);

  const [formData, setFormData] = useState({
    facultyName: "",
    eventName: "",
    studyProgram: "",
    category: "",
    participationType: "",
    participantCount: null,
    achievement: "",
    advisorName: "",
    participants: [],
    startDate: "",
    endDate: "",
    year: "",
    file: null,
    uploadedFiles: [],
  });
  const token = getToken();
  const [isIndividual, setIsIndividual] = useState(false);

  const handleAddParticipant = () => {
    const newParticipant = {
      name: "",
      npm: "",
    };

    setFormData((prevData) => ({
      ...prevData,
      participants: [...prevData.participants, newParticipant],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Set isIndividual berdasarkan jenis kegiatan yang dipilih
    if (name === "participationType") {
      setIsIndividual(value === "Individu");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file,
      uploadedFiles: [...prevData.uploadedFiles, file.name],
    }));
  };

  const individualParticipant = {
    name: formData.nama,
    npm: formData.npm,
  };

  let data = {
    faculty: formData.facultyName,
    name: formData.eventName,
    major: formData.studyProgram,
    levelActivity: formData.category,
    participantType: formData.participationType,
    totalParticipants: Number(formData.participantCount),
    participants: formData.participants,
    achievement: formData.achievement,
    mentor: formData.advisorName,
    year: formData.year,
    startDate: formData.startDate,
    endDate: formData.endDate,
    fileUrl: formData.uploadedFiles,
  };

  const handleUpload = async () => {
    try {
      if (isIndividual) {
        data.participants[0] = individualParticipant;
      }
      const response = await axios.post("http://localhost:5001/api/v1/achievements/independents", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowConfirmationPopup(true);
      console.log(response);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  };

  const facultyPrograms = {
    MIPA: ["D3-Manajemen Informatika", "D3-Elektronika", "S1-Matematika", "S1-Fisika", "S1-Kimia", "S1-Biologi", "S1-Informatika", "S1-Statistika", "S1-Farmasi", "S2-Kecerdesan Buatan"],
    "Fakultas Teknik": [
      "D3-Teknik Sipil",
      "D3-Teknik Listrik",
      "D3-Teknik Mesin",
      "Profesi-Pendidikan Profesi Insunyur",
      "S1-Teknik Geologi",
      "S1-Teknik Komputer",
      "S1-Teknik Mesin",
      "S1-Arsitektur",
      "S1-Teknik Industri",
      "S1-Teknik Pertambangan",
      "S1-Perencanaan wilayah",
      "S1-Teknik Sipil",
      "S1-Teknik Kimia",
      "S1-Teknik Elektro",
      "S1-Teknik Geofisika",
      "S2-Teknik Mesin",
      "S2-Arsitektur",
      "S2-Teknik Industri",
      "S2-Teknik Sipil",
      "S2-Teknik Kimia",
      "S2-teknik Elektro",
      "S2-Teknik Mesin",
    ],
    "Fakultas Ekonomi": [
      "D3-Pemasaran",
      "D3-Keuangan dan Perbankan",
      "D3-Perpajakan",
      "D3-Manajemen Perusahaan",
      "D3-Sekretari",
      "D3-Akuntansi",
      "S1-Manajemen",
      "S1-Profesi Akuntan",
      "S1-Manajemen(gayo lues)",
      "S1-Pembangunan",
      "S1-Akuntansi",
      "S1-Ekonomi Islam",
      "S2-Ilmu Ekonomi",
      "S2-Akuntansi",
      "S2-Manajemen",
      "S3-Ilmu Manajemen",
      "S3-Ilmu Ekonomi Studi pembangunan",
    ],
    "Fakultas Kedokteran Hewan": ["D3-Kesehatan Hewan", "Profesi-Profesi Kedokteran hewan", "S1-Pendidikan Dokter Hewan", "S2-Kesehatan Masyarakat Veterenir"],
    "Fakultas Hukum": ["S1-Ilmu Hukum", "S2-Kenotariatan", "S2-Ilmu Hukum", "S3-Ilmu Hukum"],
    "Fakultas Pertanian": [
      "D3-Manajemen Agribisnis",
      "D3-Budidaya Peternakan",
      "S1-AgroTeknologi",
      "S1-Peternakan",
      "S1-Teknik Pertanian",
      "S1-Proteksi Tanaman",
      "S1-Agroteknologi(gayo lues)",
      "S1-Agribisnis",
      "S1-Teknologi Hasil Pertanian",
      "S1-Ilmu Tanah",
      "S1-Kehutanan",
      "S1-Kehutanan(gayo lues)",
      "S2-Agroekoteknologi",
      "S2-Ilmu Peternakan",
      "S2-Agribisnis",
      "S2-Teknologi Ilmu Pertanian",
    ],
    KIP: [
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan geografi",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan ekonomi",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan sejarah",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Pancasila dan kewarganegaraan",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Bahasa dan sastra indonesia",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Bahasa Ingris",
      "Profesi-Pendidikan Profesi Guru(PPG) Seni Drama,Tari dan Musik ",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Biologi ",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Matematika",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Fisika ",
      "Profesi-Pendidikan Profesi Guru(PPG) Pendidikan Kimia",
      "Profesi-Pendidikan Profesi Guru(PPG) Teknik Kimia",
      "Profesi-Profesi PGSD",
      "Profesi-Pendidikan Profesi Guru(PPG) Penjaskesrek",
      "S1-Pendidikan Pancasila dan Kewarganegaraan",
      "S1-Pendidikan Sejarah",
      "S1-Pendidikan Ekonomi",
      "S1-Pendidikan Geografi",
      "S1-Pendidikan Bahasa Indonesia",
      "S1-Pendidikan Bahasa Inggris",
      "S1-Pendidikan Seni Drama, Tari dan musik",
      "S1-Pendidikan Biologi",
      "S1-Pendidikan Matematika",
      "S1-Pendidikan Fisika",
      "S1-Pendidikan Kimia",
      "S1-Pendidikan Kesejahteraan Keluarga",
      "S1-Pendidikan Jasmani, kesehatan dan Rekreasi",
      "S1-Bimbingan dan konseling",
      "S1-Pendiikan Guru Sekolah Dasar",
      "S1-PG PAUD",
      "S1-Pendidikan Biologi (gayo lues)",
      "S2-Pendidikan Bahasa Indonesia",
      "S2-Pendidikan Bahasa Inggris",
      "S2-Pendidikan Biologi",
      "S2-Pendidikan Matematika",
      "S2-Pendidikan Olahraga",
    ],
    Kedokteran: [
      "Profesi-Profesi Dokter",
      "S1-Pendidikan Dokter",
      "S1-Psikolog",
      "S2-Kesehatan Masyarakat",
      "S2-Sains Biomedis",
      "S3-Doktor Ilmu Kedokteran",
      "Spesialis-Ilmu Bedah",
      "Spesialis-Ilmu Penyakit Dalam",
      "Spesialis-Ilmu Kebidanan dan Penyakit Kandungan",
      "Spesialis-Pulmologi dan kedokteran Respirasi ",
      "Spesialis-Ilmu Kesehatan anak ",
      "Spesialis-Neurologi",
      "Spesialis-Ilmu Kesehatan THT-KL",
      "Spesialis-Anestesiologi dan Terapi Intensif ",
      "Spesialis-Ilmu Penyakit Jantung dan pembuluh Darah",
      "Spesialis-BEdah Plastik Rekonstruksi dan estetik ",
    ],
    "Pasca sarjana": [
      "S2-Konservasi dan Sumberdaya Lahan",
      "S2-Administrasi pendidikan",
      "S2-Ilmu Kebencanaan",
      "S2-Pendidikan IPA",
      "S2-Pengelolaan Sumberdaya pesisir Terpadu",
      "S2-Pengelolaan Lingkungan",
      "S3-Ilmu Pertnaian",
      "S3-Pendidikan IPS",
      "S3-Doktor Ilmu Teknik Kimia",
      "S3-Doktor Matematika dan Aplikasi Sains",
    ],
    FISIP: ["S1-Ilmu Komunikasi", "S1-Ilmu Pemerintahan", "S1-Sosiologi", "S1-Ilmu Politik"],
    Kelautan: ["S1-Ilmu Kelautan", "S1-Pemanfaatan Sumberdaya Perikanan", "S1-Budidaya perairan"],
    Keperawatan: ["Profesi-Profesi Ners", "S1-Ilmu Keperawatan", "S2-Magister Keperawatan"],
    "Kedokteran Gigi": ["Profesi-Profesi Dokter Gigi", "S1-Pendidikan Dokter Gigi"],
  };

  const handleStudyProgramChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleParticipantChange = (e, index) => {
    const { name, value } = e.target;
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index][name] = value;

    setFormData((prevData) => ({
      ...prevData,
      participants: updatedParticipants,
    }));
  };

  const handleEventNameChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;

    if (name === "facultyName") {
      const updatedPrograms = facultyPrograms[value] || [];
      const firstProgram = updatedPrograms.length > 0 ? updatedPrograms[0] : "";
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        studyProgram: firstProgram,
        studyPrograms: updatedPrograms,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRemoveParticipant = (index) => {
    setFormData((prevData) => {
      const updatedParticipants = [...prevData.participants];
      updatedParticipants.splice(index, 1);
      return {
        ...prevData,
        participants: updatedParticipants,
      };
    });
  };

  const renderParticipants = () => {
    return formData.participants.map((participant, index) => (
      <div key={index} className="mb-4">
        <label htmlFor={`participantName-${index}`} className="block mb-2 text-[15px] text-gray-700 font-poppins">
          Nama Peserta #{index + 1}
        </label>
        <input
          type="text"
          id={`participantName-${index}`}
          name="name"
          value={participant.name}
          onChange={(e) => handleParticipantChange(e, index)}
          className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500"
          required
        />
        <label htmlFor={`participantNPM-${index}`} className="block mb-2 text-[15px] text-gray-700 font-poppins">
          NPM Peserta #{index + 1}
        </label>
        <input
          type="text"
          id={`participantNPM-${index}`}
          name="npm"
          value={participant.npm}
          onChange={(e) => handleParticipantChange(e, index)}
          className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500"
          required
        />
        <button onClick={() => handleRemoveParticipant(index)}>Hapus Peserta</button>
      </div>
    ));
  };

  return (
    <div className="pt-3 ">
      <h2 className="font-semibold text-gray-700 font-poppins">Formulir</h2>

      <form className="max-h-[80vh] p-10 overflow-auto mt-9 shadow-boxShadow" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="eventName" className="block mb-2 text-[15px] text-black font-poppins">
            Nama Kegiatan
          </label>
          <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleEventNameChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="studyProgram" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Program Studi
          </label>
          <select id="studyProgram" name="studyProgram" value={formData.studyProgram} onChange={handleStudyProgramChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Program Studi</option>
            {formData.studyPrograms &&
              formData.studyPrograms.map((program, index) => (
                <option key={index} value={program}>
                  {program}
                </option>
              ))}
          </select>
        </div>

        {/* Kategori Kegiatan */}
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Kategori Kegiatan
          </label>
          <select id="category" name="category" value={formData.category} onChange={handleDropdownChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Kategori</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Wilayah">Wilayah</option>
            <option value="Nasional">Nasional</option>
            <option value="Internasional">Internasional</option>
          </select>
        </div>

        {/* Jenis Kegiatan */}
        <div className="mb-4">
          <label htmlFor="participationType" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Jenis Kegiatan
          </label>
          <select id="participationType" name="participationType" value={formData.participationType} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Jenis Kegiatan</option>
            <option value="Individu">Individu</option>
            <option value="Kelompok">Kelompok</option>
          </select>
        </div>

        {isIndividual && (
          <div>
            <div className="flex flex-wrap">
              <div className="w-full pr-4 mb-4 md:w-1/2">
                <label htmlFor="nama" className="block mb-2 text-[15px] text-gray-700 font-poppins">
                  Nama
                </label>
                <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
              </div>
              <div className="w-full pr-4 mb-4 md:w-1/2">
                <label htmlFor="npm" className="block mb-2 text-[15px] text-gray-700 font-poppins">
                  NPM
                </label>
                <input type="text" id="npm" name="npm" value={formData.npm} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
              </div>
            </div>
          </div>
        )}

        {formData.participationType === "Kelompok" && (
          <>
            <div className="mb-4">
              <button onClick={handleAddParticipant} className="px-4 py-2 mb-4 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700 font-poppins focus:outline-none focus:shadow-outline">
                Tambah Peserta
              </button>
              {renderParticipants()}
            </div>
          </>
        )}

        <div className="mb-4">
          <label htmlFor="participantCount" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Jumlah Peserta
          </label>
          <input
            type="number"
            id="participantCount"
            name="participantCount"
            value={formData.participantCount}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="achievement" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Capaian Prestasi
          </label>
          <select id="achievement" name="achievement" value={formData.achievement} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih Capaian Prestasi</option>
            <option value="Juara 1">Juara 1</option>
            <option value="Juara 2">Juara 2</option>
            <option value="Juara 3">Juara 3</option>
          </select>
        </div>

        {/* Nama Pembimbing */}
        <div className="mb-4">
          <label htmlFor="advisorName" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Nama Pembimbing
          </label>
          <input type="text" id="advisorName" name="advisorName" value={formData.advisorName} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Tanggal Mulai
          </label>
          <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Tanggal Selesai
          </label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Tahun Kegiatan
          </label>
          <input type="text" id="year" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block mb-2 text-[15px] text-gray-700 font-poppins">
            Upload File
          </label>
          <input type="file" id="file" name="file" onChange={handleFileChange} className="p-2 border rounded-md border-secondary focus:outline-none focus:border-blue-500" required />
        </div>

        <button type="submit" onClick={handleUpload} className="px-4 py-2 font-semibold text-white rounded bg-secondary font-poppins focus:outline-none focus:shadow-outline">
          Daftar
        </button>
      </form>
      {showConfirmationPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="p-8 bg-white rounded shadow-md">
            <p className="mb-4 text-lg font-semibold text-gray-800">Apakah Anda yakin ingin mendaftarkan prestasi ini?</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowConfirmationPopup(false);

                  setShowSuccessPopup(true);
                }}
                className="px-4 py-2 mr-4 text-white rounded bg-emerald-400 hover:bg-emerald-600 font-poppins focus:outline-none focus:shadow-outline"
              >
                Ya
              </button>
              <button onClick={() => setShowConfirmationPopup(false)} className="px-4 py-2 text-white rounded bg-rose-500 hover:bg-rose-700 font-poppins focus:outline-none focus:shadow-outline">
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="p-8 bg-white rounded shadow-md">
            <p className="mb-4 text-lg font-semibold text-gray-700">Data prestasi berhasil didaftarkan!</p>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                // Reset formulir setelah pengguna menekan tombol OK pada popup berhasil daftar
                setFormData({ ...initialFormData });
              }}
              className="px-4 py-2 text-white rounded bg-emerald-400 hover:bg-emerald-600 font-poppins focus:outline-none focus:shadow-outline"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formulir;
