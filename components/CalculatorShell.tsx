import React from 'react';
import Card from './Card';

interface CalculatorShellProps {
  title: string;
  description: string;
  form: React.ReactNode;
  results: React.ReactNode;
}

const CalculatorShell: React.FC<CalculatorShellProps> = ({ title, description, form, results }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl tracking-tight">{title}</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <Card className="md:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Parameters</h2>
          {form}
        </Card>
        
        <div className="md:col-span-3">
            {results}
        </div>
      </div>
    </div>
  );
};

export default CalculatorShell;