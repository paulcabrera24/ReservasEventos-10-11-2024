import React from 'react';
import Loader from './Loader';

interface LoadingOverlayProps {
  isLoading: boolean;
  light?: boolean;
  children: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  light = false,
  children
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          light ? 'bg-black/20' : 'bg-white/80'
        } backdrop-blur-[1px] rounded-lg z-10`}
      >
        <Loader size="md" light={light} />
      </div>
    </div>
  );
};

export default LoadingOverlay;