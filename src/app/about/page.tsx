
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Goal, Telescope, Lightbulb } from 'lucide-react';

// Dynamically import the AwarenessVideo component with SSR turned off
const AwarenessVideo = dynamic(() => import('@/components/ui/awareness-video'), {
  ssr: false,
  loading: () => <div className="w-full aspect-video rounded-lg bg-muted animate-pulse"></div>,
});

const AboutPage: React.FC = () => {
  const videoId = "gKZj9RGLBPw"; // Updated video ID

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">About Sudarshan</h1>
        <p className="text-xl text-muted-foreground mt-2">
          A shield against cyber threats, built with passion and purpose.
        </p>
      </div>

      <Card className="bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-2xl">Who We Are</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-muted-foreground">
          <p>
            We are a team of passionate first-year engineering students participating in the Dawn of Code hackathon, united by a vision of building a safer digital world. We specialize in cybersecurity and AI-driven problem-solving.
          </p>
          <p>
            We started this journey because we personally witnessed how misinformation, phishing, and online scams affect students and common users who are often unaware of cyber risks. We realized there is no single tool that combines education, detection, and reporting in a simple way.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Goal className="text-primary" /> Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our mission is to make cyberspace safer for everyone by combining awareness, detection, and prevention into one accessible platform.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-primary" /> Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe that <span className="font-semibold text-primary">Awareness + Action</span> is the real kavach (shield) against modern cyber threats.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Telescope className="text-primary" /> Future Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Looking ahead, we aim to expand Sudarshan into a robust platform with advanced AI-driven detection for text, images, and videos, integrated emergency response features, and real-world integration with cybercrime authorities. This is just the beginning of our journey.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             Project Video
          </CardTitle>
          <CardDescription>
            Watch this short video to understand the project's goals on awareness, prevention, and detection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AwarenessVideo videoId={videoId} key={videoId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-primary" /> Our Team
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="text-center">
            <img src="/images/1John-Photo.png" alt="John Varghese" className="mx-auto rounded-full h-32 w-32 object-cover border-2 border-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">John Varghese</h3>
          </div>
          <div className="text-center">
            <img src="/images/1Amit_Photo.png" alt="Amit Kumar" className="mx-auto rounded-full h-32 w-32 object-cover border-2 border-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Amit Kumar</h3>
          </div>
          <div className="text-center">
            <img src="/images/1Rishabh-Photo.png" alt="Rishabh Nirmalkar" className="mx-auto rounded-full h-32 w-32 object-cover border-2 border-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Rishabh Nirmalkar</h3>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-lg text-muted-foreground italic">
        "The best way to stay safe online is to stay alert."
      </div>
    </div>
  );
};

export default AboutPage;
