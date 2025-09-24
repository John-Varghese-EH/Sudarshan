
"use client";

import Joyride, { Step } from 'react-joyride';

interface DashboardTutorialProps {
  run: boolean;
  onClose: () => void;
}

const DashboardTutorial: React.FC<DashboardTutorialProps> = ({ run, onClose }) => {
  const steps: Step[] = [
    {
      target: '.risk-summary-cards',
      content: 'These cards show a high-level overview of the current risk level, total threats, and critical alerts.',
      placement: 'bottom',
    },
    {
      target: '.threat-intelligence-map',
      content: 'This map visualizes the geographical origin of cyber threats in real-time.',
      placement: 'top',
    },
    {
      target: '.live-activity-feed',
      content: 'This feed displays a live stream of potential threats as they are detected.',
      placement: 'top',
    },
    {
      target: '.detection-trend-chart',
      content: 'This chart shows the trend of threat detections over time.',
      placement: 'top',
    },
    {
      target: '.threat-analyzer',
      content: 'You can use this tool to manually analyze suspicious messages or text for potential threats.',
      placement: 'top',
    },
    {
      target: '.ai-chatbot-card',
      content: 'Our AI-powered chatbot is here to answer your cybersecurity questions and provide assistance.',
      placement: 'top',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={({ status }) => {
        if (['finished', 'skipped'].includes(status)) {
          onClose();
        }
      }}
      styles={{
        options: {
          primaryColor: '#007bff',
          textColor: '#333',
        },
      }}
    />
  );
};

export default DashboardTutorial;
