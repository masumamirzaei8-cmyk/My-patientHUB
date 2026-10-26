import React, { useState } from 'react';

const DonutChart = ({ data, size = 200, strokeWidth = 40 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate total for proportional rendering
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercent = 0;

  const segments = data.map((item, index) => {
    const percent = (item.value / total) * 100;
    const dashLength = (percent / 100) * circumference;
    const dashOffset = -((cumulativePercent / 100) * circumference);
    
    cumulativePercent += percent;

    return {
      ...item,
      percent,
      dashLength,
      dashOffset,
      index
    };
  });

  const handleMouseEnter = (segment, event) => {
    setHoveredIndex(segment.index);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 10,
      content: `${segment.name}: ${segment.value}%`
    });
  };

  const handleMouseMove = (event) => {
    if (hoveredIndex !== null) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip(prev => ({
        ...prev,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 10
      }));
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  };

  return (
    <div className="donut-chart-container" style={{ position: 'relative' }}>
      <svg width={size} height={size} className="donut-chart">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
        />
        
        {/* Data segments */}
        {segments.map((segment) => (
          <circle
            key={segment.index}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={hoveredIndex === segment.index ? strokeWidth + 5 : strokeWidth}
            strokeDasharray={`${segment.dashLength} ${circumference}`}
            strokeDashoffset={segment.dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="donut-segment"
            onMouseEnter={(e) => handleMouseEnter(segment, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'stroke-width 0.2s ease',
              cursor: 'pointer'
            }}
          />
        ))}

        {/* Center text */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="donut-center-text"
        >
          {total}%
        </text>
      </svg>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="donut-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
