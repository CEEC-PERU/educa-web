import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Admin/SideBarAdmin";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import CampaignFormModal from "@/components/campaigns/CampaignFormModal";
import { useAuth } from "@/context/AuthContext";
import { getCompanies } from "@/services/users/userService";
import {
  Campaign,
  createCampaign,
  deleteCampaign,
  getCampaigns,
  updateCampaign,
} from "@/services/campaignService";
import { getCampaignLabel } from "@/utils/campaigns";
import "@/app/globals.css";

const ADMIN_ROLE_ID = 4;
const CORPORATE_ADMIN_ROLE_ID = 5;

interface EnterpriseOption {
  enterprise_id: number;
  name: string;
}

const CampaignsAdmin: React.FC = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const [showSidebar] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [companies, setCompanies] = useState<EnterpriseOption[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const roleId = useMemo(
    () => (typeof user === "object" && user !== null ? Number(user.role) : Number.NaN),
    [user],
  );
  const sessionEnterpriseId = useMemo(
    () => (typeof user === "object" && user !== null ? Number(user.enterprise_id) : Number.NaN),
    [user],
  );
  const isSystemAdmin = roleId === ADMIN_ROLE_ID;
  const canManage = roleId === ADMIN_ROLE_ID || roleId === CORPORATE_ADMIN_ROLE_ID;

  // El admin global elige la empresa; el administrador corporativo opera siempre
  // sobre la empresa de su sesion.
  const enterpriseFilter = isSystemAdmin
    ? selectedEnterprise
    : (Number.isSafeInteger(sessionEnterpriseId) && sessionEnterpriseId > 0
      ? String(sessionEnterpriseId)
      : "");

  const loadCampaigns = useCallback(async () => {
    if (!token || !enterpriseFilter) {
      setCampaigns([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaigns(token, Number(enterpriseFilter));
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las campañas.");
    } finally {
      setLoading(false);
    }
  }, [token, enterpriseFilter]);

  useEffect(() => {
    if (!token || !canManage) return;
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (loadError) {
        console.error("Error fetching companies:", loadError);
      }
    };
    loadCompanies();
  }, [token, canManage]);

  useEffect(() => {
    if (!token || !canManage) return;
    if (isSystemAdmin) {
      if (!selectedEnterprise && companies.length > 0) {
        setSelectedEnterprise(String(companies[0].enterprise_id));
      }
    }
  }, [token, canManage, isSystemAdmin, companies, selectedEnterprise]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const campaignLabel = getCampaignLabel(enterpriseFilter || null);

  const openCreateModal = () => {
    setEditing(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (campaign: Campaign) => {
    setEditing(campaign);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (values: { name: string; ceco: string | null }) => {
    if (!token) return;
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateCampaign(token, editing.id, { name: values.name, ceco: values.ceco });
        toast.success(`${campaignLabel} actualizada correctamente.`);
      } else {
        await createCampaign(token, {
          name: values.name,
          ceco: values.ceco,
          enterprise_id: Number(enterpriseFilter),
        });
        toast.success(`${campaignLabel} creada correctamente.`);
      }
      setModalOpen(false);
      setEditing(null);
      await loadCampaigns();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "No se pudo guardar la campaña.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (campaign: Campaign) => {
    if (!token) return;
    const confirmed = window.confirm(
      `¿Eliminar la ${campaignLabel.toLowerCase()} "${campaign.name}"? Esta accion no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      await deleteCampaign(token, campaign.id);
      toast.success(`${campaignLabel} eliminada.`);
      await loadCampaigns();
    } catch (deleteError) {
      toast.error(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la campaña.");
    }
  };

  if (!canManage) {
    return (
      <ProtectedRoute>
        <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
          <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
          <div className="flex flex-1 pt-16">
            <Sidebar showSidebar={showSidebar} setShowSidebar={() => {}} />
            <main className="min-w-0 flex-1 p-6">
              <p className="text-sm text-gray-700">No tienes permiso para gestionar campañas.</p>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={() => {}} />
          <main className="min-w-0 flex-1 p-6">
            <div className="max-w-5xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Gestión de {campaignLabel.toLowerCase()}s</h1>
                  <p className="text-sm text-gray-600">
                    Crea y edita las {campaignLabel.toLowerCase()}s de la empresa, incluido su CECO.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  disabled={!enterpriseFilter}
                  className="rounded-lg bg-gradient-to-r from-green-500 to-green-400 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:from-green-600 hover:to-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Nueva {campaignLabel}
                </button>
              </div>

              {isSystemAdmin && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <label htmlFor="campaign-enterprise" className="text-sm font-medium text-gray-700">
                    Empresa
                  </label>
                  <select
                    id="campaign-enterprise"
                    value={selectedEnterprise}
                    onChange={(event) => setSelectedEnterprise(event.target.value)}
                    className="rounded-md border border-gray-300 p-2 text-sm"
                  >
                    <option value="">Selecciona una empresa</option>
                    {companies.map((company) => (
                      <option key={company.enterprise_id} value={company.enterprise_id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <p role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full bg-white text-black">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs uppercase tracking-wider">CECO</th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs uppercase tracking-wider">Usuarios</th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">Cargando...</td>
                      </tr>
                    )}
                    {!loading && campaigns.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                          No hay {campaignLabel.toLowerCase()}s para esta empresa.
                        </td>
                      </tr>
                    )}
                    {!loading && campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-200">
                        <td className="px-6 py-4 whitespace-no-wrap">{campaign.name}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{campaign.ceco || "-"}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">{campaign.users_count}</td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <button
                            type="button"
                            aria-label={`Editar ${campaign.name}`}
                            title="Editar"
                            onClick={() => openEditModal(campaign)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar ${campaign.name}`}
                            title="Eliminar"
                            onClick={() => handleDelete(campaign)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      <CampaignFormModal
        show={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); setFormError(null); }}
        onSubmit={handleSubmit}
        campaign={editing}
        label={campaignLabel}
        submitting={saving}
        error={formError}
      />
    </ProtectedRoute>
  );
};

export default CampaignsAdmin;
