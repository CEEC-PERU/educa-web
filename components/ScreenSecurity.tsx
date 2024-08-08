import { useEffect } from 'react';

const ScreenSecurity = () => {
  useEffect(() => {
    const preventScreenshot = () => {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
        }
      });
      document.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen') {
          navigator.clipboard.writeText('');
          alert('Screenshots are disabled on this page.');
        }
      });
    };

    const preventScreenRecording = () => {
      // Detiene la grabación de pantalla
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          alert('Screen recording is disabled.');
          window.close();
        }
      });
    };

    preventScreenshot();
    preventScreenRecording();

    return () => {
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('visibilitychange', preventScreenRecording);
    };
  }, []);

  return null;
};

export default ScreenSecurity;
