
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Preloader = () => {
  const [loadingText, setLoadingText] = useState('Initiating quantum link...');
  const texts = [
    'Establishing secure connection...',
    'Compiling neural networks...',
    'Decrypting data streams...',
    'Loading cybernetic modules...',
    'Access granted.',
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < texts.length) {
        setLoadingText(texts[index]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-primary overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <div className="scanline"></div>

      <div className="z-10 text-center">
        <div className="glitch-text text-3xl md:text-5xl font-mono font-bold mb-4" data-text="SUDARSHAN">
          SUDARSHAN
        </div>
        <p className="font-mono text-sm md:text-lg animate-pulse">{loadingText}</p>
      </div>
      
      <div className="absolute bottom-4 left-4 font-mono text-xs">
        <p>STATUS: OPERATIONAL</p>
        <p>VERSION: 2.0.1</p>
      </div>

       <div className="absolute top-4 right-4 font-mono text-xs text-right">
        <p>IP: 192.168.1.1</p>
        <p>NODE: 7.8.2</p>
      </div>

      {/* Floating objects */}
      <div className="floating-object floating-object-1"></div>
      <div className="floating-object floating-object-2"></div>
      <div className="floating-object floating-object-3"></div>
      <div className="floating-object floating-object-4"></div>
    </div>
  );
};

export default Preloader;
