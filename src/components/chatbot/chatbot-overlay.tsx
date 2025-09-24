
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cyberAwarenessChatbot } from '@/ai/flows/cyber-awareness-chatbot';
import { cn } from '@/lib/utils';

const FAQ_QUESTIONS = [
    "What is phishing and how can I protect myself?",
    "How can I create a strong password?",
    "What are the signs of a cyberattack?",
    "How can I secure my home network?",
];

const FaqItem: React.FC<{question: string, onQuestionClick: (q:string) => void}> = ({ question, onQuestionClick }) => (
    <Button variant="outline" size="sm" className="h-auto whitespace-normal" onClick={() => onQuestionClick(question)}>
        {question}
    </Button>
)

const ChatbotOverlay = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('div:first-child > div:first-child');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || input;
        if (!textToSend.trim()) return;

        const newMessages = [...messages, { text: textToSend, sender: 'user' as const }];
        setMessages(newMessages);
        if (!messageText) {
            setInput('');
        }
        setIsLoading(true);

        try {
            const result = await cyberAwarenessChatbot({ message: textToSend });
            setMessages(currentMessages => [...currentMessages, { text: result.response, sender: 'bot' }]);
        } catch (error) {
            console.error("Chatbot API error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not get a response. Please try again.",
            });
            setMessages(messages);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
            </Button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50">
                    <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl animate-slide-in-from-right">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="text-primary" />
                                AI Cyber Awareness Chatbot
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                                <div className="flex flex-col space-y-4">
                                     {messages.length === 0 && (
                                        <div className="flex items-start gap-3 justify-start">
                                            <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                                                <Bot size={20} />
                                            </Avatar>
                                            <div className="p-3 rounded-lg max-w-[80%] bg-muted rounded-bl-none">
                                                <p className="text-sm whitespace-pre-wrap font-medium">Hello! Ask me a question or try one of the suggestions below.</p>
                                                <div className="grid grid-cols-1 gap-2 mt-4">
                                                     {FAQ_QUESTIONS.map(q => <FaqItem key={q} question={q} onQuestionClick={() => handleSendMessage(q)} />)}
                                                </div>
                                            </div>
                                    </div>
                                    )}
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={cn("flex items-start gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                                        >
                                            {msg.sender === 'bot' && (
                                                <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                                                    <Bot size={20} />
                                                </Avatar>
                                            )}
                                            <div className={cn("p-3 rounded-lg max-w-[85%]", msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                            </div>
                                            {msg.sender === 'user' && (
                                                <Avatar className="w-8 h-8 bg-muted text-muted-foreground flex items-center justify-center">
                                                    <User size={20} />
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-start gap-3 justify-start">
                                             <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                                                <Bot size={20} />
                                            </Avatar>
                                            <div className="p-3 rounded-lg bg-muted rounded-bl-none">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0"></span>
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-2 border-t">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Ask a question about cyber awareness..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                    disabled={isLoading}
                                />
                                <Button size="icon" onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default ChatbotOverlay;
