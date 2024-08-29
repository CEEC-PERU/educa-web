import { useEffect, useState } from 'react';

const ScreenSecurity: React.FC = () => {
  const [isScreenBlocked, setIsScreenBlocked] = useState(false);

  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      // Detectar la tecla PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setIsScreenBlocked(true);
        navigator.clipboard.writeText('');
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      // Deshabilitar el botón derecho del mouse
      if (e.button === 2) {
        e.preventDefault();
      }
    };

    const preventScreenRecording = () => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          setIsScreenBlocked(true);
        }
      });
    };

    //document.addEventListener('keydown', preventScreenshot);
    //document.addEventListener('contextmenu', preventContextMenu);
    //preventScreenRecording();

    // Remueve la capa si hay interacción
    const handleInteraction = () => {
      setIsScreenBlocked(false);
    };

   // document.addEventListener('mousemove', handleInteraction);
   // document.addEventListener('keydown', handleInteraction);

    return () => {
     // document.removeEventListener('keydown', preventScreenshot);
      //document.removeEventListener('contextmenu', preventContextMenu);
      //document.removeEventListener('visibilitychange', preventScreenRecording);
      //document.removeEventListener('mousemove', handleInteraction);
     // document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <div>
      {isScreenBlocked && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
          }}
        />
      )}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
          backgroundImage: 'url(https://your-image-url.com/watermark.png)',
          backgroundRepeat: 'repeat',
          opacity: 0.2,
        }}
      />
    </div>
  );
};

export default ScreenSecurity;
