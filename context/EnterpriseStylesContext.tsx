import { API_USERU } from '../utils/Endpoints';
import { useAuth } from './AuthContext';
import axios from 'axios';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { EnterpriseStyles } from '@/interfaces/User/UserEnterprise';

interface EnterpriseStylesContextProps {
  styles: EnterpriseStyles | null;
  loading: boolean;
  error: string | null;
  refreshStyles: () => Promise<void>;
}

// generamos el contexto
export const EnterpriseStylesContext =
  createContext<EnterpriseStylesContextProps>(
    {} as EnterpriseStylesContextProps,
  );

// hook para usar el contexto
export const useEnterpriseStyles = () => {
  const context = useContext(EnterpriseStylesContext);
  if (!context) {
    throw new Error('Hubo un error al cargar los estilos de la empresa.');
  }
  return context;
};

//Provider para envolver la aplicación
interface EnterpriseStylesProviderProps {
  children: ReactNode;
}

export const EnterpriseStylesProvider: React.FC<
  EnterpriseStylesProviderProps
> = ({ children }) => {
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };
  const [styles, setStyles] = useState<EnterpriseStyles | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enterprise_styles');
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // obtener estilos de la empresa
  const fetchEnterpriseStyles = async () => {
    if (!userInfo?.id) {
      console.warn('No se puede obtener estilos');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_USERU}/enterprise/${userInfo.id}`,
      );
      console.log('Respuesta de estilos de empresa:', response.data);

      // extaer estilos
      const enterpriseStyles = response.data?.enterprise?.styles || null;

      setStyles(enterpriseStyles);
      /* 
      // guardar en localStorage
      if (enterpriseStyles) {
        localStorage.setItem(
          'enterprise_styles',
          JSON.stringify(enterpriseStyles),
        );
      } else {
        console.warn('No se encontraron estilos de empresa en la respuesta.');
      }*/
    } catch (err) {
      console.error('Hubo un error al obtener los estilos de la empresa:', err);
      setError('Hubo un error al cargar los estilos de la empresa.');
    } finally {
      setLoading(false);
    }
  };

  // refrescar estilos
  const refreshStyles = async () => {
    await fetchEnterpriseStyles();
  };

  // cargar estilos al montar el componente
  useEffect(() => {
    if (userInfo?.id && !styles) {
      fetchEnterpriseStyles();
    }
  }, [userInfo?.id]);

  const value = {
    styles,
    loading,
    error,
    refreshStyles,
  };

  return (
    <EnterpriseStylesContext.Provider value={value}>
      {children}
    </EnterpriseStylesContext.Provider>
  );
};

export default EnterpriseStylesProvider;
