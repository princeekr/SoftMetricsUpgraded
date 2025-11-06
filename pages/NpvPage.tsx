import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorShell from '../components/CalculatorShell';
import Card from '../components/Card';
import CashFlowTable from '../components/CashFlowTable';
import { calculateNPV } from '../services/financialService';
import { formatCurrency } from '../utils/formatters';

const NpvPage: React.FC = () => {
  const [rate, setRate] = useState('10');
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [cashFlows, setCashFlows] = useState(['3000', '4000', '5000', '4000']);
  const [result, setResult] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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
    const numCashFlows = cashFlows.map(cf => parseFloat(cf) || 0);

    if (!isNaN(numRate) && !isNaN(numInitialInvestment)) {
      const npv = calculateNPV(numRate, numInitialInvestment, numCashFlows);
      setResult(npv);
      setShowDetails(true);
    }
  };

  const handleClear = () => {
    setRate('10');
    setInitialInvestment('10000');
    setCashFlows(['3000', '4000', '5000', '4000']);
    setResult(null);
    setShowDetails(false);
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
        min="0"
        required
      />
      <Input
        label="Initial Investment"
        id="initialInvestment"
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
                id={`cf-${index}`}
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
      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" className="w-full">Calculate NPV</Button>
        <Button type="button" variant="secondary" className="w-full" onClick={handleClear}>Clear</Button>
      </div>
    </form>
  );

  const parsedCashFlows = cashFlows.map(cf => parseFloat(cf) || 0);
  const parsedRate = parseFloat(rate) || 0;
  const parsedInitialInvestment = parseFloat(initialInvestment) || 0;

  const results = (
    <>
      <Card className="p-6 flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Result</h2>
        <div className="bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center">
          {result !== null ? (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400">Net Present Value</p>
              <p className={`text-4xl lg:text-5xl font-bold tracking-wider my-2 ${result >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {formatCurrency(result)}
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                {result >= 0
                  ? "A positive NPV suggests the investment is profitable and will add value, as projected earnings exceed costs in today's dollars."
                  : "A negative NPV suggests the investment may be unprofitable, as the projected costs outweigh the earnings in today's dollars."
                }
              </p>
            </>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">Enter parameters and click "Calculate" to see the result.</p>
          )}
        </div>
      </Card>
      {result !== null && showDetails && (
        <CashFlowTable 
            cashFlows={parsedCashFlows}
            discountRate={parsedRate}
            initialInvestment={parsedInitialInvestment}
        />
      )}
    </>
  );

  return (
    <CalculatorShell
      title="Net Present Value (NPV) Calculator"
      description="Determine the profitability of an investment by comparing the present value of future cash flows to the initial investment."
      form={form}
      results={results}
    />
  );
};

export default NpvPage;