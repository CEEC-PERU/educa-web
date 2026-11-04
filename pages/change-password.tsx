import React from "react";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordModal from "@/components/ChangePasswordModal";

const ChangePasswordPage: React.FC = () => {
  const { user, completePasswordChange, redirectToDashboard } = useAuth();
  const userRole = typeof user === "object" && user ? user.role : null;

  if (userRole === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-700">Inicia sesion para cambiar tu contrasena.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow">
        <h1 className="mb-2 text-xl font-semibold text-gray-900">Actualiza tu contrasena</h1>
        <p className="mb-5 text-sm text-gray-600">
          Por seguridad, debes cambiar tu contrasena inicial para continuar.
        </p>
        <ChangePasswordModal
          show
          mandatory
          onClose={() => undefined}
          onPasswordChanged={() => {
            completePasswordChange();
            redirectToDashboard(userRole);
          }}
        />
      </div>
    </main>
  );
};

export default ChangePasswordPage;
