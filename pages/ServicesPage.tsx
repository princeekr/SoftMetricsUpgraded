import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';

/**
 * Calculates the Levenshtein distance between two strings, which represents the number of
 * single-character edits (insertions, deletions, or substitutions) required to change
 * one string into the other.
 * @param a - The first string.
 * @param b - The second string.
 * @returns The Levenshtein distance.
 */
const levenshteinDistance = (a: string, b: string): number => {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  // Create a 2D array
  const matrix = Array.from({ length: bn + 1 }, () =>
    Array.from({ length: an + 1 }, () => 0)
  );

  // Initialize first row
  for (let i = 0; i <= an; i++) {
    matrix[0][i] = i;
  }

  // Initialize first column
  for (let j = 0; j <= bn; j++) {
    matrix[j][0] = j;
  }

  // Fill the rest of the matrix
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,      // Deletion
        matrix[j - 1][i] + 1,      // Insertion
        matrix[j - 1][i - 1] + cost, // Substitution
      );
    }
  }

  return matrix[bn][an];
};


const NpvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.75A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 5.75v12.5A2.25 2.25 0 0 0 6 20.25Z" />
  </svg>
);

const CocomoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.5A2.25 2.25 0 006 20.25z" />
  </svg>
);

const AnnuityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.188-.648a2.25 2.25 0 001.423-1.423L16.25 15.5l.648 1.188a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.188.648a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const ConceptifyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const InflationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const RupeeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3v3h6v-3l-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5h6M9 12h6m-5.25 4.5h4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12V6H6v12z" />
    </svg>
);

const AnalyticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </svg>
);

const SearchOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const services = [
  { 
    name: 'BrainBites', 
    description: 'Get quick, AI-powered explanations of complex financial and software engineering concepts.', 
    href: '/brain-bites',
    icon: <BrainIcon className="w-8 h-8 text-amber-500" />,
    category: 'AI & Learning'
  },
  { 
    name: 'Conceptify', 
    description: 'Explore key financial and project management concepts, with clear definitions and formulas.', 
    href: '/conceptify',
    icon: <ConceptifyIcon className="w-8 h-8 text-orange-500" />,
    category: 'AI & Learning'
  },
  { 
    name: 'Project Analytics', 
    description: 'Upload a document for an AI-powered feasibility analysis, score, and recommendations.', 
    href: '/analytics',
    icon: <AnalyticsIcon className="w-8 h-8 text-cyan-500" />,
    category: 'AI & Learning'
  },
  { 
    name: 'NPV Calculator', 
    description: 'Evaluate the profitability of an investment by comparing future cash flows to the initial investment.', 
    href: '/npv',
    icon: <NpvIcon className="w-8 h-8 text-green-500" />,
    category: 'Financial Planning'
  },
  { 
    name: 'Annuity Factor', 
    description: 'Calculate the present value of a series of equal future payments using the annuity factor shortcut.', 
    href: '/annuity',
    icon: <AnnuityIcon className="w-8 h-8 text-purple-500" />,
    category: 'Financial Planning'
  },
  { 
    name: 'Inflation Calculator', 
    description: 'Calculate the future value of money adjusted for a consistent annual inflation rate.', 
    href: '/inflation',
    icon: <InflationIcon className="w-8 h-8 text-red-500" />,
    category: 'Financial Planning'
  },
  { 
    name: 'COCOMO Calculator', 
    description: 'Estimate software development effort and time using the basic Constructive Cost Model (COCOMO).', 
    href: '/cocomo',
    icon: <CocomoIcon className="w-8 h-8 text-blue-500" />,
    category: 'Project Management'
  },
  { 
    name: 'Income Tax Calculator (India)', 
    description: 'Calculate your income tax liability based on the 2025-26 Indian New Tax Regime.', 
    href: '/income-tax',
    icon: <RupeeIcon className="w-8 h-8 text-teal-500" />,
    category: 'Personal Finance'
  },
];


const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  const userName = user?.email ? user.email.split('@')[0] : 'there';
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const filteredServices = services.filter(service => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) {
      return true;
    }

    const nameLower = service.name.toLowerCase();
    const descriptionLower = service.description.toLowerCase();
    const combinedText = `${nameLower} ${descriptionLower}`;
    
    const searchWords = searchTermLower.split(' ').filter(Boolean);

    // All search words must be present in some form (exact or fuzzy)
    return searchWords.every(searchWord => {
      // Priority 1: Exact substring match for speed
      if (combinedText.includes(searchWord)) {
        return true;
      }

      // Priority 2: Fuzzy match for typo tolerance
      const serviceWords = new Set(combinedText.split(/[\s,.-]+/).filter(Boolean));
      const threshold = searchWord.length > 5 ? 2 : 1; // More typos allowed for longer words

      for (const serviceWord of serviceWords) {
        if (levenshteinDistance(searchWord, serviceWord) <= threshold) {
          return true; // Found a fuzzy match for this search word
        }
      }

      return false; // This search word was not found, so the service is filtered out
    });
  });

  const groupedServices = filteredServices.reduce((acc, service) => {
    const { category } = service;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl tracking-tight">
          Hello, <span className="text-brand-primary">{capitalizedUserName}!</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          What would you like to accomplish today? Explore our suite of tools designed for smart decision-making.
        </p>
      </div>
      
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a tool by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            aria-label="Search for services"
          />
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="space-y-12">
            {Object.entries(groupedServices).map(([category, servicesInCategory]) => (
                <div key={category}>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b-2 border-brand-primary/20 pb-2 mb-6">
                        {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {servicesInCategory.map((service) => (
                        <Link to={service.href} key={service.name} className="block group">
                        <Card className="p-8 h-full group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out border border-transparent group-hover:border-brand-primary/50">
                            <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg p-3">
                                {service.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white ml-4">{service.name}</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 min-h-[3rem]">{service.description}</p>
                            <div className="mt-6 text-brand-secondary font-semibold group-hover:translate-x-1 transition-transform duration-300">
                            Open Tool &rarr;
                            </div>
                        </Card>
                        </Link>
                    ))}
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <Card className="inline-block p-8">
                <SearchOffIcon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
                <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">No Tools Found</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Your search for "{searchTerm}" did not match any tools.</p>
            </Card>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;