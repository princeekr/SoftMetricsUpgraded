import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import MarkdownRenderer from '../components/MarkdownRenderer';

const BrainBitesPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const topics = [
    'Return on Investment (ROI)',
    'Capital Asset Pricing Model (CAPM)',
    'Weighted Average Cost of Capital (WACC)',
    'Time Value of Money (TVM)',
    'Discounted Cash Flow (DCF)'
  ];

  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic);
    fetchExplanation(selectedTopic);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
        setError('Please enter a topic.');
        return;
    }
    fetchExplanation(topic);
  };

  const fetchExplanation = async (currentTopic: string) => {
    if (!process.env.API_KEY) {
      setError('API key is not configured. Please set the API_KEY environment variable.');
      return;
    }

    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Explain the financial concept of "${currentTopic}" in a simple and concise way, as if for a software engineer. Use markdown for formatting, including headers, bold text, and bullet points where appropriate. Start with a simple definition.`,
      });
      
      setExplanation(response.text);

    } catch (e) {
      console.error(e);
      setError('Failed to fetch explanation. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-slate-200 via-purple-500 to-pink-500 dark:from-white dark:via-purple-400 dark:to-pink-400 text-transparent bg-clip-text">Brain Bites</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Get quick, AI-powered explanations of complex financial and software engineering management concepts.
        </p>
      </div>

      <Card className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <Input
              label="Enter a concept"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Return on Investment (ROI)"
            />
          </div>
          <Button type="submit" disabled={loading} className="self-start sm:self-end h-10 mt-1 sm:mt-6">
            {loading ? 'Thinking...' : 'Explain'}
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Or try one of these:</span>
            {topics.map(t => (
                <button 
                  key={t} 
                  onClick={() => handleTopicClick(t)}
                  className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                    {t}
                </button>
            ))}
        </div>
      </Card>

      <Card className="p-6 min-h-[20rem]">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Explanation</h2>
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {explanation && (
          <MarkdownRenderer content={explanation} />
        )}
        {!loading && !explanation && !error && (
            <p className="text-slate-500 dark:text-slate-400">Your explanation will appear here.</p>
        )}
      </Card>
    </div>
  );
};

export default BrainBitesPage;