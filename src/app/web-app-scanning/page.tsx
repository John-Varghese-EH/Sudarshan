
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, AlertTriangle, Bot } from 'lucide-react';
import { analyzeContentWithAI } from '@/lib/ai-scanner';

// Define the structure of the report state
interface ScanReport {
  url: string;
  scanDate: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  aiAnalysis: {
    isSafe: boolean;
    reason: string;
  };
  summary: {
    vulnerabilities: number;
    technologies: string[];
  };
  vulnerabilities: {
    id: string;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    recommendation: string;
  }[];
}

const WebAppScanningPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!url) {
      setError('Please enter a URL to scan.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      // Simulate AI content analysis
      const isContentSafe = await analyzeContentWithAI(url);

      // In a real application, you would also make an API call to your backend for vulnerability scanning.
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock report data - this would be replaced with actual scan results
      const mockReport: ScanReport = {
        url: url,
        scanDate: new Date().toLocaleString(),
        riskLevel: isContentSafe ? 'Low' : 'Critical',
        aiAnalysis: {
          isSafe: isContentSafe,
          reason: isContentSafe
            ? 'AI analysis found no immediate signs of phishing or malicious content.'
            : 'AI analysis detected patterns commonly associated with phishing or malicious websites.',
        },
        summary: {
          vulnerabilities: isContentSafe ? 2 : 5,
          technologies: ['React', 'Nginx'],
        },
        vulnerabilities: isContentSafe
          ? [
              { id: 'CVE-2023-1121', severity: 'Low', description: 'Missing Security Headers', recommendation: 'Add appropriate security headers.' },
              { id: 'CVE-2023-3141', severity: 'Low', description: 'Outdated Component', recommendation: 'Update to the latest version.' },
            ]
          : [
              { id: 'CVE-2023-1234', severity: 'High', description: 'Cross-Site Scripting (XSS)', recommendation: 'Sanitize user input.' },
              { id: 'CVE-2023-5678', severity: 'Medium', description: 'SQL Injection', recommendation: 'Use parameterized queries.' },
              { id: 'CVE-2023-9101', severity: 'Medium', description: 'Insecure Direct Object References', recommendation: 'Implement proper access control.' },
              { id: 'CVE-2024-0001', severity: 'High', description: 'Potential Phishing Content Detected', recommendation: 'Review website content and scripts for malicious patterns.' },
              { id: 'CVE-2023-1121', severity: 'Low', description: 'Missing Security Headers', recommendation: 'Add appropriate security headers.' },
            ],
      };

      setReport(mockReport);
    } catch (err: any) {
      setError('An error occurred during the scan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <main>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter URL to Scan</CardTitle>
            <CardDescription>
              Enter the full URL of the web application to scan for vulnerabilities and analyze with AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleScan} disabled={isLoading}>
                {isLoading ? 'Scanning...' : 'Scan Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {report && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className={report.aiAnalysis.isSafe ? "text-green-500" : "text-red-500"} />
                Scan Report for <span className="text-primary">{report.url}</span>
              </CardTitle>
              <CardDescription>
                Scan completed on {report.scanDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="text-primary" />
                    AI Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert variant={report.aiAnalysis.isSafe ? 'default' : 'destructive'}>
                    <AlertTitle className="flex items-center gap-2">
                      {report.aiAnalysis.isSafe ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {report.aiAnalysis.isSafe ? 'Content Appears Safe' : 'Potential Threat Detected'}
                    </AlertTitle>
                    <AlertDescription>
                      {report.aiAnalysis.reason}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Existing vulnerability reporting can be displayed here */}
              {/* For brevity, we'''ll just show the AI part */}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WebAppScanningPage;
