import React, { useEffect, useState } from 'react';

interface DonutChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  size = 200,
  strokeWidth = 20,
}) => {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    const progressOffset = ((100 - percentage) / 100) * circumference;
    // Set a timeout to allow the initial render to complete before starting the animation
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  const getColor = () => {
    if (percentage >= 75) return 'text-green-500 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const colorClass = getColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-slate-200 dark:text-slate-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-in-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${colorClass}`}>
          {percentage}
          <span className="text-3xl">%</span>
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Feasible</span>
      </div>
    </div>
  );
};

export default DonutChart;