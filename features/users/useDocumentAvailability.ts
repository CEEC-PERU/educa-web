import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_USERS_CHECK_DOCUMENT } from "@/utils/Endpoints";

type DocumentType = "DNI" | "CE" | "PA";

export function useDocumentAvailability(
  documentType: DocumentType,
  documentNumber: string,
  enabled = true,
) {
  const { token } = useAuth();
  const [isCheckingDocument, setIsCheckingDocument] = useState(false);
  const [documentExists, setDocumentExists] = useState<boolean | null>(null);
  const [verificationFailed, setVerificationFailed] = useState(false);

  useEffect(() => {
    const normalizedNumber = documentNumber.trim().toUpperCase();
    const locallyValid = documentType === "DNI"
      ? /^\d{8}$/.test(normalizedNumber)
      : documentType === "CE"
        ? /^[A-Z0-9]{8,12}$/.test(normalizedNumber)
        : /^[A-Z0-9]{1,12}$/.test(normalizedNumber);

    setIsCheckingDocument(false);
    setDocumentExists(null);
    setVerificationFailed(false);

    if (!enabled || !token || !locallyValid) return;

    const controller = new AbortController();
    setIsCheckingDocument(true);
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        document_type: documentType,
        document_number: normalizedNumber,
      });
      try {
        const response = await fetch(`${API_USERS_CHECK_DOCUMENT}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const payload = await response.json();
        if (!response.ok) throw new Error("Document check failed");
        setDocumentExists(Boolean(payload.exists));
      } catch (_error) {
        if (!controller.signal.aborted) setVerificationFailed(true);
      } finally {
        if (!controller.signal.aborted) setIsCheckingDocument(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [documentType, documentNumber, enabled, token]);

  return { isCheckingDocument, documentExists, verificationFailed };
}
