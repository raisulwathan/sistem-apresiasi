import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import axios from "axios";

const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

const Activity = ({ token }) => {
  const [data, setData] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/achievements/noncompetitions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const responseData = response.data.data;
          setData(responseData);
          // Ambil opsi fakultas dari data yang diterima
          const faculties = responseData.map((activity) => activity.faculty);
          const uniqueFaculties = [...new Set(faculties.filter((faculty) => faculty))];
          setFacultyOptions(uniqueFaculties);
        } else {
          setError("Data tidak ditemukan");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat fetching data.");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data, selectedFaculty]);

  const drawChart = () => {
    d3.select("#myPieChart").selectAll("*").remove();

    const filteredData = selectedFaculty ? data.filter((activity) => activity.faculty === selectedFaculty) : data;
    const fieldActivityCounts = countFieldActivities(filteredData);

    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select("#myPieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const pie = d3
      .pie()
      .value((d) => d.count)
      .sort(null);

    const arcs = svg.selectAll("arc").data(pie(fieldActivityCounts)).enter().append("g").attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => colors[i % colors.length])
      .each(function (d) {
        this._current = d;
      })
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "0px")
      .style("fill", "white")
      .transition()
      .delay(1000)
      .duration(500)
      .style("font-size", "17px")
      .text((d) => d.data.count);
  };

  const countFieldActivities = (data) => {
    const countMap = new Map();
    data.forEach((activity) => {
      const category = activity.category;
      countMap.set(category, (countMap.get(category) || 0) + 1);
    });
    return Array.from(countMap).map(([category, count]) => ({ category, count }));
  };

  const renderFacultyFilter = () => (
    <div className="flex justify-between w-full mb-4 faculty-filter">
      <label htmlFor="faculty-select" className="text-[15px] text-gray-300 font-mono">
        Non-Lomba
      </label>
      {error ? (
        <p>{error}</p>
      ) : (
        <select id="faculty-select" value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="p-2 bg-[#313347] text-gray-300  text-[14px] border border-[#0F6292] rounded">
          <option value="">Semua Fakultas</option>
          {facultyOptions.map((faculty, index) => (
            <option key={index} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
      )}
    </div>
  );

  const renderLegend = () => {
    const filteredData = selectedFaculty ? data.filter((activity) => activity.faculty === selectedFaculty) : data;
    const fieldActivityCounts = countFieldActivities(filteredData);

    return (
      <div className="mt-5 legend">
        {fieldActivityCounts.map((data, index) => (
          <div key={index} className="legend-item" style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <span
              className="legend-color"
              style={{
                backgroundColor: colors[index % colors.length],
                width: "15px",
                height: "15px",
                display: "inline-block",
                marginRight: "10px",
                borderRadius: "8px",
              }}
            ></span>
            <span className="legend-text text-gray-300 text-[14px]">{data.category}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[75vh] w-[100%] bg-[#313347] rounded-lg shadow-lg p-5">
      {renderFacultyFilter()}
      <div id="myPieChart"></div>
      {renderLegend()}
    </div>
  );
};

Activity.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Activity;
