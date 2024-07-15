/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

const SkpiVisual = ({ validatedSkpiData }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (validatedSkpiData.length === 0) return;

    const skpiByFaculty = countSkpiByFaculty(validatedSkpiData, "completed");
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 70, left: 100 };
    const xScale = d3
      .scaleBand()
      .domain(Object.keys(skpiByFaculty))
      .range([margin.left, width - margin.right])
      .padding(0.2);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(skpiByFaculty))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(Object.keys(skpiByFaculty))
      .range(Object.values(getColorScheme(skpiByFaculty)));

    svg.attr("width", width).attr("height", height).style("background-color", "#313347");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "start") // Use "start" for better alignment with rotation
      .style("color", "#d1d5db")
      .attr("dx", "0.5em")
      .attr("dy", "0.5em")
      .attr("transform", "rotate(25)"); // Adjust the angle as needed

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0)).style("color", "#d1d5db").style("font-family", "Arial, sans-serif").style("font-size", "12px");

    svg
      .selectAll(".bar")
      .data(Object.entries(skpiByFaculty))
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
      .data(Object.entries(skpiByFaculty))
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 8)
      .text((d) => d[1])
      .attr("fill", "#d1d5db")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif");
  }, [validatedSkpiData]);

  const countSkpiByFaculty = (skpiData, status = "completed") => {
    const skpiByFaculty = {};
    skpiData.forEach((skpi) => {
      if (isStatusAccepted(skpi.status, status) && skpi.owner && skpi.owner.faculty) {
        const faculty = skpi.owner.faculty.trim();
        skpiByFaculty[faculty] = (skpiByFaculty[faculty] || 0) + 1;
      }
    });
    return skpiByFaculty;
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

  const getColorScheme = (data) => {
    const colors = ["brown", "#dcfce7", "#0F6292"];
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

  return <svg ref={svgRef}></svg>;
};

SkpiVisual.propTypes = {
  validatedSkpiData: PropTypes.array.isRequired,
};

export default SkpiVisual;
