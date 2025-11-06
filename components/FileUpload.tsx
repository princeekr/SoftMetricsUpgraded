import React, { useState, useCallback } from 'react';
import Card from './Card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V8.25c0-1.12.93-2.02 2.08-1.92 1.15.1 2.08.98 2.08 2.12V17.25m-4.16 0h4.16m-4.16 0L2.25 16.5" />
    </svg>
);

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (files: FileList | null) => {
    setError('');
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name.toLowerCase();
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      
      if (allowedTypes.includes(file.type) || fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.txt')) {
        onFileUpload(file);
      } else {
        setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  }, [onFileUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  return (
    <Card className="p-8">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${isDragging ? 'border-brand-primary bg-indigo-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
      >
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={handleChange}
          accept=".pdf,.docx,.txt"
        />
        <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
        <label htmlFor="file-upload" className="mt-4 block text-sm font-medium text-slate-900 dark:text-slate-200">
          <span className="text-brand-primary cursor-pointer">Upload a file</span> or drag and drop
        </label>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, TXT up to 10MB</p>
      </div>
      {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
    </Card>
  );
};

export default FileUpload;