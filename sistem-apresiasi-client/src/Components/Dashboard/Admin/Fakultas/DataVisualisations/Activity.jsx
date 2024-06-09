import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import axios from "axios";

// Definisikan warna secara global di luar komponen
const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

const Activity = ({ token }) => {
  const [validatedData, setValidatedData] = useState([]);
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/activities/faculties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const activities = response.data.data.activities;
        setValidatedData(activities);

        // Ambil daftar unique major dari data yang diterima
        const uniqueMajors = [...new Set(activities.map((activity) => activity.owner.major))];
        setMajors(uniqueMajors);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (validatedData.length > 0) {
      drawChart();
    }
  }, [validatedData, selectedMajor]);

  const drawChart = () => {
    // Hapus grafik sebelumnya jika ada
    d3.select("#myPieChart").selectAll("*").remove();

    if (!validatedData || validatedData.length === 0) {
      return;
    }

    // Filter data berdasarkan major yang dipilih
    const filteredData = selectedMajor ? validatedData.filter((activity) => activity.owner.major === selectedMajor) : validatedData;

    // Ambil data fieldActivity yang sudah divalidasi
    const fieldActivityCounts = countFieldActivities(filteredData);

    // Buat skala warna
    const colorScale = d3
      .scaleOrdinal()
      .domain(fieldActivityCounts.map((d) => d.fieldActivity))
      .range(colors);

    // Buat pie generator
    const pie = d3
      .pie()
      .value((d) => d.count)
      .sort(null);

    const width = 350;
    const height = 350; // Mengubah tinggi
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select("#myPieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Buat slices
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll("arc").data(pie(fieldActivityCounts)).enter().append("g").attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.fieldActivity))
      .each(function (d) {
        this._current = d;
      }) // Simpan data awal untuk animasi
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    // Tambahkan jumlah data di dalam belahan
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "0px")
      .transition()
      .delay(1000)
      .duration(500)
      .style("font-size", "17px")
      .text((d) => d.data.count);
  };

  // Fungsi untuk menghitung jumlah data setiap fieldActivity
  const countFieldActivities = (data) => {
    const countMap = new Map();
    data.forEach((activity) => {
      const fieldActivity = activity.fieldsActivity;
      countMap.set(fieldActivity, (countMap.get(fieldActivity) || 0) + 1);
    });
    return Array.from(countMap).map(([fieldActivity, count]) => ({ fieldActivity, count }));
  };

  // Render legenda
  const renderLegend = () => {
    if (validatedData.length === 0 || !validatedData) {
      return null;
    }

    const filteredData = selectedMajor ? validatedData.filter((activity) => activity.owner.major === selectedMajor) : validatedData;

    const fieldActivityCounts = countFieldActivities(filteredData);

    return (
      <div className="legend">
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
            <span className="legend-text text-[14px]">{data.fieldActivity}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderMajorFilter = () => (
    <div className="flex justify-between w-full mb-4 major-filter">
      <label htmlFor="major-select" className=" text-[15px] ">
        Kegiatan Mahasiswa
      </label>
      <select id="major-select" value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)} className="p-2  text-[14px] border border-amber-500 rounded">
        <option value="">semua jurusan</option>
        {majors.map((major, index) => (
          <option key={index} value={major}>
            {major}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className=" h-[75vh] w-[100%] bg-white rounded-lg shadow-lg p-5 border">
      {error && <p>Error: {error}</p>}
      {renderMajorFilter()}
      <div id="myPieChart"></div>
      {renderLegend()}
    </div>
  );
};

// Validasi prop menggunakan PropTypes
Activity.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Activity;
