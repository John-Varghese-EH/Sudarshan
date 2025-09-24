
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const PageLoader = () => {
  const [loading, setLoading] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) {
    return null;
  }

  return (
    <div className="page-loader">
      <div className="spinner"></div>
    </div>
  );
};

export default PageLoader;
