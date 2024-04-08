import React, { useEffect, useState } from "react";
import styles from "../../../style";
import axios from "axios";
import { getUserId, getToken } from "../../../utils/Config";

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
    <div className="flex max-h-[887px] h-[878px]  lg:mt-6 bg-white lg:p-14 pb-3 lg:w-[98.5%] rounded-lg">
      <div className="w-1/2">
        <h2 className="mb-6 text-[40px] text-gray-800 w-[85px] p-2 rounded-lg ml-8 font-bold mt-9 lg:mt-0 font-poppins">Profil</h2>

        <div className="border bg-slate-300 rounded-md mt-20 ml-8  h-1 lg:w-[600px]"></div>

        <div className="ml-8 mt-9">
          <div className="px-3  mb-4 w-[270px] rounded-lg lg:w-[300px] flex">
            <div className="mr-4 ">
              <img src="./src/assets/List.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold ">Nama</h3>
              <p className="text-gray-400 ">{data.name}</p>
            </div>
          </div>

          <div className="px-3 rounded-lg w-[270px] lg:w-[300px] flex">
            <div className="mr-4 ">
              <img src="./src/assets/npmm.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold ">Npm</h3>
              <p className="text-gray-400">{data.npm}</p>
            </div>
          </div>

          <div className="border bg-slate-300 rounded-md mt-20  h-1 lg:w-[600px]"></div>

          <div className="px-3 mt-9  mb-4 w-[270px] rounded-lg lg:w-[300px] flex">
            <div className="mr-4 ">
              <img src="./src/assets/fakultas.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold ">Fakultas</h3>
              <p className="text-gray-400 ">{data.faculty}</p>
            </div>
          </div>

          <div className="px-3  w-[270px] rounded-lg lg:w-[300px] flex">
            <div className="mr-4 ">
              <img src="./src/assets/prodi.png" alt="Logo" className="w-[48px] h-auto" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold ">Prodi</h3>
              <p className="text-gray-400">{data.major}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end w-1/2 ">
        <table className="mt-6 overflow-hidden rounded-xl bg-gray-50 font-poppins">
          <tbody className="">
            <tr>
              <td className="px-6 py-4 text-base">Kegiatan Wajib</td>
              <td className="px-6 py-4">{skpi.mandatoryPoints}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-base">Organisasi dan Kepemimpinan</td>
              <td className="px-6 py-4">{skpi.organizationPoints}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-base">Penalaran dan Keilmuan</td>
              <td className="px-6 py-4">{skpi.scientificPoints}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-base">Minat dan Bakat</td>
              <td className="px-6 py-4">{skpi.talentPoints}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-base">Kepedulian Sosial</td>
              <td className="px-6 py-4 text-base">{skpi.charityPoints}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-base">Kegiatan Lainnya</td>
              <td className="px-6 py-4">{skpi.otherPoints}</td>
            </tr>
          </tbody>
          <div className="mt-20 lg:ml-16 ">
            <img src="./src/assets/cardprofil.png" alt="Logo" className="" />
            <button className="py-3 text-white bg-black rounded-lg px-14">Ajukan Prestasi</button>
          </div>
        </table>
      </div>
    </div>
  );
};

export default Profile;
