/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { getToken } from "../../../../utils/Config";
import { FaCheckCircle, FaTrophy, FaClock } from "react-icons/fa";
function Dashboard() {
  const [validatedSkpiData, setValidatedSkpiData] = useState([]);
  const [independentAchievements, setIndependentAchievements] = useState([]);
  const svgRefIndependent = useRef();
  const [error, setError] = useState(null);
  const token = getToken();
  const svgRef = useRef();
  const [colorScheme, setColorScheme] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [unvalidatedSkpiData, setUnvalidatedSkpiData] = useState([]);

  const statusMapping = {
    "accepted by ADMIN": "Validasi Admin",
    "accepted by WD": "Validasi WD3",
    "accepted by OPERATOR": "Validasi Operator",
    completed: "Selesai",
    accepted: "Diterima",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/skpi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const skpiData = response.data.data.skpi;
        setValidatedSkpiData(skpiData.filter((skpi) => skpi.status !== "pending" && skpi.status !== "accepted by OPERATOR"));
        setUnvalidatedSkpiData(skpiData.filter((skpi) => skpi.status === "accepted by OPERATOR"));
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
        if (selectedYear) {
          url += `?year=${selectedYear}`;
        }
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
  }, [token, selectedYear]);

  const countAchievementsByMajor = () => {
    const achievementsByMajor = {};

    independentAchievements
      .filter((achievement) => !selectedYear || achievement.year === selectedYear)
      .forEach((achievement) => {
        const major = achievement.major;
        if (!achievementsByMajor[major]) {
          achievementsByMajor[major] = 1;
        } else {
          achievementsByMajor[major] += 1;
        }
      });

    const result = Object.entries(achievementsByMajor).map(([major, count]) => ({
      major,
      count,
    }));

    return result;
  };

  useEffect(() => {
    if (independentAchievements.length === 0) return;

    const svg = d3.select(svgRefIndependent.current);

    const achievementsByMajor = countAchievementsByMajor();

    const data = achievementsByMajor;

    const margin = { top: 50, right: 60, bottom: 120, left: 80 };
    const width = 900;
    const height = 500;

    const xScale = d3
      .scaleBand()
      .domain(data.map((entry) => entry.major))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (entry) => entry.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => xScale(d.major) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height).style("background-color", "white"); // Background color

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em")
      .attr("transform", "rotate(-45)")
      .style("fill", "#6b7280") // X-axis label color
      .style("font-size", "12px");

    svg.append("g").attr("class", "y-axis").attr("transform", `translate(${margin.left},0)`).transition().duration(1000).call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2})`)
      .style("text-anchor", "middle")
      .style("font-style", "italic")
      .style("fill", "#6b7280") // X-axis label color
      .style("font-size", "14px")
      .text("Nama Jurusan");

    svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#8b5cf6").attr("stroke-width", 2).attr("d", line); // Line color and width

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.major) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.count))
      .attr("r", 0) // Dot size initially set to 0
      .style("fill", "#6d28d9") // Dot color
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration("50").attr("r", 8); // Increase dot size on hover
        // Add tooltip or other interactivity
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration("50").attr("r", 0); // Revert dot size on mouseout
        // Remove tooltip or other interactivity
      })
      .transition()
      .duration(1000)
      .attr("r", 6); // Dot size transition

    svg.selectAll(".grid-line").remove();
    svg
      .selectAll(".horizontal-line")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .style("stroke", "#cbd5e0") // Grid line color
      .style("stroke-dasharray", "2,2");

    svg
      .selectAll(".vertical-line")
      .data(xScale.domain())
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", (d) => xScale(d) + xScale.bandwidth() / 2)
      .attr("x2", (d) => xScale(d) + xScale.bandwidth() / 2)
      .attr("y1", yScale(0))
      .attr("y2", yScale(d3.max(data, (entry) => entry.count)))
      .style("stroke", "#cbd5e0") // Grid line color
      .style("stroke-dasharray", "2,2");
  }, [independentAchievements, selectedYear]);

  useEffect(() => {
    const skpiByStatus = countSkpiByStatus(validatedSkpiData);
    setColorScheme(getColorScheme(skpiByStatus));
  }, [validatedSkpiData]);

  useEffect(() => {
    if (validatedSkpiData.length === 0) return;

    const skpiByMajor = countSkpiByMajor(validatedSkpiData, selectedStatus);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 70, left: 100 };
    const xScale = d3
      .scaleBand()
      .domain(Object.keys(skpiByMajor))
      .range([margin.left, width - margin.right])
      .padding(selectedStatus === "Semua" ? 0.5 : 0.2);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(skpiByMajor))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(Object.keys(skpiByMajor))
      .range(Object.values(getColorScheme(skpiByMajor)));

    svg.attr("width", width).attr("height", height).style("background-color", "white");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em")
      .attr("transform");

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0)).style("color", "#333").style("font-family", "Arial, sans-serif").style("font-size", "12px");

    svg
      .selectAll(".bar")
      .data(Object.entries(skpiByMajor))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("opacity", 0.8)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("filter", "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))")
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => height - margin.bottom - yScale(d[1]))
      .attr("fill", (d) => colorScale(d[0]))
      .ease(d3.easeCubicInOut);

    svg
      .selectAll(".bar-label")
      .data(Object.entries(skpiByMajor))
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 8)
      .text((d) => d[1])
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif");
  }, [validatedSkpiData, selectedStatus]);

  const countSkpiByMajor = (skpiData, status) => {
    const skpiByMajor = {};
    skpiData.forEach((skpi) => {
      if ((!status || isStatusAccepted(skpi.status, status)) && skpi.owner && skpi.owner.major) {
        const major = skpi.owner.major.trim();
        skpiByMajor[major] = (skpiByMajor[major] || 0) + 1;
      }
    });
    return skpiByMajor;
  };

  const isStatusAccepted = (skpiStatus, selectedStatus) => {
    switch (selectedStatus) {
      case "completed":
        return skpiStatus === "completed";
      case "accepted by ADMIN":
        return skpiStatus === "accepted by ADMIN" && skpiStatus !== "completed" && skpiStatus !== "accepted by WD" && skpiStatus !== "accepted by OPERATOR";
      case "accepted by WD":
        return skpiStatus === "accepted by WD" && skpiStatus !== "completed" && skpiStatus !== "accepted by ADMIN" && skpiStatus !== "accepted by OPERATOR";
      case "accepted by OPERATOR":
        return skpiStatus === "accepted by OPERATOR" && skpiStatus !== "completed" && skpiStatus !== "accepted by WD" && skpiStatus !== "accepted by ADMIN" && skpiStatus !== "accepted";
      case "accepted":
        return skpiStatus === "accepted" && skpiStatus !== "completed" && skpiStatus !== "accepted by WD" && skpiStatus !== "accepted by ADMIN" && skpiStatus !== "accepted by OPERATOR";
      default:
        return false;
    }
  };

  const countSkpiByStatus = (skpiData) => {
    const skpiByStatus = {};
    skpiData.forEach((skpi) => {
      const status = skpi.status;
      skpiByStatus[status] = (skpiByStatus[status] || 0) + 1;
    });
    return skpiByStatus;
  };

  const getColorScheme = (data) => {
    const colors = ["brown", "teal", "orange"];
    const colorScheme = {};
    const values = Object.values(data);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    Object.keys(data).forEach((key) => {
      const percentage = (data[key] - minValue) / (maxValue - minValue);
      let colorIndex;
      if (percentage === 1) {
        colorIndex = 2; // Orange untuk nilai tertinggi
      } else if (percentage === 0) {
        colorIndex = 0; // Brown untuk nilai terendah
      } else {
        colorIndex = 1; // Teal untuk nilai di tengah
      }
      colorScheme[key] = colors[colorIndex];
    });
    return colorScheme;
  };

  const handleFilterByStatus = async (status) => {
    try {
      let response;
      if (status === "Semua") {
        response = await axios.get("http://localhost:5001/api/v1/skpi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedStatus(null);
      } else {
        let endpoint;
        if (status === "accepted by operator") {
          endpoint = "accepted by OPERATOR";
        } else {
          endpoint = status;
        }
        response = await axios.get(`http://localhost:5001/api/v1/skpi?status=${encodeURIComponent(endpoint)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedStatus(status);
      }
      setValidatedSkpiData(response.data.data.skpi.filter((skpi) => skpi.owner.major)); // Filter data yang memiliki jurusan
    } catch (error) {
      setError(error.message);
    }
  };

  const getButtonClass = (status) => {
    return selectedStatus === status ? "bg-emerald-500 text-white" : "text-gray-800 border-emerald-500";
  };

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

        <div className="relative flex-row items-start hidden w-full bg-white border shadow-lg lg:flex rounded-xl p-7">
          <div className="w-2/3 pr-6">
            <h2 className="mb-2 text-base font-medium text-gray-700">SKPI yang sudah divalidasi</h2>
            <div className="border bg-gradient-to-r from-blue-300 to-blue-400 rounded-md mb-6  h-1 lg:w-[230px]"></div>
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 text-sm border border-gray-300 rounded-lg hover:text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getButtonClass("Semua")}`}
                onClick={() => handleFilterByStatus("Semua")}
              >
                Semua
              </button>
              {Object.keys(colorScheme).map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 text-sm border border-gray-300 rounded-lg hover:text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getButtonClass(status)}`}
                  onClick={() => handleFilterByStatus(status)}
                >
                  {statusMapping[status] || status}
                </button>
              ))}
            </div>
            <svg className="mt-6" ref={svgRef}></svg>
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

        <div className="relative flex-row items-start hidden w-full lg:flex ">
          <div className="absolute top-0 right-0 w-full bg-white border rounded-lg shadow-lg mb-11 mt-7 p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-base font-medium text-gray-700">Data Prestasi</h2>
                <div className="border bg-gradient-to-r from-green-300 to-green-400 rounded-md mb-6  h-1 lg:w-[120px]"></div>
              </div>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-2 py-3 text-[13px] border border-teal-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Semua Tahun</option>
                {Array.from({ length: 10 }, (_, index) => 2029 - index).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <svg className="mt-6 mb-[81px] ml-9" ref={svgRefIndependent}></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
