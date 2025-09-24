
'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Shield } from 'lucide-react';

const ChatDemoCard: FC = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
            <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
            <CardTitle className="text-2xl">Live Chat Demonstration</CardTitle>
            <CardDescription className="text-base">
            See our core solution in action. This simulation demonstrates how on-device AI can detect suspicious activity in real-time without compromising end-to-end encryption.
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
         <div className="p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-semibold flex items-center gap-2 mb-2"><Shield className="text-blue-400" /> Our Vision</h4>
            <p className="text-sm text-muted-foreground">
              Our idea is to implement on-device suspicious pattern detection for encrypted platforms. This allows for reporting to higher authorities like CBI and CERT to prevent drug trafficking, without compromising user privacy or breaking encryption. For a safer India and a safer World.
            </p>
         </div>
      </CardContent>
      <CardFooter>
        <Link href="/chat-demo" passHref className="w-full">
          <Button className="w-full text-lg py-6">
            Launch Demo
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ChatDemoCard;
