import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartAnalysis, ZodiacSign } from '../types';
import { ZODIAC_ORDER, ZODIAC_SYMBOLS, ZODIAC_COLORS } from '../constants';

interface NatalChartProps {
  data: ChartAnalysis;
}

const NatalChart: React.FC<NatalChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const center = { x: width / 2, y: height / 2 };

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${center.x},${center.y})`);

    // 1. Draw Zodiac Ring
    const zodiacThickness = 40;
    const zodiacOuterRadius = radius - 10;
    const zodiacInnerRadius = zodiacOuterRadius - zodiacThickness;

    const pie = d3.pie<string>()
      .value(1) // Equal size slices
      .sort(null)
      .startAngle(0); // Start at 12 o'clock effectively? No, d3 starts at 12 but usually astrology starts Aries at 9 o'clock.
      // Adjust: D3 0 is 12 o'clock. Aries is 0-30 deg.
      // Let's standard: 0 deg = Aries 0 = 3 o'clock in standard math, but let's make Aries start at 9 o'clock (180 deg) or standard 0 (3 o'clock)?
      // Let's stick to standard math angles for simplicity, then rotate the whole group.
      // Aries (0) -> Taurus (30) -> ...
      // In D3 arc, 0 is up (12 o clock), clockwise.
      // So Aries (1st) should be 0 to 30 deg?
      // Let's just use D3 default and rotate the group so Aries is where we want.
      // Tradition: Ascendant (Left, 9 o clock) defines the rotation. 
      // For this simplified view, let's fix Aries at 9 o'clock (Left).

    const arc = d3.arc<d3.PieArcDatum<string>>()
      .innerRadius(zodiacInnerRadius)
      .outerRadius(zodiacOuterRadius);

    const zodiacGroup = g.append("g")
      // Rotate -90 degrees to put index 0 at 9 o'clock? 
      // Default: index 0 starts at 0 (12 o'clock).
      // We want Aries at 9 o'clock (-90 deg or 270 deg).
      // Let's just render naturally and know that index 0 is at top.
      .attr("class", "zodiac-ring");

    const arcs = zodiacGroup.selectAll("path")
      .data(pie(ZODIAC_ORDER))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d) => ZODIAC_COLORS[d.data as ZodiacSign])
      .attr("stroke", "#0f172a")
      .attr("stroke-width", "2px")
      .attr("opacity", 0.8);

    // Labels for Zodiac
    const labelArc = d3.arc<d3.PieArcDatum<string>>()
      .innerRadius(zodiacInnerRadius + 5)
      .outerRadius(zodiacOuterRadius - 5);

    arcs.append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .text((d) => ZODIAC_SYMBOLS[d.data as ZodiacSign]);

    // 2. Plot Planets
    // Logic: Each sign is 30 degrees.
    // Total 360.
    // D3 Pie puts index 0 at 12 o'clock (0 rad) to 1 o'clock.
    // We need to map Planet(Sign, Degree) to an angle.
    // ZODIAC_ORDER index 0 (Aries) corresponds to angle 0 to (2*PI/12).
    
    const planetRadius = zodiacInnerRadius - 30;

    data.planets.forEach((planet, i) => {
      const signIndex = ZODIAC_ORDER.indexOf(planet.sign);
      if (signIndex === -1) return;

      // Calculate angle within the sign (0-30 => 0-1 slice)
      const signStartAngle = signIndex * (2 * Math.PI / 12);
      const angleInSign = (planet.degree / 30) * (2 * Math.PI / 12);
      
      // Total angle (clockwise from 12 o'clock)
      const totalAngle = signStartAngle + angleInSign;
      
      // Convert polar to cartesian
      // Note: In D3 arc gen, 0 is 12 o'clock, clockwise.
      // Standard trig: 0 is 3 o'clock, counter-clockwise.
      // D3 coordinates match the svg coordinate system (y down).
      // x = r * sin(angle), y = -r * cos(angle) for 0 at top clockwise.
      
      const x = planetRadius * Math.sin(totalAngle);
      const y = -planetRadius * Math.cos(totalAngle);

      // Draw Connection Line
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "rgba(255,255,255,0.1)")
        .attr("stroke-width", 1);

      // Draw Planet Dot
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", "#fff")
        .attr("stroke", ZODIAC_COLORS[planet.sign])
        .attr("stroke-width", 2);

      // Draw Planet Label (abbreviated)
      // Push label out slightly
      const labelR = planetRadius + 15;
      const lx = labelR * Math.sin(totalAngle);
      const ly = -labelR * Math.cos(totalAngle);

      g.append("text")
        .attr("x", lx)
        .attr("y", ly)
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr("fill", "#e2e8f0")
        .attr("font-size", "10px")
        .text(planet.name.substring(0, 2));
    });

    // 3. Center Decoration
    g.append("circle")
      .attr("r", 40)
      .attr("fill", "url(#centerGradient)")
      .attr("opacity", 0.5);

    // Add SVG defs for gradients
    const defs = svg.append("defs");
    const gradient = defs.append("radialGradient")
      .attr("id", "centerGradient");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "transparent");

  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg ref={svgRef} className="w-full max-w-[400px] h-auto drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]"></svg>
    </div>
  );
};

export default NatalChart;
