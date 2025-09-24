
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, UserRound } from 'lucide-react';

const ReportScamPage = () => {
  const [anonymousReport, setAnonymousReport] = useState('');
  const [anonymousEmail, setAnonymousEmail] = useState('');
  const [scamDescription, setScamDescription] = useState('');
  const [scamType, setScamType] = useState('');
  const [scamEmail, setScamEmail] = useState('');

  const handleAnonymousSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ anonymousReport, anonymousEmail });
    alert('Anonymous report submitted!');
  };

  const handleScamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ scamDescription, scamType, scamEmail });
    alert('Scam report submitted!');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Report a Scam or Concern</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your reports help protect the community. Choose an option below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Card className="border-border/60 hover:border-primary/80 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="text-primary" />
              Report Anonymously
            </CardTitle>
            <CardDescription>
              Submit a report without revealing your identity. Your privacy is respected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnonymousSubmit} className="space-y-4">
              <div>
                <Label htmlFor="anonymousReport" className="text-sm font-medium">Your Report</Label>
                <Textarea
                  id="anonymousReport"
                  placeholder="Describe the issue in detail..."
                  value={anonymousReport}
                  onChange={(e) => setAnonymousReport(e.target.value)}
                  required
                  className="mt-1"
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="anonymousEmail" className="text-sm font-medium">Contact Email (Optional)</Label>
                <Input
                  id="anonymousEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={anonymousEmail}
                  onChange={(e) => setAnonymousEmail(e.target.value)}
                  className="mt-1"
                />
                 <p className="text-xs text-muted-foreground mt-1">Provide an email if you'd like to receive updates.</p>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Submit Anonymously</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/80 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-primary" />
              Report a Specific Scam
            </CardTitle>
            <CardDescription>
              Provide details about a scam to help us take action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScamSubmit} className="space-y-4">
              <div>
                <Label htmlFor="scamType" className="text-sm font-medium">Type of Scam</Label>
                <Input
                  id="scamType"
                  placeholder="e.g., Phishing, Investment, Tech Support..."
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="scamDescription" className="text-sm font-medium">Scam Description</Label>
                <Textarea
                  id="scamDescription"
                  placeholder="Provide all relevant details about the scam..."
                  value={scamDescription}
                  onChange={(e) => setScamDescription(e.target.value)}
                  required
                  className="mt-1"
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="scamEmail" className="text-sm font-medium">Your Email (for updates)</Label>
                <Input
                  id="scamEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={scamEmail}
                  onChange={(e) => setScamEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">We may contact you for more information if needed.</p>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Report Scam</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportScamPage;
