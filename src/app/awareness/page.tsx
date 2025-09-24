
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertTriangle,
  BookOpen,
  Users,
  ShieldCheck,
  Phone,
  Siren,
  Brain,
  CircleHelp,
  CheckSquare,
  KeyRound,
  WifiOff,
  AtSign,
  Lock,
  UserCheck,
  Youtube,
} from 'lucide-react';

// Dynamically import the AwarenessVideo component with SSR turned off
const AwarenessVideo = dynamic(() => import('@/components/ui/awareness-video'), {
  ssr: false,
  loading: () => <div className="w-full aspect-video rounded-lg bg-muted animate-pulse"></div>,
});

const AwarenessPage: React.FC = () => {
  const safetyTips = [
  {
    icon: <KeyRound className="h-8 w-8 text-primary" />,
    title: 'Use Strong Passwords',
    description: 'Use a mix of letters, numbers & symbols. Avoid using your name, birthdate, or “123456.” Use a password manager to keep passwords safe.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Turn On Two-Factor Authentication (2FA)',
    description: 'Add an extra layer of security to your accounts. Even if someone knows your password, they can’t log in without the second code.',
  },
  {
    icon: <AtSign className="h-8 w-8 text-primary" />,
    title: 'Don’t Click on Suspicious Links',
    description: 'Be cautious with emails, texts, or messages that look strange. Don’t click on unknown links or download unexpected files — they might contain malware or phishing attacks.',
  },
    {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: 'Keep Your Software Updated',
    description: 'Always update your apps, browsers, and operating systems. Updates fix security bugs that hackers can exploit.',
  },
  {
    icon: <Siren className="h-8 w-8 text-primary" />,
    title: 'Use Antivirus and a Firewall',
    description: 'Install antivirus software to detect and block threats. Enable your firewall to protect your network.',
  },
    {
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    title: 'Be Smart on Social Media',
    description: 'Don’t overshare personal information (location, phone number, family details). Keep your profiles private. Think before you post.',
  },
  {
    icon: <WifiOff className="h-8 w-8 text-primary" />,
    title: 'Avoid Public Wi-Fi for Sensitive Work',
    description: 'Public Wi-Fi is not secure. Use a VPN (Virtual Private Network) when connecting to public Wi-Fi.',
  },
    {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Back Up Your Data',
    description: 'Save important files on external drives or cloud storage. Helps in case of ransomware attacks or accidental loss.',
  },
  {
    icon: <AlertTriangle className="h-8 w-8 text-primary" />,
    title: 'Watch Out for Online Scams',
    description: 'Don’t trust emails or messages asking for money or personal info. Beware of “You’ve won a prize!” scams. If it sounds too good to be true, it probably is.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Teach Kids and Elderly About Cyber Safety',
    description: 'Help children avoid unsafe websites or apps. Talk to elderly family members about fake calls, messages, and scams.',
  },
];


  const unsafeThings = [
    "Don’t use the same password for all accounts",
    "Don’t share OTPs or bank info with anyone",
    "Don’t install apps from unknown sources",
    "Don’t believe every message or post online",
    "Don’t ignore cyberbullying or threats — report them",
  ];

  const victimSteps = [
    {
      situation: "Hacked Account",
      action: "Change password immediately and enable 2FA",
    },
    {
      situation: "Scammed Online",
      action: "Report to your bank and cyber crime helpline",
    },
    {
      situation: "Cyberbullying",
      action: "Save evidence and report to parents, teachers, or police",
    },
    {
      situation: "Malware Attack",
      action: "Run antivirus, disconnect internet, and seek tech help",
    }
  ];

  // Explicitly setting the videoIds to only two videos.
  const videoIds = ["ye60C6BYXcM", "-r_2a064dWY"];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Cyber Safety Awareness Guide</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Cyber Safety is the safe and responsible use of the internet and digital devices to protect yourself.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="text-primary" /> Top 10 Cyber Safety Tips You Should Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {safetyTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-4">
              {tip.icon}
              <div>
                <h3 className="font-semibold">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle /> Don’t Do These Unsafe Things
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {unsafeThings.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleHelp className="text-primary" /> What to Do If You’re a Victim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Situation</th>
                  <th className="p-2">What To Do</th>
                </tr>
              </thead>
              <tbody>
                {victimSteps.map((step, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-semibold">{step.situation}</td>
                    <td className="p-2">{step.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="text-primary" /> Cyber Crime Reporting (India Example)</CardTitle>
          <CardDescription>
            Every country has its own cyber crime reporting system. Know yours.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-2">Cyber Crime Helpline Number: <span className="font-mono">1930</span></p>
            <p>National Cyber Crime Portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://cybercrime.gov.in</a></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-primary">
            <Brain />
            Final Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
            <p className="flex items-center gap-2">💡 Think before you click.</p>
            <p className="flex items-center gap-2">🛡️ Stay private.</p>
            <p className="flex items-center gap-2">🔐 Stay secure.</p>
            <p className="flex items-center gap-2">🚫 Don’t trust everything online.</p>
            <p className="flex items-center gap-2">🧠 Stay informed and aware.</p>
        </CardContent>
      </Card>

      {/* This Card component is explicitly written to ensure only two videos are rendered from videoIds array */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="text-primary" /> Awareness Videos
          </CardTitle>
          <CardDescription>
            Watch these short videos to understand the project&apos;s goals on awareness, prevention, and detection.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {videoIds.map((videoId) => (
            <AwarenessVideo videoId={videoId} key={videoId} />
          ))}
        </CardContent>
      </Card>
      
      <div className="text-center text-lg text-muted-foreground italic">
        "The best way to stay safe online is to stay alert."
        <p className="mt-2">Cyber safety is your responsibility — protect yourself and others.</p>
      </div>

    </div>
  );
};

export default AwarenessPage;
