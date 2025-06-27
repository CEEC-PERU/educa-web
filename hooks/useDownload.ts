// hooks/useDownload.ts
import { useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useAuth } from '../context/AuthContext';

interface DownloadOptions {
  endpoint: string;
  fileName: string;
  responseType?: 'blob' | 'json' | 'text';
  axiosInstance?: AxiosInstance;
}

const useDownload = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadFile = async (
    options: DownloadOptions,
    params?: Record<string, any>
  ) => {
    const {
      endpoint,
      fileName,
      responseType = 'blob',
      axiosInstance = axios,
    } = options;

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(endpoint, {
        params,
        responseType,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Download failed'));
      console.error('Download error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { downloadFile, loading, error };
};

export default useDownload;
