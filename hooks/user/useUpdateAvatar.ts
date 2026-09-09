import { useState } from "react";
import { updateProfileAvatar } from "../../services/profile";
import { useAuth } from "../../context/AuthContext";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const validateAvatarFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Formato no permitido. Usa PNG, JPG o WEBP.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "La imagen no debe superar 5MB.";
  }
  return null;
};

export const useUpdateAvatar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token, refreshProfile } = useAuth();
  const userInfo = user as { id: number } | null;

  const submitAvatarUpdate = async (file: File): Promise<string | null> => {
    setError(null);

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      return validationError;
    }

    if (!token || !userInfo?.id) {
      const msg = "Sesión inválida, vuelve a iniciar sesión.";
      setError(msg);
      return msg;
    }

    setIsLoading(true);
    try {
      await updateProfileAvatar(token, userInfo.id, file);
      await refreshProfile(token, userInfo.id);
      return null;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? "Error al actualizar la foto de perfil";
      setError(msg);
      return msg;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, submitAvatarUpdate };
};
