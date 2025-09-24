
'use client';

import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useMemo } from 'react';
import type { ThreatMessage, ThreatLevel } from '@/lib/types';
import { generateInitialMessages, generateNewMessage } from '@/lib/mock-data';
import RiskSummaryCards from '@/components/dashboard/risk-summary-cards';
import LiveActivityFeed from '@/components/dashboard/live-activity-feed';
import DetectionTrendChart from '@/components/dashboard/detection-trend-chart';
import ThreatAnalyzer from '@/components/dashboard/threat-analyzer';
import { analyzeThreatMessage, type AnalyzeThreatMessageOutput } from '@/ai/flows/analyze-threat-message';
import { useToast } from '@/hooks/use-toast';
import AIChatbotCard from '@/components/dashboard/ai-chatbot-card';
import ThreatIntelligenceMap from '@/components/dashboard/threat-intelligence-map';
import DashboardTutorial from '@/components/dashboard/DashboardTutorial';
import { Button } from '@/components/ui/button';

const DashboardPage: FC = () => {
  const [messages, setMessages] = useState<ThreatMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeThreatMessageOutput | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const initialMessages = generateInitialMessages();
    setMessages(initialMessages);

    const interval = setInterval(() => {
      setMessages(prevMessages => {
        const updatedMessages = [generateNewMessage(), ...prevMessages];
        return updatedMessages.slice(0, 50);
      });
    }, 5000);

    if (!localStorage.getItem('hasSeenTutorial')) {
      setRunTutorial(true);
      localStorage.setItem('hasSeenTutorial', 'true');
    }

    return () => clearInterval(interval);
  }, []);

  const overallRiskLevel = useMemo((): ThreatLevel => {
    if (!isClient || messages.length === 0) return 'low';
    if (messages.some(m => m.threatLevel === 'high')) return 'high';
    if (messages.some(m => m.threatLevel === 'medium')) return 'medium';
    return 'low';
  }, [messages, isClient]);

  const criticalAlert = useMemo(() => {
    if (!isClient || messages.length === 0) return undefined;
    return messages.find(m => m.threatLevel === 'high');
  }, [messages, isClient]);
  
  const stats = useMemo(() => {
    if (!isClient || messages.length === 0) return { total: 0, high: 0, medium: 0 };
    const total = messages.length;
    const high = messages.filter(m => m.threatLevel === 'high').length;
    const medium = messages.filter(m => m.threatLevel === 'medium').length;
    return { total, high, medium };
  }, [messages, isClient]);

  const handleAnalyze = async (encryptedMessage: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeThreatMessage({ encryptedMessage });
      setAnalysisResult(result);
      setIsResultOpen(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the message. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <Skeleton className="h-[450px] w-full" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[230px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardTutorial run={runTutorial} onClose={() => setRunTutorial(false)} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setRunTutorial(true)}>Help</Button>
      </div>
      <div className="risk-summary-cards">
        <RiskSummaryCards
          overallRiskLevel={overallRiskLevel}
          stats={stats}
          criticalAlert={criticalAlert}
        />
      </div>
      <div className="h-[450px] threat-intelligence-map">
        <ThreatIntelligenceMap />
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 live-activity-feed">
          <LiveActivityFeed messages={messages} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="detection-trend-chart">
            <DetectionTrendChart messages={messages} />
          </div>
          <div className="threat-analyzer">
            <ThreatAnalyzer 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing}
              analysisResult={analysisResult}
              isResultOpen={isResultOpen}
              setIsResultOpen={setIsResultOpen}
            />
          </div>
          <div className="ai-chatbot-card">
            <AIChatbotCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
