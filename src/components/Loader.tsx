import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', light = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 ${
          light
            ? 'border-white/20 border-t-white'
            : 'border-indigo-200 border-t-indigo-600'
        }`}
      />
    </div>
  );
};

export default Loader;