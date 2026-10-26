import React from 'react';

const AfghanistanMap = ({ clinics, onClinicClick, selectedClinic }) => {
  // Afghanistan bounding box: lat 29.5-38.5, lng 60.5-75
  const mapBounds = {
    minLat: 29.5,
    maxLat: 38.5,
    minLng: 60.5,
    maxLng: 75,
  };

  const svgWidth = 800;
  const svgHeight = 500;

  const latToY = (lat) => {
    return svgHeight - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * svgHeight;
  };

  const lngToX = (lng) => {
    return ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * svgWidth;
  };

  const afghanClinics = clinics.filter(c => c.country === 'Afghanistan' && c.lat && c.lng);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">🇦🇫 Afghanistan Clinic Map</h3>
        <span className="text-sm text-gray-500">{afghanClinics.length} clinics</span>
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Simplified Afghanistan outline */}
          <path
            d="M 150 200 L 180 180 L 220 170 L 260 165 L 300 160 L 340 155 L 380 150 L 420 148 L 460 150 L 500 155 L 540 160 L 580 170 L 620 180 L 650 195 L 670 210 L 680 230 L 675 250 L 660 270 L 640 285 L 610 295 L 580 300 L 550 305 L 520 308 L 490 310 L 460 308 L 430 305 L 400 300 L 370 295 L 340 290 L 310 285 L 280 280 L 250 275 L 220 268 L 190 260 L 165 248 L 150 235 L 145 220 Z"
            fill="#e8f5e9"
            stroke="#4caf50"
            strokeWidth="2"
          />
          
          {/* Major cities labels */}
          <text x="380" y="180" fontSize="11" fill="#666" fontWeight="500">Kabul</text>
          <text x="180" y="230" fontSize="11" fill="#666" fontWeight="500">Herat</text>
          <text x="450" y="150" fontSize="11" fill="#666" fontWeight="500">Mazar-i-Sharif</text>
          <text x="320" y="290" fontSize="11" fill="#666" fontWeight="500">Kandahar</text>
          <text x="550" y="200" fontSize="11" fill="#666" fontWeight="500">Jalalabad</text>
          <text x="350" y="170" fontSize="11" fill="#666" fontWeight="500">Bamiyan</text>

          {/* Clinic markers */}
          {afghanClinics.map(clinic => {
            const x = lngToX(clinic.lng);
            const y = latToY(clinic.lat);
            const isSelected = selectedClinic === clinic.id;
            
            return (
              <g key={clinic.id} onClick={() => onClinicClick(clinic)} className="cursor-pointer">
                {/* Pulse animation for selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r="20" fill="#7c3aed" opacity="0.2">
                    <animate attributeName="r" from="15" to="25" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                
                {/* Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "10" : "8"}
                  fill={isSelected ? "#7c3aed" : "#ec4899"}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all hover:scale-110"
                />
                
                {/* Clinic icon */}
                <text x={x} y={y + 4} fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">🏥</text>
                
                {/* Label */}
                <text
                  x={x}
                  y={y - 15}
                  fontSize="9"
                  textAnchor="middle"
                  fill={isSelected ? "#7c3aed" : "#333"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="pointer-events-none"
                >
                  {clinic.name.replace(' Hospital', '').replace(' Medical Center', '').replace(' Clinic', '').replace(' Health Center', '')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span>Clinic</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span>Selected</span>
          </div>
        </div>
        <p className="italic">Click on a marker to view clinic details</p>
      </div>
    </div>
  );
};

export default AfghanistanMap;
