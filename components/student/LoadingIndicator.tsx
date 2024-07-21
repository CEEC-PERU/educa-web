// components/LoadingIndicator.tsx
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
