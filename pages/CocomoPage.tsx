import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorShell from '../components/CalculatorShell';
import Card from '../components/Card';
import { calculateCocomo, CocomoProjectType } from '../services/financialService';
import { formatNumber } from '../utils/formatters';

const CocomoPage: React.FC = () => {
  const [kloc, setKloc] = useState('50');
  const [projectType, setProjectType] = useState<CocomoProjectType>('Semidetached');
  const [result, setResult] = useState<{ effort: number; developmentTime: number } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numKloc = parseFloat(kloc);
    if (!isNaN(numKloc) && numKloc > 0) {
      setResult(calculateCocomo(numKloc, projectType));
    }
  };

  const handleClear = () => {
    setKloc('50');
    setProjectType('Semidetached');
    setResult(null);
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Kilo Lines of Code (KLOC)"
        id="kloc"
        type="number"
        value={kloc}
        onChange={(e) => setKloc(e.target.value)}
        step="1"
        min="1"
        placeholder="e.g., 50"
        required
      />
      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Project Type
        </label>
        <select
          id="projectType"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value as CocomoProjectType)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
        >
          <option>Organic</option>
          <option>Semidetached</option>
          <option>Embedded</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" className="w-full">Calculate</Button>
        <Button type="button" variant="secondary" onClick={handleClear} className="w-full">Clear</Button>
      </div>
    </form>
  );

  const results = (
    <Card className="p-6 h-full flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Results</h2>
      <div className="bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center space-y-6">
        {result !== null ? (
          <>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Effort</p>
              <p className="text-4xl lg:text-5xl font-bold text-cyan-500 dark:text-cyan-400 tracking-wider my-2">
                {formatNumber(result.effort, 2)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Person-Months</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                This is the estimated total work required, equivalent to one person working for {formatNumber(result.effort, 2)} months.
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Development Time</p>
              <p className="text-4xl lg:text-5xl font-bold text-purple-500 dark:text-purple-400 tracking-wider my-2">
                {formatNumber(result.developmentTime, 2)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Months</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                This is the estimated calendar duration of the project, from start to finish.
              </p>
            </div>
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">Enter parameters and click "Calculate" to see the result.</p>
        )}
      </div>
    </Card>
  );

  return (
    <CalculatorShell
      title="COCOMO Model Calculator"
      description="Estimate software development effort and time using the basic Constructive Cost Model (COCOMO)."
      form={form}
      results={results}
    />
  );
};

export default CocomoPage;