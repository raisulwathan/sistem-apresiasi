import React from "react";
import styles from "../../../style";

const Profile = () => {
  return (
    <div className="max-h-[887px] h-[870px] lg:mt-4 lg:p-14 pb-3 overflow-y-auto lg:w-[97%] rounded-lg lg:shadow-Shadow">
      <h2 className="mb-6 text-xl text-gray-700 w-[85px] p-2 rounded-lg ml-8 font-bold mt-9 border-l-2 border-r-2 border-b-2 border-secondary lg:mt-0 font-poppins">Profile</h2>

      <div className="items-start lg:mt-9 lg:flex">
        <div className="w-56 rounded-full">
          <img src="./src/assets/me.jpg" className="lg:w-[220px] lg:h-[220px] w-[180px] h-[180px] rounded-full" alt="me" />
        </div>

        <div className="mt-5 text-md lg:flex font-poppins lg:ml-12">
          <div className="w-1/2">
            <div className="px-3 py-3 mb-4  shadow-lg w-[270px]  rounded-lg lg:w-[300px]">
              <h3 className="mb-1 font-semibold underline text-secondary ">Nama</h3>
              <p className="text-gray-600">Raisulwathan</p>
            </div>

            <div className="px-3 py-3 rounded-lg shadow-lg w-[270px]  lg:w-[300px]">
              <h3 className="mb-1 font-semibold underline text-secondary">NPM</h3>
              <p className="text-gray-600">2008107010081</p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="px-3 py-3 mb-4 lg:ml-6 shadow-lg w-[270px]  rounded-lg lg:w-[300px]">
              <h3 className="mb-1 font-semibold underline text-secondary">Email</h3>
              <p className="text-gray-600">raisulwathan07@gmail.com</p>
            </div>

            <div className="px-3 py-3  shadow-lg lg:ml-6 w-[270px]  rounded-lg lg:w-[300px]">
              <h3 className="mb-1 font-semibold underline text-secondary text-secondaryunderline">No Hp</h3>
              <p className="text-gray-600">085376435160</p>
            </div>
          </div>
        </div>
      </div>

      <div className="gap-6 mt-36 lg:flex lg:ml-12">
        <div className="lg:w-[400px] lg:h-[300px] w-[270px] mb-8">
          <div className="h-full px-4 py-4 bg-green-100 rounded-lg shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-gray-800 underline">Panduan Pengguna</h3>
            <p className="text-gray-600">
              Anda bisa mengupload prestasi untuk menghitung point bobot skp yang telah ditentukan sesuai prestasi yang anda dapatkan selama berpendidikan di universitas syiah kuala silahkan login untuk mengupload berkas anda
            </p>
          </div>
        </div>

        <div className="lg:w-[400px] lg:h-[300px] w-[270px] mb-8">
          <div className="h-full px-4 py-4 bg-purple-100 rounded-lg shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-gray-800 underline">Syarat & Ketentuan</h3>
            <p className="text-gray-600">kegiatan-kegiatan mahasiswa yang mendapatkan prestasi dibidang seni ,bakat dan akademis anda bisa mendownload tabel panduan di bawah ini !!</p>
            <div className="flex items-center w-[230px]  px-2 py-2 transition-transform bg-yellow-100 rounded-lg shadow-lg cursor-pointer mt-14 lg:w-80 hover:transform hover:scale-110">
              <img src="./src/assets/download.png" alt="download" className="w-10" />
              <h3 className="px-3 text-base font-poppins">Unduh tabel Panduan SKPi</h3>
            </div>
          </div>
        </div>
        <div className={`${styles.flexCenter} w-[170px] h-[170px] rounded-full  p-[2px] cursor-pointer`}>
          <div className={`${styles.flexCenter} flex-col bg-blue-100 border-[4px] border-yellow-100  w-[100%] h-[100%] rounded-full`}>
            <div className={`${styles.flexStart} flex-row`}>
              <button className="font-poppins font-medium text-[18px] leading-[23.4px]">
                <span className="text-gray-700 "> Upload Kegiatanmu Sekarang !</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
