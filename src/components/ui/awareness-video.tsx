
'use client';

import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Youtube, PlayCircle, ExternalLink } from 'lucide-react';
import { Button } from './button';

const AwarenessVideo = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  const handleError = (e: any) => {
    console.error('Video Error:', e);
    setError(true);
  };

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden group bg-black">
      {isPlaying ? (
        <ReactPlayer
          url={videoUrl}
          playing={isPlaying}
          controls
          width="100%"
          height="100%"
          onError={handleError}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                rel: 0,
                iv_load_policy: 3,
                color: 'white',
              },
            },
          }}
        />
      ) : (
        <>
          <img
            src={thumbnailUrl}
            alt="Video Thumbnail"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer transition-opacity"
            onClick={() => setIsPlaying(true)}
          >
            <PlayCircle className="text-white h-20 w-20 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
        </>
      )}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          asChild
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(videoUrl, '_blank');
          }}
        >
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <Youtube className="h-4 w-4" />
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default AwarenessVideo;
