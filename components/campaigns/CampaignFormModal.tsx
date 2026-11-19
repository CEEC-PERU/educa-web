import React, { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/Admin/Modal";
import { Campaign } from "@/services/campaignService";

interface CampaignFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; ceco: string | null }) => Promise<void> | void;
  campaign?: Campaign | null;
  /** Texto del concepto segun la empresa: "Campaña" o "Producto" (Rimac). */
  label?: string;
  submitting?: boolean;
  error?: string | null;
}

const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  show,
  onClose,
  onSubmit,
  campaign = null,
  label = "Campaña",
  submitting = false,
  error = null,
}) => {
  const [name, setName] = useState("");
  const [ceco, setCeco] = useState("");

  useEffect(() => {
    if (!show) return;
    setName(campaign?.name ?? "");
    setCeco(campaign?.ceco ?? "");
  }, [show, campaign]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({ name: name.trim(), ceco: ceco.trim() === "" ? null : ceco.trim() });
  };

  return (
    <Modal show={show} onClose={onClose} title={campaign ? `Editar ${label}` : `Nueva ${label}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1 text-sm font-medium text-gray-700">
          Nombre
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            required
            autoFocus
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder={`Nombre de ${label.toLowerCase()}`}
          />
        </label>

        <label className="block space-y-1 text-sm font-medium text-gray-700">
          CECO (opcional)
          <input
            value={ceco}
            onChange={(event) => setCeco(event.target.value)}
            maxLength={150}
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Codigo de centro de costo"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || name.trim() === ""}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CampaignFormModal;
