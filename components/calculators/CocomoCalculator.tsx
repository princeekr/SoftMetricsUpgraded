import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import Card from '../Card';
import { calculateCocomo, CocomoProjectType } from '../../services/financialService';
import { formatNumber } from '../../utils/formatters';

const CocomoCalculator: React.FC = () => {
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-brand-primary mb-4">COCOMO Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Kilo Lines of Code (KLOC)"
          id="kloc-comp"
          type="number"
          value={kloc}
          onChange={(e) => setKloc(e.target.value)}
          step="1"
          min="1"
          placeholder="e.g., 50"
          required
        />
        <div>
          <label htmlFor="projectType-comp" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Project Type
          </label>
          <select
            id="projectType-comp"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as CocomoProjectType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
          >
            <option>Organic</option>
            <option>Semidetached</option>
            <option>Embedded</option>
          </select>
        </div>
        <Button type="submit" className="w-full">Calculate</Button>
      </form>
      {result !== null && (
        <div className="mt-6 bg-slate-100 dark:bg-slate-900/70 p-6 rounded-lg text-center space-y-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Effort</p>
            <p className="text-4xl font-bold text-cyan-500 dark:text-cyan-400 tracking-wider my-2">
              {formatNumber(result.effort, 2)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Person-Months</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Development Time</p>
            <p className="text-4xl font-bold text-purple-500 dark:text-purple-400 tracking-wider my-2">
              {formatNumber(result.developmentTime, 2)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Months</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CocomoCalculator;
