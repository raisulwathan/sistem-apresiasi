import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import PropTypes from "prop-types"; // Import PropTypes

const Independent = ({ token }) => {
  const [independentAchievements, setIndependentAchievements] = useState([]);
  const svgRefIndependent = useRef();
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, index) => currentYear - index);

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

    const margin = { top: 50, right: 60, bottom: 122, left: 30 };
    const width = 700;
    const height = 500;

    const xScale = d3
      .scaleBand()
      .domain(data.map((entry) => entry.major))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([1, d3.max(data, (entry) => entry.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => xScale(d.major) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height).style("background-color", "white");

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
      .style("font-size", "14px");

    svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#8b5cf6").attr("stroke-width", 2).attr("d", line); // Line color and width

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.major) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.count))
      .attr("r", 0)
      .style("fill", "#6d28d9")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration("50").attr("r", 8);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration("50").attr("r", 0); // Revert dot size on mouseout
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

  return (
    <div className="p-4 bg-white h-[75vh] w-full border rounded-lg shadow-lg mt-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-base font-medium text-gray-700">Data Prestasi</h2>
          <div className="h-1 mb-6 border rounded-md bg-gradient-to-r from-green-300 to-green-400 "></div>
        </div>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-2 py-3 text-[13px] border border-amber-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="">Semua Tahun</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <svg className="mt-6 mb-[81px] ml-9" ref={svgRefIndependent}></svg>
    </div>
  );
};

Independent.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Independent;
