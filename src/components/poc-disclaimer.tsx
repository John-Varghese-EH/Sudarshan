
'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import Image from 'next/image';

const PocDisclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const hasSeenDisclaimer = sessionStorage.getItem('hasSeenPocDisclaimer');
      if (!hasSeenDisclaimer) {
        setIsOpen(true);
      }
    }
  }, [isClient]);

  const handleAcknowledge = () => {
    sessionStorage.setItem('hasSeenPocDisclaimer', 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <Image src="/logo.jpeg" alt="Sudarshan Logo" width={80} height={80} className="mb-4 rounded-full" />
          <AlertDialogTitle>Work in Progress (Proof of Concept)</AlertDialogTitle>
          <AlertDialogDescription>
            Welcome to Sudarshan, a project from <strong>MyStic Squad</strong>! Please be aware that this application is currently a
            Proof of Concept (PoC). Features are for demonstration purposes only and may not be fully functional or stable.
            Your feedback is valuable as we continue to develop and improve the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={handleAcknowledge} className="w-full">Acknowledge & Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PocDisclaimer;
