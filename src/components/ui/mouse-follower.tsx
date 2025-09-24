
'use client';

import React, { useState, useEffect } from 'react';

const MouseFollower = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className="mouse-follower"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
        <div className="mouse-follower-dot" />
    </div>
  );
};

export default MouseFollower;
