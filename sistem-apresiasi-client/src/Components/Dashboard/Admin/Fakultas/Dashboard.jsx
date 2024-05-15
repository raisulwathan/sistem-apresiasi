import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { getToken } from "../../../../utils/Config";

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

        setValidatedSkpiData(response.data.data.skpi);
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
    const width = 700;
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

    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height).style("background-color", "white");

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em")
      .attr("transform", "rotate(-45)")
      .style("fill", "#444")
      .style("font-size", "12px");

    svg.append("g").attr("class", "y-axis").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2})`)
      .style("text-anchor", "middle")
      .style("font-style", "italic")
      .style("fill", "#666")
      .style("font-size", "14px")
      .text("Nama Jurusan");

    const line = d3
      .line()
      .x((d) => xScale(d.major) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.count));

    svg.append("path").datum(data).attr("fill", "none").attr("stroke", "url(#line-gradient)").attr("stroke-width", 2).attr("d", line);

    // Gradient definition
    const gradient = svg
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(0))
      .attr("x2", 0)
      .attr("y2", yScale(d3.max(data, (entry) => entry.count)));

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#D1C236");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#F9D423");

    // Adding hover effect
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.major) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.count))
      .attr("r", 4)
      .style("fill", "#D1C236")
      .on("mouseover", (event, d) => {
        d3.select(event.target).attr("r", 6); // Increase dot size on hover
        // Add tooltip or other interactivity
      })
      .on("mouseout", (event, d) => {
        d3.select(event.target).attr("r", 4); // Revert dot size on mouseout
        // Remove tooltip or other interactivity
      });

    // Adding animation
    svg.selectAll(".dot").transition().duration(1000).attr("opacity", 1);

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
      .style("stroke", "#A0DEFF")
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
      .style("stroke", "#A0DEFF")
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

    const width = 1000;
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

    svg.attr("width", width).attr("height", height).style("background-color", "white");

    const bars = svg
      .selectAll("rect")
      .data(Object.entries(skpiByMajor))
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(d[0]))
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => (i % 2 === 0 ? "#75A47F" : "#BACD92"))
      .attr("opacity", 0.8)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("filter", "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))");

    bars
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => height - margin.bottom - yScale(d[1]))
      .ease(d3.easeCubicInOut);

    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2})`)
        .style("text-anchor", "middle")
        .style("font-style", "italic")
        .text("Nama Jurusan");
    }

    svg
      .selectAll(".bar-label-major")
      .data(Object.entries(skpiByMajor))
      .enter()
      .append("text")
      .attr("class", "bar-label-major")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", height + 15)
      .text((d) => d[0])
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif")
      .style("visibility", "visible");

    svg
      .selectAll(".bar-label-skpi")
      .data(Object.entries(skpiByMajor))
      .enter()
      .append("text")
      .attr("class", "bar-label-skpi")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 3)
      .text((d) => d[1])
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif");

    svg
      .selectAll(".bar-label-text")
      .data(Object.entries(skpiByMajor))
      .enter()
      .append("text")
      .attr("class", "bar-label-text")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 3)
      .text((d) => d[1])
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif");

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
    const colors = d3.schemeCategory10; // Menggunakan skema warna D3 bawaan
    const colorScheme = {};
    Object.keys(data).forEach((key, index) => {
      colorScheme[key] = colors[index];
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
    <div className="p-3 mb-7">
      <h1 className="font-semibold text-gray-700 font-poppins">Dashboard</h1>
      <div className="h-screen p-5 overflow-y-auto bg-gray-100 mt-9 shadow-boxShadow">
        <div className="w-[1200px] bg-white shadow-lg p-7 ml-5 rounded-lg relative">
          <h2 className="text-base text-gray-700 font-poppins">SKPI yang sudah divalidasi</h2>
          <div className="flex mt-4">
            <div className="flex mt-4">
              <button className={`px-3 py-1 mr-4 text-[12px] border rounded hover:text-white hover:bg-emerald-500 ${getButtonClass("Semua")}`} onClick={() => handleFilterByStatus("Semua")}>
                Semua
              </button>
              {Object.keys(colorScheme).map((status) => (
                <button key={status} className={`px-3 py-1 mr-4 text-[12px] border rounded hover:text-white hover:bg-emerald-500 ${getButtonClass(status)}`} onClick={() => handleFilterByStatus(status)}>
                  {statusMapping[status] || status}
                </button>
              ))}
            </div>
          </div>
          <svg className="ml-9" ref={svgRef}></svg>
        </div>
        <div className="w-[800px]  mt-7 bg-white shadow-lg p-7 ml-5 mb-14 rounded-lg ">
          <h2 className="text-base text-gray-700 font-poppins">Data Prestasi</h2>
          <div>
            <label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">Semua Tahun</option>
                {Array.from({ length: 10 }, (_, index) => 2029 - index).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <svg className="ml-9" ref={svgRefIndependent}></svg>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
