'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const RedButton = () => {
  const { toast } = useToast();
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    if (isFrozen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isFrozen]);

  const handleEmergencyLogout = async () => {
    toast({
      title: "Emergency Protocols Activated",
      description: "Your session has been securely closed.",
      variant: 'destructive',
    });

    try {
      await logout();
      setTimeout(() => {
        toast({
          title: "Account Frozen",
          description: "Your account has been temporarily frozen as a security precaution. Please contact support to restore access.",
          variant: 'destructive',
        });
      }, 1000);

      setTimeout(() => {
        toast({
          title: "Admin Alert Sent",
          description: "System administrators have been notified of this emergency event.",
          variant: 'destructive',
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Could not securely log you out. Please close this browser window immediately.",
        variant: 'destructive',
      });
    }
  };

  const activateFreeze = () => {
    setIsFrozen(true);
  };

  const deactivateFreeze = () => {
    setIsFrozen(false);
  };

  const handleConfirm = () => {
    deactivateFreeze();
    handleEmergencyLogout();
  };

  return (
    <>
      <Button variant="destructive" className="flex items-center gap-2" onClick={activateFreeze}>
        <ShieldAlert className="h-4 w-4" />
        <span className="hidden sm:inline">Emergency Logout</span>
      </Button>

      {isFrozen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm backdrop-grayscale z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-6 w-6" /> Emergency Protocol
              </CardTitle>
              <CardDescription>
                You are about to activate the emergency logout sequence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This is a final security measure. By proceeding, you will be logged out, your account will be temporarily frozen, and an alert will be sent to the system administrators.
              </p>
              <p className="text-sm mt-4 font-semibold">
                Are you sure you want to proceed?
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={deactivateFreeze}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Confirm & Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default RedButton;
