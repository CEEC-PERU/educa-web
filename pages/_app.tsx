import { AuthProvider } from '../context/AuthContext';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) { 
  return (
    // Retorna el componente AuthProvider como contenedor principal de la aplicación.
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
