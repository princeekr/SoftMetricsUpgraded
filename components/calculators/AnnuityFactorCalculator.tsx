import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import Card from '../Card';
import { calculateAnnuityFactor } from '../../services/financialService';
import { formatNumber } from '../../utils/formatters';

const AnnuityFactorCalculator: React.FC = () => {
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-brand-primary mb-4">Annuity Factor Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Discount Rate (%)"
          id="rate-comp"
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
          id="periods-comp"
          type="number"
          value={periods}
          onChange={(e) => setPeriods(e.target.value)}
          step="1"
          min="1"
          placeholder="e.g., 10"
          required
        />
        <Button type="submit" className="w-full">Calculate</Button>
      </form>
      {result !== null && (
        <div className="mt-6 bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Annuity Factor</p>
          <p className="text-4xl font-bold text-cyan-500 dark:text-cyan-400 tracking-wider my-2">
            {formatNumber(result, 4)}
          </p>
        </div>
      )}
    </Card>
  );
};

export default AnnuityFactorCalculator;
