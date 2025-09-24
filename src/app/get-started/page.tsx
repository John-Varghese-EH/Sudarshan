
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const GetStartedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Our Security Center</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Protect yourself and others by reporting suspicious activity. Your anonymous reports help us track and prevent scams.
        </p>
        <Button asChild size="lg">
          <Link href="/report-scam">Report a Scam</Link>
        </Button>
      </div>
    </div>
  );
};

export default GetStartedPage;
