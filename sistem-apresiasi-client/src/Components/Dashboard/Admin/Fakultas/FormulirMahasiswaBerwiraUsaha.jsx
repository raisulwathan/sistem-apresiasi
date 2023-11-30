import React, { useState } from "react";
import axios from "axios";

function FormulirMahasiswaBerwiraUsaha() {
  const [fakultas, setFakultas] = useState("");
  const [Kegiatan, setKegiatan] = useState("");
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [tahunKegiatan, setTahunKegiatan] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fakultas", fakultas);
      formData.append("kegiatan", Kegiatan);
      formData.append("jumlahPeserta", jumlahPeserta);
      formData.append("tahunKegiatan", tahunKegiatan);
      formData.append("file", file);

      await axios.post("URL_API", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Data berhasil dikirim ke server");

      setFakultas("");
      setKegiatan("");
      setJumlahPeserta("");
      setTahunKegiatan("");
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-[1130px] h-[700px] p-6 ">
      <h1 className="text-2xl font-semibold mb-11">Formulir Pertukaran Mahasiswa</h1>
      <form onSubmit={handleSubmit} className=" space-y-14">
        <div className="flex items-center">
          <label htmlFor="fakultas" className="w-36">
            Fakultas:
          </label>
          <select id="fakultas" value={fakultas} onChange={(e) => setFakultas(e.target.value)} className="flex-grow p-2 ml-32 text-center border rounded ">
            <option value="">Pilih Fakultas</option>
            <option value="Fakultas Mipa">Fakultas Mipa</option>
            <option value="Fakultas teknik">Fakultas teknik</option>
            <option value="Fakultas ekonomi">Fakultas ekonomi</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="program" className="w-39">
            Nama Kegiatan :
          </label>
          <input type="text" id="program" value={Kegiatan} onChange={(e) => setKegiatan(e.target.value)} className="flex-grow p-2 border rounded ml-[88px]" />
        </div>
        <div className="flex items-center">
          <label htmlFor="jumlahPeserta" className="w-36">
            Jumlah Mahasiswa:
          </label>
          <input type="number" id="jumlahPeserta" value={jumlahPeserta} onChange={(e) => setJumlahPeserta(e.target.value)} className="flex-grow ml-[129px] p-2 border rounded" />
        </div>
        <div className="flex items-center">
          <label htmlFor="tahunKegiatan" className="w-39">
            Tahun Kegiatan:
          </label>
          <input type="text" id="tahunKegiatan" value={tahunKegiatan} onChange={(e) => setTahunKegiatan(e.target.value)} className="flex-grow ml-[128px] p-2 border rounded" />
        </div>
        <div className="flex items-center">
          <label htmlFor="file" className="w-36">
            Unggah File:
          </label>
          <input type="file" id="file" onChange={handleFileChange} className="flex-grow p-2 ml-[129px] border rounded" />
        </div>
        <button type="submit" className="px-4 py-2 text-base transition-transform hover:text-secondary rounded-lg w-[150px] bg-yellow-200 font-poppins hover:transform hover:scale-110 ml-[270px] ">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormulirMahasiswaBerwiraUsaha;
