
'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Key, Shield, ShieldCheck, Hash, Lock, Unlock, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as CryptoJS from 'crypto-js';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper to check if a string is potentially Base64 (not foolproof but helps for common cases)
const isValidBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch (e) {
    return false;
  }
};

const EncryptionDemoPage: React.FC = () => {
  const [text, setText] = useState('');
  const [secretKey, setSecretKey] = useState('secret-key');
  const [isError, setIsError] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleEncrypt = () => {
    if (!text) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter text to encrypt.' });
      return;
    }
    if (!secretKey) {
      toast({ variant: 'destructive', title: 'Error', description: 'A secret key is required.' });
      return;
    }
    try {
      const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
      setText(encrypted);
      setIsError(false);
      toast({ title: 'Encrypted!', description: 'The text has been encrypted using AES.' });
    } catch(e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Encryption Failed', description: 'An unexpected error occurred.' });
    }
  };

  const handleDecrypt = async () => {
    if (!text) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter text to decrypt.' });
      return;
    }
    if (!secretKey) {
      toast({ variant: 'destructive', title: 'Error', description: 'A secret key is required.' });
      return;
    }

    if (!isValidBase64(text)) {
        toast({ variant: 'destructive', title: 'Decryption Failed', description: 'Input text is not valid ciphertext (expected Base64 format).' });
        setIsError(true);
        return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(text, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
         throw new Error("Decryption resulted in an empty string. This often indicates a wrong key or corrupted data.");
      }

      setText(decrypted);
      setIsError(false);
      toast({ title: 'Decrypted!', description: 'The text has been decrypted successfully.' });

    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Decryption Failed', description: 'Invalid ciphertext or incorrect key. Please check your input and key.' });
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AES Encryption Demo</h1>
        <p className="text-muted-foreground">Demonstrating secure encryption and decryption.</p>
      </div>
      <Alert className="border-primary/50">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>AES Encryption (CBC Mode)</AlertTitle>
        <AlertDescription>
          This demo uses the industry-standard AES (Advanced Encryption Standard) for secure data protection.
          All operations are performed locally in your browser.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>AES Encryptor / Decryptor</CardTitle>
          <CardDescription>Enter text and a secret key to encrypt or decrypt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Input / Output</Label>
            <Textarea
              id="text-input"
              placeholder="Enter plaintext to encrypt, or paste AES Base64 ciphertext to decrypt."
              rows={8}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setIsError(false);
              }}
              className={isError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
             {isError && <p className="text-sm text-destructive">The current text is not valid ciphertext or the key is wrong.</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key (Password)</Label>
            <div className="relative flex items-center">
              <Key className="h-5 w-5 text-muted-foreground absolute left-3" />
              <Input
                id="secret-key"
                type={showKey ? 'text' : 'password'}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your secret key"
                className="pl-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 h-7 w-7"
                onClick={() => setShowKey(!showKey)}
                type="button"
               >
                 {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 <span className="sr-only">{showKey ? 'Hide key' : 'Show key'}</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleEncrypt} className="w-full" disabled={!secretKey.trim() || !text.trim()}>Encrypt</Button>
            <Button onClick={handleDecrypt} className="w-full" variant="secondary" disabled={!secretKey.trim() || !text.trim()}>Decrypt</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Understanding Encryption</CardTitle>
          <CardDescription>Learn about the fundamental types of data encryption.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Lock className="text-primary"/>
                  Symmetric Encryption (e.g., AES)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pl-4 border-l-2 border-primary ml-4">
                <p>
                  Symmetric encryption uses a single key to both encrypt (lock) and decrypt (unlock) data. The demo above is an example of this. Both the sender and receiver must have the same secret key.
                </p>
                <p><strong>Benefits:</strong></p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li><strong>Speed:</strong> It's very fast and efficient, making it ideal for encrypting large amounts of data, like entire files or network connections.</li>
                  <li><strong>Simplicity:</strong> The process is less complex than asymmetric encryption.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                 <div className="flex items-center gap-3">
                  <Unlock className="text-blue-400"/>
                  Asymmetric Encryption (Public-Key Cryptography)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pl-4 border-l-2 border-blue-400 ml-4">
                <p>
                  Asymmetric encryption uses a pair of keys: a public key (which can be shared with anyone) and a private key (which must be kept secret). Data encrypted with the public key can only be decrypted with the corresponding private key.
                </p>
                 <p><strong>Benefits:</strong></p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li><strong>Secure Key Exchange:</strong> It solves the problem of how to share a secret key securely. You can share your public key freely without compromising security.</li>
                  <li><strong>Digital Signatures:</strong> It's used to verify the identity of the sender and ensure that a message has not been altered.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                 <div className="flex items-center gap-3">
                  <Fingerprint className="text-yellow-400"/>
                  Hashing
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pl-4 border-l-2 border-yellow-400 ml-4">
                <p>
                  Hashing is a one-way process that converts an input of any size into a fixed-size string of text, called a "hash". You cannot reverse the process to get the original input from the hash.
                </p>
                 <p><strong>Benefits:</strong></p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li><strong>Password Storage:</strong> Websites store the hash of your password, not the password itself. When you log in, they hash what you typed and compare it to the stored hash.</li>
                  <li><strong>Data Integrity:</strong> Hashing is used to verify that a file or message has not been tampered with. If even one character changes in the input, the output hash will change completely.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncryptionDemoPage;
