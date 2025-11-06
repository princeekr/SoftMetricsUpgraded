
import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorShell from '../components/CalculatorShell';
import Card from '../components/Card';
import { calculateIndianIncomeTax } from '../services/financialService';
import { formatCurrency, formatNumber } from '../utils/formatters';

const IncomeTaxPage: React.FC = () => {
  const [income, setIncome] = useState('1000000');
  const [result, setResult] = useState<{ tax: number; percentage: number } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numIncome = parseFloat(income);

    if (!isNaN(numIncome) && numIncome >= 0) {
      const tax = calculateIndianIncomeTax(numIncome);
      const percentage = numIncome > 0 ? (tax / numIncome) * 100 : 0;
      setResult({ tax, percentage });
    }
  };

  const handleClear = () => {
    setIncome('1000000');
    setResult(null);
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Total Annual Income (₹)"
        id="income"
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        step="10000"
        min="0"
        placeholder="e.g., 1000000"
        required
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Based on the New Tax Regime for AY 2025-26, including a standard deduction of ₹50,000 for salaried employees.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" className="w-full">Calculate Tax</Button>
        <Button type="button" variant="secondary" onClick={handleClear} className="w-full">Clear</Button>
      </div>
    </form>
  );

  const results = (
    <Card className="p-6 h-full flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Tax Calculation Result</h2>
      <div className="bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center">
        {result !== null ? (
          <div className="space-y-6">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Tax Payable</p>
                <p className="text-4xl lg:text-5xl font-bold text-teal-500 dark:text-teal-400 tracking-wider my-2">
                    {formatCurrency(result.tax)}
                </p>
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Effective Tax Rate</p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 tracking-wider my-1">
                    {formatNumber(result.percentage, 2)}%
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    This is the percentage of your total income that goes towards tax.
                </p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">Enter your income and click "Calculate" to see the result.</p>
        )}
      </div>
    </Card>
  );

  return (
    <CalculatorShell
      title="Income Tax Calculator (India)"
      description="Calculate your income tax liability based on the New Tax Regime for the Assessment Year 2025-26."
      form={form}
      results={results}
    />
  );
};

export default IncomeTaxPage;
