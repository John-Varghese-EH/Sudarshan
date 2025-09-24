
'use client';

import { useState, useEffect } from 'react';
import Preloader from '@/components/ui/preloader';
import MainLayout from '@/components/main-layout';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Show preloader for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen">
        <div className="corner-bracket top-left"></div>
        <div className="corner-bracket top-right"></div>
        <div className="corner-bracket bottom-left"></div>
        <div className="corner-bracket bottom-right"></div>
        <Preloader />
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
