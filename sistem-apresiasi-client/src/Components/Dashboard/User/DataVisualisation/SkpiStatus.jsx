import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { getToken } from "../../../../utils/Config";

const SkpiStatus = () => {
  const [percentage, setPercentage] = useState(0);
  const gaugeRef = useRef(null);
  const token = getToken();

  useEffect(() => {
    const fetchDataSkpi = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/skpi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const status = response.data.data.status;
          let value = 0;

          switch (status) {
            case "accepted by OPERATOR":
              value = 20;
              break;
            case "accepted by WD":
              value = 40;
              break;
            case "accepted by ADMIN":
              value = 70;
              break;
            case "completed":
              value = 100;
              break;
            default:
              value = 0;
          }

          setPercentage(value);
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    };

    fetchDataSkpi();
  }, []);

  useEffect(() => {
    if (gaugeRef.current) {
      d3.select(gaugeRef.current).selectAll("*").remove();
      renderGaugeChart(gaugeRef.current, percentage);
    }
  }, [percentage]);

  const renderGaugeChart = (element, percentage) => {
    const width = 200;
    const height = 200;
    const thickness = 20;

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal().range(["#d3d3d3", "#FF6347"]);

    const arc = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0);

    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    svg
      .append("path")
      .datum({ endAngle: 2 * Math.PI })
      .style("fill", color(0))
      .attr("d", arc);

    const foreground = svg.append("path").datum({ endAngle: 0 }).style("fill", color(1)).attr("d", arc);

    foreground
      .transition()
      .duration(750)
      .attrTween("d", (d) => {
        const interpolate = d3.interpolate(d.endAngle, (percentage / 100) * 2 * Math.PI);
        return (t) => {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });

    svg.append("text").attr("text-anchor", "middle").attr("dy", ".35em").style("font-size", "24px").style("fill", "white").text(`${percentage}%`);
  };

  return <div ref={gaugeRef}></div>;
};

export default SkpiStatus;
