import React from 'react';

const ChartLegend = ({ data }) => {
  return (
    <div className="chart-legend">
      {data.map((item, index) => (
        <div key={index} className="chart-legend-item">
          <div 
            className="chart-legend-color" 
            style={{ backgroundColor: item.color }}
          />
          <span className="chart-legend-label">{item.name}</span>
          <span className="chart-legend-value">{item.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
