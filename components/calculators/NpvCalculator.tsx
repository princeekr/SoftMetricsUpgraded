import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import Card from '../Card';
import { calculateNPV } from '../../services/financialService';
import { formatCurrency } from '../../utils/formatters';

const NpvCalculator: React.FC = () => {
  const [rate, setRate] = useState('10');
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [cashFlows, setCashFlows] = useState(['3000', '4000', '5000', '4000']);
  const [result, setResult] = useState<number | null>(null);

  const handleCashFlowChange = (index: number, value: string) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
  };

  const addCashFlow = () => setCashFlows([...cashFlows, '']);
  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numRate = parseFloat(rate);
    const numInitialInvestment = parseFloat(initialInvestment);
    const numCashFlows = cashFlows.map(cf => parseFloat(cf)).filter(cf => !isNaN(cf));

    if (!isNaN(numRate) && !isNaN(numInitialInvestment) && numCashFlows.length > 0) {
      const npv = calculateNPV(numRate, numInitialInvestment, numCashFlows);
      setResult(npv);
    }
  };

  return (
    <Card className="p-6">
        <h2 className="text-2xl font-bold text-brand-primary mb-4">NPV Calculator</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            label="Discount Rate (%)"
            id="rate-comp"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            step="0.1"
            min="0"
            required
        />
        <Input
            label="Initial Investment"
            id="initialInvestment-comp"
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            step="100"
            min="0"
            required
        />
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cash Flows (per period)</label>
            <div className="space-y-2">
            {cashFlows.map((cf, index) => (
                <div key={index} className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm w-12">Yr {index + 1}:</span>
                <Input
                    label=""
                    id={`cf-comp-${index}`}
                    type="number"
                    value={cf}
                    onChange={(e) => handleCashFlowChange(index, e.target.value)}
                    placeholder="e.g., 5000"
                    className="flex-grow"
                    required
                />
                <button
                    type="button"
                    onClick={() => removeCashFlow(index)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white disabled:opacity-50"
                    disabled={cashFlows.length <= 1}
                    aria-label={`Remove Year ${index + 1} cash flow`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                </button>
                </div>
            ))}
            </div>
            <Button type="button" onClick={addCashFlow} variant="secondary" className="mt-2 w-full text-xs">
            + Add Year
            </Button>
        </div>
        <Button type="submit" className="w-full">Calculate NPV</Button>
        </form>
        {result !== null && (
            <div className="mt-6 bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Net Present Value</p>
                <p className={`text-4xl font-bold tracking-wider my-2 ${result >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {formatCurrency(result)}
                </p>
            </div>
        )}
    </Card>
  );
};

export default NpvCalculator;
