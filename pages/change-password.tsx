import React from "react";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";

const ChangePasswordPage: React.FC = () => {
  const { user, refreshProfile, completePasswordChange, redirectToDashboard } = useAuth();
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
          onPasswordChanged={async (updatedToken) => {
            if (!user || typeof user !== "object") {
              toast.error("No se pudo validar la sesión. Inicia sesión nuevamente.");
              return;
            }
            completePasswordChange(updatedToken);
            try {
              const profile = await refreshProfile(updatedToken, user.id);
              if (!profile) {
                toast.warning("Contraseña guardada, pero no se encontró el perfil. Se intentará cargar desde la plataforma.");
              }
            } catch {
              toast.warning("Contraseña guardada, pero falló la actualización visual del perfil. Se volverá a intentar desde la plataforma.");
            }
            redirectToDashboard(user.role, updatedToken);
          }}
        />
      </div>
    </main>
  );
};

export default ChangePasswordPage;
