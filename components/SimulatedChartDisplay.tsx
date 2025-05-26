
import React from 'react';
import type { SimulatedChartData } from '../types';

interface SimulatedChartDisplayProps {
  chartData: SimulatedChartData;
  primaryColor?: string; // Optional: to use brand color from report
}

const SimulatedChartDisplay: React.FC<SimulatedChartDisplayProps> = ({ chartData, primaryColor }) => {
  if (!chartData || !chartData.labels || !chartData.values || chartData.labels.length === 0 || chartData.values.length === 0 || chartData.labels.length !== chartData.values.length) {
    return <p className="text-sm text-brand-gray-400 py-4 text-center">Chart data is unavailable or invalid.</p>;
  }

  const { chartTitle, dataType, labels, values } = chartData;
  const displayColor = primaryColor || '#2563EB'; // Default to brand-premium-blue

  const SVG_WIDTH = 500; 
  const SVG_HEIGHT = 300; 
  const PADDING = { top: 30, right: 30, bottom: 50, left: 50 }; 

  const CHART_WIDTH = SVG_WIDTH - PADDING.left - PADDING.right;
  const CHART_HEIGHT = SVG_HEIGHT - PADDING.top - PADDING.bottom;

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  
  const yRange = (dataMax - dataMin === 0) ? (dataMax === 0 ? 10 : dataMax * 0.2 || 10) : dataMax - dataMin;
  const yAxisMin = (dataMax - dataMin === 0) ? (dataMin - yRange / 2) : dataMin - yRange * 0.1; 
  const yAxisMax = (dataMax - dataMin === 0) ? (dataMax + yRange / 2) : dataMax + yRange * 0.1; 
  const yDisplayRange = yAxisMax - yAxisMin;


  const getX = (index: number): number => {
    if (labels.length === 1) return PADDING.left + CHART_WIDTH / 2;
    return PADDING.left + (index / (labels.length - 1)) * CHART_WIDTH;
  };

  const getY = (value: number): number => {
    if (yDisplayRange === 0) return PADDING.top + CHART_HEIGHT / 2; 
    return PADDING.top + CHART_HEIGHT - ((value - yAxisMin) / yDisplayRange) * CHART_HEIGHT;
  };

  const linePath = values.map((value, index) => {
    const x = getX(index);
    const y = getY(value);
    return `${index === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const yAxisTicks = 5; 
  const yAxisValues: number[] = [];
  if (yDisplayRange > 0) {
    for (let i = 0; i <= yAxisTicks; i++) {
      yAxisValues.push(yAxisMin + (yDisplayRange / yAxisTicks) * i);
    }
  } else { 
     yAxisValues.push(yAxisMin, values[0] ?? yAxisMin, yAxisMax);
  }


  return (
    <div className="space-y-3 p-3 bg-gradient-to-br from-brand-gray-850 to-brand-gray-900 rounded-md border border-brand-gray-700">
      {chartTitle && <h4 className="text-md font-semibold text-brand-gray-200 mb-1 text-center">{chartTitle}</h4>}
      {dataType && <p className="text-xs text-brand-gray-400 mb-3 text-center">Data Type: {dataType}</p>}
      
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
          <title id="chart-title">{chartTitle || "Simulated Data Chart"}</title>
          {/* Y-axis grid lines and labels */}
          {yAxisValues.map((value, index) => (
            <g key={`y-axis-${index}`}>
              <line
                x1={PADDING.left}
                y1={getY(value)}
                x2={PADDING.left + CHART_WIDTH}
                y2={getY(value)}
                strokeDasharray="3,3"
                className="stroke-brand-gray-700" 
                strokeWidth="0.5"
              />
              <text
                x={PADDING.left - 8}
                y={getY(value) + 4} 
                textAnchor="end"
                className="text-xs fill-brand-gray-400"
              >
                {Math.round(value)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {labels.map((label, index) => (
            <text
              key={`x-label-${index}`}
              x={getX(index)}
              y={PADDING.top + CHART_HEIGHT + 20} 
              textAnchor="middle"
              className="text-xs fill-brand-gray-400"
            >
              {label}
            </text>
          ))}
          
          {/* X and Y Axis lines */}
          <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={PADDING.top + CHART_HEIGHT} className="stroke-brand-gray-600" strokeWidth="1"/>
          <line x1={PADDING.left} y1={PADDING.top + CHART_HEIGHT} x2={PADDING.left + CHART_WIDTH} y2={PADDING.top + CHART_HEIGHT} className="stroke-brand-gray-600" strokeWidth="1"/>


          {/* Line Path - only draw if more than one point */}
          {linePath && labels.length > 1 && (
            <path d={linePath} stroke={displayColor} className="fill-none" strokeWidth="2" />
          )}

          {/* Data Points (Circles) */}
          {values.map((value, index) => (
            <circle
              key={`point-${index}`}
              cx={getX(index)}
              cy={getY(value)}
              r="3.5"
              fill={displayColor}
              className="stroke-brand-gray-850" 
              strokeWidth="1.5"
            >
              <title>{`${labels[index]}: ${value}`}</title>
            </circle>
          ))}
           {labels.length === 1 && ( 
            <text
                x={getX(0)}
                y={getY(values[0]) - 10}
                textAnchor="middle"
                fill={displayColor}
                className="text-xs font-semibold"
            >
                {values[0]}
            </text>
           )}
        </svg>
      </div>
      {values.every(v => v === values[0]) && labels.length > 1 && (
          <p className="text-xs text-brand-gray-500 italic mt-2 text-center">Data shows a flat trend.</p>
      )}
    </div>
  );
};

export default SimulatedChartDisplay;