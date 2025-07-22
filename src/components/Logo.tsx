import React from 'react';

export function DezSaudeLogo({ size = 'md', showPartnership = false }: { size?: 'sm' | 'md' | 'lg', showPartnership?: boolean }) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12', 
    lg: 'h-16'
  };

  if (showPartnership) {
    return (
      <div className="flex items-center space-x-4">
        {/* Logo Droga Leste */}
        <div className="flex items-center">
          <img 
            src="https://i.postimg.cc/Px3ncGZ9/drogalest.png" 
            alt="Droga Leste" 
            className={`${sizeClasses[size]} w-auto`}
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }}
          />
        </div>
        
        {/* Separador de parceria */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-600">+</span>
          <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
        </div>
        
        {/* Logo Dez Saúde */}
        <div className="flex items-center">
          <img 
            src="https://i.postimg.cc/8cKTg4pt/Imagem-do-Whats-App-de-2025-07-16-s-16-46-12-0b81ecf9.jpg" 
            alt="Dez Saúde - Emergências Médicas" 
            className={`${sizeClasses[size]} w-auto`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <img 
        src="https://i.postimg.cc/8cKTg4pt/Imagem-do-Whats-App-de-2025-07-16-s-16-46-12-0b81ecf9.jpg" 
        alt="Dez Saúde - Emergências Médicas" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
}