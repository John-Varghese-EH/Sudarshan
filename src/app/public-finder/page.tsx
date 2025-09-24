
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, RotateCcw, Copy, Loader2, Search, Globe, Wand2, FileText, Eraser, Fingerprint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeWebText, AnalyzeWebTextOutput, AnalyzeWebTextInput } from '@/ai/flows/analyze-web-text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ScanKeyword } from '@/lib/keyword-service';
import { proxyFetch } from '@/ai/flows/proxy-fetch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ScanResult = AnalyzeWebTextOutput & {
  id: string;
  source: { type: 'text' | 'url', value: string };
  timestamp: string;
  keywords: ScanKeyword[];
  analyzedContent: string;
};

const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-400/30 text-yellow-300 rounded-sm px-1 py-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const HighlightedContent = ({ text, keywords }: { text: string; keywords: string[] }) => {
    if (keywords.length === 0) {
        return <p className="whitespace-pre-wrap">{text}</p>;
    }

    const regex = new RegExp(`(${keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <p className="whitespace-pre-wrap">
            {parts.map((part, i) =>
                keywords.some(kw => new RegExp(`^${kw}$`, 'i').test(part)) ? (
                    <mark key={i} className="bg-yellow-400/30 text-yellow-300 rounded-sm px-1 py-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </p>
    );
};


const PublicFinderPage: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [aiContentInput, setAiContentInput] = useState('');
  const [aiContentResult, setAiContentResult] = useState<any>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [customKeywords, setCustomKeywords] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        const savedHistory = localStorage.getItem('publicFinderHistoryV3');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Failed to parse history from localStorage', error);
      }
    }
  }, [hydrated]);

  const saveHistory = (newHistory: ScanResult[]) => {
    setHistory(newHistory);
    if(hydrated) {
       try {
        localStorage.setItem('publicFinderHistoryV3', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save history to localStorage', error);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const keywordsFromFile = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        setCustomKeywords(prev => {
          const existing = prev.split('\n').map(k => k.trim()).filter(Boolean);
          const combined = [...new Set([...existing, ...keywordsFromFile])];
          return combined.join('\n');
        });
        toast({ title: 'File Loaded', description: `${keywordsFromFile.length} keywords loaded and added.` });
      };
      reader.readAsText(file);
    } else if (file) {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a .txt file.' });
    }
  };
  
  const handleExtractKeywords = async () => {
    if (!textInput.trim()) {
        toast({ variant: 'destructive', title: 'No Text', description: 'Please provide text in the input box to extract keywords from.' });
        return;
    }
    setIsExtracting(true);
    try {
        // Mocking AI extraction locally for now
        const words = textInput.toLowerCase().match(/\b(\w+)\b/g) || [];
        const freqMap: {[key: string]: number} = {};
        words.forEach(word => {
            if (word.length > 4) { // simple filter for more meaningful words
               freqMap[word] = (freqMap[word] || 0) + 1;
            }
        });
        const sortedKeywords = Object.keys(freqMap).sort((a,b) => freqMap[b] - freqMap[a]);
        const newKeywords = sortedKeywords.slice(0, 10);

        setCustomKeywords(prev => {
            const existing = prev.split('\n').map(k => k.trim()).filter(Boolean);
            const combined = [...new Set([...existing, ...newKeywords])];
            return combined.join('\n');
        });
        toast({ title: 'Keywords Suggested', description: `${newKeywords.length} new keywords suggested.` });
    } catch (error) {
        console.error("Keyword extraction error:", error);
        toast({ variant: 'destructive', title: 'Extraction Failed', description: 'Could not extract keywords from the text.' });
    } finally {
        setIsExtracting(false);
    }
  }

  const handleFetchSource = async () => {
    let urlToFetch = urlInput.trim();
    if (!urlToFetch) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a URL to fetch.' });
      return;
    }

    // Prepend https:// if no protocol is specified
    if (!/^https?:\/\//i.test(urlToFetch)) {
        urlToFetch = 'https://' + urlToFetch;
        setUrlInput(urlToFetch);
    }

    setIsFetching(true);
    try {
      const result = await proxyFetch({ url: urlToFetch });

      if (result.error) {
        throw new Error(result.error);
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(result.content, 'text/html');
      const bodyText = doc.body.innerText || 'Could not extract readable text from the URL.';
      
      setTextInput(bodyText);
      setResult(null); // Clear previous results
      toast({ title: "Source Fetched", description: `Successfully fetched content from ${urlToFetch}`});
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({ variant: 'destructive', title: 'Fetch Failed', description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsFetching(false);
    }
  }


  const getKeywordsForAnalysis = async (): Promise<ScanKeyword[]> => {
    const customKeywordList = customKeywords.split('\n').map(k => k.trim()).filter(Boolean);
    if (customKeywordList.length === 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter or extract some keywords before analyzing.' });
        throw new Error('No custom keywords');
    }
    return customKeywordList.map(word => ({ word, weight: 10, category: 'Custom' }));
  }

  const handleAnalyze = async () => {
    if (!textInput.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter text or fetch URL source to analyze.' });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
        const keywords = await getKeywordsForAnalysis();
        const input: AnalyzeWebTextInput = {
            scanKeywords: keywords,
            text: textInput
        };

        const analysisResult = await analyzeWebText(input);

        const newResult: ScanResult = {
            id: new Date().toISOString(),
            ...analysisResult,
            source: { 
                type: urlInput ? 'url' : 'text', 
                value: urlInput || textInput.substring(0, 100) + '...',
            },
            timestamp: new Date().toLocaleString(),
            keywords: keywords,
            analyzedContent: textInput
        };
        setResult(newResult);

        const updatedHistory = [newResult, ...history].slice(0, 5);
        saveHistory(updatedHistory);

    } catch (error: any) {
        if (error.message !== 'No custom keywords') {
             console.error("Analysis error:", error);
             toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze the input.' });
        }
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleAiContentCheck = async () => {
    if (!aiContentInput.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter text to analyze.' });
      return;
    }

    setIsAnalyzingAi(true);
    setAiContentResult(null);

    try {
        // Mocked response for AI content detection
        const mockResponse = {
            isAiGenerated: Math.random() > 0.5,
            confidence: Math.random(),
            tool: 'Google SynthID'
        };

        setTimeout(() => {
            setAiContentResult(mockResponse);
            setIsAnalyzingAi(false);
        }, 1500);

    } catch (error: any) {
        console.error("AI Content analysis error:", error);
        toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze the AI content.' });
        setIsAnalyzingAi(false);
    }
  };
  
  const exportData = (format: 'csv' | 'json') => {
    if (!result) return;
    let dataStr: string;
    let fileName: string;

    if (format === 'json') {
      dataStr = JSON.stringify(result.detectedKeywords, null, 2);
      fileName = 'keywords.json';
    } else {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Keyword,Category,Weight,Count\n";
      result.detectedKeywords.forEach(row => {
        csvContent += `${row.word},${row.category},${row.weight},${row.count}\n`;
      });
      dataStr = encodeURI(csvContent);
      fileName = 'keywords.csv';
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = format === 'json' ? 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr) : dataStr;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({ title: 'Exported', description: `Results exported as ${fileName}`});
  };

  const loadFromHistory = (item: ScanResult) => {
    if(item.source.type === 'url') {
      setUrlInput(item.source.value);
    } else {
      setUrlInput('');
    }
    setTextInput(item.analyzedContent);
    setCustomKeywords(item.keywords.map(k => k.word).join('\n'));
    setResult(item);
  };
  
  const clearHistory = () => {
    saveHistory([]);
    toast({ title: 'History Cleared'});
  }
  
  const clearInputs = () => {
    setTextInput('');
    setUrlInput('');
    setCustomKeywords('');
    setResult(null);
    toast({ title: 'Inputs Cleared'});
  }

  if (!hydrated) {
    return null; // or a loading skeleton
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
       <div>
        <h1 className="text-3xl font-bold">Public Finder</h1>
        <p className="text-muted-foreground">Analyze text or websites for suspicious keywords and assess risk.</p>
      </div>
      <Tabs defaultValue="ai-content-detector">
          <TabsList>
            <TabsTrigger value="keyword-analysis">Keyword Analysis</TabsTrigger>
            <TabsTrigger value="ai-content-detector">AI Content Detector</TabsTrigger>
          </TabsList>
          <TabsContent value="keyword-analysis">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="lg:col-span-1 space-y-6">
                {/* Inputs Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Analysis Input</CardTitle>
                        <CardDescription>Provide a URL or paste text to analyze.</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearInputs} aria-label="Clear Inputs">
                          <Eraser className="h-4 w-4" />
                      </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url-input">Website URL</Label>
                      <div className="flex gap-2">
                        <Input 
                            id="url-input"
                            placeholder="https://example.com"
                            value={urlInput}
                            onChange={e => {
                              setUrlInput(e.target.value);
                              setTextInput('');
                              setResult(null);
                            }}
                        />
                        <Button onClick={handleFetchSource} disabled={isFetching || !urlInput.trim()} variant="secondary">
                          {isFetching ? <Loader2 className="animate-spin" /> : 'Fetch'}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="text-input">Text / Page Source</Label>
                      {result ? (
                          <ScrollArea className="h-48 rounded-md border bg-muted/30 p-3">
                              <HighlightedContent text={textInput} keywords={result.detectedKeywords.map(k => k.word)} />
                          </ScrollArea>
                      ) : (
                          <Textarea
                              id="text-input"
                              placeholder="Page source will appear here after fetching, or you can paste any text to analyze."
                              rows={8}
                              value={textInput}
                              onChange={e => {
                                  setTextInput(e.target.value);
                                  setUrlInput('');
                              }}
                          />
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Keywords Card */}
                <Card>
                  <CardHeader>
                      <CardTitle>Keyword Configuration</CardTitle>
                      <CardDescription>Use AI to suggest keywords, or add them manually.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <Button onClick={handleExtractKeywords} disabled={isExtracting || !textInput.trim()} className="w-full">
                        {isExtracting ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        {isExtracting ? 'Suggesting...' : 'Suggest Keywords with AI'}
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="custom-keywords">Custom Keywords (one per line)</Label>
                        <Textarea
                          id="custom-keywords"
                          placeholder="e.g., untraceable\ndarknet\ncrypto"
                          rows={6}
                          value={customKeywords}
                          onChange={(e) => setCustomKeywords(e.target.value)}
                        />
                      </div>
                      <div>
                          <Label htmlFor="keyword-file" className="text-sm text-muted-foreground">Or load from local file:</Label>
                          <Input
                              id="keyword-file"
                              type="file"
                              accept=".txt"
                              onChange={handleFileChange}
                              className="mt-1"
                          />
                      </div>
                  </CardContent>
                </Card>
                
                <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg" className="w-full">
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
                </Button>

              </div>
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle>Analysis Results</CardTitle>
                      <CardDescription>Detected keywords and overall risk level.</CardDescription>
                    </div>
                    {result && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => exportData('csv')}>Export CSV</Button>
                            <Button variant="outline" size="sm" onClick={() => exportData('json')}>Export JSON</Button>
                        </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {result && (
                      <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Risk Level</p>
                                <p className={`text-2xl font-bold ${
                                  result.riskLevel === 'high' ? 'text-destructive' :
                                  result.riskLevel === 'medium' ? 'text-yellow-400' : 'text-primary'
                                }`}>{result.riskLevel.toUpperCase()}</p>
                              </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Occurrences</p>
                                <p className="text-2xl font-bold">{result.totalOccurrences}</p>
                              </div>
                          </div>
                        
                        {result.detectedKeywords.length > 0 ? (
                          <ScrollArea className="h-[30rem] pr-4">
                            <Accordion type="single" collapsible className="w-full">
                              {result.detectedKeywords.map(kw => (
                                <AccordionItem value={kw.word} key={kw.word}>
                                  <AccordionTrigger>
                                    <div className="flex justify-between items-center w-full pr-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">{kw.word}</span>
                                        <Badge variant="secondary">{kw.category}</Badge>
                                      </div>
                                      <Badge variant="outline">Found {kw.count} times</Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="space-y-2 bg-muted/30 p-3 rounded-md max-h-48 overflow-y-auto">
                                      {kw.context.map((c, i) => (
                                        <li key={i} className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                                          <HighlightedText text={c} highlight={kw.word} />
                                        </li>
                                      ))}
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </ScrollArea>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">No suspicious keywords found in the text.</p>
                        )}
                      </div>
                    )}
                    {!result && !isAnalyzing && <p className="text-center text-muted-foreground py-10">Analysis results will appear here.</p>}
                    {isAnalyzing && <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin text-primary" /><p className="ml-2 text-muted-foreground">Analyzing... please wait.</p></div>}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center">
                      <div>
                          <CardTitle>History</CardTitle>
                          <CardDescription>Your last 5 analyses.</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearHistory} disabled={history.length === 0} aria-label="Clear History">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </CardHeader>
                  <CardContent>
                      {history.length > 0 ? (
                          <div className="space-y-2">
                              {history.map(item => (
                                  <div key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                      <div className="truncate flex-1 mr-4">
                                          <p className="text-sm font-medium truncate flex items-center gap-2">
                                            {item.source.type === 'url' ? <Globe className="h-4 w-4 text-muted-foreground" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                                            {item.source.value}
                                          </p>
                                          <p className="text-xs text-muted-foreground">{item.timestamp} - {item.detectedKeywords.length} keywords</p>
                                      </div>
                                      <div className="flex gap-2">
                                          <Button variant="outline" size="sm" onClick={() => loadFromHistory(item)}>
                                              <RotateCcw className="h-3 w-3 mr-1" />
                                              Load
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => {
                                              navigator.clipboard.writeText(JSON.stringify(item, null, 2));
                                              toast({title: 'Copied to clipboard'});
                                          }}>
                                              <Copy className="h-3 w-3 mr-1" />
                                              Copy
                                          </Button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <p className="text-center text-sm text-muted-foreground py-4">No history yet.</p>
                      )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="ai-content-detector">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Content Detector</CardTitle>
                    <CardDescription>Analyze text or upload an image/audio/video to detect AI-generated content.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Paste text here to analyze for AI generation..."
                      rows={10}
                      value={aiContentInput}
                      onChange={(e) => setAiContentInput(e.target.value)}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="ai-image-input">Or upload image/video/audio (soon)</Label>
                        <Input id="ai-image-input" type="file" disabled />
                    </div>
                    <Button onClick={handleAiContentCheck} disabled={isAnalyzingAi} className="w-full">
                      {isAnalyzingAi ? <Loader2 className="animate-spin" /> : <Fingerprint />}
                      {isAnalyzingAi ? 'Analyzing...' : 'Analyze for AI Content'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis Result</CardTitle>
                      <CardDescription>The result of the AI content analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {aiContentResult && (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg ${aiContentResult.isAiGenerated ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                            <p className="text-lg font-bold">{aiContentResult.isAiGenerated ? 'Likely AI Generated' : 'Likely Human Generated'}</p>
                            <p className="text-sm text-muted-foreground">Confidence: {Math.round(aiContentResult.confidence * 100)}%</p>
                          </div>
                          {aiContentResult.isAiGenerated && (
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Potential Tool Detected</p>
                                <p className="text-lg font-bold">{aiContentResult.tool}</p>
                              </div>
                          )}
                        </div>
                      )}
                      {!aiContentResult && !isAnalyzingAi && <p className="text-center text-muted-foreground py-10">AI analysis results will appear here.</p>}
                      {isAnalyzingAi && <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin text-primary" /><p className="ml-2 text-muted-foreground">Analyzing... please wait.</p></div>}
                    </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicFinderPage;
