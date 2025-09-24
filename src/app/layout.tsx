
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from '@/hooks/use-profile';
import PreloaderWrapper from '@/components/preloader-wrapper';
import PageLoader from '@/components/ui/page-loader';
import MouseFollower from '@/components/ui/mouse-follower';

export const metadata: Metadata = {
  title: 'Sudarshan',
  description: 'Cybersecurity and Awareness Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':
new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!=\'dataLayer\'?'&l='+l:'';j.async=true;j.src=
\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,\'script\',\'dataLayer\',\'GTM-K4DHQQ2G\');` }} />
        <link rel="icon" href="/logo.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <MouseFollower />
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K4DHQQ2G"
        height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
        <ProfileProvider>
          <PreloaderWrapper>
            {children}
            <PageLoader />
          </PreloaderWrapper>
        </ProfileProvider>
        <Toaster />
      </body>
    </html>
  );
}
