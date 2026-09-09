import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./../app/globals.css";

const LoginPage: React.FC = () => {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si el error de contexto cambia, lo mostramos siempre
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  // Limpiar el error al modificar los campos
  const handleChangeDni = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
    if (localError) setLocalError(null);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (localError) setLocalError(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dni || !password) {
      setLocalError("Debes completar todos los campos");
      return;
    }
    setLoading(true);
    try {
      await login(dni, password);
      setLoading(false);
      // Si login fue exitoso y hay que limpiar el error, se puede hacer aquí (opcional)
      // setLocalError(null);
    } catch (err: any) {
      // Muestra error local SIEMPRE, no lo limpies antes
      setLocalError(err?.message || "Usuario o contraseña incorrectos");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 lg:py-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dk2red18f/image/upload/v1788973855/WEB_EDUCA/fondo-mentor_yydqw3.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-brand-500"></div>
      </div>
      <div className="relative z-10 flex flex-col-reverse lg:flex-row-reverse items-center justify-center gap-y-16 lg:gap-y-0 lg:gap-x-28 w-full max-w-7xl mx-auto px-4">
        <div className="w-full lg:w-3/5 flex justify-center animate-image">
          <img
            src="/login.gif"
            className="w-full max-w-3xl lg:max-w-5xl"
            alt="Imagen descriptiva"
          />
        </div>

        <div className="w-full lg:w-2/5 flex justify-center">
          <div className="login-card-animate bg-brandrosado-800 bg-opacity-80 p-8 rounded-3xl shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-center text-white mb-3">
              ¡Estás a un paso de seguir potenciando tus conocimientos!
            </h1>
            <p className="text-lg text-center text-white mb-6">
              Ingresa e inicia tu experiencia
            </p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label
                  className="block text-sm font-medium text-white"
                  htmlFor="dni"
                >
                  USUARIO
                </label>
                <input
                  id="dni"
                  type="text"
                  value={dni}
                  onChange={handleChangeDni}
                  className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-white/70 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
                  placeholder="Introduce tu usuario"
                  disabled={loading}
                />
              </div>
              <div className="mb-8">
                <label
                  className="block text-sm font-medium text-white"
                  htmlFor="password"
                >
                  CONTRASEÑA
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={handleChangePassword}
                    className="block w-full px-3 py-2 pr-10 bg-transparent border-b border-white text-white placeholder-white/70 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
                    placeholder="Introduce tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-2 flex items-center text-brandfucsia-900 hover:text-white transition-colors"
                    tabIndex={-1}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12m0 0a3 3 0 11-6 0 3 3 0 016 0zm0 0c1.104 0 2.149.217 3.134.616m.325 1.585A8.12 8.12 0 0121 12c-1.637-3.134-4.833-6-9-6s-7.363 2.866-9 6c.8 1.529 2.033 2.89 3.541 3.928M15 12a3.009 3.009 0 01-2.166.84m-3.215-1.804C8.252 10.227 9.354 9 12 9m3 3a3 3 0 01-2.166 2.997M3.75 3l16.5 16.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12m0 0a3 3 0 11-6 0 3 3 0 016 0zm0 0c1.104 0 2.149.217 3.134.616m.325 1.585A8.12 8.12 0 0121 12c-1.637-3.134-4.833-6-9-6s-7.363 2.866-9 6c.8 1.529 2.033 2.89 3.541 3.928M15 12a3.009 3.009 0 01-2.166.84m-3.215-1.804C8.252 10.227 9.354 9 12 9m3 3a3 3 0 01-2.166 2.997M3.75 3l16.5 16.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {loading && (
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-300 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span className="text-blue-300">Cargando...</span>
                </div>
              )}
              {localError && (
                <div className="text-red-500 text-sm mb-2">{localError}</div>
              )}
              <div className="relative w-full pb-1.5 pr-1.5">
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg bg-brandfucsia-900" />
                <button
                  type="submit"
                  className={`relative w-full py-2 px-4 bg-brandrosa-800 text-white font-semibold rounded-lg shadow-lg transition-transform duration-150 active:translate-x-1.5 active:translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandrosa-800 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  INICIAR SESIÓN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
