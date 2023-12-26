import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../../../utils/Config';

const KegiatanMahasiswa = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [detailKegiatan, setDetailKegiatan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();
  const [confirmValidation, setConfirmValidation] = useState(false);
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [validatedData, setValidatedData] = useState([]);

  const handleConfirmValidation = (id) => {
    setSelectedItemId(id);
    setConfirmValidation(true);
  };

  // Fungsi untuk menampilkan konfirmasi penolakan
  const handleConfirmRejection = (id) => {
    setSelectedItemId(id);
    setConfirmRejection(true);
  };

  const handleValidation = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/activities/${id}/validate`,
        { status: 'accepted' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Kegiatan berhasil divalidasi!');
      setShowModal(false);
      setConfirmValidation(false);
      setValidationSuccess(true);

      // Dapatkan kegiatan yang divalidasi dari data yang sebelumnya sudah di-filter
      const validatedActivity = data.find((activity) => activity.id === id);

      // Update state 'validatedData' dengan menambahkan kegiatan yang divalidasi
      setValidatedData((prevData) => [...prevData, validatedActivity]);

      // Perbarui state 'data' untuk menghilangkan kegiatan yang sudah divalidasi
      const updatedData = data.filter((activity) => activity.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRejection = async (id) => {
    try {
      const reason = prompt('Masukkan alasan penolakan:');
      const response = await axios.put(
        `http://localhost:5001/api/v1/activities/${id}/validate`,
        { status: 'rejected', message: reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      console.log('Kegiatan berhasil ditolak!');
      setConfirmRejection(false); // Menutup pop-up konfirmasi penolakan
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/v1/activities/faculties',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data.data.activities);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLihatDetail = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/activities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data); // Check the structure of response.data

      // Ubah cara akses detail kegiatan sesuai dengan struktur response yang benar
      setDetailKegiatan(response.data.data.activity); // Sesuaikan sesuai struktur yang benar
      setShowModal(true);
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setValidatedData([]); // Menghapus data yang sudah divalidasi setelah 24 jam
    }, 24 * 60 * 60 * 1000); // 24 jam dalam milidetik

    return () => clearTimeout(timer);
  }, [validatedData]);

  return (
    <div className="h-screen pt-3 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 font-poppins">
        Kegiatan Mahasiswa
      </h2>
      <div className="h-screen p-10 overflow-auto mt-9 shadow-boxShadow">
        {error ? (
          <p>Terjadi kesalahan: {error}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary">
                <th className="px-4 py-2 text-left">Kategori</th>
                <th className="px-4 py-2 text-left">Nama Kegiatan</th>
                <th className="px-4 py-2 text-left">Mahasiswa</th>
                <th className="px-4 py-2 text-left">Point</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter(
                  (activity) =>
                    activity.status === 'pending' ||
                    activity.status === undefined
                )
                .map((activity, index) => (
                  <tr key={index} className="">
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.activity}
                    </td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.fieldsActivity}
                    </td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.owner.name}
                    </td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.points}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleLihatDetail(activity.id)}
                        className="text-secondary hover:underline focus:outline-none"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              {data.filter((activity) => activity.status !== 'accepted')
                .length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">
                    Data tidak tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="h-screen py-10 mt-9 ">
          <h2 className="font-semibold text-gray-700 font-poppins">
            Sudah Divalidasi
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary">
                <th className="px-4 py-2 text-left">Kategori</th>
                <th className="px-4 py-2 text-left">Nama Kegiatan</th>
                <th className="px-4 py-2 text-left">Tingkat</th>
                <th className="px-4 py-2 text-left">Point</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((activity) => activity.status === 'accepted')
                .map((activity, index) => (
                  <tr key={index} className="">
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.activity}
                    </td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.fieldsActivity}
                    </td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.levels}
                    </td>
                    <td className="px-4 py-2 border-b-2 border-gray-300">
                      {activity.points}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleLihatDetail(activity.id)}
                        className="text-secondary hover:underline focus:outline-none"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              {data.filter((activity) => activity.status === 'accepted')
                .length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">
                    Data tidak tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg w-[1200px] h-[800px]">
            <h3 className="mb-2 text-lg font-semibold">Detail Data:</h3>
            <div>
              <p>Kegiatan : {detailKegiatan.activity}</p>
              <p>Kategori Kegiatan : {detailKegiatan.fieldsActivity}</p>
              <p>
                <a
                  href={detailKegiatan.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat Sertifikat
                </a>
              </p>
              <p>Tingkat : {detailKegiatan.levels}</p>
              <p>Nama Kegiatan : {detailKegiatan.name}</p>
              <p>Point : {detailKegiatan.points}</p>
              <p>Mahasiswa:</p>
              <p>Nama : {detailKegiatan.owner.name}</p>
              <p>NPM : {detailKegiatan.owner.npm}</p>
              <p>Prodi : {detailKegiatan.owner.major}</p>
              <p>Harapan : {detailKegiatan.possitions_achievements}</p>
              <p>Status: {detailKegiatan.status}</p>
              <p>Tahun: {detailKegiatan.years}</p>
            </div>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => handleConfirmValidation(detailKegiatan.id)}
                className="px-3 py-1 text-white bg-green-500 rounded-md"
              >
                Validasi
              </button>
              <button
                onClick={() => handleConfirmRejection(detailKegiatan.id)}
                className="px-3 py-1 text-white bg-red-500 rounded-md"
              >
                Tolak
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 mt-4 text-white rounded-md bg-secondary"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {confirmValidation && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Apakah Anda yakin ingin melakukan validasi kegiatan ini?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => handleValidation(selectedItemId)}
                className="px-3 py-1 text-white bg-green-500 rounded-md"
              >
                Ya
              </button>
              <button
                onClick={() => setConfirmValidation(false)}
                className="px-3 py-1 text-white bg-red-500 rounded-md"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmRejection && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Apakah Anda yakin ingin menolak kegiatan ini?</p>
            <input type="text" placeholder="Alasan penolakan" />
            <div className="flex justify-around mt-4">
              <button
                onClick={() => handleRejection(selectedItemId)}
                className="px-3 py-1 text-white bg-red-500 rounded-md"
              >
                Ya
              </button>
              <button
                onClick={() => setConfirmRejection(false)}
                className="px-3 py-1 text-white bg-gray-500 rounded-md"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {validationSuccess && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg">
            <p>Kegiatan berhasil divalidasi!</p>
            <button
              onClick={() => setValidationSuccess(false)}
              className="px-3 py-1 mt-4 text-white rounded-md bg-secondary"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanMahasiswa;
