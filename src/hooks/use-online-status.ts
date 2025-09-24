
'use client';

import { useState, useEffect, useCallback } from 'react';

const ONLINE_KEY = 'chatOnlineMode';
const CHANNEL_NAME = 'chat_mode_channel';

// BroadcastChannel is a browser API for communication between browsing contexts.
// We only want one instance of it.
let channel: BroadcastChannel | null = null;
const getChannel = () => {
    if (typeof window !== 'undefined') {
        if (channel === null) {
            channel = new BroadcastChannel(CHANNEL_NAME);
        }
        return channel;
    }
    return null;
}

/**
 * A custom hook to track and manage the online status of the chat demo across browser tabs.
 * It uses sessionStorage to maintain the state for the current session and BroadcastChannel
 * to communicate changes between tabs reliably.
 *
 * @returns A tuple containing the current online status and a function to update it.
 */
export function useOnlineStatus(): [boolean, (isOnline: boolean) => void] {
  // Initialize state from sessionStorage on the client, defaulting to false.
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(ONLINE_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    const bc = getChannel();
    if (!bc) return;

    // This handler listens for messages from other tabs.
    const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'modeChange') {
            const newStatus = event.data.isOnline;
            // When a message is received, update the state of THIS tab.
            sessionStorage.setItem(ONLINE_KEY, newStatus ? 'true' : 'false');
            setIsOnline(newStatus);
        }
    };
    
    bc.addEventListener('message', handleMessage);

    // Cleanup listener on component unmount.
    return () => {
      bc.removeEventListener('message', handleMessage);
    };
  }, []);

  // This function is used to change the status from THIS tab.
  const setStatus = useCallback((newStatus: boolean) => {
    const bc = getChannel();
    if (!bc) return;
    
    // 1. Set the state locally for this tab.
    sessionStorage.setItem(ONLINE_KEY, newStatus ? 'true' : 'false');
    setIsOnline(newStatus);
    
    // 2. Broadcast the change to all other tabs.
    bc.postMessage({ type: 'modeChange', isOnline: newStatus });
  }, []);

  return [isOnline, setStatus];
}
