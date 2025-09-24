
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, User, ArrowRight, LockKeyhole, Wifi, WifiOff, Globe, Server, Trash2, HelpCircle, Lock, Unlock } from 'lucide-react';
import AdvancedChatClient, { AdvancedMessage } from '@/components/advanced-chat/advanced-chat-client';
import AnalysisPanel from '@/components/advanced-chat/analysis-panel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { clearChatHistory as clearOnlineChatHistory } from '@/lib/chat-store';
import { Badge } from '@/components/ui/badge';
import { useOnlineStatus } from '@/hooks/use-online-status';

const AdvancedChatDemoPage: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<AdvancedMessage | null>(null);
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOnline, setOnlineStatus] = useOnlineStatus();
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelectMessage = (message: AdvancedMessage) => {
    if (message.analysis && message.text) {
      setSelectedMessage(message);
    }
  };

  const handleClosePanel = () => {
    setSelectedMessage(null);
  };

  const handleUnlock = () => {
    if (password === 'kavach123') {
      setOnlineStatus(true);
      toast({ title: 'Success', description: "Real-time demo unlocked for this session." });
      setIsDialogOpen(false);
      setPassword('');
    } else {
      toast({ variant: 'destructive', title: 'Access Denied', description: "Incorrect password." });
    }
  };

  const handleLock = () => {
    setOnlineStatus(false);
    toast({ title: 'Demo Locked', description: 'Chat is back in local-only mode.' });
  };

  const handleClearOnlineHistory = async () => {
     try {
        await clearOnlineChatHistory();
        toast({ title: 'Online History Cleared', description: 'All messages in the real-time demo have been deleted.' });
     } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not clear online chat history.' });
        console.error(error);
     }
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Chat Demo</h1>
        <p className="text-muted-foreground">Demonstrating on-device analysis without breaking end-to-end encryption.</p>
      </div>

      <Alert className="border-blue-500/50 bg-blue-500/10 text-foreground">
        <HelpCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-400">How To Use This Demo</AlertTitle>
        <AlertDescription>
           <ul className="list-disc list-outside pl-5 space-y-2 mt-2">
              <li>
                <strong>Our Vision:</strong> Our idea is to implement on-device suspicious pattern detection for encrypted platforms. This allows for reporting to authorities without compromising user privacy or breaking encryption.
              </li>
              <li>
                <strong>Chat Clients:</strong> Open Rahul's and Ram's chats. They can be in different tabs to simulate a real conversation.
              </li>
              <li>
                <strong>Local Mode (Default):</strong> By default, chats are stored locally in your browser. They won't sync across devices.
              </li>
              <li>
                <strong>Real-time Mode:</strong> Use the "Unlock Real-time Demo" card and enter the password to switch to a live, multi-device chat experience. All open chat windows will sync automatically.
              </li>
               <li>
                <strong>Flagged Messages View:</strong> This centralized view shows only messages that the AI has flagged as suspicious. Click any message to see the detailed analysis.
              </li>
           </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/chat-demo/rahul" target="_blank" rel="noopener noreferrer" className="block h-full">
          <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="text-primary" />Rahul's Chat</CardTitle>
              <CardDescription>Open Rahul's perspective. Best viewed in a separate tab or device.</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full">Open Rahul's Chat <ArrowRight className="ml-2" /></Button>
            </CardContent>
          </Card>
        </Link>
        <Link href="/chat-demo/ram" target="_blank" rel="noopener noreferrer" className="block h-full">
          <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="text-blue-500" />Ram's Chat</CardTitle>
              <CardDescription>Open Ram's perspective. Best viewed in a separate tab or device.</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="secondary" className="w-full">Open Ram's Chat <ArrowRight className="ml-2" /></Button>
            </CardContent>
          </Card>
        </Link>
        
        {isOnline ? (
          <Card className="bg-muted/20 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400"><Lock className="text-green-500" />Real-time Demo Active</CardTitle>
              <CardDescription>Return to local-only mode and stop syncing between devices.</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button onClick={handleLock} variant="secondary" className="w-full">Lock Demo</Button>
            </CardContent>
          </Card>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive"><Unlock />Unlock Real-time Demo</CardTitle>
                  <CardDescription>Enable multi-device, real-time chat with a password.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button variant="destructive" className="w-full">Unlock Demo</Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unlock Real-time Demo</DialogTitle>
                <DialogDescription>
                  Enter the secret password to switch all chat clients to real-time online mode for this browser session.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password-input" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password-input"
                    type="password"
                    className="col-span-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUnlock}>Unlock</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle>Flagged Messages View</CardTitle>
                  <CardDescription>This is a centralized view of the conversation showing only AI-flagged messages. Click a message to view analysis.</CardDescription>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-center">
                 <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-500/20 text-green-300 border-green-400' : ''}>
                    {isOnline ? <Wifi className="mr-2 h-4 w-4"/> : <WifiOff className="mr-2 h-4 w-4"/>}
                    {isOnline ? 'Real-time Mode' : 'Local Mode'}
                  </Badge>
                  {isOnline && (
                     <Button onClick={handleClearOnlineHistory} variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/>Clear History</Button>
                  )}
                </div>
             </div>
          </CardHeader>
          <CardContent>
            <AdvancedChatClient currentUser="Observer" onSelectMessage={handleSelectMessage} filterFlagged={true} />
          </CardContent>
        </Card>

        <div className="sticky top-20">
          <AnalysisPanel selectedMessage={selectedMessage} onClose={handleClosePanel} />
        </div>
      </div>

    </div>
  );
};

export default AdvancedChatDemoPage;
