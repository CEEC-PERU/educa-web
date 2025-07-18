import { useState } from 'react';

const useDownloadWordReport = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadWordReport = async (courseId: number, classroomId: number) => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://educa-web-api.onrender.com/api/notas/courses/firmas/${courseId}/${classroomId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type':
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            // Agregar headers de autenticación si son necesarios
            // 'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al descargar el informe: ${response.status}`);
      }

      // Obtener el blob del archivo
      const blob = await response.blob();

      // Crear URL temporal para el archivo
      const url = window.URL.createObjectURL(blob);

      // Crear elemento link temporal para descarga
      const link = document.createElement('a');
      link.href = url;

      // Generar nombre del archivo con timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, '-');
      link.download = `informe-firmas-curso-${courseId}-aula-${classroomId}-${timestamp}.docx`;

      // Simular click para iniciar descarga
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error downloading Word report:', err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadWordReport,
    isDownloading,
    error,
    clearError: () => setError(null),
  };
};

export default useDownloadWordReport;
