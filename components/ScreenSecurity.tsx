import { useEffect, useState } from 'react';

const ScreenSecurity: React.FC = () => {
  const [isScreenBlocked, setIsScreenBlocked] = useState(false);

  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setIsScreenBlocked(true);
        navigator.clipboard.writeText('');
      }
    };

    const preventScreenRecording = () => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          setIsScreenBlocked(true);
        }
      });
    };

    document.addEventListener('keydown', preventScreenshot);
    preventScreenRecording();

    return () => {
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('visibilitychange', preventScreenRecording);
    };
  }, []);

  return (
    isScreenBlocked && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          zIndex: 9999,
        }}
      />
    )
  );
};

export default ScreenSecurity;
