import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/70 dark:bg-slate-800/50 shadow-xl rounded-lg backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;