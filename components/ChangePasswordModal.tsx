import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  useChangePassword,
  validateNewPassword,
} from "../hooks/user/useChangePassword";
import { useAuth } from "../context/AuthContext";

interface Props {
  show: boolean;
  onClose: () => void;
}

interface FieldState {
  value: string;
  visible: boolean;
}

const PasswordField = ({
  id,
  label,
  field,
  onChange,
  onToggle,
  error,
}: {
  id: string;
  label: string;
  field: FieldState;
  onChange: (v: string) => void;
  onToggle: () => void;
  error?: string | null;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={field.visible ? "text" : "password"}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brandazul-600 transition-colors ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {field.visible ? (
          <EyeSlashIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </button>
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const ChangePasswordModal: React.FC<Props> = ({ show, onClose }) => {
  const { logout } = useAuth();
  const { isLoading, error, success, submitChangePassword } =
    useChangePassword();

  const [current, setCurrent] = useState<FieldState>({
    value: "",
    visible: false,
  });
  const [next, setNext] = useState<FieldState>({ value: "", visible: false });
  const [confirm, setConfirm] = useState<FieldState>({
    value: "",
    visible: false,
  });
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

  const handleClose = () => {
    setCurrent({ value: "", visible: false });
    setNext({ value: "", visible: false });
    setConfirm({ value: "", visible: false });
    setConfirmError(null);
    setNewPasswordError(null);
    onClose();
  };

  const handleNewPasswordChange = (v: string) => {
    setNext((s) => ({ ...s, value: v }));
    setNewPasswordError(validateNewPassword(v));
  };

  const handleConfirmChange = (v: string) => {
    setConfirm((s) => ({ ...s, value: v }));
    setConfirmError(v !== next.value ? "Las contraseñas no coinciden" : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateNewPassword(next.value);
    if (validationError) {
      setNewPasswordError(validationError);
      return;
    }

    if (next.value !== confirm.value) {
      setConfirmError("Las contraseñas no coinciden");
      return;
    }

    const ok = await submitChangePassword(current.value, next.value);
    if (ok) {
      setTimeout(() => {
        handleClose();
        logout();
      }, 1500);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            Cambiar contraseña
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <PasswordField
            id="current-password"
            label="Contraseña actual"
            field={current}
            onChange={(v) => setCurrent((s) => ({ ...s, value: v }))}
            onToggle={() => setCurrent((s) => ({ ...s, visible: !s.visible }))}
          />

          <PasswordField
            id="new-password"
            label="Nueva contraseña"
            field={next}
            onChange={handleNewPasswordChange}
            onToggle={() => setNext((s) => ({ ...s, visible: !s.visible }))}
            error={newPasswordError}
          />

          <PasswordField
            id="confirm-password"
            label="Confirmar nueva contraseña"
            field={confirm}
            onChange={handleConfirmChange}
            onToggle={() => setConfirm((s) => ({ ...s, visible: !s.visible }))}
            error={confirmError}
          />

          <p className="text-xs text-gray-400">
            Mínimo 8 caracteres, una mayúscula, un número y un carácter
            especial.
          </p>

          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="px-3 py-2.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              Contraseña actualizada. Cerrando sesión...
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className="px-4 py-2 rounded-lg bg-brandm365-100 text-white text-sm font-medium hover:bg-branda365-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
