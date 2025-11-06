import React from 'react';
import { formatCurrency } from '../utils/formatters';
import Card from './Card';

interface CashFlowTableProps {
  cashFlows: number[];
  discountRate: number;
  initialInvestment: number;
}

const CashFlowTable: React.FC<CashFlowTableProps> = ({ cashFlows, discountRate, initialInvestment }) => {
  const rate = discountRate / 100;

  return (
    <Card className="mt-4 p-4 overflow-x-auto">
      <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Cash Flow Details</h3>
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Period (Year)</th>
            <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cash Flow</th>
            <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Discounted Value</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
          <tr>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">0</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-red-500 dark:text-red-400 text-right">{formatCurrency(-initialInvestment)}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-red-500 dark:text-red-400 text-right">{formatCurrency(-initialInvestment)}</td>
          </tr>
          {cashFlows.map((cf, index) => {
            const period = index + 1;
            const discountedValue = cf / Math.pow(1 + rate, period);
            return (
              <tr key={period}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{period}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600 dark:text-green-400 text-right">{formatCurrency(cf)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 text-right">{formatCurrency(discountedValue)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default CashFlowTable;