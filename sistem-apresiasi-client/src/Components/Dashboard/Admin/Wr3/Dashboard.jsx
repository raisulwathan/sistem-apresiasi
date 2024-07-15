/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";
import { FiCheckCircle } from "react-icons/fi";
import { PiChatCircleSlashBold } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import SkpiVisual from "./DataVisualisation/SkpiVisual";
import Independent from "./DataVisualisation/Independent";
import Activity from "./DataVisualisation/Activity";

function Dashboard() {
  const [validatedSkpiData, setValidatedSkpiData] = useState([]);
  const [independentAchievements, setIndependentAchievements] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [unvalidatedSkpiData, setUnvalidatedSkpiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/skpi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const skpiData = response.data.data.skpi;
        setValidatedSkpiData(skpiData.filter((skpi) => skpi.status !== "pending"));
        setUnvalidatedSkpiData(skpiData.filter((skpi) => skpi.status === "accepted by ADMIN"));
      } catch (error) {
        console.error("Error fetching validated SKPI data:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:5001/api/v1/achievements/independents";

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIndependentAchievements(response.data.data);
        } else {
          setError("Data tidak ditemukan");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="h-screen p-16 bg-[#424461] overflow-y-auto">
      <h1 className="font-semibold text-gray-300 lg:text-[26px] font-poppins">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 mt-6 mb-8 info-box-container md:grid-cols-3">
        <div className="lg:py-8  text-gray-300 bg-[#313347] transition-transform transform rounded-md shadow-2xl  info-box  ">
          <div className="flex items-center justify-around ">
            <div className="py-4 ">
              <h3 className="font-mono">Total SKPI Divalidasi</h3>
              <p className="font-medium mt-2 font-mono lg:text-[30px]">{validatedSkpiData.length}</p>
            </div>
            <FiCheckCircle size={60} color="#0F6292" />
          </div>
        </div>
        <div className="lg:py-8 text-gray-300 transition-transform transform rounded-md shadow-2xl bg-[#313347] info-box ">
          <div className="flex items-center justify-around">
            <div className="py-4">
              <h3 className="font-mono ">Total Data Prestasi</h3>
              <p className="font-medium mt-2 font-mono lg:text-[30px] ">{independentAchievements.length}</p>
            </div>
            <PiChatCircleSlashBold size={60} color="#06D001" />
          </div>
        </div>
        <div className="lg:py-8 transition-transform transform rounded-md shadow-2xl bg-[#313347] text-gray-300 info-box ">
          <div className="flex items-center justify-around">
            <div className="py-4">
              <h3 className="font-mono ">SKPI Belum Divalidasi</h3>
              <p className="font-medium font-mono lg:text-[30px] mt-2 ">{unvalidatedSkpiData.length}</p>
            </div>
            <IoTimerOutline size={60} color="#FFDB00" />
          </div>
        </div>
      </div>

      <div className="relative  flex-row hidden lg:flex items-start w-full bg-[#313347]  shadow-2xl rounded-md p-7">
        <div className="w-2/3 pr-6">
          <h2 className="mb-2 font-mono text-base font-medium text-gray-300">SKPI yang sudah divalidasi</h2>

          <SkpiVisual validatedSkpiData={validatedSkpiData} />
        </div>
        <div className="w-1/3 pt-10 pl-40">
          <div className="flex flex-col space-y-2 rounded-md p-6 bg-[#424461] ">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#0F6292" }}></div>
              <span className="text-sm"> Tertinggi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#dcfce7" }}></div>
              <span className="text-sm"> Sedang</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "brown" }}></div>
              <span className="text-sm"> Rendah</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden gap-2 lg:flex">
        <div className="shadow-2xl">
          <Independent token={token} />
        </div>
        <div className="shadow-2xl mt-7">
          <Activity token={token} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
