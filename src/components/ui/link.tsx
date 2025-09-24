
'use client';

import React from 'react';
import NextLink, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

const Link = ({ href, ...props }: LinkProps & { children: React.ReactNode, className?: string }) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.toString() !== pathname) {
        window.dispatchEvent(new CustomEvent('routeChangeStart', { detail: href.toString() }));
    }
    
    // Let Next.js handle the navigation
    props.onClick?.(e);
  };

  React.useEffect(() => {
    // This effect will run when the page linked to has finished loading.
    // We can signal the completion of the route change here.
    window.dispatchEvent(new Event('routeChangeComplete'));
  }, [pathname]); // Depend on pathname to know when navigation is complete

  return <NextLink href={href} {...props} onClick={handleClick} />;
};

export default Link;
