// hooks/useDownloadNotas.ts
import useDownload from './../useDownload';
import { API_GET_NOTAS_EXCEL } from '../../utils/Endpoints';
import { useAuth } from '../../context/AuthContext';

const useDownloadNotas = () => {
  const { downloadFile, loading, error } = useDownload();
  const { user } = useAuth();

  const downloadNotas = async (courseId: number) => {
    if (!user) return false;

    const userInfo = user as { enterprise_id: number };
    const endpoint = `${API_GET_NOTAS_EXCEL}/${userInfo.enterprise_id}/${courseId}`;

    return downloadFile({
      endpoint,
      fileName: 'reporte_notas.xlsx',
    });
  };

  return { downloadNotas, loading, error };
};

export default useDownloadNotas;
