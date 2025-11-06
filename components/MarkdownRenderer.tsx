import React from 'react';

/**
 * A simple component to render basic markdown content into styled React elements.
 * It supports headers (#, ##, ###), lists (* or -), and bold text (**text**).
 */
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const parseInlineFormatting = (text: string) => {
    // Splits the text by the bold markdown (**text**) and returns an array of nodes.
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      // Every odd-indexed part is the content inside the asterisks.
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-slate-900 dark:text-white">{part}</strong>;
      }
      return part;
    });
  };

  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4 text-slate-600 dark:text-slate-300">
          {listItems.map((item, index) => (
            <li key={index}>{parseInlineFormatting(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  content.split('\n').forEach((line, index) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">{parseInlineFormatting(line.substring(2))}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-bold mt-5 mb-2 text-slate-800 dark:text-slate-100">{parseInlineFormatting(line.substring(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-bold mt-4 mb-2 text-slate-700 dark:text-slate-200">{parseInlineFormatting(line.substring(4))}</h3>);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      listItems.push(line.substring(2));
    } else if (line.trim() === '') {
      // An empty line could separate paragraphs or end a list.
      flushList();
    } else {
      flushList();
      elements.push(<p key={index} className="my-3 text-slate-600 dark:text-slate-300 leading-relaxed">{parseInlineFormatting(line)}</p>);
    }
  });

  flushList(); // Add any remaining list items at the end of the content.

  return <div className="prose prose-sm dark:prose-invert max-w-none">{elements}</div>;
};

export default MarkdownRenderer;
