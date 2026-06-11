import { useEffect } from "react";
import { useRouter } from "next/router";
import { on } from "@/lib/http/events";
import { clearAuthToken } from "@/lib/http/token";
import { notify } from "@/lib/http/notifications";

const LOGIN_PATH = "/";

const AuthBridge: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = on("auth:unauthorized", () => {
      clearAuthToken();
      notify({
        type: "warning",
        message: "Tu sesión expiró. Inicia sesión nuevamente.",
      });
      if (router.pathname !== LOGIN_PATH) {
        router.push(LOGIN_PATH);
      }
    });
    return unsubscribe;
  }, [router]);

  return null;
};

export default AuthBridge;
