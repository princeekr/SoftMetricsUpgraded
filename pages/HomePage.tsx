import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import InteractiveInflationCalculator from '../components/calculators/InteractiveInflationCalculator';

// Icons for pre-login page
const NpvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.75A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 5.75v12.5A2.25 2.25 0 0 0 6 20.25Z" />
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

// Icons for after-login dashboard
const AnalyticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </svg>
);

const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);


const features = [
  {
    name: 'BrainBites',
    description: 'AI-powered concept explanations.',
    icon: <BrainIcon className="w-8 h-8 text-amber-500" />
  },
  {
    name: 'Conceptify',
    description: 'Explore key concepts with clear definitions.',
    icon: <ConceptifyIcon className="w-8 h-8 text-orange-500" />
  },
  {
    name: 'NPV Calculator',
    description: 'Evaluate investment profitability.',
    icon: <NpvIcon className="w-8 h-8 text-green-500" />
  }
];

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const userName = user?.email ? user.email.split('@')[0] : 'there';
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);


  return (
    <>
      {isAuthenticated ? (
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Welcome Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-slate-200 via-brand-primary to-brand-secondary dark:from-white dark:via-brand-primary dark:to-brand-secondary text-transparent bg-clip-text">
              Welcome Back, {capitalizedUserName}!
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
              Here's your dashboard. Ready to dive into your next project?
            </p>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/services" className="block group">
                <Card className="p-6 h-full text-center group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out border border-transparent group-hover:border-brand-primary/50">
                  <div className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg p-4 inline-block">
                    <GridIcon className="w-10 h-10 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">View All Tools</h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Explore the full suite of financial and project management calculators.</p>
                </Card>
              </Link>
              <Link to="/analytics" className="block group">
                <Card className="p-6 h-full text-center group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out border border-transparent group-hover:border-brand-primary/50">
                  <div className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg p-4 inline-block">
                    <AnalyticsIcon className="w-10 h-10 text-cyan-500" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Analyze a Project</h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Get AI-powered feasibility insights from your project documents.</p>
                </Card>
              </Link>
              <Link to="/brain-bites" className="block group">
                <Card className="p-6 h-full text-center group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out border border-transparent group-hover:border-brand-primary/50">
                  <div className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg p-4 inline-block">
                    <BrainIcon className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Learn a Concept</h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Ask our AI for quick, easy-to-understand explanations.</p>
                </Card>
              </Link>
            </div>
          </div>

          {/* Featured Tool */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Featured Tool</h2>
            <Card className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Evaluate Investments with the NPV Calculator
                  </h3>
                  <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Our Net Present Value (NPV) calculator is an essential tool for capital budgeting. It helps you determine the profitability of an investment by accounting for the time value of money, ensuring you make informed financial decisions. Analyze future cash flows in today's terms and see if your project is set for success.
                  </p>
                  <Link to="/npv">
                    <Button className="mt-6">Try the NPV Calculator</Button>
                  </Link>
                </div>
                <div className="hidden md:flex justify-center items-center">
                  <NpvIcon className="w-32 h-32 text-green-500/50" />
                </div>
              </div>
            </Card>
          </div>

        </div>
      ) : (
        <div className="space-y-12 md:space-y-16">
          {/* Hero Section */}
          <div className="relative text-center pt-16 pb-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 rounded-3xl transform -rotate-1"></div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl tracking-tight">
              Smart Financial Tools for Software Engineers
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              SoftMetrics provides a suite of calculators and AI-powered tools to help you navigate the financial aspects of software development and management.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/signup">
                  <Button className="w-full text-lg px-8 py-3">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Instant Insights, No Signup Required
                </h2>
                <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                    Get a feel for our tools with this live demo of the Inflation Calculator.
                </p>
            </div>
            <InteractiveInflationCalculator />
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto my-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Our Featured Tools
                </h2>
                <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                  Explore our most popular tools for AI-driven insights, clear concept explanations, and powerful investment analysis.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((feature) => (
                <Card key={feature.name} className="p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <div className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-lg p-4 inline-block">
                      {feature.icon}
                    </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{feature.name}</h3>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-400">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default HomePage;