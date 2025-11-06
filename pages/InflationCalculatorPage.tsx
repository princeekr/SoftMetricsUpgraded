
import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorShell from '../components/CalculatorShell';
import Card from '../components/Card';
import { calculateInflationAdjustment } from '../services/financialService';
import { formatCurrency } from '../utils/formatters';

const InflationCalculatorPage: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState('1000');
  const [annualRate, setAnnualRate] = useState('3');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numInitialAmount = parseFloat(initialAmount);
    const numAnnualRate = parseFloat(annualRate);
    const numYears = parseInt(years, 10);

    if (!isNaN(numInitialAmount) && !isNaN(numAnnualRate) && !isNaN(numYears) && numYears >= 0) {
      setResult(calculateInflationAdjustment(numInitialAmount, numAnnualRate, numYears));
    }
  };

  const handleClear = () => {
    setInitialAmount('1000');
    setAnnualRate('3');
    setYears('10');
    setResult(null);
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Initial Amount (₹)"
        id="initialAmount"
        type="number"
        value={initialAmount}
        onChange={(e) => setInitialAmount(e.target.value)}
        step="100"
        min="0"
        placeholder="e.g., 1000"
        required
      />
      <Input
        label="Average Annual Inflation Rate (%)"
        id="annualRate"
        type="number"
        value={annualRate}
        onChange={(e) => setAnnualRate(e.target.value)}
        step="0.1"
        min="0"
        placeholder="e.g., 3"
        required
      />
      <Input
        label="Number of Years"
        id="years"
        type="number"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        step="1"
        min="0"
        placeholder="e.g., 10"
        required
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" className="w-full">Calculate</Button>
        <Button type="button" variant="secondary" onClick={handleClear} className="w-full">Clear</Button>
      </div>
    </form>
  );

  const results = (
    <Card className="p-6 h-full flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Result</h2>
      <div className="bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center">
        {result !== null ? (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">Adjusted Amount for Inflation</p>
            <p className="text-4xl lg:text-5xl font-bold text-red-500 dark:text-red-400 tracking-wider my-2">
              {formatCurrency(result)}
            </p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              To have the same purchasing power as {formatCurrency(parseFloat(initialAmount))} today, you will need {formatCurrency(result)} in {years} years, assuming an average annual inflation rate of {annualRate}%.
            </p>
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">Enter parameters and click "Calculate" to see the result.</p>
        )}
      </div>
    </Card>
  );

  return (
    <CalculatorShell
      title="Inflation Calculator"
      description="Calculate the future value of an amount required to maintain the same purchasing power, given a constant annual inflation rate."
      form={form}
      results={results}
    />
  );
};

export default InflationCalculatorPage;
