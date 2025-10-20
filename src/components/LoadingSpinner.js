import React from 'react';

const LoadingSpinner = ({ message = "Generando documento..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 flex flex-col items-center space-y-4 max-w-sm">
        {/* Spinner animado */}
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full animate-spin">
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Mensaje */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Por favor espera...
          </p>
        </div>

        {/* Puntos animados */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
