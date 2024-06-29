import React, { useEffect, useState } from "react";
import styles from "../../../style";
import axios from "axios";
import { getUserId, getToken } from "../../../utils/Config";
import SkpiStatus from "./DataVisualisation/SkpiStatus";

const Profile = () => {
  const [data, setData] = useState({});
  const userId = getUserId();
  const token = getToken();
  const [skpi, setSkpi] = useState({});

  useEffect(() => {
    const fetchDataSkpi = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v1/skpi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setSkpi(response.data.data);
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    };

    fetchDataSkpi();
  }, [token]);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/users/${userId}`)
      .then((response) => {
        setData(response.data.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]); // Make sure to include userId in the dependency array

  return (
    <div className="h-screen p-6 lg:p-16 bg-[#1d2638] overflow-y-auto ">
      <h2 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Profil</h2>

      <div className="grid grid-cols-1 gap-4 mb-8 mt-11 info-box-container md:grid-cols-4">
        <div className="lg:py-3  text-gray-300 bg-[#1A4057] shadow-xl transition-transform transform rounded-md   info-box  ">
          <div className="flex items-center justify-between mx-3">
            <div className="py-3 ">
              <h3 className=" lg:text-[20px]">Nama</h3>
              <p className="mt-2 font-normal text-gray-400 ">{data.name}</p>
            </div>
            <div className="mr-4 ">
              <img src="./src/assets/List.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
          </div>
        </div>
        <div className="lg:py-3  text-gray-300 shadow-xl bg-[#1A4057] transition-transform transform rounded-md   info-box  ">
          <div className="flex items-center justify-between mx-3">
            <div className="py-3 ">
              <h3 className=" lg:text-[20px]">Npm</h3>
              <p className="mt-2 font-normal text-gray-400 ">{data.npm}</p>
            </div>
            <div className="mr-4 ">
              <img src="./src/assets/npmm.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
          </div>
        </div>
        <div className="lg:py-3  text-gray-300 shadow-xl bg-[#1A4057] transition-transform transform rounded-md   info-box  ">
          <div className="flex items-center justify-between mx-3">
            <div className="py-3 ">
              <h3 className=" lg:text-[20px]">Fakultas</h3>
              <p className="mt-2 font-normal text-gray-400 ">{data.faculty}</p>
            </div>
            <div className="mr-4 ">
              <img src="./src/assets/fakultas.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
          </div>
        </div>
        <div className="lg:py-3  text-gray-300 shadow-xl bg-[#1A4057] transition-transform transform rounded-md   info-box  ">
          <div className="flex items-center justify-between mx-3">
            <div className="py-3 ">
              <h3 className=" lg:text-[20px]">Jurusan</h3>
              <p className="mt-2 font-normal text-gray-400 ">{data.major}</p>
            </div>
            <div className="mr-4 ">
              <img src="./src/assets/prodi.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="gap-5 mt-24 lg:flex lg:mt-12">
        <div className="lg:w-[70%]">
          <div className="p-6 mt-6 overflow-hidden bg-[#1A4057] shadow-xl text-gray-300 rounded-lg font-poppins">
            <h1 className="mb-4 text-[18px] "> Bobot SKP yang telah terkumpul </h1>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Kegiatan Wajib</span>
              <span>{skpi.mandatoryPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Organisasi dan Kepemimpinan</span>
              <span className="text-gray-300">{skpi.organizationPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Penalaran dan Keilmuan</span>
              <span className="text-gray-300">{skpi.scientificPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Minat dan Bakat</span>
              <span className="text-gray-300">{skpi.talentPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Kepedulian Sosial</span>
              <span className="text-gray-300">{skpi.charityPoints}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-gray-400">Kegiatan Lainnya</span>
              <span className="text-gray-300">{skpi.otherPoints}</span>
            </div>
          </div>
        </div>
        <div className="flex mt-6 rounded-lg lg:w-[30%] shadow-xl p-2 justify-center bg-[#1A4057] relative">
          <h1 className="text-gray-300 text-start text-[17px] absolute top-2 left-2 p-2">Status SKPI</h1>
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center mt-16 lg:mt-0">
              <SkpiStatus skpi={skpi} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
