
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, X, Shield } from 'lucide-react';
import type { AdvancedMessage } from '@/components/advanced-chat/advanced-chat-client';

interface AnalysisPanelProps {
  selectedMessage: AdvancedMessage | null;
  onClose: () => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ selectedMessage, onClose }) => {
  if (!selectedMessage) {
    return (
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2">
            <Shield />
            Analysis Panel
           </CardTitle>
          <CardDescription>Select a message to see the AI analysis results here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-10">No message selected.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { analysis } = selectedMessage;

  if (!analysis) {
    return (
       <Card>
        <CardHeader className="flex flex-row items-start justify-between">
           <div>
            <CardTitle className="flex items-center gap-2"><Shield /> Analysis Panel</CardTitle>
            <CardDescription>AI analysis of the selected message.</CardDescription>
           </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-10">No analysis available for this message.</p>
        </CardContent>
      </Card>
    )
  }

  const getRiskLevel = (score: number): 'high' | 'medium' | 'low' => {
      if (score > 75) return 'high';
      if (score > 40) return 'medium';
      return 'low';
  }

  const riskLevel = getRiskLevel(analysis.riskScore);

  return (
    <Card className="animate-slide-in-from-right shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
           <CardTitle className="flex items-center gap-2">
            {analysis.warrantsReview ? (
                <AlertCircle className="text-destructive" />
              ) : (
                <CheckCircle className="text-primary" />
              )}
              Analysis Report
            </CardTitle>
          <CardDescription>AI-powered analysis of the message.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">Decrypted Message</h4>
          <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
            <strong>{selectedMessage.sender}:</strong> {selectedMessage.text}
          </p>
        </div>
        <Separator />
         <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Risk Score</span>
            <Badge 
              variant={riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'secondary' : 'default'}
              className={riskLevel === 'low' ? 'bg-primary/20 text-primary-foreground border-primary' : ''}
            >
              {analysis.riskScore}
            </Badge>
          </div>
         <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Threat Level</span>
            <Badge 
                variant={analysis.threatLevel === 'high' ? 'destructive' : analysis.threatLevel === 'medium' ? 'secondary' : 'default'}
                className={analysis.threatLevel === 'low' ? 'bg-primary/20 text-primary-foreground border-primary' : ''}
            >
                {analysis.threatLevel.toUpperCase()}
            </Badge>
         </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-1">Reasoning</h4>
          <p className="text-sm text-muted-foreground">{analysis.reason}</p>
        </div>
        
      </CardContent>
    </Card>
  );
};

export default AnalysisPanel;
