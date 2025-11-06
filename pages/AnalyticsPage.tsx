// AnalyticsPage.tsx
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import FileUpload from '../components/FileUpload';
import Card from '../components/Card';
import DonutChart from '../components/DonutChart';
import Button from '../components/Button';
import MarkdownRenderer from '../components/MarkdownRenderer';

// TypeScript: augment Window with expected globals
declare global {
  interface Window {
    pdfjsLib?: any;
    mammoth?: any;
  }
}

interface FeasibilityResult {
  feasibilityPercentage: number;
  explanation: string;
}

const scriptCache = new Map<string, Promise<any>>();

const loadScript = (src: string, globalName: string): Promise<any> => {
  if (scriptCache.has(src)) return scriptCache.get(src)!;

  const promise = new Promise((resolve, reject) => {
    // Already available?
    const existing = (window as any)[globalName] ?? (window as any)[globalName]?.default;
    if (existing) return resolve(existing);

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.type = 'application/javascript';

    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      const lib = (window as any)[globalName] ?? (window as any)[globalName]?.default;
      cleanup();
      if (lib) resolve(lib);
      else reject(new Error(`Script loaded from ${src} but global '${globalName}' not found on window.`));
    };

    script.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load script ${src}. network/CORS/CSP or CDN might be blocking it.`));
    };

    document.head.appendChild(script);
  });

  scriptCache.set(src, promise);
  return promise;
};

const AnalyticsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setError('');
    setResult(null);
    setLoading(true);

    // NOTE: For client apps you should not embed a secret key in process.env on the client.
    // Use a server-side endpoint to call Google GenAI with your API key instead.
    const apiKey = process.env.NEXT_PUBLIC_GENAI_API_KEY ?? (process.env as any).REACT_APP_GENAI_API_KEY ?? process.env.API_KEY;
    if (!apiKey) {
      setError('API key is not configured. Use a server-side proxy to keep keys secret.');
      setLoading(false);
      return;
    }

    try {
      // Load from CDN for better compatibility
      if (!(window as any).pdfjsLib) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'pdfjsLib');
        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      }
      
      if (!(window as any).mammoth) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', 'mammoth');
      }

      const fileContent = await readFileContent(uploadedFile);
      if (!fileContent.trim()) throw new Error('Could not extract any text from the document. It might be empty or image-based.');

      // IMPORTANT: keep API calls server-side in production. This example demonstrates the client call
      // because your original code did so; production apps should call a server endpoint that holds the secret.
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a project feasibility analyzer. Based on the following project requirements document, you must provide a feasibility analysis. Return your response in strict JSON format with this exact structure:
{
  "feasibilityPercentage": number, // An integer between 0 and 100
  "explanation": string // A markdown-formatted analysis including risks and recommendations
}

Do not include any other text, only output valid JSON.

Document to analyze:
${fileContent}`;

      console.log('Sending prompt to Gemini...', { prompt: prompt.slice(0, 200) + '...' });
      
      // Use a model that's supported by the SDK and the API endpoint used here.
      // If you have access to a different Gemini model, replace 'gemini-2.5-flash' accordingly.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // The SDK returns text in different shapes depending on version; normalize it.
      const responseText = (response as any).text ?? (response as any).responseText ?? (response as any).content ?? '';
      console.log('Raw response from Gemini:', responseText);

      // Normalize line endings and clean up the response
      let jsonStr = String(responseText)
        .replace(/\r\n/g, '\n')  // Normalize line endings
        .trim();
      
      // Try a few strategies to extract JSON returned by the model
      let parsedResult: FeasibilityResult | null = null;
      const tryParse = (s: string) => {
        if (!s || !s.trim()) {
          console.log('Empty string provided to parser');
          return null;
        }
        
        try {
          // Log the exact string we're trying to parse
          console.log('Attempting to parse string:', 
            `Length: ${s.length}, ` +
            `Start: "${s.slice(0, 50)}...", ` +
            `End: "...${s.slice(-50)}"`
          );
          
          const obj = JSON.parse(s);
          
          if (!obj || typeof obj !== 'object') {
            console.log('Parsed result is not an object:', obj);
            return null;
          }
          
          if (typeof obj.feasibilityPercentage === 'number' && 
              typeof obj.explanation === 'string') {
            console.log('Successfully parsed valid feasibility result:', {
              percentage: obj.feasibilityPercentage,
              explanationLength: obj.explanation.length
            });
            return obj as FeasibilityResult;
          } else {
            console.log('Object missing required properties:', obj);
          }
        } catch (e) {
          console.log('JSON parse error:', (e as Error).message);
          // Log the problematic characters around the error position if available
          if (e instanceof SyntaxError && 'message' in e) {
            const match = /position (\d+)/.exec(e.message);
            if (match) {
              const pos = parseInt(match[1]);
              console.log('Context around error:',
                s.slice(Math.max(0, pos - 20), pos) +
                ' >>> ERROR >>> ' +
                s.slice(pos, pos + 20)
              );
            }
          }
        }
        return null;
      };

      // 1) Try direct parse first
      parsedResult = tryParse(jsonStr);

      // Try multiple approaches to extract and parse the JSON
      if (!parsedResult) {
        console.log('Direct parse failed, trying different extraction methods...');
        
        // First, try to extract from markdown code fence
        if (jsonStr.startsWith('```')) {
          console.log('Found markdown fence, extracting content...');
          // Split by lines and remove fence lines
          const lines = jsonStr.split('\n');
          const contentLines = lines
            .slice(1, -1)  // Remove first and last line (the fences)
            .join('\n')
            .trim();
          
          console.log('Extracted content:', contentLines.slice(0, 100) + '...');
          parsedResult = tryParse(contentLines);
        }
        
        // If that didn't work, try to find a JSON object
        if (!parsedResult) {
          console.log('Looking for JSON object pattern...');
          const matches = jsonStr.match(/\{[\s\S]*\}/);
          if (matches) {
            const extracted = matches[0];
            console.log('Found JSON pattern:', extracted.slice(0, 100) + '...');
            parsedResult = tryParse(extracted);
          }
        }
      }

      // Log what we found and validate the structure
      if (parsedResult) {
        console.log('Successfully parsed result:', {
          hasPercentage: typeof parsedResult.feasibilityPercentage === 'number',
          percentageValue: parsedResult.feasibilityPercentage,
          hasExplanation: typeof parsedResult.explanation === 'string',
          explanationLength: parsedResult.explanation?.length
        });
        
        // Validate the structure
        if (typeof parsedResult.feasibilityPercentage !== 'number' || 
            typeof parsedResult.explanation !== 'string' ||
            parsedResult.feasibilityPercentage < 0 || 
            parsedResult.feasibilityPercentage > 100) {
          console.error('Invalid feasibility result structure:', parsedResult);
          setError('The analysis result was not in the expected format. Please try again.');
          return;
        }
      } else {
        // If we couldn't parse anything, show a helpful error
        console.error('Could not parse the response. Response preview:', 
          jsonStr.slice(0, 200));
        setError('Could not process the analysis result. Please try again.');
        return;
      }

      // 3) first {...} block
      if (!parsedResult) {
        const first = jsonStr.indexOf('{');
        const last = jsonStr.lastIndexOf('}');
        if (first !== -1 && last !== -1 && last > first) {
          const candidate = jsonStr.slice(first, last + 1);
          parsedResult = tryParse(candidate);
        }
      }

      if (parsedResult) {
        setResult(parsedResult);
      } else {
        // Provide a helpful error including a truncated model response so the user
        // can see what the model returned and adjust the prompt or model choice.
        const preview = jsonStr.length > 1000 ? jsonStr.slice(0, 1000) + '... (truncated)' : jsonStr;
        setError(`Model did not return valid JSON. Raw response:\n${preview}`);
      }
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Failed to analyze the document. ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
        reader.onload = async (event) => {
          try {
            const pdfjsLib = (window as any).pdfjsLib;
            if (!pdfjsLib) {
              return reject(new Error('PDF processing library is not available. Please try again.'));
            }

            const arrayBuffer = event.target?.result as ArrayBuffer;
            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
              return reject(new Error('File is empty or could not be read.'));
            }

            // Convert ArrayBuffer to Uint8Array for better compatibility
            const uint8Array = new Uint8Array(arrayBuffer);
            
            const loadingTask = pdfjsLib.getDocument({
              data: uint8Array,
              // Disable range requests for better compatibility
              disableRange: true,
              // Disable streaming for simpler processing
              disableStream: true,
              // Stop at first error to provide better error messages
              stopAtErrors: true
            });

            const pdf = await loadingTask.promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str || '')
                .join(' ');
              fullText += pageText + '\n';
            }
            
            if (!fullText.trim()) {
              return reject(new Error('No text content found in PDF. It might be a scanned document or image-based PDF.'));
            }
            
            resolve(fullText);
          } catch (error: any) {
            console.error('PDF Parsing Error:', error);
            let errorMessage = 'Could not parse the PDF file.';
            
            if (error.name === 'PasswordException') {
              errorMessage = 'This PDF is password-protected. Please provide an unprotected version.';
            } else if (error.name === 'InvalidPDFException') {
              errorMessage = 'This file is not a valid PDF or may be corrupted.';
            } else if (error.message) {
              errorMessage = `PDF Error: ${error.message}`;
            }
            
            reject(new Error(errorMessage));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read the file. Please try again.'));
        reader.readAsArrayBuffer(file);
      } else if (fileName.endsWith('.docx') || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.onload = async (event) => {
          try {
            const mammothLib = (window as any).mammoth;
            if (!mammothLib) {
              return reject(new Error('DOCX processing library is not available. Please try again.'));
            }

            const arrayBuffer = event.target?.result as ArrayBuffer;
            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
              return reject(new Error('File is empty or could not be read.'));
            }

            const result = await mammothLib.extractRawText({ arrayBuffer });
            const text = result.value || '';
            
            if (!text.trim()) {
              return reject(new Error('No text content found in DOCX file.'));
            }
            
            resolve(text);
          } catch (err: any) {
            console.error('DOCX Parsing Error:', err);
            const errorMessage = err.message || 'Could not parse the DOCX file.';
            reject(new Error(`DOCX Error: ${errorMessage}`));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read the file. Please try again.'));
        reader.readAsArrayBuffer(file);
      } else if (fileName.endsWith('.txt') || fileType === 'text/plain') {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read the file.'));
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.'));
      }
    });
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Reading and analyzing "{file?.name}"...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <Card className="inline-block p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">Analysis Failed</h3>
            <p className="mt-2 text-red-600 dark:text-red-400 max-w-md">{error}</p>
            <Button onClick={handleReset} variant="secondary" className="mt-6">Try Again</Button>
          </Card>
        </div>
      );
    }

    if (result) {
      return (
        <div>
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Feasibility Analysis for:</p>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{file?.name}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 flex justify-center">
              <DonutChart percentage={result.feasibilityPercentage} />
            </div>
            <div className="md:col-span-2">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Analysis & Recommendations</h3>
                <MarkdownRenderer content={result.explanation} />
              </Card>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button onClick={handleReset} variant="secondary">Analyze Another Document</Button>
          </div>
        </div>
      );
    }

    return <FileUpload onFileUpload={handleFileUpload} />;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-slate-200 via-green-500 to-cyan-500 dark:from-white dark:via-green-400 dark:to-cyan-400 text-transparent bg-clip-text">Project Analytics</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload your project requirement document to receive an AI-powered feasibility analysis, complete with a score and actionable insights.
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default AnalyticsPage;