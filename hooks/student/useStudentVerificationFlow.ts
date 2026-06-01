import { useState, useRef, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import { useAuth } from "@/context/AuthContext";
import { useUserInfo } from "@/hooks/user/useUserInfo";
import { Profile } from "@/interfaces/User/UserInterfaces";
import { UserInfoData } from "@/interfaces/User/UserInfo";
import { API_USER_INFO_SHOWMODAL } from "@/utils/Endpoints";

function dataURLToFile(dataUrl: string, fileName: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], fileName, { type: mime });
}

function pdfToFile(pdf: jsPDF, fileName: string): File {
  return new File([pdf.output("blob")], fileName, { type: "application/pdf" });
}

function getEventCoords(
  e: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement,
) {
  const rect = canvas.getBoundingClientRect();
  if ("touches" in e) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function useStudentVerificationFlow() {
  const { user, profileInfo, token } = useAuth();
  const { submitUserInfo, loading } = useUserInfo();

  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const profile = profileInfo as Profile | null;
  const name = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const userId = (user as { id: number } | null)?.id ?? 0;

  useEffect(() => {
    if (!token || !userId) return;
    const check = async () => {
      try {
        const res = await fetch(`${API_USER_INFO_SHOWMODAL}/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setIsOpen(data.showModal);
      } catch (e) {
        console.error("Error checking modal status:", e);
      }
    };
    check();
  }, [token, userId]);

  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraStream]);

  const close = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setIsOpen(false);
  }, [cameraStream]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          alert("No se ha detectado ninguna cámara en tu dispositivo.");
        } else if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          alert("Por favor, permite el acceso a la cámara para continuar.");
        } else {
          alert(
            "Error al acceder a la cámara. Asegúrate de estar usando un dispositivo con cámara.",
          );
        }
      }
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL());
  }, []);

  const handleStartDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getEventCoords(e, canvas);
      setIsDrawing(true);
      setLastX(x);
      setLastY(y);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [],
  );

  const handleDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || lastX === null || lastY === null) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getEventCoords(e, canvas);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      setLastX(x);
      setLastY(y);
    },
    [isDrawing, lastX, lastY],
  );

  const handleStopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastX(null);
    setLastY(null);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setSignature(null);
  }, []);

  const confirmSignature = useCallback(() => {
    const dataURL = canvasRef.current?.toDataURL();
    if (dataURL) setSignature(dataURL);
  }, []);

  const submit = useCallback(async () => {
    if (!photo || !signature || !userId) {
      alert("Debes tomar una foto y firmar antes de enviar.");
      return;
    }
    const pdf = new jsPDF();
    pdf.addImage(photo, "JPEG", 10, 10, 190, 190);
    pdf.addImage(signature, "JPEG", 10, 210, 190, 50);
    pdf.save(`${name}_${lastName}_${Date.now()}.pdf`);

    const userInfo: UserInfoData = {
      user_id: userId,
      foto_image: dataURLToFile(photo, `${name}_${lastName}_photo.jpg`),
      firma_image: dataURLToFile(
        signature,
        `${name}_${lastName}_signature.jpg`,
      ),
      documento_pdf: pdfToFile(pdf, `${name}_${lastName}.pdf`),
    };

    try {
      await submitUserInfo(userInfo);
      close();
      alert("Datos enviados exitosamente");
    } catch {
      alert("Hubo un error al enviar los datos.");
    }
  }, [photo, signature, userId, name, lastName, submitUserInfo, close]);

  return {
    isOpen: isOpen === true,
    loading,
    signature,
    photo,
    consentGiven,
    setConsentGiven,
    canvasRef,
    videoRef,
    cameraStream,
    handleStartDrawing,
    handleDrawing,
    handleStopDrawing,
    clearCanvas,
    confirmSignature,
    startCamera,
    capturePhoto,
    submit,
  };
}
