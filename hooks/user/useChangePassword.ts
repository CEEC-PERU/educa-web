import { useState } from "react";
import { changePassword } from "../../services/authService";

export const validateNewPassword = (password: string): string | null => {
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";
  if (!/\d/.test(password)) return "Debe contener al menos un número";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password))
    return "Debe contener al menos un carácter especial";
  return null;
};

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    setError(null);
    setSuccess(false);

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      setError(validationError);
      return false;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña no puede ser igual a la actual");
      return false;
    }

    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.msg ?? "Error al cambiar la contraseña";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, submitChangePassword };
};
