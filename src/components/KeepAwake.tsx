'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react'; // Using an icon to indicate status

const KeepAwake = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsLocked(true);
        setError(null);
        lock.onrelease = () => {
          setIsLocked(false);
          // console.log('Screen Wake Lock released');
        };
        // console.log('Screen Wake Lock active');
      } catch (err: any) {
        setError(`Could not acquire wake lock: ${err.name}, ${err.message}`);
        // console.error(`Could not acquire wake lock: ${err.name}, ${err.message}`);
        setIsLocked(false);
      }
    } else {
      setError('Wake Lock API not supported by this browser.');
      // console.warn('Wake Lock API not supported.');
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
      // isLocked state will be updated by the onrelease event
    }
  };

  useEffect(() => {
    // Request wake lock when component mounts
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleVisibilityChange); // Also re-acquire on fullscreen change

    // Cleanup: release wake lock when component unmounts
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
    };
  }, []); // Empty dependency array: run once on mount, cleanup on unmount

  // Optional: UI to indicate wake lock status or allow manual toggle (not requested, but good for debugging)
  if (error && !isLocked) {
    return (
      <div className="fixed bottom-2 right-2 bg-red-100 text-red-700 p-2 rounded text-xs shadow">
        Wake Lock Error: {error}
      </div>
    );
  }
  
  if (isLocked) {
      return (
        <div className="fixed bottom-2 right-2 bg-green-100 text-green-700 p-2 rounded text-xs shadow flex items-center">
            <Zap size={14} className="mr-1"/> Keep Awake Active
        </div>
      )
  }

  return null; // No UI if not locked and no error, or if API not supported
};

export default KeepAwake; 