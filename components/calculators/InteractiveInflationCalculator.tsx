import React, { useState, useEffect } from 'react';
import Input from '../Input';
import Card from '../Card';
import { calculateInflationAdjustment } from '../../services/financialService';
import { formatCurrency } from '../../utils/formatters';

const InteractiveInflationCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState('1000');
  const [annualRate, setAnnualRate] = useState('3');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const numInitialAmount = parseFloat(initialAmount);
    const numAnnualRate = parseFloat(annualRate);
    const numYears = parseInt(years, 10);

    if (!isNaN(numInitialAmount) && !isNaN(numAnnualRate) && !isNaN(numYears) && numYears >= 0 && numYears <= 1000) {
      const calculation = calculateInflationAdjustment(numInitialAmount, numAnnualRate, numYears);
      setResult(calculation);
    } else {
      setResult(null);
    }
  }, [initialAmount, annualRate, years]);


  return (
    <Card className="p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Form Section */}
        <div className="space-y-4">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <Input
              label="If I have this amount today..."
              id="interactive-initialAmount"
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              step="100"
              min="0"
            />
            <Input
              label="And the annual inflation rate is..."
              id="interactive-annualRate"
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              step="0.1"
              min="0"
              addon="%"
            />
            <Input
              label="In this many years..."
              id="interactive-years"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              step="1"
              min="0"
            />
          </form>
        </div>
        {/* Result Section */}
        <div className="bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center h-full flex flex-col justify-center min-h-[15rem]">
          {result !== null ? (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400">...I will need this amount to have the same buying power:</p>
              <p className="text-4xl lg:text-5xl font-bold text-red-500 dark:text-red-400 tracking-wider my-2">
                {formatCurrency(result)}
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                To have the purchasing power of {formatCurrency(parseFloat(initialAmount))} today, you'll need {formatCurrency(result)} in {years} years.
              </p>
            </>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">Enter valid numbers to see the calculation.</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InteractiveInflationCalculator;