/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/Config";
import { FaCheckCircle, FaTrophy, FaClock } from "react-icons/fa";
import Activity from "./DataVisualisations/Activity";
import Independent from "./DataVisualisations/Independent";
import SkpiVisual from "./DataVisualisations/SkpiVisual";

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
        setUnvalidatedSkpiData(skpiData.filter((skpi) => skpi.status === "pending"));
      } catch (error) {
        console.error("Error fetching validated SKPI data:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:5001/api/v1/achievements/independents/faculties";

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
    <div className="pt-3 overflow-y-auto">
      <h1 className="font-semibold text-gray-700 font-poppins">Dashboard</h1>
      <div className="h-screen p-10 overflow-auto mt-9 shadow-boxShadow bg-slate-50">
        <div className="grid grid-cols-1 gap-4 mb-6 info-box-container md:grid-cols-3">
          <div className="p-4 text-gray-800 transition-transform transform border border-blue-300 rounded-lg shadow-md bg-gradient-to-r from-blue-100 to-blue-200 info-box hover:scale-105">
            <div className="flex items-center">
              <FaCheckCircle className="mr-4 text-[27px] text-indigo-500" />
              <div className="py-4">
                <h3 className="font-thin ">Total SKPI Divalidasi</h3>
                <p className="font-medium ">{validatedSkpiData.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 text-gray-800 transition-transform transform border border-green-300 rounded-lg shadow-md bg-gradient-to-r from-green-100 to-green-200 info-box hover:scale-105">
            <div className="flex items-center">
              <FaTrophy className="mr-4 text-[27px] text-amber-500" />
              <div className="py-4">
                <h3 className="font-thin ">Total Data Prestasi</h3>
                <p className="font-medium ">{independentAchievements.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 transition-transform transform border border-gray-300 rounded-lg shadow-md bg-gradient-to-r from-rose-100 to-rose-200 info-box hover:scale-105">
            <div className="flex items-center">
              <FaClock className="mr-4 text-[27px] text-pink-700" />
              <div className="py-4">
                <h3 className="font-thin ">SKPI Belum Divalidasi</h3>
                <p className="font-medium ">{unvalidatedSkpiData.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-row items-start w-full bg-white border shadow-lg rounded-xl p-7">
          <div className="w-2/3 pr-6">
            <h2 className="mb-2 text-base font-medium text-gray-700">SKPI yang sudah divalidasi</h2>
            <div className="border bg-gradient-to-r from-blue-300 to-blue-400 rounded-md mb-6  h-1 lg:w-[230px]"></div>

            <SkpiVisual validatedSkpiData={validatedSkpiData} />
          </div>
          <div className="w-1/3 pt-10 pl-40">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "orange" }}></div>
                <span className="text-sm"> Tertinggi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "teal" }}></div>
                <span className="text-sm"> Sedang</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "brown" }}></div>
                <span className="text-sm"> Rendah</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <Independent token={token} />
          </div>
          <div className="mb-24 mt-7">
            <Activity token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
