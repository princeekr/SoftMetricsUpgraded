import React from 'react';
import Card from './Card';
import { formatCurrency } from '../utils/formatters';

interface CashFlowChartProps {
  cashFlows: number[];
  discountRate: number;
  initialInvestment: number;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ cashFlows, discountRate, initialInvestment }) => {
  const allFlows = [-initialInvestment, ...cashFlows];
  const rate = discountRate / 100;

  const discountedFlows = allFlows.map((cf, index) => {
    if (index === 0) return cf;
    return cf / Math.pow(1 + rate, index);
  });

  const maxValue = Math.max(0, ...allFlows, ...discountedFlows);
  const minValue = Math.min(0, ...allFlows, ...discountedFlows);

  if (maxValue === 0 && minValue === 0) {
    return (
        <Card className="mt-4 p-4">
            <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Cash Flow Visualization</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center py-10">All cash flows are zero.</p>
        </Card>
    );
  }

  const chartHeight = 300;
  const chartPaddingY = 50; // For labels top and bottom
  const barAreaHeight = chartHeight - chartPaddingY;
  
  let zeroLine: number;
  let positiveScale: (v: number) => number;
  let negativeScale: (v: number) => number;

  const hasPositive = maxValue > 0;
  const hasNegative = minValue < 0;

  if (hasPositive && hasNegative) {
    const totalRange = maxValue - minValue;
    const positiveRatio = maxValue / totalRange;
    const positiveAreaHeight = barAreaHeight * positiveRatio;
    const negativeAreaHeight = barAreaHeight - positiveAreaHeight;
    zeroLine = positiveAreaHeight + chartPaddingY / 2;
    positiveScale = (v) => v > 0 ? (v / maxValue) * positiveAreaHeight : 0;
    negativeScale = (v) => v < 0 ? (Math.abs(v) / Math.abs(minValue)) * negativeAreaHeight : 0;
  } else if (hasPositive) {
    zeroLine = barAreaHeight + chartPaddingY / 2;
    positiveScale = (v) => v > 0 ? (v / maxValue) * barAreaHeight : 0;
    negativeScale = () => 0;
  } else { // hasNegative
    zeroLine = chartPaddingY / 2;
    positiveScale = () => 0;
    negativeScale = (v) => v < 0 ? (Math.abs(v) / Math.abs(minValue)) * barAreaHeight : 0;
  }

  const barWidth = 30;
  const barMargin = 5;
  const barGroupWidth = barWidth * 2 + barMargin * 3;
  const chartWidth = barGroupWidth * allFlows.length;

  return (
    <Card className="mt-4 p-4">
      <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Cash Flow Visualization</h3>
      
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs mb-4">
        <div className="flex items-center"><div className="w-3 h-3 bg-blue-300 dark:bg-blue-700 mr-1.5 rounded-sm"></div>Original</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-cyan-500 dark:bg-cyan-400 mr-1.5 rounded-sm"></div>Discounted</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-red-300 dark:bg-red-700 mr-1.5 rounded-sm"></div>Original (Negative)</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-red-500 dark:bg-red-400 mr-1.5 rounded-sm"></div>Discounted (Negative)</div>
      </div>

      <div className="overflow-x-auto pb-4">
        <svg width={chartWidth} height={chartHeight} className="font-sans" aria-label="Cash flow bar chart">
          <line x1="0" y1={zeroLine} x2={chartWidth} y2={zeroLine} className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="2" />
          
          {allFlows.map((cf, index) => {
            const discountedCf = discountedFlows[index];
            const x = index * barGroupWidth;
            
            const isOriginalNegative = cf < 0;
            const originalHeight = isOriginalNegative ? negativeScale(cf) : positiveScale(cf);
            const originalY = isOriginalNegative ? zeroLine : zeroLine - originalHeight;
            
            const isDiscountedNegative = discountedCf < 0;
            const discountedHeight = isDiscountedNegative ? negativeScale(discountedCf) : positiveScale(discountedCf);
            const discountedY = isDiscountedNegative ? zeroLine : zeroLine - discountedHeight;

            return (
              <g key={index} transform={`translate(${x}, 0)`} role="group" aria-label={`Year ${index}: Original cash flow ${formatCurrency(cf)}, Discounted cash flow ${formatCurrency(discountedCf)}`}>
                {/* Original Bar */}
                <rect 
                  x={barMargin}
                  y={originalY}
                  width={barWidth}
                  height={originalHeight}
                  className={isOriginalNegative ? "fill-red-300 dark:fill-red-700" : "fill-blue-300 dark:fill-blue-700"}
                  aria-label={`Original value: ${formatCurrency(cf)}`}
                />
                {/* Discounted Bar */}
                 <rect 
                  x={barWidth + barMargin * 2}
                  y={discountedY}
                  width={barWidth}
                  height={discountedHeight}
                  className={isDiscountedNegative ? "fill-red-500 dark:fill-red-400" : "fill-cyan-500 dark:fill-cyan-400"}
                  aria-label={`Discounted value: ${formatCurrency(discountedCf)}`}
                />
                {/* Year Label */}
                <text 
                  x={barGroupWidth / 2} 
                  y={chartHeight - 10} 
                  textAnchor="middle" 
                  className="text-xs fill-slate-600 dark:fill-slate-400"
                  aria-hidden="true"
                >
                  Year {index}
                </text>
                 {/* Value Label for Discounted Bar */}
                 <text
                  x={barWidth + barMargin * 2 + barWidth / 2}
                  y={isDiscountedNegative ? zeroLine + discountedHeight + 15 : discountedY - 5}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-slate-800 dark:fill-slate-200"
                  aria-hidden="true"
                >
                  {formatCurrency(discountedCf)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

export default CashFlowChart;