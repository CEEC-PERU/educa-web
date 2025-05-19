// components/SessionTimeoutNotification.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SessionTimeoutNotification = () => {
  const { resetInactivityTimer } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const warningTime = 5 * 60 * 1000; // 5 minutos antes de expirar
  const totalTimeout = 45 * 60 * 1000; // 45 minutos

  useEffect(() => {
    if (!resetInactivityTimer) return;

    let warningTimer: NodeJS.Timeout;

    const setupTimers = () => {
      const timeUntilWarning = totalTimeout - warningTime;

      warningTimer = setTimeout(() => {
        setShowWarning(true);
      }, timeUntilWarning);

      resetInactivityTimer();
    };

    setupTimers();

    return () => {
      clearTimeout(warningTimer);
    };
  }, [resetInactivityTimer]);

  const handleStayLoggedIn = () => {
    resetInactivityTimer();
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Tu sesión está por expirar</h2>
        <p className="mb-4">
          Tu sesión se cerrará automáticamente debido a inactividad en 5
          minutos. ¿Deseas continuar?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleStayLoggedIn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutNotification;
