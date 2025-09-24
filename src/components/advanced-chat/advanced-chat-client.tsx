
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, AlertTriangle, ShieldCheck, Key, RefreshCw, Trash2, Lock, Eye, EyeOff, Save, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeThreatMessage, type AnalyzeThreatMessageOutput } from '@/ai/flows/analyze-threat-message';
import * as CryptoJS from 'crypto-js';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { listenForMessages, sendMessage, clearLocalChatHistory, clearChatHistory as clearOnlineChatHistory } from '@/lib/chat-store';
import type { Unsubscribe } from 'firebase/firestore';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';


type ChatUser = 'Rahul' | 'Ram' | 'Observer';

export type AdvancedMessage = {
  id: string;
  sender: ChatUser;
  text?: string; // Plaintext, only available on the sending client before encryption or after decryption
  encryptedText: string;
  timestamp: string;
  analysis?: AnalyzeThreatMessageOutput | null;
};

interface AdvancedChatClientProps {
  currentUser: ChatUser;
  onSelectMessage?: (message: AdvancedMessage) => void;
  filterFlagged?: boolean;
}

const SECRET_KEY_STORAGE = 'chatSecretKey';
const DEFAULT_SECRET_KEY = 'MySecretKey';

const AdvancedChatClient: React.FC<AdvancedChatClientProps> = ({ currentUser, onSelectMessage, filterFlagged = false }) => {
  const [messages, setMessages] = useState<AdvancedMessage[]>([]);
  const [input, setInput] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  
  const [isOnline, setOnlineStatus] = useOnlineStatus();

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isObserver = currentUser === 'Observer';

  useEffect(() => {
    setIsClient(true);
    try {
        const savedKey = localStorage.getItem(SECRET_KEY_STORAGE);
        setSecretKey(savedKey || DEFAULT_SECRET_KEY);
    } catch(e) { console.error('Failed to load secret key from localStorage', e)}
  }, []);

  const decryptMessage = useCallback((encryptedText: string, key: string): string => {
    if (!key) return '*** INVALID KEY ***';
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || (isObserver ? '*** DECRYPTION FAILED ***' : '*** DECRYPTION FAILED (WRONG KEY?) ***');
    } catch (e) {
      return '*** DECRYPTION FAILED ***';
    }
  }, [isObserver]);

  const encryptMessage = useCallback((text: string, key: string): string => {
    if (!key) return text;
    return CryptoJS.AES.encrypt(text, key).toString();
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    let unsubscribe: Unsubscribe | null = null;
    
    if (isOnline) {
      setMessages([]);
      unsubscribe = listenForMessages(setMessages);
    } else {
      try {
          const savedMessages = localStorage.getItem('advancedChatMessages');
          setMessages(savedMessages ? JSON.parse(savedMessages) : []);
      } catch (e) {
          console.error("Failed to parse local messages", e);
          setMessages([]);
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isOnline, isClient]);

  useEffect(() => {
    if (isClient && !isOnline) {
      localStorage.setItem('advancedChatMessages', JSON.stringify(messages));
    }
  }, [messages, isClient, isOnline]);

  useEffect(() => {
    if (!isClient) return;
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === SECRET_KEY_STORAGE && e.newValue) {
            setSecretKey(e.newValue);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isClient]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('div:first-child');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const displayedMessages = useMemo(() => {
    const decrypted = messages.map(msg => ({
      ...msg,
      text: decryptMessage(msg.encryptedText, secretKey),
    }));

    if (filterFlagged) {
      return decrypted.filter(msg => msg.analysis?.warrantsReview);
    }
    return decrypted;
  }, [messages, filterFlagged, secretKey, decryptMessage]);
  
  const handleUnlock = () => {
    if (password === 'kavach123') {
      setOnlineStatus(true);
      toast({ title: 'Success', description: "Real-time demo unlocked for this session." });
      setIsUnlockDialogOpen(false);
      setPassword('');
    } else {
      toast({ variant: 'destructive', title: 'Access Denied', description: "Incorrect password." });
    }
  };

  const handleLock = () => {
    setOnlineStatus(false);
    toast({ title: 'Demo Locked', description: 'Chat is back in local-only mode.' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isSending || isObserver) return;
    
    setIsSending(true);
    const plaintext = input;
    setInput('');

    try {
      const analysisResult = await analyzeThreatMessage({ 
        encryptedMessage: plaintext, 
      });

      const encryptedText = encryptMessage(plaintext, secretKey);
      
      const newMessage: AdvancedMessage = {
        id: new Date().toISOString() + Math.random(),
        sender: currentUser,
        encryptedText: encryptedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: analysisResult,
      };
      
      if (isOnline) {
        await sendMessage(newMessage);
      } else {
        setMessages(prev => [...prev, newMessage]);
      }

    } catch (error) {
      console.error("Failed to analyze or send message:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.' });
      setInput(plaintext); // Restore input on failure
    } finally {
      setIsSending(false);
    }
  };
  
  const handleClearHistory = () => {
    if(isOnline) {
      clearOnlineChatHistory();
      toast({title: 'Online Chat History Cleared'});
    } else {
      clearLocalChatHistory();
      setMessages([]);
      toast({title: 'Local Chat History Cleared'});
    }
  }

  const handleSaveKey = () => {
    if (isClient) {
        localStorage.setItem(SECRET_KEY_STORAGE, secretKey);
        window.dispatchEvent(new StorageEvent('storage', {key: SECRET_KEY_STORAGE, newValue: secretKey}));
        toast({title: "Secret Key Saved", description: "The new key will be used for all chats in this browser."});
    }
  };

  const getAvatarColor = (sender: ChatUser) => {
    if(sender === 'Rahul') return 'bg-primary text-primary-foreground';
    if(sender === 'Ram') return 'bg-blue-600 text-white';
    return 'bg-muted';
  }
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
       {isObserver && (
         <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
             <div className="flex flex-col md:flex-row gap-4 items-center">
                 <div className="flex-1 space-y-2">
                    <Label htmlFor="secretKey">AES Secret Key</Label>
                    <div className="flex gap-2">
                        <Input id="secretKey" type={showKey ? 'text' : 'password'} value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="font-mono"/>
                         <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>{showKey ? <EyeOff/> : <Eye/>}</Button>
                    </div>
                </div>
                 <div className="flex-1 space-y-2 self-end">
                     <Label className="opacity-0 hidden md:inline-block">Actions</Label>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setSecretKey(DEFAULT_SECRET_KEY); }} className="w-full">
                           <RefreshCw className="mr-2 h-4 w-4"/> Reset Key
                        </Button>
                        <Button variant="destructive" onClick={handleClearHistory} className="w-full">
                           <Trash2 className="mr-2 h-4 w-4"/> Clear History
                        </Button>
                     </div>
                 </div>
             </div>
          </CardContent>
        </Card>
      )}

      <div className={cn("flex-1 border rounded-lg flex flex-col", isObserver ? 'h-[500px]' : 'h-full')}>
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex items-end gap-2', msg.sender === currentUser && !isObserver ? 'justify-end' : 'justify-start')}
                onClick={() => onSelectMessage?.(msg)}
              >
                {msg.sender !== currentUser && !isObserver && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getAvatarColor(msg.sender)}>{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(`max-w-[70%] p-3 rounded-lg`,
                  msg.sender === currentUser && !isObserver ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none',
                  onSelectMessage && 'cursor-pointer hover:bg-opacity-80'
                )}>
                  {isObserver && <div className="font-bold text-xs mb-1">{msg.sender}</div>}
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs font-mono break-all mt-2 opacity-50">{msg.encryptedText}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
                      {msg.analysis?.warrantsReview ? (
                          <Badge variant="destructive" className="gap-1 p-1 h-5"><AlertTriangle className="h-3 w-3"/> Flagged</Badge>
                      ) : (
                          <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-300 border-green-500/50 p-1 h-5"><ShieldCheck className="h-3 w-3"/> Safe</Badge>
                      )}
                      <span>{msg.timestamp}</span>
                      <Lock className="h-3 w-3" />
                  </div>
                </div>

                {msg.sender === currentUser && !isObserver && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getAvatarColor(msg.sender)}>{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {displayedMessages.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                <p>No messages yet.</p>
                {isObserver && <p className="text-xs">Send a message as Rahul or Ram to see it here if it gets flagged.</p>}
                 {!isObserver && !isOnline && <p className="text-xs mt-1">Chat is in local mode.</p>}
                 {!isObserver && isOnline && <p className="text-xs mt-1">Chat is in real-time mode.</p>}
              </div>
            )}
          </div>
        </ScrollArea>
        {!isObserver && (
          <div className="p-4 border-t bg-background/90">
             <div className="flex items-center justify-between mb-2">
                 <Label htmlFor="secretKey" className="text-xs">AES Secret Key</Label>
                 <Dialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
                    <Badge 
                        variant={isOnline ? 'default' : 'secondary'} 
                        className={cn('transition-colors cursor-pointer', isOnline ? 'bg-green-500/20 text-green-300 border-green-400' : '')}
                        onClick={() => isOnline ? handleLock() : setIsUnlockDialogOpen(true)}
                    >
                        {isOnline ? <Wifi className="mr-1 h-3 w-3"/> : <WifiOff className="mr-1 h-3 w-3"/>}
                        {isOnline ? 'Real-time (Click to Lock)' : 'Local (Click to Unlock)'}
                    </Badge>
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
             </div>
             <div className="flex items-center gap-2">
                <Input id="secretKey" type={showKey ? 'text' : 'password'} value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="font-mono text-xs h-8"/>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowKey(!showKey)}>{showKey ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</Button>
                <Button variant="outline" size="sm" className="h-8" onClick={handleSaveKey}><Save className="mr-2 h-4 w-4"/> Save</Button>
             </div>
             <div className="flex items-center gap-2 mt-4">
                <Input placeholder={`Say something as ${currentUser}...`} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isSending}/>
                <Button onClick={handleSendMessage} disabled={isSending || !input.trim()}><Send className="h-4 w-4" /></Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedChatClient;
