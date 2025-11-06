
import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorShell from '../components/CalculatorShell';
import Card from '../components/Card';
import { calculateAnnuityFactor } from '../services/financialService';
import { formatNumber } from '../utils/formatters';

const AnnuityFactorPage: React.FC = () => {
  const [rate, setRate] = useState('5');
  const [periods, setPeriods] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numRate = parseFloat(rate);
    const numPeriods = parseInt(periods, 10);
    if (!isNaN(numRate) && !isNaN(numPeriods) && numPeriods > 0 && numRate > 0) {
      setResult(calculateAnnuityFactor(numRate, numPeriods));
    }
  };

  const handleClear = () => {
    setRate('5');
    setPeriods('10');
    setResult(null);
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Discount Rate (%)"
        id="rate"
        type="number"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        step="0.1"
        min="0.1"
        placeholder="e.g., 5"
        required
      />
      <Input
        label="Number of Periods"
        id="periods"
        type="number"
        value={periods}
        onChange={(e) => setPeriods(e.target.value)}
        step="1"
        min="1"
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Annuity Factor</p>
            <p className="text-4xl lg:text-5xl font-bold text-cyan-500 dark:text-cyan-400 tracking-wider my-2">
              {formatNumber(result, 4)}
            </p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              This factor represents the present value of ₹1 received every period for {periods} periods, discounted at a rate of {rate}%.
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
      title="Annuity Factor Calculator"
      description="Calculate the present value of a series of equal future payments using the annuity factor."
      form={form}
      results={results}
    />
  );
};

export default AnnuityFactorPage;
