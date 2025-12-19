import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Corporate/CorporateSideBar";
import { API_CERTIFICATES } from "../../utils/Endpoints";
import { useAuth } from "../../context/AuthContext";
import { UserInfo } from "../../interfaces/Certification";

interface CertificadoActivo {
  certification_id: number;
  enterprise_id: number;
  title: string;
  passing_percentage: number;
  is_active: boolean;
}

interface CertificationResultados {
  result_id: number;
  user_id: number;
  user_name?: string;
  dni?: string;
  score: string;
  passed: boolean;
  certification_id: number;
  certification_title?: string;
  created_at?: string;
}

const Certification: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { user } = useAuth();
  const userInfo = user as UserInfo;

  const [certificados, setCertificados] = useState<CertificadoActivo[]>([]);
  const [resultados, setResultados] = useState<CertificationResultados[]>([]);
  const [selectedCertId, setSelectedCertId] = useState<number | "">("");

  const [loadingCerts, setLoadingCerts] = useState(true);
  const [loadingResultados, setLoadingResultados] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const descargarCSV = () => {
    if (filteredResults.length === 0) return;

    const headers = [
      "Certificación",
      "Estudiante",
      "DNI",
      "Puntuación",
      "Estado",
      "Fecha",
      "Hora",
    ];

    const rows = filteredResults.map((res) => {
      return [
        `"${res.certification_title}"`,
        `"${res.user_name}"`,
        res.dni,
        res.score,
        res.passed ? "APROBADO" : "REPROBADO",
        res.created_at,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Reporte_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!userInfo?.enterprise_id) return;
    const fetchCertificados = async () => {
      setLoadingCerts(true);
      try {
        const userToken = localStorage.getItem("userToken");
        const response = await fetch(
          `${API_CERTIFICATES}/enterprise/${userInfo.enterprise_id}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const data = await response.json();
        setCertificados(data.data || data);
      } catch (err) {
        setError("Error al cargar las campañas.");
      } finally {
        setLoadingCerts(false);
      }
    };
    fetchCertificados();
  }, [userInfo?.enterprise_id]);

  useEffect(() => {
    if (!selectedCertId) {
      setResultados([]);
      return;
    }

    const fetchResultados = async () => {
      setLoadingResultados(true);
      setError(null);
      try {
        const userToken = localStorage.getItem("userToken");
        const response = await fetch(
          `${API_CERTIFICATES}/certificationId/${selectedCertId}/enterpriseId/${userInfo.enterprise_id}/results`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );

        if (!response.ok)
          throw new Error("No se pudieron obtener los resultados.");

        const data = await response.json();

        // Insertamos el titulo de la certificación en cada resultado
        const certTitle = data.data.title;

        const normalizedResults = (data.data.results || []).map((r: any) => ({
          result_id: r.result_id,
          user_id: r.user_id,
          score: r.score,
          passed: r.passed,
          certification_id: data.data.certification_id,
          certification_title: certTitle, // Título de la certificación
          user_name: r.user?.userProfile
            ? `${r.user.userProfile.first_name} ${r.user.userProfile.last_name}`
            : r.user?.user_name ?? `ID: ${r.user_id}`,
          dni: r.user?.dni ?? "N/A",
          created_at: formatDate(r.created_at),
        }));

        setResultados(normalizedResults);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingResultados(false);
      }
    };
    fetchResultados();
  }, [selectedCertId]);

  const filteredResults = useMemo(() => {
    if (!searchTerm) return resultados;
    return resultados.filter((res) =>
      res.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, resultados]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={() => setShowSidebar(!showSidebar)}
        />

        <main
          className={`flex-grow p-6 transition-all duration-300 ${
            showSidebar ? "ml-64" : "ml-20"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {!userInfo ? (
              <div className="p-24 text-center animate-pulse text-gray-400">
                Cargando perfil...
              </div>
            ) : (
              <>
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                      Gestión de Certificaciones
                    </h1>
                    <p className="text-gray-500 mt-2">
                      Analiza el desempeño de tus colaboradores.
                    </p>
                  </div>

                  {filteredResults.length > 0 && (
                    <button
                      onClick={descargarCSV}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md transition-all active:scale-95"
                    >
                      Descargar Reporte (CSV)
                    </button>
                  )}
                </header>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-grow w-full md:w-1/2">
                    <label className="text-xs font-bold text-gray-400 mb-2 uppercase block">
                      Certificaciones Disponibles
                    </label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                      value={selectedCertId}
                      onChange={(e) =>
                        setSelectedCertId(Number(e.target.value) || "")
                      }
                      disabled={loadingCerts}
                    >
                      <option value="">
                        {loadingCerts
                          ? "Cargando..."
                          : "Selecciona una certificación..."}
                      </option>
                      {certificados.map((cert) => (
                        <option
                          key={cert.certification_id}
                          value={cert.certification_id}
                        >
                          {cert.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-grow w-full md:w-1/2">
                    <label className="text-xs font-bold text-gray-400 mb-2 uppercase block">
                      Buscar por Estudiante
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="Nombre del estudiante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={!selectedCertId}
                    />
                  </div>
                </div>

                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {loadingResultados ? (
                    <div className="p-24 text-center flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-400 italic">
                        Obteniendo datos...
                      </p>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                          <tr>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Certificación
                            </th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Estudiante
                            </th>
                            <th className="p-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                              DNI
                            </th>
                            <th className="p-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Puntuación
                            </th>
                            <th className="p-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="p-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Fecha de Intento
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredResults.map((res) => (
                            <tr
                              key={res.result_id}
                              className="hover:bg-blue-50/30 transition-colors"
                            >
                              <td className="p-5 font-medium text-gray-600 text-sm max-w-xs truncate">
                                {res.certification_title}
                              </td>
                              <td className="p-5">
                                <div className="font-semibold text-gray-800 uppercase text-sm">
                                  {res.user_name}
                                </div>
                              </td>
                              <td className="p-5 text-center text-sm text-gray-600">
                                {res.dni}
                              </td>
                              <td className="p-5 text-center text-sm text-gray-600">
                                {res.score}
                              </td>
                              <td className="p-5 text-center">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${
                                    res.passed
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {res.passed ? "✓ APROBADO" : "✕ REPROBADO"}
                                </span>
                              </td>
                              <td className="p-5 text-right text-xs text-gray-500">
                                {res.created_at}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-24 text-center text-gray-400 italic">
                      {selectedCertId
                        ? "No hay resultados registrados."
                        : "Selecciona un certificado para comenzar."}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Certification;
